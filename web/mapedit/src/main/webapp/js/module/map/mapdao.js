/**
 * 
 */
define(function(require, exports, module) {

	"use strict";
	
	var actions = [],
		ajaxing = false;
	
	var fields = {
			node : {
				moved : {x:true,y:true}
			}
	};
	
	function getAction(data){
		var i,action;
		for (i=0;action=actions[i];i+=1){
			if (data === action.data){
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
				data : node
			});
		}
		if (!ajaxing){
			start();
		}
	}
	
	function updateMovedNode(node){
		var action = getAction(node);
		if (!action){
			actions.push({
				type : 'put',
				dirty : true,
				fields : $.extend({},fields.node.moved),
				data : node
			});
		} else {
			if (action.fields !== 'all'){
				$.extend(action.fields,fields.node.moved);
			}
		}
		if (!ajaxing){
			start();
		}
	}
	
	function delNode(node){
		actions.push({
			type : 'delete',
			url : '/'
		});
	}
	
	
	function start(){
		var current = current || newNodes.shift();
		if (!current){
			ajaxing = false;
			return;
		}
		ajaxing = true;
		var data = current.getData();
		if (data.id){
			
		}
	}
	
});