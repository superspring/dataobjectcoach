if (!window['Node']) {
    window.Node = new Object();
    Node.ELEMENT_NODE = 1;
    Node.ATTRIBUTE_NODE = 2;
    Node.TEXT_NODE = 3;
    Node.CDATA_SECTION_NODE = 4;
    Node.ENTITY_REFERENCE_NODE = 5;
    Node.ENTITY_NODE = 6;
    Node.PROCESSING_INSTRUCTION_NODE = 7;
    Node.COMMENT_NODE = 8;
    Node.DOCUMENT_NODE = 9;
    Node.DOCUMENT_TYPE_NODE = 10;
    Node.DOCUMENT_FRAGMENT_NODE = 11;
    Node.NOTATION_NODE = 12;
}
if( typeof decomposeVersion != "function" ) {
    function decomposeVersion( version ) {
	var result = version.match(/([0-9]+)\.([0-9]+)(-([0-9]+))?/);
	return { major: parseInt(result[1]), 
		 minor: parseInt(result[2]), 
		 build: parseInt(result[4]) || 0 };
    }
}

if( typeof iRequire != "function" ) {
    function iRequire( lib, low, high ) {
	var version = decomposeVersion( lib.version );
	low = decomposeVersion( low );
	if( ( version.major < low.major )
	    ||
	    ( version.major == low.major 
	      && version.minor < low.minor ) 
	    ||
	    ( version.major == low.major 
	      && version.minor == low.minor 
	      && version.build < low.build ) )
	{
	    return false;
	}
	if( high ) {
            high = decomposeVersion( high );
            if( ( version.major > high.major )
		||
		( version.major == high.major 
		  && version.minor > high.minor ) 
		||
		( version.major == high.major 
		  && version.minor == high.minor 
		  && version.build > high.build ) )
	    {
		return false;
	    }
	}
	
	return true;
    }
}
    
if( ! iRequire( ADL, "0.1-4" ) ) {
    alert( "Canvas2D requires at least ADL version 0.1-4. " +
	   "Current ADL version = " + ADL.version );
}
if( !document.createElement('canvas').getContext &&
    !G_vmlCanvasManager.initElement ) {
    alert( "You browser doesn't support the Canvas element. " +
	   "If you're using IE, ExplorerCanvas is required." );
} else if( typeof CanvasTextFunctions == "undefined" ) {
    alert( "Canvas2D requires the CanvasText implementation." );
}

/*
if( typeof Canvas2D != "undefined" ) {
    alert( "WARNING: Canvas2D is already defined and will be redefined!!!" );
}
*/

function unless( stmt, func ) {
    if( ! stmt ) { func(); }
}

function max(a,b) {
    return a < b ? b : a;
}

function min(a,b) {
    return a < b ? a : b;
}

// IE misses indexOf ... and so do we ;-)
if(!Array.indexOf) {
    Array.prototype.indexOf = function(obj){
	for(var i=0; i<this.length; i++){
	    if(this[i]==obj){
	        return i;
	    }
	}
	return -1;
    }
}

Array.prototype.contains = function(substring) {
    return this.indexOf(substring) > -1;
};

/**
 * Provides the size specified in the given font specifier
 * @param {DOMString} font a CSS font specifier
 * @return the size of the font, in pixels
 */
 function getFontSize(font) {
     var size = null;
     size = toPx(font, "px");
     if (size == null) {
	 size = toPx(font, "pt");
	 if (size == null) {
	     size = toPx(font, "em");
	     if (size == null) {
		 size = toPx(font, "pct");
		 if (size != null) {
		     return size;
		 }
	     } else {
		 return size;
	     }
	 } else {
	     return size;
	 }
     } else {
	 return size;
     }
     
     throw("cannot get size from font specifier: " + font);
}

function toPx(font, src) {
    if(!font) {
	console.log( "Common::toPx: require a valid font. Got: '" + font + "'");
	return;
    }

    /* 
     * if font size is expressed in points, ems or percentages,
     * then it is converted to pixels approximately, using the table on 
     * http://www.reeddesign.co.uk/test/points-pixels.html
     */
    var conversionTable = [
	{"pt":5.5,	"px":6, 	"em":0.375,	"pct":37.5},
	{"pt":6,	"px":8, 	"em":0.5,	"pct":50},
	{"pt":7,	"px":9,		"em":0.55,	"pct":55},
	{"pt":7.5,	"px":10,	"em":0.625,	"pct":62.5},
	{"pt":8,	"px":11,	"em":0.7,	"pct":70},
	{"pt":9,	"px":12,	"em":0.75,	"pct":75},
	{"pt":10,	"px":13,	"em":0.8,	"pct":80},
	{"pt":10.5,	"px":14,	"em":0.875,	"pct":87.5},
	{"pt":11,	"px":15,	"em":0.95,	"pct":95},
	{"pt":12,	"px":16,	"em":1,		"pct":100},
	{"pt":13,	"px":17,	"em":1.05,	"pct":105},
	{"pt":13.5,	"px":18,	"em":1.125,	"pct":112.5},
	{"pt":14,	"px":19,	"em":1.2,	"pct":120},
	{"pt":14.5,	"px":20,	"em":1.25,	"pct":125},
	{"pt":15,	"px":21,	"em":1.3,	"pct":130},
	{"pt":16,	"px":22,	"em":1.4,	"pct":140},
	{"pt":17,	"px":23,	"em":1.45,	"pct":145},
	{"pt":18,	"px":24,	"em":1.5,	"pct":150},
	{"pt":20,	"px":26,	"em":1.6,	"pct":160},
	{"pt":22,	"px":29,	"em":1.8,	"pct":180},
	{"pt":24,	"px":32,	"em":2,		"pct":200},
	{"pt":26,	"px":35,	"em":2.2,	"pct":220},
	{"pt":27,	"px":36,	"em":2.25,	"pct":225},
	{"pt":28,	"px":37,	"em":2.3,	"pct":230},
	{"pt":29,	"px":38,	"em":2.35,	"pct":235},
	{"pt":30,	"px":40,	"em":2.45,	"pct":245},
	{"pt":32,	"px":42,	"em":2.55,	"pct":255},
	{"pt":34,	"px":45,	"em":2.75,	"pct":275},
	{"pt":36,	"px":48,	"em":3,		"pct":300}
    ];
    
    var result = font.match("(\\d+)"+src+"\\s*/");
    if (result == null) {
	result = font.match("(\\d+)"+src+"\\s*");
	if (result != null) {
	    result = result[1];
	}
    } else {
	result = result[1];
    }
    if (result != null) {
	for (var i = 0; i < conversionTable.length; i++) {
	    if (conversionTable[i][src] == result) {
		return conversionTable[i]["px"];
	    }
	}
    }
    
    return null;
}

function Timer() {
    this.now = new Date().getTime();
    this.stop = function() {
	return new Date().getTime() - this.now;
    }
}
// namespace for holding all Canvas2D related classes, functions and extensions
var Canvas2D = {
    // all known/registered shapes that can be used on this canvas
    shapes: $H(),

    // libraries are groups of shapes
    libraries: $H(),

    // global placeholder for extensions to register
    extensions: [],

    // one-shot activation of a Canvas
    activate: function activate(canvasId) {
	var canvas = document.getElementById(canvasId);
	if(canvas) {
	    var manager = new Canvas2D.Manager();
	    var canvas  = manager.setupBook(canvasId);
	    var sheet   = canvas.addSheet();
	    manager.startAll();
	    return sheet;
	}
	throw( canvasId + " does not reference a known id on the document." );
    },

    // method to register a shape
    registerShape: function registerShape(shape) {
	// let's store a reference to the class in the prototype itself
	shape.prototype.__CLASS__ = shape;
	shape.prototype.getClass = function getClass() { return this.__CLASS__; }

	// mixin static methods for dealing with manifests
	Canvas2D.Shape.manifestHandling.iterate( function(key, value) {
	    shape[key] = value;
	} );

	// register shape with all names (including aliasses)
	shape.getTypes().iterate(function(name) {
	    Canvas2D.shapes.set(name, shape);
	} );

	// add shape to libraries
	shape.getLibraries().iterate(function(library) {
	    if( !Canvas2D.libraries.get(library) ) { 
		Canvas2D.libraries.set(library, []);
	    }
	    Canvas2D.libraries.get(library).push(shape);
	} );
    },

    getBook : function(id) {
	return Canvas2D.KickStarter.manager.getBook(id);
    }
};
/**
 * Factory.js
 *
 * Author: Christophe VG & TheSoftwareFactory
 * http://thesoftwarefactory.be/wiki/Canvas2D
 *
 * License: http://thesoftwarefactory.be/wiki/BSD_License
 *
 * This factory takes a standard HTML5 Canvas element, adds (clearly
 * missing) features and tries to overcome the differences between
 * browsers implementations.
 *
 * The Factory extensions sub-namespace, contains sets of functionality
 * that need to be merged in. The sub-namespace "all" contains sets
 * that are merged in for all browsers. 
 */

Canvas2D.Factory = { extensions: { all: {} } };

/**
 * There are a few methods clearly missing on the HTML5 Canvas
 * element. This namespace adds a few utility methods that make life a
 * lot easier.
 */
Canvas2D.Factory.extensions.all.ShortHands = {
    clear: function clear() {
	this.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    },

    fillTextCenter : function fillTextCenter(text, x, y, maxWidth) {
	var dx = this.measureText(text) / 2;
	this.fillText(text, x-dx, y, maxWidth);
    },

    fillTextRight : function fillTextRight(text, x, y, maxWidth) {
	var dx = this.measureText(text);
	this.fillText(text, x-dx, y, maxWidth);
    },

    strokeTextCenter : function strokeTextCenter(text, x, y, maxWidth) {
	var dx = this.measureText(text) / 2;
	this.strokeText(text, x-dx, y, maxWidth);
    },

    strokeTextRight : function strokeTextRight(text, x, y, maxWidth) {
	var dx = this.measureText(text);
	this.strokeText(text, x-dx, y, maxWidth);
    },

    fillStrokeRect : function fillStrokeRect(left, top, width, height) {
	this.fillRect( left, top, width, height );
	this.strokeRect( left, top, width, height );
    }
};

/**
 * This namespace adds basic event-handling supporting functions.
 */
Canvas2D.Factory.extensions.all.EventHandling = {
    on: function on( event, handler ) {
	if( !this.eventHandlers ) { this.eventHandlers = []; }
	if( !this.eventHandlers[event] ) { this.eventHandlers[event] = []; }
	this.eventHandlers[event].push(handler);
    },

    fireEvent: function fireEvent( event, data ) {
	if( !this.eventHandlers ) { return; }
	if( this.eventHandlers[event] ) {
	    this.eventHandlers[event].iterate( function(handler) { 
		handler(data);
	    } );
	}
    }
};

/**
 * We add some functionality, which also requires some additional
 * attributes, that are by default not part of the HTML5 Canvas spec. We
 * need to extend the some basic functionality to include these extended
 * properties.
 */

Canvas2D.Factory.extensions.all.ExtendedCanvasSupport = {
    __extend__: function __extend__(ctx) {
	var extProperties = [ "useCrispLines", "textDecoration", "lineStyle" ];

	var $superSave = ctx["save"];
	ctx["save"] = function() {
	    var oldValues = {};
	    var currentValues = this;
	    extProperties.iterate(function(prop) {
		oldValues[prop] = currentValues[prop];
	    });
	    if( !this.savedValues ) { this.savedValues = []; }
	    this.savedValues.push(oldValues);

	    $superSave.apply(this);
	};

	var $superRestore = ctx["restore"];
	ctx["restore"] = function() {
	    if( !this.savedValues ) { return; }

	    var oldValues = this.savedValues.pop();
	    var currentValues = this;
	    extProperties.iterate(function(prop) {
		currentValues[prop] = oldValues[prop];
	    });

	    $superRestore.apply(this);
	}

	return ctx;
    }
};

/**
 * The HTML5 specs did not specify dashed line support, because it is
 * said not to be trivial to implement natively ?! So we have to do it
 * ourselves!
 */
Canvas2D.Factory.extensions.all.DashedLineSupport = {
    __extend__: function __extend__(ctx) {
	[ "_setCurrentXY", "_plotPixel", "_drawLine" ].iterate( function(f) {
	    ctx[f] = Canvas2D.Factory.extensions.all.DashedLineSupport[f];
	});

	ctx.nativeMoveTo = ctx["moveTo"];
	ctx["moveTo"] = function(x,y) {
	    ctx.nativeMoveTo.apply( this, arguments );
	    this._setCurrentXY( x, y );
	}

	ctx.nativeLineTo = ctx["lineTo"];
	ctx["lineTo"] = function(x,y) {
	    if( this.lineStyle == "dashed" ) {
		this._drawLine( this.currentX, this.currentY, x, y );
	    } else {
		this.nativeLineTo.apply( this, arguments );
	    }
	    this._setCurrentXY(x, y);
	}

	return ctx;
    },

    _setCurrentXY: function _setCurrentXY(x, y) {
	if( !this.currentX ) { this.currentX = 0; }
	if( !this.currentY ) { this.currentY = 0; }
	this.currentX = x;
	this.currentY = y;
    },

    _plotPixel: function _plotPixel( x, y, c ) {
	var oldStyle = this.strokeStyle;
	this.beginPath();
	this.strokeStyle = c;
	this.fillStyle = c;
	this.moveTo(x,y);
	this.nativeLineTo(x+1,y+1);
	this.stroke();
	this.closePath();
	this.strokeStyle = oldStyle;
    },

    _drawLine: function _drawLine(x1, y1, x2, y2 ) {
	x1 = Math.floor(x1);	x2 = Math.floor(x2);
	y1 = Math.floor(y1-1);	y2 = Math.floor(y2-1);
	// to make sure other strokes are stroked:
	this.stroke();

	var c     = this.strokeStyle;
	var style = this.lineStyle;

	var steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
	if (steep) {
            t = y1;            y1 = x1;            x1 = t;
            t = y2;            y2 = x2;            x2 = t;
	}
	var deltaX = Math.abs(x2 - x1);
	var deltaY = Math.abs(y2 - y1);
	var error = 0;
	var deltaErr = deltaY;
	var xStep;
	var yStep;
	var x = x1;
	var y = y1;
	if(x1 < x2) {  xStep = 1; } else { xStep = -1; }
	if(y1 < y2) {  yStep = 1; } else { yStep = -1;	}
	if( steep ) { this._plotPixel(y, x, c); } 
	else        { this._plotPixel(x, y, c); }
	var dot = 0;
	while( x != x2 ) {
            x = x + xStep;
            error = error + deltaErr;
            if( 2 * error >= deltaX ) {
		y = y + yStep;
		error = error - deltaX;
            }
	    var color = ( style != "dashed" || ++dot % 15 ) < 10 ? c : "white";
            if(steep) { this._plotPixel(y, x, color); } 
	    else      { this._plotPixel(x, y, color); }
	}
    }
};

/**
 * Althought the HTML5 Canvas is a pixel-oriented environment, it still
 * uses anti-aliassing to smooth its drawings. I some cases this
 * default behaviour is not optimal (think horizontal/vertical
 * hairlines). This namspace adds support for crisp lines.
 */
Canvas2D.Factory.extensions.all.CrispLineSupport = {
    __extend__: function __extend__(ctx) {
	[ "strokeRect", "moveTo", "lineTo", "rect" ].iterate(function(f) {
	    var $super = ctx[f];
	    ctx[f] = function(x,y,w,h) {
		if(!this.useCrispLines) { return $super.apply(this,arguments); }
		var crisp = 
		    Canvas2D.Factory.extensions.all.CrispLineSupport.makeCrisp
		      (x,y,w,h,this.lineWidth);
		return $super.apply(this, [crisp.x, crisp.y, crisp.w, crisp.h]);
	    }
	});
	return ctx;
    },

    makeCrisp : function makeCrisp(x, y, xx, yy, lineWidth) {
	var x1 = x;  var y1 = y;
	var x2 = xx; var y2 = yy;
	var w  = xx; var h  = yy;

	// if the lineWidth is odd
	if( lineWidth % 2 ) {
	    x1 = Math.floor(x) + 0.5;
	    y1 = Math.floor(y) + 0.5;
	    if(typeof x2 != "undefined") {
		x2 = Math.floor(xx) + 0.5;
		y2 = Math.floor(yy) + 0.5;
	    }
	    // if the width/height is fractional
	    if( xx % 1 != 0 ) { w = Math.floor(xx); }
	    if( yy % 1 != 0 ) { h = Math.floor(yy); }
	} else {
	    x1 = Math.floor(x);
	    y1 = Math.floor(y);
	    if(typeof x2 != "undefined" ) {
		x2 = Math.floor(xx);
		y2 = Math.floor(yy);
	    }
	    // if the width/height is fractional
	    if( xx % 1 != 0 ) { w = Math.floor(xx) + 0.5; }
	    if( yy % 1 != 0 ) { h = Math.floor(yy) + 0.5; }
	}

	return {x:x1, y:y1, x1:x1, y1:y1, w:w, h:h, x2:x2, y2:y2};
    }
};

/**
 * The HTML5 Canvas provides no support for decorating text. So, this
 * namespace adds simple support for it.
 */
Canvas2D.Factory.extensions.all.TextDecorationSupport = {
    decorateText : function decorateText(text, x, y, maxWidth) {
	if( !this.textDecoration ) { return; }

	this.save();
	this.useCrispLines = true;
	this.strokeStyle = "black"; // TODO: this fixes red FF underlining
	this.textDecoration.toLowerCase().split(" ")
	                                 .iterate(function(decoration) {
	    var decorator = null;
	    switch(decoration) {
	    case "underline"   : decorator = this.underlineText;   break;
	    case "overline"    : decorator = this.overlineText;    break;
	    case "line-through": decorator = this.linethroughText; break;
	    }
	    if( decorator ) { 
		this.beginPath();
		var length = this.measureText(text);
		if( length > maxWidth ) { length = maxWidth; }
		decorator.call(this, text, x, y, length); 
		this.stroke();
		this.closePath();
	    }
	}.scope(this) );
	this.restore();
    },

    underlineText : function underlineText(text, x, y, length) {
        this.moveTo(x, y + 3);
        this.lineTo(x + length, y + 3);
    },

    overlineText : function overlineText(text, x, y, length) {
        this.moveTo(x, y - getFontSize(this.font) );
        this.lineTo(x + length, y - getFontSize(this.font) );
    },

    linethroughText : function linethroughText(text, x, y, length) {
        this.moveTo(x, y - (getFontSize(this.font) / 2) + 2);
        this.lineTo(x + length, y - (getFontSize(this.font) / 2) + 2);
    }
};

/**
 * We also want to add interaction with the Canvas. This namespace adds
 * basic mouse tracking and exposing of events to subscribers
 */
Canvas2D.Factory.extensions.all.MouseEvents = {
    setupMouseEventHandlers: function setupMouseEventHandlers() {
	ProtoJS.Event.observe(this.canvas, 'mousedown', 
		      this.handleMouseDown.scope(this));
	ProtoJS.Event.observe(this.canvas, 'mouseup', 
		      this.handleMouseUp.scope(this));
	ProtoJS.Event.observe(document, 'mousemove', 
		      this.handleMouseMove.scope(this));
	ProtoJS.Event.observe(this.canvas, 'dblclick',
		      this.handleDoubleClick.scope(this));
    },

    getLeft: function getLeft() {
	var elem = this.canvas;
	var left = 0;
	while( elem != null ) {
	    left += elem.offsetLeft;
	    elem = elem.offsetParent;
	}
	return left;
    },

    getTop: function getTop() {
	var elem = this.canvas;
	var top = 0;
	while( elem != null ) {
	    top += elem.offsetTop;
	    elem = elem.offsetParent;
	}
	return top;
    },

  getXY: function getXY(e) {
    var x,y;
    if( ProtoJS.Browser.IE ) {
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    } else {
      x = e.pageX;
      y = e.pageY;
    }
    return { x: x - this.getLeft(), y: y - this.getTop() };
  },
  
    handleMouseDown: function handleMouseDown(event) {
	this.mousepressed = true;
	var pos = this.getXY(event);
	this.fireEvent( "mousedown", pos );
	this.mousePos = pos;
    },

    handleMouseUp: function handleMouseUp(event) {
	this.mousepressed = false;
	var pos = this.getXY(event);
	this.fireEvent( "mouseup", pos );
	this.mousePos = pos;
    },

    handleMouseMove: function handleMouseMove(event) {
	    if( this.mousepressed ) { this.handleMouseDrag(event); }
	    var pos = this.getXY(event);
	    if( pos ) {
        var mouseWasOver = this.mouseOver;
	      this.mouseOver = ( pos.x >= 0 && pos.x <= this.canvas.width )
	                   &&  ( pos.y >= 0 && pos.y <= this.canvas.height );
		    if(this.mouseOver && !mouseWasOver) { this.fireEvent( "mouseEnter" );}
	      if(!this.mouseOver && mouseWasOver) { this.fireEvent( "mouseLeave" );}
	    }
    },
    
    handleMouseDrag: function handleMouseDrag(event) {
	var pos = this.getXY(event);
	this.fireEvent( "mousedrag", { x: pos.x, 
				       y: pos.y, 
				       dx: pos.x - this.mousePos.x,
				       dy: pos.y - this.mousePos.y } );
	this.mousePos = pos;
    },

    handleDoubleClick: function handleDoubleClick(event) {
      var pos = this.getXY(event);
      this.fireEvent( "dblclick", pos );
      this.mousePos = pos;
    }
};

/**
 * The iPhone has special events for touching and dragging.
 */
Canvas2D.Factory.extensions.TouchEvents = {
    setupTouchEventHandlers: function setupTouchEventHandlers() {
	ProtoJS.Event.observe(this.canvas, 'touchstart',
			      this.handleTouchStart.scope(this));
	ProtoJS.Event.observe(this.canvas, 'touchmove',
			      this.handleTouchMove.scope(this));
	ProtoJS.Event.observe(this.canvas, 'touchend',
			      this.handleTouchEnd.scope(this));
    },

    handleTouchStart: function handleTouchStart(event) {
	if( event.touches.length == 1 ) {
	    this.handleMouseDown(event.touches[0]);
	    event.preventDefault();
	}	
    },

    handleTouchMove: function handleTouchMove(event) {
	if( event.touches.length == 1 ) {
	    this.handleMouseDrag(event.touches[0]);
	    event.preventDefault();
	}	
    },

    handleTouchEnd: function handleTouchEnd(event) {
	this.handleMouseUp(event);
	event.preventDefault();
    }
};

/**
 * The HTML5 Canvas specification specifies functions for rendering
 * text. Currently only recent FF implementations provide an
 * implementation for these functions.
 *
 * Different browsers have different custom support for rendering
 * text. This namespace provides common functions for our
 * implementation.
 */
Canvas2D.Factory.extensions.all.TextSupport = {
    adjustToAlignment: function adjustToAlignment(x, text) {
	switch(this.textAlign) {
	  case "center": x -= this.measureText(text) / 2; break;
	  case "right":  x -= this.measureText(text);     break;
	}
	return x;
    },

    getFontSize: function() {
	return getFontSize( this.font || Canvas2D.Sheet.Defaults.font );
    }
};

/**
 * The HTML5 Canvas specification specifies functions for rendering
 * text. Currently only recent FF implementations provide an
 * implementation for these functions.
 *
 * For browsers that have no support at all, we render text using small
 * lines. We use the canvastext library by Jim Studt.
 */
Canvas2D.Factory.extensions.CanvasText = {
    fillText : function fillText(text, x, y, maxWidth) {
	// CanvasText implementation is stroke-based, no filling, just stroking
	this.strokeText(text, x, y, maxWidth);
    },
    
    strokeText : function strokeText(text, x, y, maxWidth) {
    	this.beginPath();
	
    	this.save();
	// CanvasText implementation is stroke-based. Just in case the
	// fillStyle is set in stead of strokeStyle
	this.strokeStyle = this.fillStyle;
	x = this.adjustToAlignment(x, text);
	CanvasTextFunctions.draw(this, this.font, getFontSize(this.font), 
				 x, y, text);
	this.decorateText(text, x, y, maxWidth);
	this.restore();

	this.closePath();
    },
    
    measureText  : function measureText(text) {
	return CanvasTextFunctions.measure( this.font, getFontSize(this.font), 
					    text);
    }
};

/**
 * The HTML5 Canvas specification specifies functions for rendering
 * text. Currently only recent FF implementations provide an
 * implementation for these functions.
 *
 * Even with HTML5 compliant text rendering functions, we still want to
 * add some missing functionalities like text-alignment and
 * text-decoration.
 */
Canvas2D.Factory.extensions.HTML5CanvasText = {
    __extend__: function __extend__(ctx) {
	var $superMeasureText = ctx["measureText"];
	ctx["measureText"] = function measureText(text) {
	    return $superMeasureText.apply(this, arguments).width;
	}

	var $superFillText = ctx["fillText"];
	ctx["fillText"] = function fillText(text, x, y, maxWidth) {
	    maxWidth = maxWidth  || this.measureText(text);
            $superFillText.apply(this, arguments);
	    x = this.adjustToAlignment( x, text );	    
            this.decorateText(text, x, y, maxWidth);
	}

	var $superStrokeText = ctx["strokeText"];
	ctx["strokeText"] = function strokeText(text, x, y, maxWidth) {
	    maxWidth = maxWidth  || this.measureText(text);
            $superStrokeText.apply(this, arguments);
	    x = this.adjustToAlignment( x, text );
            this.decorateText(text, x, y, maxWidth);
	}

	return ctx;
    }
};

/**
 * The HTML5 Canvas specification specifies functions for rendering
 * text. Currently only recent FF implementations provide an
 * implementation for these functions.
 *
 * This implementation should be used for pre Gecko 1.9.1.  Later
 * versions of Gecko should use HTML5CanvasText, which wraps the native
 * HTML5 text rendering functions.
 */
Canvas2D.Factory.extensions.GeckoCanvasText = {
    fillText     : function fillText(text, x, y, maxWidth) {
	x = this.adjustToAlignment(x, text);
        this._drawText(text, x, y, true);
        this.decorateText(text, x, y, maxWidth);
    },

    strokeText   : function strokeText(text, x, y, maxWidth) {
	x = this.adjustToAlignment(x, text);
        this._drawText(text, x, y, false);
        this.decorateText(text, x, y, maxWidth);
    },

    measureText  : function measureText(text) {
        this.save();
        this.mozTextStyle = this.font;
        var width = this.mozMeasureText(text);
        this.restore();
        return width;
    },

    /**
     * Helper function to stroke text.
     * @param {DOMString} text The text to draw into the context
     * @param {float} x The X coordinate at which to begin drawing
     * @param {float} y The Y coordinate at which to begin drawing
     * @param {boolean} fill If true, then text is filled, 
     * 			otherwise it is stroked  
     */
    _drawText : function _drawText(text, x, y, fill) {
        this.save();

        this.beginPath();
        this.translate(x, y);
        this.mozTextStyle = this.font;
        this.mozPathText(text);
        if (fill) {
            this.fill();
        } else {
            this.stroke();
        }
        this.closePath();

        this.restore();
    }
};

/**
 * This is the main Factory method. It takes a native Canvas 2D Context
 * and transforms it into a Canvas2D.
 */
Canvas2D.Factory.setup = function(element) {
    if( !Canvas2D.initialized ) {
	Canvas2D.initialized = true;
	// prepare Canvas Prototype
	if (!window.CanvasRenderingContext2D) {   // webkit
	    window.CanvasRenderingContext2D =
		document.createElement("canvas").getContext("2d").__proto__;
	} else {   // firefox
	    window.CanvasRenderingContext2D = CanvasRenderingContext2D.prototype
	}
    }

    unless( element && element.nodeType &&
	    element.nodeType == 1,
	    function() {
		throw( "CanvasBase:initialize: expected HTMLElement" );
	    } );
    
    try {
	var ctx = element.getContext("2d");    
    } catch(e) {
	throw( "Canvas2D: element is no HTML5 Canvas." );
    }

    // TextFunctions are problematic ;-)
    // it took a while before all major browser supported the text functions
    if( ctx.strokeText && ctx.fillText && ctx.measureText ) {
      // standard native functions are present, extend them a bit further
      ctx = Canvas2D.Factory.extensions.HTML5CanvasText.__extend__(ctx);
    } else if( ctx.mozMeasureText && ctx.mozPathText ) {
      // pre 1.9 gecko suports own interface (<= FF 3.1)
      ProtoJS.mix(Canvas2D.Factory.extensions.GeckoCanvasText, ctx, true );
    } else {
      // browser has no native text functions, use CanvasText to simulate it
      ProtoJS.mix( Canvas2D.Factory.extensions.CanvasText, ctx, true );
      if( ProtoJS.Browser.IE ) {
        // IE already uses an emulation layer (explorercanvas)
        // which is slow, so we disable the additional watermark text
        Canvas2D.Book.prototype.addWaterMark = function() { };
      }
    }	

    // Additional Browser Specific Configuration
    if( ProtoJS.Browser.MobileSafari ) { 
      ProtoJS.mix( Canvas2D.Factory.extensions.TouchEvents, ctx, true );
      ctx.setupTouchEventHandlers();
    }

    // mixin some functions that clearly are missing ;-)
    $H(Canvas2D.Factory.extensions.all).values().iterate(function(ext) {
	if( ext.__extend__ ) {
	    ctx = ext.__extend__(ctx);
	} else {
	    ProtoJS.mix( ext, ctx, true );
	}
    } );

    // initialize own default settings
    $H(Canvas2D.Defaults.Canvas).iterate(function(key, value) {
	ctx[key] = value;
    });

    // activate mouseEventHandlers
    ctx.setupMouseEventHandlers();

    return ctx;
}

// mix-in event handling to Canvas2D
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, Canvas2D );
Canvas2D.KeyboardDriver = Class.extend( {
    init: function initialize() {
	this.currentKeysDown = [];
	ProtoJS.Event.observe(document, 'keydown', 
			      this.handleKeyDownEvent.scope(this));
	ProtoJS.Event.observe(document, 'keyup', 
			      this.handleKeyUpEvent.scope(this));
    },

    handleKeyDownEvent: function( event ) {
	var key = (event || window.event).keyCode;
	this.currentKeysDown.push(key);
	this.fireEvent( "keydown", key );
    },

    handleKeyUpEvent: function handleKeyUpEvent( event ) {
	var key = (event || window.event).keyCode;
	this.currentKeysDown = this.currentKeysDown.remove(key);
	this.fireEvent( "keyup", key );
    },

    getCurrentKeysDown: function getCurrentKeysDown() {
	return this.currentKeysDown;
    },

    keyDown: function keyDown(key) {
	return this.currentKeysDown.contains(key);
    }
} );

ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling,
	     Canvas2D.KeyboardDriver.prototype );

Canvas2D.Keyboard = new Canvas2D.KeyboardDriver();
Canvas2D.ImageManager = {};

Canvas2D.ImageManager.work = 0;

Canvas2D.ImageManager.load = function(src, onload) {
    var image = new Image();
    Canvas2D.ImageManager.work++;
    image.onload = function() {
	Canvas2D.ImageManager.work--;
	onload();
    }
    image.src = src;
    return image;
};

Canvas2D.ImageManager.isReady = function() {
    return Canvas2D.ImageManager.work == 0;
};Canvas2D.Manager = Class.extend( {
    init : function() {
	this.plugins = [];
	this.books   = $H();
    },

    setupBook : function(id) {
	return this.addBook(new Canvas2D.Book(id));
    },

    addBook : function(book) {
	unless( book instanceof Canvas2D.Book, function() { 
	    throw( "Manager::addBook: book must be instance of Canvas2D.Book" );
	} );
	this.books.set(book.name, book);
	return book;
    },

    getBook : function(id) {
	return this.books.get(id);
    },
    
    startAll :function() {
	if( Canvas2D.ImageManager.isReady() ) {
	    this.plugins.iterate(function(plugin)      { plugin.start(); } );
	    this.books.values().iterate(function(book) { book.start();   } );
	} else {
	    this.startAll.scope(this).after(10);
	}
    }
} );
Canvas2D.ADLVisitor = Class.extend( {
  init: function() {
    this.errors = [];  
  },

  visit: function( construct, parent ) {
    var constructType = construct.type.toLowerCase();
    if( construct.name == "root" ) {
      // just move on to the children
      construct.childrenAccept(this, parent);
      return parent;
    } else if( Canvas2D.shapes.get(constructType) ) {
      var shape = Canvas2D.shapes.get(constructType).from(construct, parent);
      if( shape ) {
        if( shape.errors ) {
          shape.errors.iterate( function( error ) {
            this.errors.push( error );
          }.scope(this) );
        } else {
          if( shape.warnings ) {
            shape.warnings.iterate( function( error ) {
              this.errors.push( error );
            }.scope(this) );
          }
          var left, top;
          if( construct.annotations && construct.annotations.length > 0 ) {
            var pos = construct.annotations[0].value.split(",");
            left = parseInt(pos[0]);
            top  = parseInt(pos[1]);
            parent.book.getCurrentSheet().at(left,top).add( shape );
          } else {
            parent.add( shape );
          }
          construct.childrenAccept(this, shape);
        }
      }
      return construct;
    } else {
      this.errors.push("Unknown Construct Type: " + construct.type);
      // if we don't know the construct type, no need to go further
      return parent;
    }
  }
} );
Canvas2D.Book = Class.extend( {
  init: function(element) {
    // overloaded constructor implementation allows the passing of an id
    unless( element && element.nodeType && 
      element.nodeType == Node.ELEMENT_NODE, 
      function(){
        element = document.getElementById(element);
    } );

    this.canvas = Canvas2D.Factory.setup(element);

    this.sheets = [];
    this.currentSheet = 0;      // index of the current show sheet

    this.canvas.on( "mousedown", function(data) {
      this.fireEvent("mousedown");
      var sheet;
      if(sheet = this.getCurrentSheet() ) {
        sheet.handleMouseDown(data);
      }
    }.scope(this) );

    this.canvas.on( "mouseup", function(data) {
      this.fireEvent("mouseup");
      var sheet;
      if(sheet = this.getCurrentSheet() ) {
        sheet.handleMouseUp(data);
      }
    }.scope(this) );

    this.canvas.on( "mousedrag", function(data) {
      this.fireEvent("mousedrag");
      var sheet;
      if(sheet = this.getCurrentSheet()) {
        sheet.handleMouseDrag(data);
      }
    }.scope(this) );


    // look for a console and sources for this book
    this.console   = document.getElementById( element.id + "Console"   );
    this.source    = document.getElementById( element.id + "Source"    );
    this.generated = document.getElementById( element.id + "Generated" );

    this.name = element.id;

    this.setupExtensions();
    this.setupPlugins();
  },

  add: function( sheet ) {
    return this.addSheet(sheet);
  },

  addSheet : function( sheet ) {
    unless( sheet instanceof Canvas2D.Sheet, function() {
      sheet = new Canvas2D.Sheet( { book: this } );
    }.scope(this) );
    sheet.setCanvas(this.canvas);
    sheet.on( "change", this.rePublish.scope(this) );
    sheet.on( "newShape", this.log.scope(this) );
    this.sheets.push(sheet);
    return sheet;
  },

  setupExtensions: function() {
    this.extensions = new Hash();
    Canvas2D.extensions.iterate(function(extension) {
      this.extensions.set(extension.name, extension);
    }.scope(this) );
  },

  setupPlugins: function() {
    this.plugins = {};
    $H(Canvas2D.Book.plugins).iterate(function(key, value) {
      var plugin = new (value)(this);
      this.plugins[key] = plugin;
      if( value['exposes'] ) {
        value.exposes.iterate(function(func) {
          this[func] = function(arg1, arg2, arg3) { 
            this.plugins[key][func](arg1, arg2, arg3);
          };
        }.scope(this) );
      }
    }.scope(this) );
  },

  log: function( msg ) {
    if( this.console ) { 
      this.console.value = "[" + (new Date).toLocaleString() + "] " 
      + msg + "\n" + this.console.value;
    }
  },

  getCurrentSheet: function() {
    return this.sheets[this.currentSheet];
  },

  clear : function() {
    this.sheets.length = 0;
  },

  start : function() {
    this.stop();
    this.rePublish();
    this.publish();
  },

  stop : function() {
    if( this.nextPublish ) { window.clearTimeout( this.nextPublish ); }
  },

  freeze: function() { this.wait = true;  },
  thaw: function()   { this.wait = false; },

  load: function(source) {    
    var parser = new ADL.Parser();
    var tree;
    this.errors = "";
    if( ( tree = parser.parse( source ) ) ) {
      this.clear();
      this.freeze();
      var visitor = new Canvas2D.ADLVisitor();
      tree.getRoot().accept(visitor, this );
      this.thaw();
      this.rePublish();
      if( visitor.errors.length > 0 ) {
        this.errors = "ADLVisitor reported errors:"
        visitor.errors.iterate( function(error) {
          this.log(error);
          this.errors += "\n   - " + error;
        }.scope(this));
      }
      this.fireEvent("sourceLoaded");
      return true;
    } else {
      this.log( parser.errors );
      this.errors = parser.errors;
      this.fireEvent("sourceLoaded");
      return false;
    }
  },

  toADL: function() {
    var s = "";
    this.sheets.iterate(function(sheet) {
      s += sheet.toADL() + "\n";
    } );
    return s;
  },

  rePublish: function() {
    this.rePublishNeeded = true;	
  },

  publish : function() {
    if( this.rePublishNeeded && !this.wait ) {
      this.publishOnce();
      this.rePublishNeeded = false;
      this.afterPublish();
    }

    // reshedule publish in 10ms
    this.nextPublish = this.publish.scope(this).after(10);
  },

  publishOnce : function() {
    var timer = new Timer();
    this.canvas.clear();

    if( this.getCurrentSheet() ) {
      this.beforeRender();
      this.getCurrentSheet().render();
      this.afterRender();
    }

    this.log( "Canvas2D::publish: RenderTime: " + timer.stop() + "ms" );
  },

  afterPublish: function afterPublish() {
    $H(this.plugins).iterate( function( name, plugin ) {
      if( plugin["afterPublish"] ) { plugin.afterPublish(this); }
    }.scope(this) );
  },

  beforeRender: function beforeRender() {
    $H(this.plugins).iterate( function( name, plugin ) {
      if( plugin["beforeRender"] ) { plugin.beforeRender(this); }
    }.scope(this) );
  },

  afterRender: function afterRender() {
    $H(this.plugins).iterate( function( plugin ) {
      if( plugin["afterRender"] ) { plugin.afterRender(this); }
    }.scope(this) );

    this.updateExternalSource();
  },

  updateExternalSource: function updateExternalSource() {
    if( this.getCurrentSheet() ) {
      var newSource = this.getCurrentSheet().toADL();
      // this should be moved to Widget
      if( this.generated && newSource != this.generated.value ) {
        this.generated.value = newSource;
      }
      this.fireEvent( "sourceUpdated", newSource );
    }
  }

} );

// mix-in some common functionality at class level
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling,
  Canvas2D.Book.prototype );

  // add support for plugins
  Canvas2D.Book.plugins = {};
Canvas2D.ShapeCounter = {};

Canvas2D.Shape = Class.extend( {
  init: function initialize( props ) {
    props = props || {};

    // add default name is none is provided
    if( !props['name'] ) { 
      props.name = this.getPropertyDefault( 'name' ) || "__shape__";
      if( ! Canvas2D.ShapeCounter[props.name] ) {
        Canvas2D.ShapeCounter[props.name] = 0;
      }
      props.name += Canvas2D.ShapeCounter[props.name]++
    }

    // preprocess is used to allow Shapes to preprocess the
    // properties before they are automatically initialized
    props = this.preprocess(props);
    this.setProperties(props);

    // setup getters
    this.getPropertyList().iterate(function propertyListIterator(prop) {
      var propName = prop.substr(0,1).toUpperCase() + prop.substr(1);
      var getterName = "get"+propName;
      if( typeof this[getterName] == "undefined" ) {
        this[getterName] = function() { return this.getProperty(prop);};
      }
    }.scope(this));

    // postInitialize is used to allow Shapes to do initialization
    // stuff, without the need to override this construtor and
    // make sure it is called correctly
    this.postInitialize();
  },

  setParent: function setParent(parent) {
    this.parent = parent;
  },

  getParent: function getParent() {
    return this.parent;
  },

  prepare: function prepare(sheet) {},

  setProperties : function setProperties(props) {
    this.getPropertyList().iterate(function propertyListIterator(prop) {
      this[prop] = props[prop] != null ? props[prop] : null;
    }.scope(this) );
  },

  setProperty : function setProperty(prop, value) {
    this[prop] = value != null ? value : null;
    this.fireEvent( 'change' );
  },

  getProperty: function getProperty( prop ) {
    if( typeof this[prop] == "undefined" ) {
      var propName = prop.substr(0,1).toUpperCase() + prop.substr(1);
      var getterName = "get"+propName;
      return this[getterName]();
    } else {
      return this[prop] != null ? 
      this[prop] : this.getPropertyDefault(prop);
    }
  },

  getPropertyDefault: function getPropertyDefault(prop) {
    var retVal = null;
    this.getClassHierarchy().reverse().iterate( 
      function classHierarchyIterator(clazz) {
        if( retVal == null && typeof clazz.Defaults[prop] != "undefined" ) {
          retVal = clazz.Defaults[prop];
        }
      }
    );
    return retVal;
  },

  toADL: function(prefix) {
    return this.constructToString(this.asConstruct(), prefix);
  },

  asConstruct: function() {
    var construct =  
    { __SHAPE__   : this,
      annotation  : { data: null },
      type        : this.getType(),
      name        : this.getName(),
      supers      : [],
      modifiers   : {},
      children    : [],
      addModifiers: function( props ) {
        props.iterate( function(prop) {
          if( this.__SHAPE__.getProperty( prop ) ) {
            this.addModifier( prop, 
              this.__SHAPE__.getProperty(prop) );
            }
          }.scope(this)
        );
      },
      addModifier : function( key, value ) {
        if( this.__SHAPE__.getPropertyDefault( key ) != value ) {
          this.modifiers[key] = "\"" + value + "\"";
        }
      }
    };

    construct.addModifiers( [ "label", "labelPos", "labelColor" ] );

    return construct;
  },

  constructToString: function(construct, prefix) {
    if(construct == null) { return ""; }
    var string = "";
    if( construct.annotation && construct.annotation.data ) {
      string += prefix + "[@" + construct.annotation.data + "]\n";
    }
    string += prefix + construct.type + " " + construct.name;
    construct.supers.iterate(function(zuper) { string += " : " + zuper; });
    $H(construct.modifiers).iterate( 
      function modifierIterator( key, value ) {
        if( typeof value != "function" ) {
          string += " +" + key;
          if( value ) { string += "=" + value; }
        }
      } 
    );
    if( construct.children.length > 0 ) {
      string += " {\n";
      var me = this;
      construct.children.iterate(function childIterator(child) {
        string += me.constructToString(child, prefix + "  " ) + "\n";
      } );
      string += prefix + "}";
    } else {
      string += ";";
    }
    return string;
  },

  delayRender: function() {
    return false;
  },

  drawLabel: function(sheet, left, top) {
    if( this.getLabel() && this.getHeight() != null && this.getCenter() ) {
      left += this.getCenter().left;

      switch( this.getLabelPos() ) {
        case "top":	            top  += - 5;   break;
        case "top-inner":       top  += + 16;  break;
        case "bottom":          top  += this.getHeight() + 11; break;
        case "bottom-inner":    top  += this.getHeight() - 8;  break;
        case "center": default: top  += this.getCenter().top + 2.5;
      }

      sheet.save();
      sheet.fillStyle     = this.getLabelColor();
      sheet.textAlign     = this.getLabelAlign();
      sheet.font          = this.getLabelFont();
      sheet.useCrispLines = this.getLabelUseCrispLines();
      sheet.fillText(this.getLabel(), left, top);
      sheet.restore();
    }
  },

  render: function(sheet, left, top) {
    this.prepare(sheet);

    sheet.save();
    this.draw     (sheet, left, top);
    this.drawLabel(sheet, left, top);
    sheet.restore();
  },


  // these methods are required and are created when a shape is
  // registered correctly.
  getType            : function() { 
    throw( "Missing getType. Did you register the shape?" ); 
  },
  getClasSHierarchy  : function() { 
    throw( "Missing getClassHierarchy. Did you register the shape?" ); 
  },

  // the remaining methods are not applicable for abstract shapes
  preprocess     : function preprocess(props)      { return props; },
  postInitialize : function postInitialize()       { },
  draw           : function draw(sheet, left, top) { },
  hit            : function hit(x, y)              { return false; },
  hitArea        : function hitArea(l, t, w, h)    { return false; },
  getCenter      : function getCenter()            { return null;  },
  getPort        : function getPort(side)          { return null;  }
} );

// add-in some common functionality
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling,
  Canvas2D.Shape.prototype );

  Canvas2D.Shape.MANIFEST = {
    name : "shape",
    properties: [ "name", "label", "labelPos", "labelColor", "labelAlign",
    "labelFont", "labelUseCrispLines", "useCrispLines",
    "topDown" ]
  };

  Canvas2D.Shape.manifestHandling = $H( {
    getManifest: function getManifest() {
      return this.MANIFEST || this.__CLASS__.MANIFEST;
    },

    getType: function getType() {
      return this.getManifest().name;
    },

    getTypes: function getTypes() {
      return [ this.getType() ].concat( this.getAliasses() );
    },

    getPropertyPath: function getPropertyPath() {
      return this.getManifest().propertyPath || [];
    },

    getClassHierarchy: function getClassHierarchy() {
      var classes = [ Canvas2D.Shape ].concat( this.getPropertyPath() );
      classes.push( this.getClass() );
      return classes;
    },

    getLocalProperties: function getLocalProperties() {
      return this.getManifest().properties || [];
    },

    getPropertyList: function getPropertyList() {
      if( !this.allPropertiesCache ) { 
        this.allPropertiesCache = [];
        this.getClassHierarchy().iterate(
          function propertiesCacheFiller(shape){
            this.allPropertiesCache = this.allPropertiesCache
            .concat(shape.getLocalProperties());
          }.scope(this)
        );
      }
      return this.allPropertiesCache
    },

    getAliasses: function getAliasses() {
      return this.getManifest().aliasses || [];
    },

    getLibraries: function getLibraries() {
      return this.getManifest().libraries || [];
    }
  } 
);

// add manifestHandling functions to each Shape instance and on the
// class itself
Canvas2D.Shape.manifestHandling.iterate( function(key, value) {
  Canvas2D.Shape.prototype[key] = value;
  Canvas2D.Shape[key] = value;
} );
Canvas2D.Sheet = Class.extend( {
  init: function init(props) {
    props = props || {};

    this.book = props.book;

    this.name  = props.name  || "default";   // name of the sheet
    this.style = props.style || "static";    // selected style

    this.clear();
    this.dirty = false;

    if(props.canvas) { this.setCanvas(props.canvas); }

    Canvas2D.Keyboard.on( "keyup", this.handleKeyDown.scope(this) );
  },

  setCanvas: function setCanvas(canvas) {
    this.canvas = canvas;
    this.wireCanvasDelegation();
    this.setupProperties();
  },
  
  getHeight: function getHeight() {
    return this.canvas.canvas.height;
  },

  wireCanvasDelegation: function wireCanvasDelegation() {
    if( !this.canvas ) { return; }

    Canvas2D.Sheet.Operations.iterate(function(operation) {
      if( operation == "restore" ) {
        this[operation] = function() {
          this.canvas[operation].apply(this.canvas, arguments);
          this.transferBackProperties();
          return;
        }.scope(this);
      } else {
        this[operation] = function() {
          this.transferProperties();
          return this.canvas[operation].apply(this.canvas, arguments);
        }.scope(this);
      }
    }.scope(this) );
  },

  setupProperties: function setupProperties() {
    Canvas2D.Sheet.Properties.iterate( function(prop) {
      this[prop] = Canvas2D.Sheet.Defaults[prop] || this.canvas[prop];
    }.scope(this) );
  },

  transferProperties : function() {
    Canvas2D.Sheet.Properties.iterate(function(prop) {
      this.canvas[prop] = this[prop];
    }.scope(this) );
  },

  transferBackProperties : function() {
    Canvas2D.Sheet.Properties.iterate(function(prop) {
      this[prop] = this.canvas[prop];
    }.scope(this) );
  },

  makeDirty: function() {
    this.dirty = true;
    this.fireEvent( "change" );
  },

  isDirty: function() {
    return this.dirty;
  },

  clear: function() {
    this.positions      = []; // list of shapes on the sheet
    this.shapesMap      = {}; // name to shape mapping
    this.positionsMap   = {}; // shape to position mapping
    this.selectedShapes = []; // list of selected shapes

    this.fireEvent( "change" );
  },

  makeDynamic: function() { this.style = "dynamic";         },
  makeStatic : function() { this.style = "static";          },
  isDynamic  : function() { return this.style == "dynamic"; },
  isStatic   : function() { return !this.isDynamic();       },

  freeze: function() { this.fireEvent( "freeze" ); },
  thaw:   function() { this.fireEvent( "thaw" );   },

  at: function(left, top) {
    this.newTop  = top;
    this.newLeft = left;
    return this;
  },

  put: function(shape) {
    return this.add(shape);
  },

  add: function(shape) {
    var baseName = shape.getName().replace(/<.*$/,'');
    if( this.shapesMap[baseName] ) {
      // TODO: this.book dependency should be enforced
      var logger = this.book ? this.book : console;
      logger.log( "WARNING: Shape with name '" + baseName + 
                  "' already exists. Skipping." );
      return null;
    }

    var position = new Canvas2D.Position( shape, this.newLeft, this.newTop);
    shape   .on( "change", this.makeDirty.scope(this) );
    position.on( "change", this.makeDirty.scope(this) );

    this.newLeft = null;
    this.newTop = null;

    this.positions.push(position);
    this.shapesMap[baseName] = shape;
    this.positionsMap[shape.getName()] = position;

    this.fireEvent( "newShape", "added new shape" + 
    ( position.getLeft() != null ? 
    "@" + position.getLeft() + "," 
    + position.getTop() : "" ) );

    this.makeDirty();

    return shape;
  },

  getPosition: function getPosition(shape) {
    return this.positionsMap[shape.getName()];
  },

  hit: function(x,y) {
    for( var s = this.positions.length-1; s>=0; s-- ) {
      var position = this.positions[s];
      if( position.hit(x,y) ) {
        if( Canvas2D.Keyboard.keyDown(91) ||    // cmd
        Canvas2D.Keyboard.keyDown(17) )     // ctrl
        {
          // adding and removing
          if( this.selectedShapes.contains(position) ) {
            this.selectedShapes.remove(position);
          } else {
            this.selectedShapes.push(position);
          }
        } else {
          if( !this.selectedShapes.contains(position) ) {
            this.selectedShapes = [ position ];
          } else {
            // just clicked on already selected shape
            return;
          }
        }
        this.fireEvent( "shapeSelected", position );
        return;
      }
    }
    // no position was hit, so clearing the selection list
    this.selectedShapes = [];
  },

  hitArea: function( left, top, right, bottom ) {
    var newSelection =  
    ( Canvas2D.Keyboard.keyDown(91) || // cmd
    Canvas2D.Keyboard.keyDown(17) ) // ctrl
    ? this.selectedShapes : [];
    for( var s = this.positions.length-1; s>=0; s-- ) {
      if( this.positions[s].hitArea(left, top, right, bottom) ) {
        newSelection.push( this.positions[s] );
        this.fireEvent( "shapeSelected", this.positions[s] );
      }
    }
    this.selectedShapes = newSelection.unique();
  },

  handleMouseDown: function(pos) {
    if( !this.isDynamic() ) { return; }
    this.hit( pos.x, pos.y );
    this.currentPos = pos;
    this.makeDirty();
  },

  handleMouseUp: function(pos) {
    if( !this.isDynamic() ) { return; }
    this.selectedShapes.iterate(function(position) {
      this.fireEvent( "shapesMoved",
      "Shape moved to " + 
      position.left + ", " + position.top );
    }.scope(this) );
    this.showSelection   = false;
    this.makeDirty();
  },

  handleMouseDrag: function(pos) {
    if( !this.isDynamic() ) { return; }
    if( !this.showSelection && this.selectedShapes.length > 0 ) {
      this.moveCurrentSelection(pos.dx, pos.dy);
    } else {
      // we've lost our currentPos somewhere (probably a new sheet load)
      if( !this.currentPos ) { this.currentPos = pos; }
      this.showSelection = true;
      this.hitArea( this.currentPos.x, this.currentPos.y, pos.x, pos.y );
      this.selectionPos  = pos;
    }
    this.makeDirty();
  },

  selectAllShapes: function() {
    // FIXME: only selectable shapes (so no connectors)
    this.selectedShapes = [];
    this.positions.iterate( function(position) { 
      this.selectedShapes.push(position) 
    }.scope(this) );
    this.makeDirty();
  },

  moveCurrentSelection: function(dx, dy) {
    this.selectedShapes.iterate(function(position) {	
      position.move(dx, dy);
    }.scope(this) );
  },

  handleKeyDown: function(key) {
    if( Canvas2D.Keyboard.keyDown(16) ) { // shift + 
      switch(key) {
        case 37: this.moveCurrentSelection( -5,  0 ); break; // left
        case 38: this.moveCurrentSelection(  0, -5 ); break; // up
        case 39: this.moveCurrentSelection(  5,  0 ); break; // right
        case 40: this.moveCurrentSelection(  0,  5 ); break; // down
      }
    }
    if( ( Canvas2D.Keyboard.keyDown(91) ||    // cmd 
    Canvas2D.Keyboard.keyDown(17) ) &&  // ctrl +
    key == 65 &&                          // a
    this.canvas.mouseOver )
    {
      this.selectAllShapes();
    }
  },

  addSelectionOverlay: function() {
    if( this.showSelection ) { 
      var pos = this.selectionPos;
      var dx = pos.x - this.currentPos.x;
      var dy = pos.y - this.currentPos.y;

      this.canvas.fillStyle = "rgba( 0, 0, 255, 0.1 )";
      this.canvas.fillRect( pos.x <= this.currentPos.x ?  
        pos.x : this.currentPos.x, 
        pos.y <= this.currentPos.y ?
        pos.y : this.currentPos.y,
        Math.abs(dx), Math.abs(dy) );
    }
  },

  addSelectionMarkers: function() {
    this.selectedShapes.iterate( function(shape) {
      var box = shape.getBox();
      this.canvas.fillStyle = "rgba( 200, 200, 255, 1 )";
      [[ box.left, box.top    ], [ box.right, box.top    ],
      [ box.left, box.bottom ], [ box.right, box.bottom ]].iterate( 
        function(corner) {
          this.canvas.beginPath();
          this.canvas.arc( corner[0],  corner[1], 5, 0, Math.PI*2, true );
          this.canvas.fill();	
        }.scope(this) );
    }.scope(this) );
  },

  render: function() {
    var delayed = [];
    this.positions.iterate( function(shape) { 
      if( shape.delayRender() ) {
        delayed.push(shape);
      } else {
        shape.render(this); 
      }
    }.scope(this) );

    delayed.iterate( function(shape) { 
      shape.render(this); 
    }.scope(this) );

    this.addSelectionOverlay();
    this.addSelectionMarkers();
  },

  toADL: function() {
    var s = "";
    s += "Sheet "  + this.name;
    s += " +" + this.style + " {\n";
    this.positions.iterate(function(shape) { 
      var t = shape.toADL("  ");
      if( t ) { s += t + "\n"; }
    } );
    s += "}";
    return s;
  }
} );

// add-in some common functionality
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, 
             Canvas2D.Sheet.prototype );

Canvas2D.Sheet.Properties = 
  [ "globalAlpha", "globalCompositeOperation",
    "strokeStyle", "fillStyle", "lineWidth", 
    "lineCap", "lineJoin", "miterLimit", 
    "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor",
    "font", "textAlign", "textBaseline",
    "lineStyle", "useCrispLines", "textDecoration" ];

Canvas2D.Sheet.Operations = 
  [ "save", "restore", 
    "scale", "rotate", "translate", "transform", "setTransform",
    "createRadialGradient", "createPattern",
    "clearRect", "fillRect", "strokeRect",
    "beginPath", "closePath", "moveTo", "lineTo",
    "quadraticCurveTo", "bezierCurveTo", 
    "arcTo", "rect", "arc",
    "fill", "stroke", 
    "clip","isPointInPath", 
    "fillText","fillText","strokeText","strokeText","measureText",
    "drawImage","createImageData","getImageData","putImageData",
    "getFontSize", "fillStrokeRect" ];

Canvas2D.Sheet.from = function(construct, book) {
  var style = "static";
  var styleModifier = construct.modifiers.get( "style" );
  if( styleModifier ) {
    style = styleModifier.value.value.toLowerCase();
  }

  construct.modifiers.iterate(function(key, value) {
    if( key.toLowerCase() == "static" || key.toLowerCase() == "dynamic" ) {
      style = key.toLowerCase();
    }
  });

  return new Canvas2D.Sheet({ book: book, 
                              name: construct.name, style: style } );
};

Canvas2D.Sheet.MANIFEST = {
  name      : "sheet",
  properties : [],
  libraries : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Sheet );
Canvas2D.Position = Class.extend( {
    init: function( shape, left, top ) {
	this.shape = shape;
	this.left  = left || null;
	this.top   = top  || null;
    },

    toADL: function(prefix) {
	var loc = "";
	if( this.left != null && this.top != null ) {
	    loc = prefix + "[@" + this.left + "," + this.top + "]\n";
	}
	return loc + this.shape.toADL(prefix);
    },

    getLeft: function() { return this.left; },
    getTop : function() { return this.top;  },

    getWidth : function() { return this.shape.getWidth();  },
    getHeight: function() { return this.shape.getHeight(); },
    
    getCenter: function() { 
	var center = this.shape.getCenter();
	center.left += this.left;
	center.top += this.top;
	return center;
    },

    getBox: function() {
	return { left  : this.left, 
		 right : this.left + this.shape.getWidth(),
		 top   : this.top,
		 bottom: this.top  + this.shape.getHeight() };
    },

    getPort: function(port) {
	var port = this.shape.getPort(port);
	port.left += this.left;
	port.top  += this.top;
	return port;
    },

    render: function( sheet ) {
	this.shape.render( sheet, this.left, this.top );
    },

    move: function( dleft, dtop ) {
	this.left += dleft;
	this.top  += dtop;
	this.fireEvent( "change", 
			"from " + this.left - dleft + "," + this.top - dtop +
			" to " + this.left + "," + this.top );
    },

    getName: function() {
	return this.shape.getName();
    },

    hit: function(x,y) {
	var rx = x - this.left;
	var ry = y - this.top;
	if( rx < 0 || ry < 0 ) { return false; }
	return this.shape.hit(rx, ry);
    },

    hitArea: function(left, top, right, bottom) {
	var rleft   = left   - this.left;
	var rtop    = top    - this.top;
	var rright  = right  - this.left;
	var rbottom = bottom - this.top;
	return this.shape.hitArea(min(rleft,rright), 
				  min(rtop,rbottom), 
				  max(rleft,rright), 
				  max(rtop,rbottom));

    },

    delayRender: function() {
	return this.shape.delayRender();
    }
});

ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling,
	     Canvas2D.Position.prototype );
Canvas2D.Connector = Canvas2D.Shape.extend( {
  preprocess: function preprocess(props) {
    props = this._super(props);
    if( props.from == props.to ) { props.routing = "recursive"; }
    return props;
  },

  getFrom  : function getFrom(sheet) { 
    return sheet ? sheet.getPosition(this.from) : this.from; 
  },

  getTo    : function getTo(sheet) { 
    return sheet ? sheet.getPosition(this.to)   : this.to;   
  },

  delayRender: function delayRender() { return true; },

  isValid: function isValid() {
    return this.to != null && this.from != null;
  },

  draw: function draw(sheet, left, top) {
    if( !this.isValid() ) { return };
    
    sheet.save();
    sheet.useCrispLines = this.getUseCrispLines();
    sheet.strokeStyle   = this.getLineColor();
    sheet.lineWidth     = this.getLineWidth();
    sheet.lineStyle     = this.getLineStyle();

    sheet.beginPath();
    switch( this.getRouting() ) {
      case "custom":              this._custom    (sheet); break;
      case "recursive":           this._recursive (sheet); break;
      case "vertical":            this._vertical  (sheet); break;
      case "horizontal":          this._horizontal(sheet); break;
      case "direct":     default: this._direct    (sheet);
    }
    sheet.stroke();
    sheet.closePath();
    
    this.addLabels(sheet);
    
    sheet.restore();
  },
  
  _custom: function _custom(sheet) {
    var beginShape = this.getFrom(sheet);
    var endShape   = this.getTo(sheet);
    var start      = beginShape.getPort(this.getRouteBegin());
    var end        = endShape.getPort(this.getRouteEnd());
    // straight is a special case for direct
    if( this.getRouteStyle() == "straight" ) {
      if( this.getRouteBegin() == "e" || this.getRouteBegin() == "w" ) {
        var y = start.top - ( ( start.top - end.top ) / 2 );
        start.top = y;
        end.top   = y;
      } else {
        var x = start.left - ( ( start.left - end.left ) / 2 );
        start.left = x;
        end.left   = x;
      }
    }
    
    // label positions and alignment for begin and end
    var offset = { "e" : { left: +5, top: -5, align: "left"  },
                   "n" : { left: +5, top: -5, align: "left"  },
                   "w" : { left: -5, top: -5, align: "right" },
                   "s" : { left: +5, top: +10, align: "left"  } };

    var dir;
    if( this.getRouteBegin() ) {
      dir = this.getRouteBegin().substring(0,1);
      this.beginLabelPos = { left: start.left + offset[dir].left,
                             top:  start.top  + offset[dir].top };
      this.beginLabelAlign = offset[dir].align;
    } else {
      console.log( "WARNING: missing routeBegin on " + this.name );
    }

    if( this.getRouteEnd() ) {
      dir = this.getRouteEnd().substring(0,1);
      this.endLabelPos = { left: end.left + offset[dir].left,
                           top:  end.top  + offset[dir].top };
      this.endLabelAlign = offset[dir].align;
    } else {
      console.log( "WARNING: missing routeBegin on " + this.name );
    }
    
    // draw connectors
    end   = this._draw_end_connector(sheet, end)
    start = this._draw_start_connector(sheet, start)

    // choose special drawing algorithm
    switch( this.getRouteStyle() ) {
      case "corner"    : this._draw_corner   (sheet, start, end); break;
      case "tree"      : this._draw_tree     (sheet, start, end); break;
      case "recursive" : this._draw_recursive(sheet, start, end); break;
      default:
        var l = start.left - (( start.left - end.left ) / 2 );
        var t = start.top  - (( start.top  - end.top  ) / 2 );
        if( start.top == end.top ) { t -= 5; }
        this.centerLabelPos = { left: l, top: t };
    }
    sheet.lineTo( end.left, end.top );
  },
  
  addLabels: function addLabels(sheet) {
    if( this.getBeginLabel() && this.getBeginLabelPos() ) {
      this.addLabel( sheet, this.getBeginLabel(), 
                     this.getBeginLabelPos(), this.getBeginLabelAlign() );
    }
    if( this.getEndLabel() && this.getEndLabelPos() ) {
      this.addLabel( sheet, this.getEndLabel(),
                     this.getEndLabelPos(),   this.getEndLabelAlign() );
    }
    if( this.getCenterLabel() && this.getCenterLabelPos() ) {
      this.addLabel(sheet, this.getCenterLabel(),
                    this.getCenterLabelPos(), "center");
    }
  },
  
  addLabel: function addLabel(sheet, label, pos, align) {
    sheet.save();
    sheet.textAlign = align || "left";
    sheet.font = this.getLabelFont();
    sheet.fillText(label, pos.left, pos.top);
    sheet.restore();
  },
  
  getBeginLabelPos: function getBeginLabelPos() { 
    return this.beginLabelPos; 
  },
  
  getEndLabelPos: function getEndLabelPos() { 
    return this.endLabelPos; 
  },
  
  getCenterLabelPos: function getCenterLabelPos() { 
    return this.centerLabelPos; 
  },
  
  getBeginLabelAlign: function getBeginLabelAlign() {
    return this.beginLabelAlign || "left";    
  },
  
  getEndLabelAlign: function getEndLabelAlign() {
    return this.endLabelAlign || "left";
  },
  
  _draw_corner : function _draw_corner( sheet, start, end ) {
    var dir = this.getRouteBegin().substring(0,1);
    if( dir == "n" || dir == "s" ) {
      sheet.lineTo( start.left, end.top );
      this.centerLabelPos = { left: start.left, 
                              top: end.top + ( dir == "n" ? -5 : 10 ) };
    } else {
      sheet.lineTo( end.left, start.top );
      this.centerLabelPos = { left: end.left, 
                              top: start.top + ( dir =="e" ? -5 : 10 ) };      
    }
    sheet.lineTo( end.left, end.top   );
  },

  _draw_tree: function _draw_tree( sheet, start, end ) {
    var direction = this.getRouteBegin().substring(0,1);
    var dx = end.left - start.left;
    var dy = end.top  - start.top;
    if( direction == "n" || direction == "s" ) {
      sheet.lineTo( start.left, start.top + dy/2);
      sheet.lineTo( end.left  , start.top + dy/2);
      this.centerLabelPos = { left: start.left - ((start.left - end.left )/2),
                              top: start.top + (dy/2) + 10 };
    } else {
      sheet.lineTo( start.left + dx/2, start.top );
      sheet.lineTo( start.left + dx/2, end.top   );
      this.centerLabelPos = { left: start.left + (dx/2),
                              top: start.top - ((start.top - end.top )/2) - 5 };
    }    
  },

  _draw_recursive : function _draw_recursive(sheet, start, end) {
    var e = 30;
    var sl = start.left;  var st = start.top;
    var el = end.left;    var et = end.top;
    var mapping = { "e" : [ [ sl+e, st ], [ sl+e, et-e ], [ el, et-e ] ],
                    "n" : [ [ sl, st-e ], [ el-e, st-e ], [ el-e, et ] ],
                    "w" : [ [ sl-e, st ], [ sl-e, et+e ], [ el, et+e ] ],
                    "s" : [ [ sl, st+e ], [ el+e, st+e ], [ el+e, et ] ] };
    var orientation = this.getRouteBegin().substring(0,1);
    var d = mapping[orientation];

    sheet.lineTo( d[0][0], d[0][1] );
    sheet.lineTo( d[1][0], d[1][1] );
    sheet.lineTo( d[2][0], d[2][1] );

    var offset = { "e" : { left: 0, top: -5 }, 
                   "n" : { left: 0, top: -5 },
                   "w" : { left: 0, top: +10 },
                   "s" : { left: 0, top: +10 } };
    this.centerLabelPos = { left: d[1][0] + offset[orientation].left, 
                            top: d[1][1] + offset[orientation].top};
  },

  _draw_start_connector: function draw_start_connector(sheet, pos) {
    var connector = null;
    var dir       = this.getRouteBegin();

    if( this.getBegin() ) { 
      var connectors = this.getBegin();
      connector = connectors[dir] ? 
        connectors[dir] : connectors[dir.substring(0,1)];
    }

    return this._draw_connector(sheet, connector, pos.left, pos.top );
  },

  _draw_end_connector: function draw_start_connector(sheet, pos) {
    var connector = null;
    var dir       = this.getRouteEnd();

    if( this.getEnd() ) { 
      var connectors = this.getEnd();
      connector = connectors[dir] ? 
        connectors[dir] : connectors[dir.substring(0,1)];
    }

    return this._draw_connector(sheet, connector, pos.left, pos.top );
  },
  
  _draw_connector: function _draw_connector(sheet, connector, left, top) {
    sheet.moveTo(left, top);
    if( connector ) {
      var oldStyle = sheet.lineStyle;
      sheet.lineStyle = "solid";
      sheet.stroke();
      sheet.beginPath();
      sheet.moveTo(left, top);
      connector.lines.iterate(function(d){
        if(d == "fill") {
          sheet.fillStyle = "rgba( 0, 0, 0, 1 )";
          sheet.fill();
        } else {
          sheet.lineTo(left + d[0], top + d[1]);
        }
      });
      sheet.stroke();
      sheet.beginPath();
      sheet.lineStyle = oldStyle;
      sheet.moveTo(left + connector.end[0], top + connector.end[1]);
      return { left: left + connector.end[0], top: top + connector.end[1] };
    }
    return { left: left, top: top };
  },

  _direct: function _direct(sheet) {
    var from = this.getFrom(sheet).getCenter();
    var to   = this.getTo(sheet).getCenter();

    // top : left : [ from, to ]
    var mapping = { "-1" : { "-1" : [ "nw", "se" ],
                              "0" : [ "n" , "s"  ],
                              "1" : [ "ne", "sw" ] },
                    "0"  : { "-1" : [ "w" , "e"  ],
                              "0" : [ "n",  "s"  ],
                              "1" : [ "e",  "w"  ] },
                    "1"  : { "-1" : [ "sw", "ne" ],
                              "0" : [ "s",  "n"  ],
                              "1" : [ "se", "nw" ] } };
    var m = 100;                            
    var top  = to.top - from.top;
    top = Math.round( top / m ) * m;
    if( top != 0 ) { top /= Math.abs(top); }
    var left = to.left - from.left;
    left = Math.round( left / m ) * m;
    if( left != 0 ) { left /= Math.abs(left); }
    var route = mapping[top][left];

    // translate to new routing system
    this.routeStyle = 'direct';
    this.routeBegin = route[0];
    this.routeEnd   = route[1];

    // and call it
    this._custom(sheet);
  },
  
  _recursive: function _recursive(sheet) {
    this.routeStyle = "recursive";
    this.routeBegin = this.routeBegin || "ene";
    var mapping = { "nnw" : "wnw", "ene" : "nne",  
                    "wsw" : "ssw", "sse" : "ese" };
    this.routeEnd   = mapping[this.routeBegin];
    this._custom(sheet);
  },

  _vertical: function _vertical(sheet) {
    var from    = this.getFrom(sheet);
    var to      = this.getTo(sheet);
    var reverse = from.getBox().top < to.getBox().top;
    var dist1   = reverse ? to.getBox().top   - from.getBox().bottom
                          : from.getBox().top - to.getBox().bottom;
    var dist2   = reverse ? to.getCenter().top - from.getBox().bottom
                          : from.getCenter().top - to.getBox().bottom;
    
    if( dist1 >= Canvas2D.Connector.Defaults.minTreeDist ) {
      this.routeStyle = "tree";
      this.routeBegin = reverse ? "s" : "n";
      this.routeEnd   = reverse ? "n" : "s";
    } else if( dist2 >= Canvas2D.Connector.Defaults.minCornerDist ) {  
      this.routeStyle = "corner";
      this.routeBegin = reverse ? "s" : "n";
      this.routeEnd   = from.getPort(this.routeBegin).left < 
                          to.getPort("w").left ? "w" : "e";
    } else {
      this.routeStyle = "straight";
      this.routeBegin = from.getPort("e").left < 
                          to.getPort("w").left ? "e" : "w";
      this.routeEnd   = this.routeBegin == "e" ? "w" : "e";
    }
    this._custom(sheet);
  },

  _horizontal: function _horizontal(sheet) {
    var from    = this.getFrom(sheet);
    var to      = this.getTo(sheet);
    var reverse = from.getBox().left < to.getBox().left;
    var dist1   = reverse ? to.getBox().left   - from.getBox().right
                          : from.getBox().left - to.getBox().right;
    var dist2   = reverse ? to.getCenter().left - from.getBox().right
                          : from.getCenter().left - to.getBox().right;
    
    if( dist1 >= Canvas2D.Connector.Defaults.minTreeDist ) {
      this.routeStyle = "tree";
      this.routeBegin = reverse ? "e" : "w";
      this.routeEnd   = reverse ? "w" : "e";
    } else if( dist2 >= Canvas2D.Connector.Defaults.minCornerDist ) {  
      this.routeStyle = "corner";
      this.routeBegin = reverse ? "e" : "w";
      this.routeEnd   = from.getPort(this.routeBegin).top < 
                          to.getPort("n").top ? "n" : "s";
    } else {
      this.routeStyle = "straight";
      this.routeBegin = from.getPort("s").top < 
                          to.getPort("n").top ? "s" : "n";
      this.routeEnd   = this.routeBegin == "n" ? "s" : "n";
    }
    this._custom(sheet);
  },
  
  initialBranchLength: function initialBranchLength(top, bottom) {
    return ( bottom - top ) / 2;
  },

  hit: function hit(x,y) {
    // connectors aren't selectable (for now ;-))
    return false;
  },

  asConstruct: function asConstruct() {
    var construct = this._super();

    if( this.getFrom() && this.getTo() ) {
      construct.modifiers[this.getFrom().getName() + "-" +
                          this.getTo().getName()] = null;
    }

    construct.modifiers[this.getRouting()] = null;
    if( this.getRouting() == "custom" ) {
      construct.annotation.data = this.getRouteStyle() + ":" +
                                  this.getRouteBegin() + "-" +
                                  this.getRouteEnd();
    }

    construct.addModifiers( [ "lineColor", "lineStyle", "lineWidth", 
                              "begin", "end",
                              "beginLabel", "centerLabel", "endLabel" ] );

    if( this.getRouting() == "recursive" && this.getRouteBegin() != "ene" ) {
      construct.addModifiers( [ "routeBegin" ] );
    }
    return construct;
  }
} );

Canvas2D.Connector.from = function from(construct, sheet) {
  var props = { name: construct.name };
  construct.modifiers.iterate(function(key, value) {
    if( value.value == null ) {
      if( key.contains("-") ) {
        var parts = key.split( "-" );
        props["from"] = sheet.shapesMap[parts[0]];
        props["to"]   = sheet.shapesMap[parts[1]];
      } else {
        props["routing"] = key;
        if( key == "custom" && construct.annotation && 
            construct.annotation.data &&
            construct.annotation.data.contains(":") &&
            construct.annotation.data.contains("-") ) 
            {
              var parts = construct.annotation.data.split(":");
              props["routeStyle"] = parts[0];
              var ends = parts[1].split("-");
              props["routeBegin"] = ends[0];
              props["routeEnd"]   = ends[1];
            }
      }
    } else {
      props[key] = ( key == "from" || key == "to" ) ? 
        sheet.shapesMap[value.value.value] : value.value.value;
      if( key == "begin" || key == "end" ) {
        props[key] = Canvas2D.CustomConnectors[props[key]];
      }
    }
  });

  errors = [];
  warnings = [];
  if( !props['from'] ) {
      errors.push( "Missing FROM connection-end on " + construct.name );
  }
  if( !props['to'] ) {
    errors.push( "Missing TO connection-end on " + construct.name   );
  }
  if( !["vertical","horizontal","direct","custom"].has(props["routing"]) ){
    warnings.push( "unknown routing: " + props["routing"] + 
                   ", defaulting to direct." );
  }
  
  var result = {};
  
  if( warnings.length > 0 ) {
    result.warnings = warnings;
  }

  if( errors.length > 0 ) {
    result.errors = errors;
  } else {
    var elem = new Canvas2D.Connector( props );
    elem.warnings = result.warnings;
    result = elem;
  }

  return result;
};

Canvas2D.Connector.MANIFEST = {
  name         : "connector",
  aliasses     : [ "link" ],
  properties   : [ "lineColor", "lineStyle", "lineWidth", 
                   "from", "to", "begin", "end",
                   "routing", "routeStyle", "routeBegin", "routeEnd",
                   "beginLabel", "centerLabel", "endLabel" ],
  libraries    : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Connector );

Canvas2D.CustomConnectors = {};
Canvas2D.registerConnector = function registerConnector( name, connector ) {
  Canvas2D.CustomConnectors[name] = connector;
}
Canvas2D.Line = Canvas2D.Shape.extend( {
    getWidth : function() { return this.getDx() },
    getHeight: function() { return this.getDy() },

    draw: function(sheet, left, top) {
	sheet.beginPath();

	sheet.strokeStyle = this.getColor();
	sheet.lineWidth = this.getLineWidth();
	sheet.lineStyle = this.getLineStyle();

	sheet.moveTo(left, top);
	sheet.lineTo(left + this.getDx(), top + this.getDy());
	sheet.stroke();
	// set lineStyle back to default
	sheet.lineStyle = "solid";

	sheet.closePath();
    },

    hit: function(x,y) { 
	return ( this.getWidth() >= x && this.getHeight() >= y ); 
    },

    hitArea: function(left, top, right, bottom) { 
	return ! ( 0 > right 
		   || this.getWidth() < left
		   || 0 > bottom
		   || this.getHeight() < top );
    },

    getCenter: function() {
	return { left: this.getWidth()  / 2, top:  this.getHeight() / 2 };
    },

    getPort: function(side) {
	switch(side) {
	case "n": case "north":  
	    return { top : 0,                left: this.getWidth() / 2 }; break;
	case "s": case "south":  
	    return { top : this.getHeight(), left: this.getWidth() / 2 }; break;
	case "e": case "east":
	    return { top : this.getHeight() / 2, left: this.getWidth() }; break;
	case "w": case "west":
	    return { top : this.getHeight() / 2, left: 0               }; break;
	}
    },

    getGeo: function() {
	return this.getWidth() && this.getHeight() ?
	    this.getWidth() + "x" + this.getHeight() : null;
    },

    asConstruct: function() {
	var construct = this._super();
	construct.addModifiers( [ "geo", "color" ] );
	return construct;
    }
} );

Canvas2D.Line.from = function( construct, sheet ) {
    var props = { name: construct.name };
    construct.modifiers.iterate(function(key, value) {
	value = ( value.value ? value.value.value : "" );

	if( key == "dx" || key == "dy" || key == "lineWidth" ) {
	    value = parseInt(value);
	} else if( value == "" ) {
	    value = key;
	    key = "color";
	}

	props[key] = value;
    } );

    return new Canvas2D.Line(props);
};

Canvas2D.Line.MANIFEST = {
    name     : "line",
    properties : [ "color", "dx", "dy", "lineWidth", "lineStyle" ],
    libraries: [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Line );
Canvas2D.LinePath = Canvas2D.Shape.extend( {
    getWidth : function() { return this.dx },
    getHeight: function() { return this.dy },

    getStart : function() { return this.start; },
    getMoves : function() { return this.moves; },

    preprocess : function(props) {
	if( props.start ) {
	    var parts = props.start.split(",");
	    props.start = { left:parseInt(parts[0]), top:parseInt(parts[1]) };
	} else {
	    props.start = { left:0, top:0 };
	}
	if( props.moves ) {
	    var moves = [];
	    var dx = max(0,props.start.left);
	    var dy = max(0,props.start.top );

	    props.moves.split(";").iterate( function(move) {
		var parts = move.split(",");
		moves.push( {dx:parseInt(parts[0]), dy:parseInt(parts[1])} );
		dx = max(dx, dx + parseInt(parts[0]));
		dy = max(dy, dy + parseInt(parts[1]));
	    });
	    props.moves = moves;
	    props.dx    = dx;
	    props.dy    = dy;
	}
	return props;
    },

    draw: function(sheet, left, top) {
	sheet.beginPath();
	sheet.strokeStyle = this.getColor();
	sheet.lineWidth = this.getLineWidth();
	sheet.lineStyle = this.getLineStyle();

	left += this.start.left;
	top  += this.start.top;
	sheet.moveTo(left, top);
	this.getMoves().iterate( function(move) {
	    left = left + move.dx;
	    top  = top  + move.dy;
	    sheet.lineTo(left, top);
	} );
	sheet.stroke();

	sheet.closePath();
    },

    hit: function(x,y) { 
	return ( this.getWidth() >= x && this.getHeight() >= y ); 
    },

    hitArea: function(left, top, right, bottom) { 
	return ! ( 0 > right 
		   || this.getWidth() < left
		   || 0 > bottom
		   || this.getHeight() < top );
    },

    getCenter: function() {
	return { left: this.getWidth()  / 2, top:  this.getHeight() / 2 };
    },

    getPort: function(side) {
	switch(side) {
	case "n": case "north":  
	    return { top : 0,                left: this.getWidth() / 2 }; break;
	case "s": case "south":  
	    return { top : this.getHeight(), left: this.getWidth() / 2 }; break;
	case "e": case "east":
	    return { top : this.getHeight() / 2, left: this.getWidth() }; break;
	case "w": case "west":
	    return { top : this.getHeight() / 2, left: 0               }; break;
	}
    },

    getGeo: function() {
	return this.getWidth() && this.getHeight() ?
	    this.getWidth() + "x" + this.getHeight() : null;
    },

    asConstruct: function() {
	var construct = this._super();
	construct.addModifiers( [ "geo", "color" ] );
	return construct;
    }
} );

Canvas2D.LinePath.from = function( construct, sheet ) {
    var props = { name: construct.name };
    construct.modifiers.iterate(function(key, value) {
	value = ( value.value ? value.value.value : "" );

	if( key == "dx" || key == "dy" || key == "lineWidth" ) {
	    value = parseInt(value);
	} else if( value == "" ) {
	    value = key;
	    key = "color";
	}

	props[key] = value;
    } );

    return new Canvas2D.LinePath(props);
};

Canvas2D.LinePath.MANIFEST = {
    name       : "linepath",
    properties : [ "dx", "dy", "start", "moves", "color", "lineWidth", "lineStyle" ],
    libraries  : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.LinePath );
Canvas2D.Alias = Canvas2D.Shape.extend( {} );

Canvas2D.Alias.mapper = {
    sheet : function(shape) { 
	return function(construct, parent) { 
	    var alias = Canvas2D.Sheet.from(construct, parent);
	    //alias.getType = function() { return shape.name; }
	    return alias;
	}
    },

    connector : function(shape) {
	return function(construct, parent) { 
	    var modifier = new ADL.Modifier( "routing", 
		                             new ADL.String("vertical" ) );
	    construct.modifiers.set( modifier.key, modifier );
	    var alias = Canvas2D.Connector.from(construct, parent);
	    //alias.getType = function() { return shape.name; }
	    return alias;
	}
    },

    image : function(shape) {
	var modifiers = shape.modifiers;
	return function( construct, parent ) {
	    modifiers.iterate(function(key, value) {
		construct.modifiers.set(key, value); 
	    } );
	    var alias = Canvas2D.Image.from(construct, parent);
	    //alias.getType = function() { return shape.name; }
	    return alias;
	}
    }
}

Canvas2D.Alias.from = function( construct, parent ) {
    Canvas2D.registerShape( { 
	prototype : {},
	MANIFEST : { 
	    name      : construct.name, 
	    libraries : [ "Aliasses" ] 
	},
	from: Canvas2D.Alias.mapper[construct.supers[0]](construct, parent)
    } );
};
    
Canvas2D.Alias.MANIFEST = {
    name     : "alias",
    aliasses : [ "shape" ],
    libraries: [] // not included in the end-user library, because it's not 
                  // a visible shape
};

Canvas2D.registerShape( Canvas2D.Alias );
Canvas2D.CompositeShape = Canvas2D.Shape.extend( {
    hasChildren: function hasChildren() {
	return this.getChildren().length > 0;
    },

    hit: function(x,y) {
	return ( this.getWidth() >= x && this.getHeight() >= y );
    },

    hitArea: function(left, top, right, bottom) {
	return ! ( 0 > right
		   || this.getWidth() < left
		   || 0 > bottom
		   || this.getHeight() < top );
    },

    getWidth: function getWidth(withoutGrowth) {
	if( this.grows 
	    && this.getParent().composition.widthGrows() 
	    && !withoutGrowth ) {
	    return this.getParent().getWidth(withoutGrowth);
	}

	if( this.hasChildren() ) {
	    return max( this.composition.getWidth(), this.width );
	}

	return this.width;
    },

    getHeight: function getHeight(withoutGrowth) {
	if( this.grows 
	    && this.getParent().composition.heightGrows() 
	    && !withoutGrowth ) 
	{
	    return this.getParent().getHeight(withoutGrowth);
	}

	if( this.hasChildren() ) {
	    return max( this.composition.getHeight(), this.height );
	}

	return this.height;
    },
    
    getChildren: function getChildren() {
	if(!this.children) { this.children = []; }
	return this.children;
    },

    preprocess: function preprocess(props) {
	props.composition = props["composition"] || "vertical-stack";
	var args = [];
	if( props.composition.contains( ":" ) ) {
	    args = props.composition.split(":");
	    props.composition = args.shift();
	}
	props.composition = 
	    new Canvas2D.Compositors[props.composition](args, this);
	return props;
    },

    draw: function(sheet, left, top) {
	this.getChildren().iterate( function(child) {
	    var d = this.composition.getPosition(child, this.getChildren());
	    child.render(sheet, left + d.left, top + d.top );
	}.scope(this) );
    },

    prepare: function(sheet) {
	this._super();
	if( this.hasChildren() ) {
	    this.prepareChildren(sheet);
	    this.composition.prepare();
	}
    },

    prepareChildren: function prepareChildren(sheet) {
	this.getChildren().iterate( function(child) {
	    child.prepare(sheet);
	} );
    },

    add: function add(child) {
	child.topDown = true; // this forces text to draw from the top down
	this.getChildren().push(child);
	child.setParent(this);
    },

    asConstruct: function() {
	var construct = this._super();
	// TODO
	return construct;
    }
} );

Canvas2D.CompositeShape.from = function( construct, sheet ) {
    var props = { name: construct.name };
    construct.modifiers.iterate(function(key, value) {
	value = ( value.value ? value.value.value : "" );

	if( "" + value == "" ) {
	    value = key;
	    key = "composition";
	}

	props[key] = value;
    } );

    return new Canvas2D.CompositeShape(props);
};

Canvas2D.CompositeShape.MANIFEST = {
    name         : "compositeShape",
    aliasses     : [ "group" ],
    properties   : [ "width", "height", "grows", "composition", "padding" ]
};

Canvas2D.registerShape( Canvas2D.CompositeShape );
Canvas2D.Compositors = {
    "vertical-stack": Class.extend( {
	init: function init(args, shape) {
	    this.align = args.contains("left") ? "left" :
		args.contains("right") ? "right" : "center";
	    this.shape = shape;
	},

	prepare: function prepare() {
	    this.left = 0;
	    this.top = 0;
	},

	getPadding: function getPadding() {
	    return parseInt(this.shape.padding ? this.shape.padding : 0);
	},

	getPosition: function(child) {
	    var dleft = this.getPadding();
	    var width = this.shape.getWidth();
	    if( this.align == "center" ) {
		dleft = ( width - child.getWidth() ) / 2;
	    } else if( this.align == "right" ) {
		dleft = width -  child.getWidth() - this.getPadding();
	    }
	    var top = this.top;
	    this.top += child.getHeight(); // for next child
	    return { left: this.left + dleft, 
		     top: top + this.getPadding() };
	},

	getWidth: function getWidth() {
	    // max width of all children
	    var width = 0;
	    this.shape.getChildren().iterate( function(child) {
		width = max( child.getWidth(child.grows), width );
	    });
	    return width + this.getPadding() * 2;
	},

	getHeight: function getHeight() {
	    // sum of all children's height
	    var height = 0;
	    this.shape.getChildren().iterate( function(child) {
		height += child.getHeight(child.grows);
	    });
	    return height + this.getPadding() * 2;
	},

	heightGrows: function heightGrows() { return false; },
	widthGrows : function widthGrows()  { return true;  }
    }),

    "horizontal-stack": Class.extend( {
	init: function init(args, shape) {
	    this.align = args.contains("top") ? "top" :
		args.contains("bottom") ? "bottom" : "center";
	    this.shape = shape;
	},
	
	prepare: function prepare() {
	    this.left = 0;
	    this.top = 0;
	},

	getPosition: function(child) {
	    var dtop = 0;
	    var height = this.shape.getHeight();
	    if( this.align == "center" ) {
		dtop = ( height - child.getHeight() ) / 2;
	    } else if( this.align == "bottom" ) {
		dtop = height - child.getHeight();
	    }
	    var left = this.left;
	    this.left += child.getWidth(); // next child
	    return { left: left, top: this.top + dtop };
	},

	getWidth: function getWidth() {
	    // sum of all children's width
	    var width = 0;
	    this.shape.getChildren().iterate( function(child) {
		width += child.getWidth(child.grows);
	    });
	    return width;
	},

	getHeight: function getHeight() {
	    // max height of all children
	    var height = 0;
	    this.shape.getChildren().iterate( function(child) {
		height = max(child.getHeight(child.grows), height);
	    });
	    return height;
	},

	heightGrows: function heightGrows() { return true;  },
	widthGrows : function widthGrows()  { return false; }
    })
};
Canvas2D.Rectangle = Canvas2D.CompositeShape.extend( {
  draw: function draw(sheet, left, top) {
    sheet.useCrispLines = this.getUseCrispLines();
    sheet.lineWidth     = this.getLineWidth();
    sheet.strokeStyle   = this.getLineColor();
    sheet.fillStyle     = this.getFillColor();
    var width  = this.getWidth();
    var height = this.getHeight();

    if( this.getRoundCorners() ) {
      this._drawRoundCorners(sheet, left, top, width, height);
    } else {
      this._drawStraightCorners(sheet, left, top, width, height);
    }
    this._super(sheet, left, top);
  },
  
  _drawRoundCorners: function _drawRoundCorners( sheet, left, top,
                                                 width, height )
  {
    sheet.beginPath();
    sheet.moveTo(left+20,top);

    sheet.lineTo(left+width-20,top);
    sheet.arcTo(left+width+0.5,top+0.5, left+width+0.5, top+20, 20);

    sheet.lineTo(left+width,top+height-20);
    sheet.arcTo(left+width+0.5, top+height+0.5, left+width-20, top+height+0.5, 20);

    sheet.lineTo(left+20, top+height);
    sheet.arcTo(left+0.5,top+height+0.5,left+0.5,top+height-20+0.5,20);

    sheet.lineTo(left, top+20);
    sheet.arcTo( left+0.5, top+0.5, left+20.5, top+0.5, 20);

    sheet.closePath();

    sheet.fill();
    sheet.stroke();
  },

  _drawStraightCorners: function _drawStraightCorners( sheet, left, top, 
                                                       width, height ) 
  {
    sheet.fillRect( left, top, width, height );
    sheet.strokeRect( left, top, width, height );
  },

  getCenter: function() {
    return { left: this.getWidth()  / 2, top:  this.getHeight() / 2 };
  },

  getPort: function(side) {
    var modifiers = { nw:  { left: 0,    top: 0   },
                      nnw: { left: 0.25, top: 0   },
                      n  : { left: 0.5,  top: 0   }, 
                      nne: { left: 0.75, top: 0   },
                      ne : { left: 1,    top: 0   },
                      ene: { left: 1,    top: 0.25},
                      e  : { left: 1,    top: 0.5 },
                      ese: { left: 1,    top: 0.75},
                      se : { left: 1,    top: 1   },
                      sse: { left: 0.75, top: 1   },
                      s  : { left: 0.5,  top: 1   },
                      ssw: { left: 0.25, top: 1   },
                      sw:  { left: 0,    top: 1   },
                      wsw: { left: 0,    top: 0.75},
                      w  : { left: 0,    top: 0.5 },
                      wnw: { left: 0,    top: 0.25} };
    
    if (!modifiers[side]) {
	return { left: 0, top: 0 };
    }
    
    return { left: modifiers[side].left * this.getWidth(),
             top:  modifiers[side].top  * this.getHeight() };
  },

  getGeo: function() {
    return this.getWidth() && this.getHeight() ?
    this.getWidth() + "x" + this.getHeight() : null;
  },
  
  asConstruct: function() {
    var construct = this._super();
    construct.addModifiers( [ "geo", "lineColor", "roundCorners" ] );
    return construct;
  }
} );

Canvas2D.Rectangle.from = function( construct, sheet ) {
  var props = { name: construct.name };
  
  construct.modifiers.iterate(function(key, value) {
    value = ( value.value ? value.value.value : "" );

    if( key == "width" || key == "height" ) {
      value = parseInt(value);
    }

    if( key == "geo" ) {
      props["width"]   = parseInt(value.split("x")[0]);
      props["height"]  = parseInt(value.split("x")[1]);
    }

    if( "" + value == "" ) {
      if( key == "roundCorners" ) {
        value = true;
      } else {
        value = key;
        key = "lineColor";
      }
    }

    props[key] = value;
  } );

  return new Canvas2D.Rectangle(props);
};

Canvas2D.Rectangle.MANIFEST = {
  name         : "rectangle",
  aliasses     : [ "box" ],
  properties   : [ "lineWidth", "lineColor", "fillColor", "roundCorners" ],
  propertyPath : [ Canvas2D.CompositeShape ],
  libraries    : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Rectangle );
Canvas2D.Text = Canvas2D.Rectangle.extend( {
    prepare: function(sheet) {
	sheet.useCrispLines  = this.getUseCrispLines();
	sheet.strokeStyle    = this.getColor();
	sheet.fillStyle      = this.getColor();
	sheet.font           = this.getFont();
	sheet.textAlign      = this.getTextAlign();
	sheet.textDecoration = this.getTextDecoration();
	this.width  = sheet.measureText(this.getText());
	this.height = sheet.getFontSize();
    },

    draw: function(sheet, left, top) {
	if( this.getTopDown() ) { top += this.getHeight(); }
	sheet.fillText(this.getText(), left, top );
    },

    asConstruct: function() {
	var construct = this._super();
	construct.addModifiers( [ "color" ] );
	return construct;
    }
} );

Canvas2D.Text.from = function( construct, parent ) {
    var props = { name: construct.name, text: construct.value.value };
    construct.modifiers.iterate(function(key, value) {
	value = ( typeof value.value != "undefined" ? 
		      value.value.value : "" );
	props[key] = value;
    } );

    return new Canvas2D.Text(props);
};

Canvas2D.Text.MANIFEST = {
    name         : "text",
    properties   : [ "text", "color", "font", "textAlign","textDecoration" ],
    propertyPath : [ Canvas2D.Rectangle ],
    libraries    : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Text );
Canvas2D.Image = Canvas2D.Rectangle.extend( {
    getSource : function() { return this.src;   },
    getImage  : function() { return this.image; },

    postInitialize: function() {
	if( this.getSource() ) {
	    this.image = 
		Canvas2D.ImageManager.load( this.getSource(), 
					    this.updateSize.scope(this) );
	}
    },

    updateSize: function() {
	this.width  = this.image.width;
	this.height = this.image.height;
    },

    draw: function(sheet,left,top) {
	sheet.drawImage(this.getImage(), left, top);
    },

    asConstruct: function() {
	var construct = this._super();
	construct.addModifiers( [ "source" ] );
	return construct;
    }
} );

Canvas2D.Image.from = function(construct, canvas) {
    var props = { name: construct.name };
    construct.modifiers.iterate(function(key, value) {
	props[key] = value.value.value;
    } );
    
    return new Canvas2D.Image(props);
};

Canvas2D.Image.MANIFEST = {
    name         : "image",
    aliasses     : [ "pic", "picture" ],
    properties   : [ "src" ],
    propertyPath : [ Canvas2D.Rectangle ],
    libraries    : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Image );
Canvas2D.Arrow = Canvas2D.Rectangle.extend( {
    draw: function(sheet, left, top) {
	// rect
	sheet.useCrispLines = this.getUseCrispLines();
	sheet.lineWidth     = this.getLineWidth();
	sheet.strokeStyle   = this.getLineColor();
	sheet.fillStyle     = this.getFillColor();

	sheet.fillRect( left, 
		top, 
		this.getWidth() - this.getArrowHeadWidth(), 
		this.getHeight() );
	sheet.strokeRect( left, 
		top, 
		this.getWidth() - this.getArrowHeadWidth(), 
		this.getHeight() );

	// arrow head
	sheet.beginPath();

	sheet.moveTo(left + this.getWidth() - this.getArrowHeadWidth(), top);
	
	sheet.lineTo(left + this.getWidth() - this.getArrowHeadWidth(), 
		top + (this.getHeight() / 2) - (this.getArrowHeadHeight() / 2));
	sheet.lineTo(left + this.getWidth(), 
		top + (this.getHeight() / 2));
	sheet.lineTo(left + this.getWidth() - this.getArrowHeadWidth(), 
		top + (this.getHeight() / 2) + (this.getArrowHeadHeight() / 2));
	
	sheet.closePath();

	sheet.stroke();
	sheet.fill();
    },

    hit: function(x,y) {
	// FIXME
	return ( this.getWidth() >= x && this.getHeight() >= y ); 
    },

    hitArea: function(left, top, right, bottom) {
	// FIXME
	return ! ( 0 > right 
		   || this.getWidth() < left
		   || 0 > bottom
		   || this.getHeight() < top );
    },

    getCenter: function() {
	// FIXME
	return { left: this.getWidth()  / 2, top:  this.getHeight() / 2 };
    },

    getPort: function(side) {
	// FIXME
	switch(side) {
	case "n": case "north":  
	    return { top : 0,                left: this.getWidth() / 2 }; break;
	case "s": case "south":  
	    return { top : this.getHeight(), left: this.getWidth() / 2 }; break;
	case "e": case "east":
	    return { top : this.getHeight() / 2, left: this.getWidth() }; break;
	case "w": case "west":
	    return { top : this.getHeight() / 2, left: 0               }; break;
	}
    }
} );

Canvas2D.Arrow.from = function( construct, sheet ) {
    var props = { name: construct.name };
    construct.modifiers.iterate(function(key, value) {
	value = ( value.value ? value.value.value : "" );

	if( key == "width" || key == "height" ) {
	    value = parseInt(value);
	}

	if( key == "geo" ) {
	    props["width"]   = parseInt(value.split("x")[0]);
	    props["height"]  = parseInt(value.split("x")[1]);
	}

	if( "" + value == "" ) {
	    value = key;
	    key = "lineColor";
	}

	props[key] = value;
    } );

    return new Canvas2D.Arrow(props);
};

Canvas2D.Arrow.MANIFEST = {
    name         : "arrow",
    aliasses     : [ "pointer" ],
    properties   : [ "width", "height", "arrowHeadWidth", "arrowHeadHeight" ],
    propertyPath : [ Canvas2D.Rectangle ],
    libraries    : [ "Canvas2D" ]
};

Canvas2D.registerShape( Canvas2D.Arrow );
Canvas2D.Book.plugins.TabbedCanvas = Class.extend( {
  init: function(book) {
    this.book = book;
  },

  makeTab: function(name, height, content) {
    var tab = document.createElement("div");
    tab.className = "tabbertab";
    tab.style.height = ( 4 + parseInt(height) ) + "px";
    var head = document.createElement("h2");
    var txt = document.createTextNode(name);
    head.appendChild(txt);
    tab.appendChild(head);
    tab.appendChild(content);
    return tab;
  },

  getAboutTab: function() {
    var width  = this.book.canvas.canvas.width;
    var height = this.book.canvas.canvas.height;
    var about  = document.createElement("div");
    about.className = "Canvas2D-about";
    about.style.height = height + "px";
    about.style.width = (parseInt(width)-4)  + "px";

    var libraries = "";
    Canvas2D.extensions.iterate(function(library) {
      libraries += "\n<hr>\n";
      libraries += "<b>Library: " +
      library.name + " " + library.version + "</b> " + 
      "by " + library.author + "<br>" +
      library.info;
    });

    about.innerHTML = '<span class="Canvas2D-about-text">' +
    '<b>Canvas2D ' + Canvas2D.version  + 
    '</b><br>Copyright &copy 2009, ' +
    '<a href="http://christophe.vg" target="_blank">Christophe VG</a>'+ 
    ' & <a href="http://thesoftwarefactory.be" ' +
    'target="_blank">The Software Factory</a><br>' + 
    'Visit <a href="http://thesoftwarefactory.be/wiki/Canvas2D" ' +
    'target="_blank">http://thesoftwarefactory.be/wiki/Canvas2D</a> ' +
    'for more info. Licensed under the ' +
    '<a href="http://thesoftwarefactory.be/wiki/BSD_License" ' + 
    'target="_blank">BSD License</a>.' + libraries + '</span>';
    return this.makeTab("About", height, about );
  },

  getConsoleTab: function() {
    var width  = this.book.canvas.canvas.width;
    var height = this.book.canvas.canvas.height;
    this.book.console = document.createElement("textarea");
    this.book.console.className = "Canvas2D-console";
    this.book.console.style.height = height + "px";
    this.book.console.style.width  = ( parseInt(width) - 4 )  + "px";
    return this.makeTab("Console", height, this.book.console );
  },

  getSourceTab: function() {
    var width    = this.book.canvas.canvas.width;
    var height   = this.book.canvas.canvas.height;
    var oldValue = this.book.generated ? this.book.generated.value : "";
    this.book.generated = document.createElement("textarea");
    this.book.generated.value = oldValue;
    this.book.generated.className = "Canvas2D-source";
    this.book.generated.style.height = height + "px";
    this.book.generated.style.width  = ( parseInt(width) - 4 )  + "px";
    return this.makeTab("Source", height, this.book.generated );
  },

  applyTabber: function() {
    var source = this.book.canvas.canvas;

    this.tabber = document.createElement("div");
    this.tabber.className    = "tabber";
    this.tabber.style.width  = (parseInt(source.width)  + 17) + "px";
    this.tabber.style.height = (parseInt(source.height) + 37) + "px";
    source.parentNode.replaceChild(this.tabber, source);	

    var tab1 = document.createElement("div");
    tab1.className = "tabbertab";
    var h1 = document.createElement("h2");
    var t1 = document.createTextNode("Diagram");
    h1.appendChild(t1);
    tab1.appendChild(h1);
    tab1.appendChild(source);
    this.tabber.appendChild(tab1);
  },

  makeTabbed: function(tabs) {
    if( !this.tabber ) { this.applyTabber(); }
    if( typeof tabs.contains == "undefined" ) { return; }

    if( tabs.contains("console") ) { 
      this.tabber.appendChild(this.getConsoleTab());
    }
    if( tabs.contains("source") ) {
      this.tabber.appendChild(this.getSourceTab());
    }
    if( tabs.contains("about") ) { 
      this.tabber.appendChild(this.getAboutTab());
    }
    tabberAutomatic(); 
  }
} );

Canvas2D.Book.plugins.TabbedCanvas.exposes = [ "makeTabbed" ];
Canvas2D.Book.plugins.AutoLayout = Class.extend( {
    init: function(book) {
	this.book = book;
	this.active = false;
    },

    // this method is exposed and therefore called on a book
    autoLayout: function autoLayout(strategy) {
	this.strategy = strategy;
	this.strategy.start();
	this.active = true;
	this.book.rePublish();
    },

    beforeRender: function beforeRender(book) {
	if( !this.active ) { return; }

	var shapes = [];
	var shapeMap = $H();
	var c = 0;
	book.getCurrentSheet().positions.iterate( function( pos ) {
	    if( !(pos.shape instanceof Canvas2D.Connector) ) {
		shapes.push( { position: pos,
			       x: pos.left + pos.shape.getWidth()/2, 
			       y: pos.top + pos.shape.getHeight()/2, 
			       s: pos.shape.getWidth() > pos.shape.getHeight() ?
			       pos.shape.getWidth() : pos.shape.getHeight(),
			       f1: 0, f2: 0, 
			       c:[] } );
		shapeMap.set(pos.shape.getName(), parseInt(c++));
	    }
	} );

	// collect connectors
	book.getCurrentSheet().positions.iterate( function( pos ) {
	    if( pos.shape instanceof Canvas2D.Connector ) {
		var from = 
		    shapeMap.get(pos.shape.getFrom(book.getCurrentSheet()).getName());
		var to   = 
		    shapeMap.get(pos.shape.getTo(book.getCurrentSheet()).getName());
		shapes[from].c.push(to);
		shapes[to].c.push(from);
	    }
	} );

	
	// apply layout strategy
	shapes = this.strategy.layout(shapes);

	if( shapes ) {
	    shapes.iterate( function( shape ) {
		shape.position.left = 
		    shape.x - shape.position.shape.getWidth() / 2;
		shape.position.top  = 
		    shape.y - shape.position.shape.getHeight() / 2;
	    } );
	} else {
	    this.active = false;
	}
    },

    afterPublish: function afterPublish(book) {
	if( this.active ) { book.rePublish(); }
    }
} );
    
Canvas2D.Book.plugins.AutoLayout.exposes = [ "autoLayout" ];
    
var ForceLayoutStrategy = Class.extend( {
    init: function initialize(config) {
	this.max_repulsive_force_distance = 
	    config["max_repulsive_force_distance"] || 50;
	this.k = config["k"] || 20;
	this.c = config["c"] || 0.05;
	this.max_movement = config["max_movement"] || 10;
	this.max_iterations = config["max_iterations"] || 1000;
	this.render = config["render"] || function() {};
	this.canContinue = config["canContinue"] || 
	    function() { return false; };
    },
    
    getIterations: function getIterations() {
	return this.iteration;
    },
    
    start: function start() {
	this.iteration = 0;
    },
    
    layout: function layout(elements) {
	this.elements = elements;
	if( this.canContinue() ) {
	    if( this.iteration <= this.max_iterations ) { 
		this._layout();
		return this.elements;
	    }
	}
	return null;
    },
    
    _layout: function layout() {
	this.iteration++;
	if( this.canContinue() ) {
	    if( this.iteration <= this.max_iterations ) { 
		this._layout_iteration();
	    } else {
		console.log( "max iterations " + 
			     "(" + this.max_iterations + ") reached.");
	    }
	}
    },
    
    _layout_iteration: function _layout_iteration() {
	// reset forces
	for(var s=0; s<this.elements.length; s++) {
	    this.elements[s].f1 = 0;
	    this.elements[s].f2 = 0;
	}
	// repulse everybody (except self)
	for(var s=0; s<this.elements.length; s++) {
	    for(var o=0; o<this.elements.length; o++) {
		if( s !== o ) {
		    this._layout_repulsive(s, o);
		}
	    }
	}
	// attract if connected or self
	for(var s=0; s<this.elements.length; s++) {
	    for(var o=0; o<this.elements.length; o++) {
		if( s !== o && this.elements[o].c.indexOf(s) > -1 ) {
		    this._layout_attractive(s, o);
		}
	    }
	}
	
	// apply forces
	for(var s=0; s<this.elements.length; s++) {
	    var dx = this.c * this.elements[s].f1;
	    var dy = this.c * this.elements[s].f2;
	    var max = this.max_movement;
	    if( dx > max )      { dx = max; }
	    if( dx < max * -1 ) { dx = max * -1; }
	    if( dy > max )      { dy = max; }
	    if( dy < max * -1 ) { dy = max * -1; }
	    this.elements[s].x += dx;
	    this.elements[s].y += dy;
	}
    },
    
    _layout_repulsive: function _layout_repulsive(s, o) {
	var dx = this.elements[o].x - this.elements[s].x;
	var dy = this.elements[o].y - this.elements[s].y;
	
	var d2 = dx * dx + dy * dy;
	if( d2 < 0.01 ) {
	    dx = Math.random() + 0.1;
	    dy = Math.random() + 0.1;
	    d2 = dx * dx + dy * dy;
	}
	var d = Math.sqrt(d2);
	if( d < this.max_repulsive_force_distance) {
	    var repulsive_force = this.k * this.k / d;
	    
	    this.elements[o].f1 += repulsive_force * dx / d;
	    this.elements[o].f2 += repulsive_force * dy / d;
	    
	    this.elements[s].f1 -= repulsive_force * dx / d;
	    this.elements[s].f2 -= repulsive_force * dy / d;
	}
    },
    
    _layout_attractive: function _layout_attractive(s, o) {
	var dx = this.elements[o].x - this.elements[s].x;
	var dy = this.elements[o].y - this.elements[s].y;
	
	var d2 = dx * dx + dy * dy;
	if( d2 < 0.01 ) {
	    dx = Math.random() + 0.1;
	    dy = Math.random() + 0.1;
	    d2 = dx * dx + dy * dy;
	}
	var d = Math.sqrt(d2);
	if( d > this.max_repulsive_force_distance) {
	    d = this.max_repulsive_force_distance;
	    d2 = d * d;
	}
	var attractive_force = ( d2 - this.k * this.k ) / this.k;
	var weight = this.elements[s].s;
	if( weight < 1 ) { weight = 1; }
	attractive_force *= Math.log(weight) * 0.5 + 1;
	
	this.elements[o].f1 -= attractive_force * dx / d;
	this.elements[o].f2 -= attractive_force * dy / d;
	
	this.elements[s].f1 += attractive_force * dx / d;
	this.elements[s].f2 += attractive_force * dy / d;
    }
});
Canvas2D.Book.plugins.Watermark = Class.extend( {
    afterPublish: function afterPublish(book) {
      book.canvas.save();
      book.canvas.fillStyle = "rgba(125,125,125,1)";
      book.canvas.textDecoration = "none";
      book.canvas.rotate(Math.PI/2);
      var extensions = "";
      book.extensions.iterate(function(key, value) { 
        extensions += " + " + key; 
      });
      book.canvas.font = "6pt Sans-Serif";
      book.canvas.textAlign = "left";
      book.canvas.useCrispLines = false;
      book.canvas.lineStyle = "solid";
      book.canvas.fillText( "Canvas2D" + extensions + " / Christophe VG",
      3, (book.canvas.canvas.width * -1) + 7 +
      ( ProtoJS.Browser.IE ? 4 : 0 ) ); // if styleborder
      book.canvas.restore();
    }
} );
Canvas2D.KickStart = {};

Canvas2D.KickStart.Starter = Class.extend( {
    init: function() {
	this.manager = new Canvas2D.Manager();
    },
    
    getTag: function() {
	return "Canvas2D";
    },

    makeInstance: function( name ) {
	return this.manager.setupBook(name);
    },   

    start: function() {
	var htmlCanvases = document.getElementsByTagName( "canvas" );
	for(var c=0; c<htmlCanvases.length; c++ ) {
	    var htmlCanvas = htmlCanvases[c];
	    var classes = htmlCanvas.className;
	    if( classes.contains(this.getTag()) ) {
		var name = htmlCanvas.id;
		var book = this.makeInstance(htmlCanvas);
		if( classes.contains("Tabbed") ) {
		    var tabs = [];
		    if(classes.contains("withSource" )){ tabs.push("source" ); }
		    if(classes.contains("withConsole")){ tabs.push("console"); }
		    if(classes.contains("withAbout"  )){ tabs.push("about"  ); }
		    book.makeTabbed(tabs); 
		}
		var sourceElement = document.getElementById(name+"Source")
		if( sourceElement ) {
		    var source;
		    try {
			// some HTML element, PRE, DIV, ...
			source = sourceElement.firstChild.nodeValue;
		    } catch(err) {
			// TEXTAREA
			source = sourceElement.value;
		    }
		    book.load(source);
		}
	    }
	}
	this.fireEvent( "ready" );
	this.manager.startAll();
    }
} );


// add-in some common functionality
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling,
	     Canvas2D.KickStart.Starter.prototype );

Canvas2D.KickStarter = new Canvas2D.KickStart.Starter();
ProtoJS.Event.observe( window, 'load', 
		       function() { Canvas2D.KickStarter.start(); } );

Canvas2D.KickStarter.on( "ready",
			  function() { Canvas2D.fireEvent( "ready" );} );
Canvas2D.Defaults = {};

Canvas2D.Defaults.Canvas = {
    lineWidth      : 1,   
    useCrispLines  : true,
    lineStyle      : "solid",
    strokeStyle    : "black", 
    fillStyle      : "black", 
    font           : "10pt Sans-Serif", 
    textAlign      : "left", 
    textBaseline   : "alphabetic",
    textDecoration : "none"    
};

Canvas2D.Sheet.Defaults = { 
    lineWidth      : 1,   
    lineStyle      : "solid",
    strokeStyle    : "black", 
    fillStyle      : "black", 
    font           : "10pt Sans-Serif", 
    textAlign      : "left", 
    textBaseline   : "alphabetic",
    textDecoration : "none",
    shadowColor    : "rgba(0,0,0,0.0)"
};

// Shapes start here ...

Canvas2D.Shape.Defaults = {
    useCrispLines      : true,
    label              : "",
    labelFont          : "7pt Sans-Serif",
    labelAlign         : "center",
    labelPos           : "center",
    labelColor         : "black",
    labelUseCrispLines : false
};

Canvas2D.Rectangle.Defaults = {
    useCrispLines  : true,
    lineWidth      : 1,
    lineColor      : "rgba(0,0,0,100)",     // solid black
    fillColor      : "rgba(255,255,255,0)", // empty white ;-)
    labelPos       : "center",
    labelColor     : "black",
    width          : 50,
    height         : 50
};

Canvas2D.Connector.Defaults = {
    useCrispLines  : true,
    lineWidth      : 1, 
    lineColor      : "black", 
    lineStyle      : "solid",
    begin          : null, 
    end            : null,
    minTreeDist    : 30,
    minCornerDist  : 15
};
    
Canvas2D.Text.Defaults = {
    useCrispLines  : false,
    color          : "black",
    font           : "10pt Sans-Serif", 
    textAlign      : "left", 
    textDecoration : "none"
};

Canvas2D.Line.Defaults = {
    lineWidth      : 1,
    lineStyle      : "solid",
    labelPos       : "center",
    labelColor     : "black",
    color          : "black",
    dx             : 50,
    dy             : 50
};

Canvas2D.LinePath.Defaults = {
    lineWidth      : 1,
    lineStyle      : "solid",
    labelPos       : "center",
    labelColor     : "black",
    color          : "black"
};

Canvas2D.Image.Defaults = {

};

Canvas2D.Arrow.Defaults = {

};

Canvas2D.CompositeShape.Defaults = {

};


Canvas2D.version = "0.3-51";

