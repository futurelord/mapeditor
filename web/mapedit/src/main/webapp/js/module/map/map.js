/**
 * 
 */
define(function(require, exports, module) {

	"use strict";
	
	require('ui/events.js');
	var mapdao = require('./mapdao.js');
	
	function Node(data,map){
		this.data = data;
		this.map = map;
		this.init();
	};
	
	Node.prototype.init = function(){
		if (this.data.id){
			this.id = this.data.id;
		} else {
			this.id = UI.newid('n');
		}
	};
	
	Node.prototype.x = function(v){
		if (typeof v === 'number'){
			this.data.x = v;
			mapdao.updateMovedNode(this);
			return this;
		}
		return this.data.x;
	};
	
	Node.prototype.y = function(v){
		if (typeof v === 'number'){
			this.data.y = v;
			mapdao.updateMovedNode(this);
			return this;
		}
		return this.data.y;
	};
	
	Node.prototype.getData = function(){
		return this.data;
	};
	
	Node.prototype.storePos = function(){
		this._x = this.data.x;
		this._y = this.data.y;
	};
	
	Node.prototype.storedx = function(){
		return this._x;
	};
	
	Node.prototype.storedy = function(){
		return this._y;
	};
	
	function Line(data,map){
		this.data = data;
		this.map = map;
		this.init();
	};
	
	Line.prototype.init = function(){
		if (this.data.id){
			this.id = this.data.id;
		} else {
			this.id = UI.newid('n');
		}
		
		this.n1 = this.data.n1 || this.map.getNode(this.data.nodeid1);
		this.n2 = this.data.n2 || this.map.getNode(this.data.nodeid2);
		
	};
	
	Line.prototype.getData = function(){
		return this.data;
	};
	
	/**
	 * arguments : 
	 * 	
	 * 	map : {
	 * 		nodes : nodes,
	 * 		lines : lines
	 * }
	 * 
	 * @event lineSelected (Line line,Map map)
	 * @event nodeSelected (Node node,Map map)
	 * 
	 * @event lineUnSelected (Line line,Map map)
	 * @event nodeUnSelected (Node node,Map map)
	 * 
	 * @event clearSelect(Map map)
	 * 
	 * @event loadMap(Map map)
	 * @event addNode(Node node,Map map)
	 * @event addLine(Line line,Map map)
 	 * 
 	 * @event selectedNodesMoved(Map map)
	 * 
	 */
	function Map(cfg){
		$.extend(this,cfg);
		this.init();
	};
	
	$.extend(Map.prototype,UI.Events.prototype);
	
	Map.prototype.init = function(){
		var map = this.map;
		this.w = map.w;
		this.h = map.h;
		if (map){
			this.setData(map);
		}
	};
	
	/**
	 * 初始化 map 数据
	 * @param map
	 */
	Map.prototype.setData = function(map){
		this.map = map;
		var nodes = map.nodes,lines = map.node_distances,i,node,line;
		this.clear();
		if (nodes){
			for (i=0;node=nodes[i];i+=1){
				this.addNode(node,true);
			}
		}
		if (lines){
			for (i=0;line=lines[i];i+=1){
				this.addLine(line,true);
			}
		}
		this.trigger('loadMap',this);
	};
	
	/**
	 * 清除 Node Line 
	 */
	Map.prototype.clear = function(){
		this._nodeMap = {};
		this._nodes = [];
		this._lineMap = {};
		this._lines = [];
		this._lineMapOfNode1Node2 = {};
		this._lineOfNodeMap = {};
		this.clearSelect(true);
		
	};
	
	/**
	 * 新增Node
	 * @param data
	 */
	Map.prototype.addNode = function(data,silent){
		var node = new Node(data,this);
		this._nodeMap[node.id] = node;
		this._nodes.push(node);
		if (!silent){
			this.trigger('addNode',node,this);
		}
	};
	
	/**
	 * 新增Line
	 * @param data
	 */
	Map.prototype.addLine = function(data,silent){
		var line = new Line(data,this);
		if (!line.n1 || !line.n2){
			return;
		}
		this._lineMap[line.id] = line;
		this._lines.push(line);
		this._lineMapOfNode1Node2[line.n1.id+'_'+line.n2.id] = line;
		this._lineMapOfNode1Node2[line.n2.id+'_'+line.n1.id] = line;
		(this._lineOfNodeMap[line.n1.id]||(this._lineOfNodeMap[line.n1.id]=[])).push(line);
		(this._lineOfNodeMap[line.n2.id]||(this._lineOfNodeMap[line.n2.id]=[])).push(line);
		if (!silent){
			this.trigger('addLine',line,this);
		}
	};
	
	/**
	 * 删除 Node
	 * @param node
	 */
	Map.prototype.removeNode = function(node){
		
	};
	
	/**
	 * 删除Line
	 * @param line
	 */
	Map.prototype.removeLine = function(line){
		
	};
	
	/**
	 * 获取Node
	 * @param id
	 * @returns
	 */
	Map.prototype.getNode = function(id){
		return this._nodeMap[id];
	};
	
	/**
	 * 获取 Line 
	 * @param id
	 * @returns
	 */
	Map.prototype.getLine = function(id){
		return this._lineMap[id];
	};
	
	/**
	 * 获取 Node 数组
	 * @returns {Array}
	 */
	Map.prototype.getNodes = function(){
		return this._nodes;
	};
	
	/**
	 * 获取 Line 数组
	 * @returns {Array}
	 */
	Map.prototype.getLines = function(){
		return this._lines;
	};
	
	/**
	 * 两个Node是否有连线
	 * @param node1
	 * @param node2
	 * @returns
	 */
	Map.prototype.hasLine = function(node1,node2){
		return this._lineMapOfNode1Node2[node1.id+'_'+node2.id];
	};
	
	/**
	 * 一个节点相关的所有Line
	 * @param node
	 */
	Map.prototype.getLinesByNode = function(node){
		return this._lineOfNodeMap[node.id];
	};
	// 选择 Node Line start:
	
	/*
	 * 	this._selectedNodeMap = {};
		this._selectedNodes = [];
		this._selectedLineMap = {};
		this._selectedLines = [];
	 */
	
	/**
	 * 当前被选中的Nodes
	 */
	Map.prototype.selectedNodes = function(){
		return this._selectedNodes;
	};
	
	/**
	 * 当前被选中的Lines
	 */
	Map.prototype.selectedLines = function(){
		return this._selectedLines;
	};
	
	/**
	 * 选中一个 Node
	 * @param node
	 */
	Map.prototype.selectNode = function(node){
		if (!this.isNodeSelected(node)){
			this._selectedNodeMap[node.id] = node;
			this._selectedNodes.push(node);
			this.trigger('nodeSelected',node,this);
			// 判断与其他选中的node是否组成line被选中
			var nodes = this.selectedNodes(),
				i,temp,line;
			for (i=0;temp = nodes[i];i+=1){
				if (temp !== node){
					line = this.hasLine(node,temp);
					if (line && !this.isLineSelected(line)){
						this.selectLine(line);
					}
				}
			}
		}
	};
	
	/**
	 * Node 是否被选中
	 * @param node
	 */
	Map.prototype.isNodeSelected = function(node){
		return this._selectedNodeMap[node.id];
	};
	
	/**
	 * 选中一个 Line
	 * @param Line
	 */
	Map.prototype.selectLine = function(line){
		if (!this.isLineSelected(line)){
			this._selectedLineMap[line.id] = line;
			this._selectedLines.push(line);
			this.trigger('lineSelected',line,this);
			// 选中Line时，同时选中两段的Node
			if (!this.isNodeSelected(line.n1)){
				this.selectNode(line.n1);
			}
			if (!this.isNodeSelected(line.n2)){
				this.selectNode(line.n2);
			}
		}
	};
	
	/**
	 * Line 是否被选中
	 * @param node
	 */
	Map.prototype.isLineSelected = function(line){
		return this._selectedLineMap[line.id];
	};
	
	/**
	 * 取消选中 Node
	 * @param node
	 */
	Map.prototype.unSelectNode = function(node){
		if (this.isNodeSelected(node)){
			delete this._selectedNodeMap[node.id];
			this._selectedNodes.remove(node);
			this.trigger('nodeUnSelected',node,this);
			// node相关的所有Line取消选中
			var lines = this.getLinesByNode(node),i,line;
			for (i=0;line=lines[i];i+=1){
				if (this.isLineSelected(line)){
					this.unSelectLine(line);
				}
			}
		}
	};
	
	/**
	 * 取消选中 Line
	 * @param line
	 */
	Map.prototype.unSelectLine = function(line){
		if (this.isLineSelected(line)){
			delete this._selectedLineMap[line.id];
			this._selectedLines.remove(line);
			this.trigger('lineUnSelected',line,this);
		}
	};
	
	/**
	 * 清楚选中
	 */
	Map.prototype.clearSelect = function(silent){
		this._selectedNodeMap = {};
		this._selectedNodes = [];
		this._selectedLineMap = {};
		this._selectedLines = [];
		if (!silent){
			this.trigger('clearSelect',this);
		}
	};
	// 选择 Node Line end.
	
	Map.prototype.moveSelectedNodes = function(offset){
		var nodes = this.selectedNodes(),i,node;
		for (i=0;node=nodes[i];i+=1){
			node.x(node.storedx()+offset.x);
			node.y(node.storedy()+offset.y);
		}
		this.trigger('selectedNodesMoved',this);
	};
	
	Map.prototype.storeSelectedNodesPos = function(){
		var nodes = this.selectedNodes(),i,node;
		for (i=0;node=nodes[i];i+=1){
			node.storePos();
		}
	};
	
	Map.prototype.getMapUrl = function(){
		return this.map.map.map_url;
	};
	
	Map.prototype.getMapWidth = function(){
		return this.map.map.w;
	};
	
	Map.prototype.getMapHeight = function(){
		return this.map.map.h;
	};
	
	/**
	 * 创建一个node
	 */
	Map.prototype.createNode = function(x,y){
		this.addNode({x:x,y:y});
	};
	
	return Map;
	
});