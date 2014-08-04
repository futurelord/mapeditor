/**
 * 
 */
define(function(require, exports, module) {

	"use strict";
	
	var actions = [],
		ajaxing = false;
	
	var fields = {
			node : {
				moved : ['x','y']
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
	function insertNode(node){
		var action = getAction(node);
		if (!action){
			actions.push({
				method : 'insert',
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
		if ((newNodes.indexOf(node)===-1) && (movedNodes.indexOf(node) !== -1)){
			movedNodes.push(node);
		}
		newNodes.push(node);
		if (!ajaxing){
			start();
		}
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