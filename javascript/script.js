/**
 * @file
 * This file configures the UmlCanvas library for use.
 */

var UMLCANVAS_VERSION = 'development';

// After the page is resized/loaded, resize the elements.
var resizeUmlCanvas = function() {

  // Prepare variables.
  var elem = jQuery('#myCaseTool');

  // Resize it.
  elem.attr('width', elem.width());
  elem.attr('height', elem.height());
};

jQuery(document).ready(function() {
  resizeUmlCanvas();
});

jQuery(window).resize(function() {
  resizeUmlCanvas();
});
