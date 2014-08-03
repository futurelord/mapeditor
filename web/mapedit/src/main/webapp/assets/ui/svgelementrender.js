/**
 * 
 */
define(function(require, exports, module) {
	'use strict';
	
	var svg = $('<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
	
	$.renderSvgFragement = function(s){
		svg.html(s);
		return svg.children().detach();
	};
	
});