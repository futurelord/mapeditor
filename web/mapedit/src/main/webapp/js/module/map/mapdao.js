/**
 * 
 */
define(function(require, exports, module) {

	"use strict";
	
	var actions = [],
		ajaxing = false,
		statusAjaxing = 'ajaxing';
	
	var fields = {
			node : {
				moved : {x:true,y:true}
			}
	};
	
	function getAction(data){
		var i,action;
		for (i=0;action=actions[i];i+=1){
			if (action.status !== statusAjaxing && data === action.data){
				return action;
			}
		}
		return null;
	}
	
	/**
	 * action :
	 * 
	 * fields
	 */
	function insertNode(node,projectId){
		var action = getAction(node);
		if (!action){
			actions.push({
				url : '/api/'+projectId+'/node',
				type : 'post',
				dirty : true,
				fields : 'all',
				time : 0+new Date(),
				data : node
			});
		}
		if (!ajaxing){
			doAjax();
		}
	}
	
	function getData(){
		return JSON.stringify(this.param);
	}
	
	function updateMovedNode(node){
		
		var action = getAction(node);
		var param, key, data = node.getData();
		if (!action){
			param = {} ;
			for (key in fields.node.moved){
				param[key] = data[key];
			}
			actions.push({
				url : '/api/'+node.map.projectId+'/node/'+node.data.id,
				type : 'put',
				dirty : true,
				fields : $.extend({},fields.node.moved),
				param : param,
				getData : getData,
				time : new Date(),
				data : node
			});
		} else {
			param = action.param;
			if (action.fields !== 'all'){
				for (key in fields.node.moved){
					param[key] = data[key];
				}
			} else {
				for (key in data){
					param[key] = data[key];
				}
			}
		}
		if (!ajaxing){
			doAjax();
		}
	}
	
	function delNode(node){
		actions.push({
			type : 'delete',
			url : '/'
		});
	}
	
	function ajaxSuccess(json){
		if (this.type === 'put' || this.type === 'post'){
			$.extend(this.data.data,json);
		}
		if (this.success){
			this.success();
		}
		actions.shift();
	}
	
	function doAjax(){
		ajaxing = true;
		if (actions.length===0){
			ajaxing = false;
			return;
		}
		var action = actions[0];
		if (new Date()-action.time < 2000){
			setTimeout(doAjax,2000);
			return;
		}
		
		action.status = statusAjaxing;
		$.ajax({
			contentType : 'application/json',
			url : action.url,
			type : action.type,
			data : action.getData(),
			context : action,
			success : ajaxSuccess,
			complete : doAjax
		});
	}
	
	return {
		updateMovedNode : updateMovedNode
	};
	
});