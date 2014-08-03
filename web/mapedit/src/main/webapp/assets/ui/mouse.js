/**
 * 
 */
define(function(require, exports, module) {

	"use strict";

	/**
	 * @event mousemovingstart({
			start : {
				x : mouse.x,
				y : mouse.y
			},
			current : {
				x : e.pageX,
				y : e.pageY
			},
			targetpos : mouse.targetpos
		})
		@event mousemoving({
			start : {
				x : mouse.x,
				y : mouse.y
			},
			current : {
				x : e.pageX,
				y : e.pageY
			},
			targetpos : mouse.targetpos
		})
		
		@event mousemovingend({
			start : {
				x : mouse.x,
				y : mouse.y
			},
			current : {
				x : e.pageX,
				y : e.pageY
			},
			targetpos : mouse.targetpos
		})
		
	 */
	var mouse = {};
	
	function returnfalse(){return false;}
	
	var clearSelection = document.selection ? function() {
		document.selection.clear();
	} : (window.getSelection().empty ? 
		function() {
			window.getSelection().empty();
		} : function(){
			window.getSelection().removeAllRanges();
		});
	
	function mousesMoveStart(e) {
		if (e.data.selector && !$(e.target).is(e.data.selector)){
			return;
		}
		var me = $(this);
		mouse.target = this;
		mouse.x = e.pageX;
		mouse.y = e.pageY;
		mouse.targetpos = me.position();
		$(document).on('mouseup', mouseUp).on('mousemove', mouseMoving).on('selectstart',returnfalse);
		$(document.body).addClass('moz-user-unselect');
		clearSelection();
		me.trigger('mousemovingstart',{
			start : {
				x : mouse.x,
				y : mouse.y
			},
			current : {
				x : e.pageX,
				y : e.pageY
			},
			targetpos : mouse.targetpos
		});
	}

	function mouseMoving(e) {
		$(mouse.target).trigger('mousemoving', {
			start : {
				x : mouse.x,
				y : mouse.y
			},
			current : {
				x : e.pageX,
				y : e.pageY
			},
			targetpos : mouse.targetpos
		});
	}

	function mouseUp(e) {
		$(mouse.target).trigger('mousemovingend', {
			start : {
				x : mouse.x,
				y : mouse.y
			},
			current : {
				x : e.pageX,
				y : e.pageY
			},
			targetpos : mouse.targetpos
		});
		$(document).off('mouseup', mouseUp).off('mousemove', mouseMoving).off('selectstart',returnfalse);
		$(document.body).removeClass('moz-user-unselect');
	}

	
	// export
	
	/**
	 * boolean/string off : true to remove event , string for selector of mouse event handler target
	 */
	$.fn.spymousemove = function(off) {
		if (off === true) {
			this.off('mousedown', mousesMoveStart);
		} else {
			this.off('mousedown', mousesMoveStart).on('mousedown', {selector:off} , mousesMoveStart);
		}
		return this; 
	};
	
	/**
	 * string onselector : 事件委托Element的selector
	 * boolean/string off : true to remove event , string for selector of mouse event handler target
	 */
	$.fn.spymousemove2 = function(onselector,off) {
		if (off === true) {
			this.off('mousedown',onselector, mousesMoveStart);
		} else {
			this.off('mousedown',onselector, mousesMoveStart).on('mousedown',onselector, {selector:off} , mousesMoveStart);
		}
		return this; 
	};

});