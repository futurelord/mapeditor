/**
 * 
 */
define(function(require, exports, module) {

	"use strict";
	
	require('ui/moveable.js');
	require('ui/events.js');
	require('ui/svgelementrender.js');
	
	/**
	 * el 
	 * imgurl
	 * 
	 */
	function MapEditor(cfg){
		$.extend(this,cfg);
		this.init();
	}
	
	$.extend(MapEditor.prototype,UI.Events.prototype,{
		
	});
	
	MapEditor.prototype.width = 1000;
	MapEditor.prototype.zoom = 0.5;
	
	MapEditor.prototype.init = function(){
		var cMap = this.cMap = {},i,b;
		cMap.map = this.map;
		var nodes = this.map.nodes,
			nodeDistances = this.map.nodeDistances,
			nodeMap = cMap.nodeMap = {},
			nodeDistanceMap = cMap.nodeDistanceMap = {},
			node1NodeDistanceMap = cMap.node1NodeDistanceMap = {},
			node2NodeDistanceMap = cMap.node2NodeDistanceMap = {};
		
		for (i=0;b=nodes[i];i+=1){
			nodeMap[b.nodeId] = b;
		}
		
		for (i=0;b=nodeDistances[i];i+=1){
			nodeDistanceMap[b.id] = b;
			(node1NodeDistanceMap[b.node1]||(node1NodeDistanceMap[b.node1]=[])).push(b);
			(node2NodeDistanceMap[b.node2]||(node2NodeDistanceMap[b.node2]=[])).push(b);
		}
		
		this.initEvents();
	};
	
	MapEditor.prototype.initEvents = function(){
		this.linetoClickEvent = new UI.Event({
			name : 'click',
			context : this,
			handler : this.linetoClickHandler
		});
		
	};
	
	var nodeidindex = 1;
	MapEditor.prototype.linetoClickHandler = function(e){
		
		var offset = $('#'+this.el+"_kbmap").offset(),
			node1 = this.target,
			node2 = {
				nodeId : ('n'+(nodeidindex+=1)),
				x : e.clientX - offset.left,
				y : e.clientY - offset.top
			},
			nd = {
				id : ('nd'+(nodeidindex+=1)),
				node1 : node1.nodeId,
				node2 : node2.nodeId
			};
		
		// add node2 
		this.cMap.map.nodes.push(node2);
		this.cMap.nodeMap[node2.nodeId] = node2;
		// add nd
		this.cMap.map.nodeDistances.push(nd);
		this.cMap.nodeDistanceMap[nd.id]=nd;
		(this.cMap.node1NodeDistanceMap[nd.node1]||(this.cMap.node1NodeDistanceMap[nd.node1]=[])).push(nd);
		this.cMap.node2NodeDistanceMap[nd.node2] = [nd];
		
		this.renderSvg();
		
		this.off(this.linetoClickEvent);
		$('#'+this.el+"_kbmap").off('mousemove',this._linetoMousemoveHandler);
		
		this.clearTarget();
		
		return false;
	};
	
	MapEditor.prototype.clearTarget =function(){
		this.target = null;
		this.targetType = null;
	};
	
	MapEditor.prototype.render = function(){
		var s = ['<div id="',this.el,'_kbmap" class="kb-map"><img draggable="false" class="i-map-image" src="',this.imgurl,'" /><div id="',this.el,'_svg" class="i-map-svg"></div></div>'];
		$('#'+this.el).html(s.join(''));
		s = ['<div class="" style="position: absolute;" >'];
		s.push('<button class="i-map-button" type="button" _e="lineto" >LineTo</button>');
		s.push('<button class="i-map-button" type="button" _e="del" >delete</button>');
		s.push('</div>');
		this.clickBars = $(s.join('')).appendTo(document.body).hide().on('click','.i-map-button',this,this._clickBarsClickHandler);
		this.renderSvg();
		this.bindEvents();
	};
	
	MapEditor.prototype.renderSvg = function(){
		var s = ['<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1">'];
		this.renderNodeDistances(s);
		this.renderNodes(s);
		s.push('</svg>');
		$('#'+this.el+'_svg').html(s.join(''));
	};
	
	MapEditor.prototype.renderNodes = function(s){
		var nodes = this.cMap.map.nodes,i,node;
		for (i=0;node=nodes[i];i+=1){
			s.push('<circle _type="nodeMap" _id="',node.nodeId,'" cx="',node.x,'" cy="',node.y,'" r="6" stroke="black" stroke-width="3" fill="white"/>');
		}
	};
	
	MapEditor.prototype.renderNodeDistances = function(s){
		var nodeDistances = this.cMap.map.nodeDistances,
			nodeMap = this.cMap.nodeMap,
			i,nd,n1,n2;
		for (i=0;nd=nodeDistances[i];i+=1){
			n1 = nodeMap[nd.node1];
			n2 = nodeMap[nd.node2];
			s.push('<line _type="nodeDistanceMap" _id="',nd.id,'" x1="',n1.x,'" y1="',n1.y,'" x2="',n2.x,'" y2="',n2.y,'" style="stroke:#888888;stroke-width:6"/>');
		}
	};
	
	MapEditor.prototype.bindEvents = function(){
		$('#'+this.el+"_kbmap").moveable().css({width: this.width+'px'});
		$('#'+this.el).on('click',this,this._clickHandler);
	};
	
	MapEditor.prototype._clickBarsClickHandler = function(e){
		var me = e.data;
		me.clickBars.hide();
		var _e = this.getAttribute('_e');
		if (me[_e]){
			me[_e](e);
		}
	};
	
	MapEditor.prototype.lineto = function(e){
		if (this.targetType !== 'nodeMap'){
			return;
		}
		var n1 = this.target;
		this.on(this.linetoClickEvent);
		var offset = $('#'+this.el+"_kbmap").on('mousemove',this,this._linetoMousemoveHandler).offset();
		$('#'+this.el+"_kbmap svg").prepend($.renderSvgFragement(['<line id="',this.el,'_lineto" x1="',n1.x,'" y1="',n1.y,'" x2="',e.clientX-offset.left,'" y2="',e.clientY-offset.top,'" style="stroke:#888888;stroke-width:6"/>'].join('')));
	};
	
	MapEditor.prototype.drawLineTo = function(e){
		var offset = $('#'+this.el+"_kbmap").offset();
		$('#'+this.el+'_lineto').attr({
			x2 : e.clientX-offset.left,
			y2 : e.clientY-offset.top
		});
	};
	
	MapEditor.prototype._linetoMousemoveHandler = function(e){
		e.data.drawLineTo(e);
	};
	
	MapEditor.prototype.del = function(e){
		var target,nodeMap=this.cMap.nodeMap,nds,i,nd,
			nodes = this.cMap.map.nodes,
			nodeDistances = this.cMap.map.nodeDistances,
			nodeDistanceMap = this.cMap.nodeDistanceMap,
			node1NodeDistanceMap = this.cMap.node1NodeDistanceMap,
			node2NodeDistanceMap = this.cMap.node2NodeDistanceMap;
		
		if (target = this.target){
			if (this.targetType === 'nodeMap'){
				nds = node1NodeDistanceMap[target.nodeId];
				if (nds){
					for (i=0;nd=nds[i];i+=1){
						delete nodeDistanceMap[nd.id];
						nodeDistances.remove(nd);
						node1NodeDistanceMap[nd.node1].remove(nd);
						node2NodeDistanceMap[nd.node2].remove(nd);
					}
				}
				nds = node2NodeDistanceMap[target.nodeId];
				if (nds){
					for (i=0;nd=nds[i];i+=1){
						delete nodeDistanceMap[nd.id];
						nodeDistances.remove(nd);
						node1NodeDistanceMap[nd.node1].remove(nd);
						node2NodeDistanceMap[nd.node2].remove(nd);
					}
				}
				delete nodeMap[target.nodeId];
				nodes.remove(target);
			} else if (this.targetType==='nodeDistanceMap') {
				delete nodeDistanceMap[target.id];
				nodeDistances.remove(target);
				node1NodeDistanceMap[target.node1].remove(target);
				node2NodeDistanceMap[target.node2].remove(target);
			}
			this.renderSvg();
		}
	};
	
	MapEditor.prototype._clickHandler = function(e){
		e.data.clickHandler(e);
	};
	
	MapEditor.prototype.clickHandler = function(e){
		if (this.trigger('click',e)){
			var t = $(e.target),
				type=t.attr('_type'),
				id = t.attr('_id');
			if (type){
				this.target = this.cMap[type][id];
				this.targetType = type;
			} else {
				this.clearTarget();
			}
			this.clickBars.css({
				left : e.clientX-20+'px',
				top : e.clientY+20+'px'
			}).show();
		}
	};
	
	return MapEditor;
	
});