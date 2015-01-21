var UMLCANVAS_VERSION = "0.4-15";

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
    
if( ! iRequire( Canvas2D, "0.2-5" ) ) {
    alert( "UmlCanvas requires at least Canvas2D version 0.2-5. " +
	   "Current Canvas2D is " + Canvas2D.version );
}
var UmlCanvasBase = Class.extend( {
  init : function init() {
    this.plugins = {};
  },

  getModel : function getModel(name) {
    return UmlCanvas.KickStarter.manager.getModel(name);
  }
} );

// mix-in event handling
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, UmlCanvasBase );

var UmlCanvas = new UmlCanvasBase();
UmlCanvas.version = UMLCANVAS_VERSION;

UmlCanvas.activate = function activate(canvasId) {
  var canvas = document.getElementById(canvasId);
  if(canvas) {
    var manager = new UmlCanvas.Manager();
    var model   = manager.setupModel(canvasId);
    var diagram = model.addDiagram();
    manager.startAll();
    return diagram;
  }
  throw( canvasId + " does not reference a known id on the document." );
};

// mix-in event handling to UmlCanvas
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, UmlCanvas );

// register this extension with Canvas2D
Canvas2D.extensions.push(
  { name: "UmlCanvas",
  version: UMLCANVAS_VERSION,
  author: "<a href=\"http://christophe.vg\">Christophe VG</a>",
  info: "Visit <a href=\"http://thesoftwarefactory.be/wiki/UmlCanvas\">" +
        "http://thesoftwarefactory.be/wiki/UmlCanvas</a> for more info." }
);
UmlCanvas.Common = {
  extractVisibility: function(construct) {
    // default modifier "visibility"
    var visibility = construct.modifiers.get("visibility" );
    if( visibility && visibility.value ) { return visibility.value.value; }
    
    // detect short hand versions
    if( construct.modifiers.get( "public"    ) ) { return "public";    }
    if( construct.modifiers.get( "private"   ) ) { return "private";   }
    if( construct.modifiers.get( "protected" ) ) { return "protected"; }
    if( construct.modifiers.get( "package"   ) ) { return "package";   }

    return null;
  },

  extractStatic: function(construct) {
    return construct.modifiers.get( "static" );
  },

  extractAbstract: function(construct) {
    var abstr = construct.modifiers.get("abstract");
    if( abstr && abstr.value ) {
      return abstr.value.value;
    } else if( abstr ) {
      return true;
    }
    return false;
  },

  determineVisibility: function(visibility) {
    switch(visibility) {
      case "__HIDE__" : return "";
      case "protected": return "#";
      case "private"  : return "-";
      case "package"  : return "~";
    }
    return "+";
  }
}
// UmlCanvas implements the Canvas2D.Book concept as a Model
UmlCanvas.Manager = Canvas2D.Manager.extend( {
  setupModel : function setupModel(modelId) {
    return this.addBook(new UmlCanvas.Model(modelId));
  },

  getModel : function getModel(id) {
    return this.getBook( id || "" );
  }
} );
// a book is called a Model, which contains diagrams in stead of sheets
// TODO plugins should be merges with Canvas2D plugins on Book
UmlCanvas.Model = Canvas2D.Book.extend( {
  init: function(UmlCanvasId) {
    this._super(UmlCanvasId);
    this.uc_plugins = {};
  },

  // TODO: move to Canvas2D::Book
  getName: function getName() {
    return this.name;
  },
  
  addPlugin: function addPlugin(plugin) {
    this.uc_plugins[plugin.getName()] = plugin;
  },

  getPlugin: function getPlugin(name) {
    return this.uc_plugins[name];
  },
  
  activatePlugins: function activatePlugins() {
    $H(this.uc_plugins).iterate( function(name, plugin) {
      plugin.activate();
    }.scope(this) );
  },
  
  addDiagram: function(diagram) {
    unless( diagram instanceof UmlCanvas.Diagram, function() {
      diagram = new UmlCanvas.Diagram();
    } );
    return this.addSheet(diagram);
  },

  // TODO: move these to Canvas2D::Book
  getWidth: function getWidth() {
    return parseInt(this.canvas.canvas.width);
  },

  getHeight: function getHeight() {
    return parseInt(this.canvas.canvas.height);
  },

  getLeft: function getLeft() {
    return this.canvas.getLeft();
  },

  getTop: function getTop() {
    return this.canvas.getTop();
  },

  setSize: function setSize(width, height) {
    this.canvas.canvas.width  = width;
    this.canvas.canvas.height = height;
    this.rePublish();
  }
} );
UmlCanvas.Diagram = Canvas2D.Sheet.extend( {
    init: function(props) {
	this._super(props);
	this.on( "shapeSelected", this.handleElementSelected.scope(this) );
	this.on( "shapeChanged",  this.handleElementChanged.scope(this) );
    },

    handleElementSelected: function(element) {
	if( element instanceof UmlCanvas.Interface ) {
	    this.canvas.fireEvent( "interfaceSelected", element.props );
	} else if( element instanceof UmlCanvas.Class ) {
	    this.canvas.fireEvent( "classSelected", element.props );
	}
    },

    handleElementChanged: function(element) {
	if( element instanceof UmlCanvas.Interface ) {
	    this.canvas.fireEvent( "interfaceChanged", element.props );
	} else if( element instanceof UmlCanvas.Class ) {
	    this.canvas.fireEvent( "classChanged", element.props );
	}
    },
    
    addClass: function(clazz) {
	return this.add(clazz);
    },

    getDiagramClass: function(name) {
	return this.shapesMap[name.replace(/<.*$/,'')];
    },

    addRelation: function(relation) {
	return this.add(relation);
    },

    toADL: function() {
	var s = "";
	s += "Diagram "  + this.name;
	s += " +" + this.style + " {\n";
	this.positions.iterate(function(shape) {
	    var t = shape.toADL("  ");
	    if( t ) { s += t + "\n"; }
	} );
	s += "}";
	return s;
    },

    asConstruct: function() {
	var construct = this._super();

	this.shapes.iterate(function(shape) { 
	    construct.push(shape.asConstruct());
	} );

	return construct;
    }
} );

UmlCanvas.Diagram.from = function(construct, model) {
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

    var diagram = new UmlCanvas.Diagram({ book: model, name: construct.name, style: style });
    model.addDiagram(diagram);
    return diagram;
};

UmlCanvas.Diagram.MANIFEST = {
    name         : "diagram",
    propertyPath : [ Canvas2D.Sheet ],
    libraries    : [ "UmlCanvas", "Diagram" ]
}

Canvas2D.registerShape(UmlCanvas.Diagram);
UmlCanvas.Class = Canvas2D.Rectangle.extend( {
    addSuper: function(zuper) {
	if( ! this.supers ) { this.supers = [] }
	this.supers.push(zuper);
    },

    postInitialize: function(props) {
	this.attributes  = new Array();
	this.operations  = new Array();
	this.markUnprepared();
	// keep short-hand local reference
	this.config = UmlCanvas.Class.Defaults;
    },

    prepare: function(sheet) {
	if( this.prepared ) { return; }

	// className and stereotype
	var strings = [ this.getName(), "<<" + this.getStereotype() + ">>" ];
	// attributes
	this.attributes.iterate(function(attribute) {
	    strings.push(attribute.toString());
	});
	// operations
	this.operations.iterate(function(operation) {
	    strings.push(operation.toString());
	});

	var maxWidth = 0;
	sheet.font = this.getFont();
	strings.iterate(function(string) {
	    var width = sheet.measureText(string);
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}.scope(this) );

	// calculate width ...
	this.width = ( 2 * this.config.padding ) + maxWidth;
	this.width = this.width < this.getMinimumWidth() 
	    ? this.getMinimumWidth() : this.width;

	var lineSize = parseInt(this.getFont()) + this.config.lineSpacing;
	var attributesHeight = this.attributes.length > 0 ?
	    ( this.attributes.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	var operationsHeight = this.operations.length > 0 ?
	    ( this.operations.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	// ... and height
	this.height = attributesHeight + operationsHeight
	    + 2 * lineSize
	    + ( 2 * this.config.padding );
	
	this.prepared = true;
    },

    markUnprepared: function() {
	this.prepared = false;	
	this.fireEvent("changed");
    },

    add: function add(child) {}, // FIXME: short-circuit CompositeShape


    addAttribute: function(attribute) {
	// allowing shorthand hash notation, objectifying on the fly
	if( !(attribute instanceof UmlCanvas.Attribute) ) {
	    attribute = new UmlCanvas.Attribute( attribute );
	}
	this.attributes.push( attribute );
	this.markUnprepared();
	return attribute;
    },

    addOperation: function(operation) {
	// allowing shorthand hash notation, objectifying on the fly
	if( !(operation instanceof UmlCanvas.Operation) ) {
	    operation = new UmlCanvas.Operation( operation );
	}
	this.operations.push(operation);
	this.markUnprepared();
	return operation;
    },

    draw: function(sheet, left, top) {
	this.prepare(sheet);
	sheet.useCrispLines = this.config.useCrispLines;
	sheet.fillStyle     = this.config.backgroundColor;
	sheet.strokeStyle   = this.config.lineColor;
	sheet.lineWidth     = this.config.lineWidth;

	var lineSize = parseInt(this.getFont()) + this.config.lineSpacing

	// className compartment
	var classCompHeight = ( this.config.padding
	                        + lineSize * 2
				+ this.config.compartmentSpacing );
	sheet.fillStrokeRect( left, top, this.getWidth(), classCompHeight );
	
	// attribute compartment
	var attrCompHeight = 0;
	if( this.attributes.length > 0 ) {
	    attrCompHeight =  ( this.config.compartmentSpacing
				+ ( lineSize * this.attributes.length )
				+ this.config.compartmentSpacing );
	    sheet.fillStrokeRect( left, top + classCompHeight, 
				  this.getWidth(), attrCompHeight );
	}

	// operation compartment
	var methCompHeight = 0;
	if( this.operations.length > 0 ) {
	    methCompHeight = ( this.config.compartmentSpacing
			       + ( lineSize * this.operations.length ) 
			       + this.config.padding );
	    sheet.fillStrokeRect( left, top + classCompHeight + attrCompHeight, 
				  this.getWidth(), methCompHeight );
	}
	// TEXT
	sheet.useCrispLines  = this.getUseCrispLines();
	sheet.fillStyle      = this.getFontColor();

	// stereotype
	sheet.font = this.getFontForClassName();

	sheet.textAlign = "center";

	if( this.getStereotype() ) {
	    sheet.fillText( "<<" + this.getStereotype() + ">>",
			    left + ( this.getWidth()/2),
			    top  + ( this.config.padding + 
				     parseInt(this.getFont()) ));
	}
	// className
	sheet.fillText( this.getName(),
			left + ( this.getWidth()/2 ), 
			top  + ( this.config.padding + 
				 parseInt(this.getFont())
				 + ( this.getStereotype() ? lineSize : 0 ) ) );
	
	// attributes
	sheet.textAlign = "left";
	sheet.font = this.getFont();
	for( var i=0; i<this.attributes.length; i++ ) {
	    sheet.strokeStyle    = this.getFontColor();
	    sheet.textDecoration = this.attributes[i].isStatic() ?
		this.config.decorationStatic : this.config.decoration;
	    sheet.fillText( this.attributes[i].toString(),
			    left + this.config.padding,
			    top + classCompHeight + ( lineSize * (i+1) ) );
	}

	// operations
	for( var i=0; i<this.operations.length; i++ ) {
	    sheet.font = this.getFontForOperationName( this.operations[i] );
	    sheet.strokeStyle    = this.getFontColor();
	    sheet.textDecoration = this.operations[i].isStatic() ?
		this.config.decorationStatic : this.config.decoration;
	    sheet.fillText( this.operations[i].toString(),
			   left + this.config.padding,
			   top + classCompHeight 
			   + attrCompHeight + (lineSize*(i+1)) );
	}
    },
    
    getFontForClassName : function() {
        return this.getIsAbstract() 
            ? this.config.fontAbstract
            : this.getFont();
    },
    
    getFontForOperationName : function(operation) {
        return operation.isAbstract() 
            ? this.config.fontAbstract
            : this.getFont();
    },

    asConstruct: function asConstruct () {
	var construct = this._super();
	delete construct.modifiers.geo;
	delete construct.modifiers[this.getFontColor()];

	if( this.getMinimumWidth() ) {
	    construct.modifiers['minimumSize'] = this.getMinimumWidth();
	}
	if( this.getSupers() ) {
	    var supers = [];
	    this.getSupers().iterate(function(zuper) {
		supers.push(zuper.getName());
	    });
	    construct.supers = supers;
	}
	if( this.getStereotype() ) {
	    construct.modifiers.stereotype = '"' + this.getStereotype() + '"';
	}
	if( this.getIsAbstract() ) {
	    construct.modifiers['abstract'] = null;
	}
	this.attributes.iterate(function(attribute) {
	    construct.children.push(attribute.asConstruct());
	});
	this.operations.iterate(function(operation) {
	    construct.children.push(operation.asConstruct());
	});
	
	return construct;
    }
} );
    
UmlCanvas.Class.from = function( construct, diagram ) {
  var props = {};

  // NAME
  props.name = construct.name;

  // MINIMUM WIDTH
  var minimumWidth = construct.modifiers.get( "minimumWidth" );
  if( minimumWidth ) {
    props.minimumWidth = parseInt(minimumWidth.value.value);
  }

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }

  props['isAbstract'] = UmlCanvas.Common.extractAbstract(construct);

  var elem = new UmlCanvas.Class( props );

  var errors = [];
  var warnings = [];

  // SUPERCLASS
  if( construct.supers && construct.supers.length > 0 ) {
    construct.supers.iterate(function(superConstruct) {
      var zuper = diagram.getDiagramClass(superConstruct.constructName);
      if( zuper ) {
        elem.addSuper(zuper);
        var relation;
        if( zuper instanceof UmlCanvas.Interface ) {
          relation = new UmlCanvas.Realization( {from: zuper, to: elem} );
        } else {
          relation = new UmlCanvas.Inheritance( {from: zuper, to: elem} );
        }
        diagram.addRelation(relation);
      } else {
        warnings.push( "unknown superclass: " + superConstruct.constructName +
          ", referenced by " + construct.name );
      }
    });
  }

  if( errors.length > 0 ) {
    return { errors: errors, warnings: warnings };
  } else {
    elem.warnings = warnings.length > 0 ? warnings : null;
    return elem;
  }
};

UmlCanvas.Class.MANIFEST = {
  name         : "class",
  properties   : [ "stereotype", "isAbstract", "supers",
  "font", "fontColor", "minimumWidth" ],
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Class);
UmlCanvas.Attribute = Class.extend( {
  init: function( attribute ) {
    this.visibility = attribute.visibility;
    this.ztatic     = attribute.isStatic;
    this.name       = attribute.name;
    this.type       = attribute.type;
    this.stereotype = attribute.stereotype;
    this.derived    = attribute.derived;
  },

  setParent: function setParent() {},

  getName:       function() { return this.name;       },
  getType:       function() { return this.type;       },
  getVisibility: function() { return this.visibility; },
  getStereotype: function() { return this.stereotype; },
  isStatic:      function() { return this.ztatic;     },
  isDerived:     function() { return this.derived;    },

  toString: function() {
    return ( this.getStereotype() ? "<<" + this.getStereotype() + ">> " : "" ) 
      + UmlCanvas.Common.determineVisibility(this.visibility)
      + ( this.isDerived() ? "/" : "" ) + this.name 
      + (this.type ? " : " + this.type.toString() : "");
  },

  asConstruct: function() {
    var modifiers = {};
    if( this.getVisibility() ) {
      modifiers[this.getVisibility()] = null;
    };

    if( this.isStatic() ) { modifiers["static"] = null; }

    if( this.getStereotype() ) {
      modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }

    if( this.isDerived() ) {
      modifiers["derived"] = null; // shorthand prefered
    }

    return {
      type        : "Attribute",
      name        : this.getName(),
      supers      : this.getType() ? [ this.getType() ] : [],
      modifiers   : modifiers,
      children    : []
    };
  }
} );

UmlCanvas.Attribute.from = function(construct, clazz) {
  var props =  { 
    name: construct.name, 
    type: construct.supers[0] ? construct.supers[0].toString() : null 
  };

  var visibility = UmlCanvas.Common.extractVisibility(construct);
  if( visibility ) {
    props['visibility'] = visibility;
  }

  props['isStatic'] = UmlCanvas.Common.extractStatic(construct);

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }
  
  // DERIVED
  var derived = construct.modifiers.get("derived");
  if( derived && derived.value ) {
    props.derived = derived.value.value;
  } else if( derived ) {
    props.derived = true;
  }

  return clazz.addAttribute(props);
};

UmlCanvas.Attribute.MANIFEST = {
  name: "attribute",
  aliasses: [ "property", "literal" ]
}

Canvas2D.registerShape(UmlCanvas.Attribute);
UmlCanvas.Operation = Class.extend( {
  init: function( operation ) {
    this.visibility = operation.visibility;
    this.ztatic     = operation.isStatic;
    this.name       = operation.name;
    this.returnType = operation.returnType;
    this.stereotype = operation.stereotype;
    this.parameters = [];
    if( operation.arguments ) {
      for(var p=0; p<operation.arguments.length; p++ ) {
        this.addParameter(operation.arguments[p]);
      }
    }
    this.abztract   = operation.isAbstract;
  },

  setParent: function setParent() {},

  getName:       function() { return this.name;       },
  getReturnType: function() { return this.returnType; },
  getVisibility: function() { return this.visibility; },
  isStatic:      function() { return this.ztatic;     },
  isAbstract:    function() { return this.abztract;   },
  getStereotype: function() { return this.stereotype; },

  addParameter: function(parameter) {
    this.parameters.push( new UmlCanvas.Parameter(parameter) );
  },

  toString: function() {
    var params = [];
    this.parameters.iterate(function(param) {
      if( param.type ) {
        params.push( param.type.toString() );
      }
    });
    return ( this.getStereotype() ? "<<" + this.getStereotype() + ">> " : "" ) 
      + UmlCanvas.Common.determineVisibility(this.visibility)
      + this.name + "(" + params.join( ", " ) + ")"
      + (this.returnType ? " : " + this.returnType.toString() : "");
  },

  asConstruct: function() {
    var parameters = [];
    this.parameters.iterate(function(parameter) {
      parameters.push(parameter.asConstruct());
    });
    var modifiers = {};
    if( this.getVisibility() ) {
      modifiers[this.getVisibility()] = null;
    };
    if( this.isAbstract() ) {
      modifiers['abstract'] = null;
    }
    if( this.isStatic() ) { modifiers["static"] = null; }

    if( this.getStereotype() ) {
      modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }    
    
    return {
      type        : "Operation",
      name        : this.getName(),
      supers      : this.getReturnType() ? [ this.getReturnType() ] : [],
      modifiers   : modifiers,
      children    : parameters
    };
  }
} );

UmlCanvas.Operation.from = function(construct, clazz) {
  var props =  { name: construct.name }; 
  if( construct.supers[0] ) {
    props.returnType = construct.supers[0].toString();
  }
  var visibility = UmlCanvas.Common.extractVisibility(construct);
  if( visibility ) {
    props['visibility'] = visibility;
  }
  props['isStatic'] = UmlCanvas.Common.extractStatic(construct);
  props['isAbstract'] = UmlCanvas.Common.extractAbstract(construct);

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }

  return clazz.addOperation( props );
};

UmlCanvas.Operation.MANIFEST = {
  name     : "operation",
  aliasses : [ "method" ]
}

Canvas2D.registerShape(UmlCanvas.Operation);
UmlCanvas.Parameter = Class.extend( {
    name: null,
    type: null,

    init: function( props ) {
	this.name = props.name;
	this.type = props.type;
    },

    setparent: function setParent() {},

    getName: function() { return this.name; },
    getType: function() { return this.type; },

    toString: function() {
	return this.name + " : " + this.type;
    },

    asConstruct: function() {
	return {
		 type        : "Argument",
		 name        : this.getName(),
		 supers      : this.getType() ? [ this.getType() ] : [],
		 modifiers   : {},
		 children    : []
	       };
    }
} );

UmlCanvas.Parameter.from = function(construct, operation) {
    return operation.addParameter( 
	new UmlCanvas.Parameter( { name: construct.name, 
				   type: construct.supers[0] || null } ) );
};

UmlCanvas.Parameter.MANIFEST = {
    name : "parameter",
    aliasses : [ "argument" ]
}

Canvas2D.registerShape(UmlCanvas.Parameter);
UmlCanvas.ConnectorHeads = {
    Triangle : {n:{lines:[[ -5, -10],[ +5,-10],[  0,  0]],end:[ 0,-10]},
		e:{lines:[[+10,  +5],[+10, -5],[  0,  0]],end:[10,  0]},
		s:{lines:[[ +5, +10],[ -5,+10],[  0,  0]],end:[ 0, 10]},
		w:{lines:[[-10,  -5],[-10, +5],[  0,  0]],end:[-10, 0]}},
    Arrow    : {n:{lines:[[ -5, -10],[  0,  0],[ +5,-10]],end:[0, 0]},
		e:{lines:[[+10,  +5],[  0,  0],[+10, -5]],end:[0, 0]},
		s:{lines:[[ +5, +10],[  0,  0],[ -5,+10]],end:[0, 0]},
		w:{lines:[[-10,  -5],[  0,  0],[-10, +5]],end:[0, 0]}},
    Diamond  : {n:{lines:[[ -5,  -5],[  0,-10],[ +5, -5],[0, 0]],end:[ 0,-10]},
		e:{lines:[[ +5,  +5],[+10,  0],[ +5, -5],[0, 0]],end:[10,  0]},
		s:{lines:[[ +5,  +5],[  0,+10],[ -5, +5],[0, 0]],end:[ 0, 10]},
		w:{lines:[[ -5,  -5],[-10,  0],[ -5, +5],[0, 0]],end:[-10, 0]}},
    FullDiamond:{n:{lines:[[-5,-5],[0,-10],[+5,-5],[0, 0],"fill"],end:[ 0,-10]},
		 e:{lines:[[+5,+5],[+10,0],[+5,-5],[0, 0],"fill"],end:[10,  0]},
		 s:{lines:[[+5,+5],[0,+10],[-5,+5],[0, 0],"fill"],end:[ 0, 10]},
		 w:{lines:[[-5,-5],[-10,0],[-5,+5],[0, 0],"fill"],end:[-10, 0]}}
};
UmlCanvas.Association = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props = this._super(props);

    this.srcName = props.sname;
    this.dstName = props.dname;

    if( props.kind && props.kind == "aggregation" ) {
      props.begin = UmlCanvas.ConnectorHeads.Diamond;	    
    } else if( props.kind && props.kind == "composition" ) {
      props.begin = UmlCanvas.ConnectorHeads.FullDiamond;	    
    } else if( props.navigability && ( props.navigability == "bi" || 
                                       props.navigability == "source" ) )
    {
      props.begin = UmlCanvas.ConnectorHeads.Arrow;
    }

    if( props.navigability && ( props.navigability == "bi" || 
                                props.navigability == "destination" ) )
    {
      props.end = UmlCanvas.ConnectorHeads.Arrow;
    }
    props['routing'] = props['routing'] || "horizontal";
    
    if( props.sname ) {
      props['beginLabel'] = props.sname == props.from.name ? "" 
        : UmlCanvas.Common.determineVisibility(props['srcVisibility']) 
          + props.sname;
    }
    if( props['srcMultiplicity'] ) { 
      props['beginLabel'] += " [" + props['srcMultiplicity'] + "]";
    }
    if( props.dname ) {
      props['endLabel']   = props.dname == props.to.name ? "" 
        : UmlCanvas.Common.determineVisibility(props['dstVisibility']) 
          + props.dname;
    }
    if( props['dstMultiplicity'] ) {
      props['endLabel'] += " [" + props['dstMultiplicity'] + "]";
    }
    
    if( props.name ) {
      props['centerLabel'] = 
        ( props.stereotype ? "<<" + props.stereotype + ">> " : "" ) 
        + ( props.derived ? "/" : "" ) 
        + ( props.name.substring(0,1) == "_" ? "" : props.name )
    }

    return props;
  },    

  _determineChildModifiers: function _determineChildModifiers(end) {
    var modifiers = [];
    var head = end ? this.end : this.begin;
    if( head == UmlCanvas.ConnectorHeads.Diamond ) {
      modifiers['shared'] = null;
    } else if( head == UmlCanvas.ConnectorHeads.FullDiamond ) {
      modifiers['composite'] = null;
    } else if( head == UmlCanvas.ConnectorHeads.Arrow ) {
      modifiers['navigable'] = null;
    }

    var multi = end ? this.dstMultiplicity : this.srcMultiplicity;
    if( multi ) {
      modifiers['multiplicity'] = '"' + multi + '"';
    }

    var visi = end ? this.dstVisibility : this.srcVisibility;
    if( visi ) {
      modifiers['visibility'] = '"' + visi + '"';
    }

    return modifiers;
  },
  
  isDerived: function() { return this.derived; },

  asConstruct: function() {
    var construct = this._super();

    if( this.getRouting() == "recursive" && this.getRouteBegin() != "ene" ) {
      construct.annotation.data = "recursive:" + 
        this.getRouteBegin() + "-" + this.getRouteEnd();
    }

    // add simple routing annotation if not default and not custom
    if( this.getRouting() != "vertical" && 
        this.getRouting() != "custom"   &&
        this.getRouting() != "recursive" ) 
    {
      construct.annotation.data = this.getRouting();
    }
    
    if( this.isDerived() ) {
      construct.modifiers["derived"] = null;
    }
    
    if( this.getStereotype() ) {
      construct.modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }

    construct.children.push( 
      { modifiers: this._determineChildModifiers(),
        supers: [ this.from.getName() ], children: [], 
        type: "role", name: this.srcName
      }
    );
    construct.children.push( 
      { modifiers: this._determineChildModifiers(true),
        supers: [ this.to.getName() ], children: [], 
        type: "role", name: this.dstName
      } 
    );

    construct.modifiers = [];

    return construct;
  }
});

UmlCanvas.Association.getNames = function() {
  return ["association", "relation"];
}

UmlCanvas.Association.from = function(construct, diagram) {
  var props = { name: construct.name };
  var child1, child2;
  
  var errors = [];
  if( construct.children && construct.children.length > 1 ) {
    child0 = construct.children[0];
    child1 = construct.children[1];
  } else {
    errors.push( "association " + construct.name + " needs two roles");
    return { errors: errors };
  }

  props["kind"]   = "association";

  var from, to;

  if( child1.modifiers.get( "composition" ) || 
      child1.modifiers.get( "composite" ) ||
      child1.modifiers.get( "aggregation" ) || 
      child1.modifiers.get( "shared" ) ) 
  {
    from = child1;    to   = child0;
  } else {
    from = child0;    to   = child1;
  }
  
  if( from.modifiers.get( "composition" ) || 
      from.modifiers.get( "composite" ) ) 
  {
    props["kind"] = "composition";
  }

  if( from.modifiers.get( "aggregation" ) ||
      from.modifiers.get( "shared" ) ) 
  {
    props["kind"] = "aggregation";
  }

  if( from.modifiers.get( "navigable" ) && to.modifiers.get( "navigable" )) {
    props["navigability"] = "bi";
  } else if( from.modifiers.get( "navigable" ) ) {
    props["navigability"] = "source";
  } else if( to.modifiers.get( "navigable" ) ) {
    props["navigability"] = "destination";
  }

  props['routing'] = "vertical";
  if( construct.annotation ) {
    if( construct.annotation.data.contains(":") &&
        construct.annotation.data.contains("-") ) 
    {
      var parts = construct.annotation.data.split(":");
      props["routing"] = "custom";
      props["routeStyle"] = parts[0];
      var ends = parts[1].split("-");
      props["routeBegin"] = ends[0];
      props["routeEnd"]   = ends[1];
    } else {
      props['routing'] = construct.annotation.data;
    }
  }

  props["sname"] = from.name;
  props["dname"] = to.name;

  if( from.modifiers.get('multiplicity') && 
      from.modifiers.get('multiplicity').value ) 
  {
    props['srcMultiplicity'] = from.modifiers.get('multiplicity').value.value;
  }
  if( to.modifiers.get('multiplicity' ) &&
      to.modifiers.get('multiplicity').value ) 
  {
    props['dstMultiplicity'] = to.modifiers.get('multiplicity').value.value;
  }
  
  var visibility = UmlCanvas.Common.extractVisibility(from);
  if( visibility ) { props['srcVisibility'] = visibility; }
  
  visibility = UmlCanvas.Common.extractVisibility(to);
  if( visibility ) { props['dstVisibility'] = visibility; }
  
  props["from"] = diagram.getDiagramClass(from.supers[0].constructName);
  props["to"]   = diagram.getDiagramClass(to.supers[0].constructName);

  if( !props['from'] ) {
    errors.push( "Unknown FROM property " + from.supers[0].constructName + 
                 "  on " + construct.name );
  }

  if( !props['to'] ) {
    errors.push( "Unknown TO property " + to.supers[0].constructName + 
                 "  on " + construct.name );    
  }
  
  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }
  
  // DERIVED
  var derived = construct.modifiers.get("derived");
  if( derived && derived.value ) {
    props.derived = derived.value.value;
  } else if( derived ) {
    props.derived = true;
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
  } else {
    return new UmlCanvas.Association( props );
  }
};

UmlCanvas.Association.MANIFEST = {
  name         : "association",
  properties   : [ "kind", "navigability", "derived", "stereotype",
                   "srcMultiplicity", "dstMultiplicity",
                   "srcVisibility", "dstVisibility" ],
  propertyPath : [ Canvas2D.Connector ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape(UmlCanvas.Association);
UmlCanvas.Role = Class.extend({
    setparent: function setParent() {}
});

UmlCanvas.Role.from = function(construct, diagram) {
    return null;
};

UmlCanvas.Role.MANIFEST = {
    name : "role"
}
    
Canvas2D.registerShape(UmlCanvas.Role);
UmlCanvas.Dependency = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props.end = UmlCanvas.ConnectorHeads.Arrow;
    props.lineStyle = "dashed";
    props['routing'] = props['routing'] || "horizontal";

    this.srcName = props.sname;
    this.dstName = props.dname;

    if( props.name ) {
      props['centerLabel'] = 
        ( props.stereotype ? "<<" + props.stereotype + ">> " : "" ) 
        + ( props.name.substring(0,1) == "_" ? "" : props.name );
    }

    return props;
  },

  asConstruct: function() {
    var construct = this._super();
    construct.modifiers = [];
    
    // add simple routing annotation if not default and not custom
    if( this.getRouting() != "horizontal" && this.getRouting() != "custom" ) {
      construct.annotation.data = this.getRouting();
    }
    
    if( this.getStereotype() ) {
      construct.modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }
    
    construct.children.push( {
      supers: [ this.from.getName() ], children: [], 
      type: "client", name: this.srcName } );

    construct.children.push( {
      supers: [ this.to.getName() ], children: [], 
      type: "supplier", name: this.dstName } );

    return construct;
  }
});

UmlCanvas.Dependency.from = function(construct, diagram) {
  var props = { name: construct.name };
  var client, supplier;
  
  if( construct.children && construct.children.length > 0 &&
      construct.children[0].type == "client" ) 
  {
    client   = construct.children[0];
    supplier = construct.children[1];
  } else {
    client   = construct.children[1];
    supplier = construct.children[0];
  }
  
  errors = [];
  
  if( !client ) {
    errors.push( "missing dependency client" );
  }

  if( !supplier ) {
    errors.push( "missing dependency supplier" );
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
  }

  props['routing'] = "horizontal";
  if( construct.annotation ) {
    if( construct.annotation.data.contains(":") &&
        construct.annotation.data.contains("-") ) 
    {
      var parts = construct.annotation.data.split(":");
      props["routing"] = "custom";
      props["routeStyle"] = parts[0];
      var ends = parts[1].split("-");
      props["routeBegin"] = ends[0];
      props["routeEnd"]   = ends[1];
    } else {
      props['routing'] = construct.annotation.data;
    }
  }

  props['sname'] = client.name;
  props['dname'] = supplier.name;

  props['from'] = diagram.getDiagramClass(client.supers[0].constructName);
  props['to'] = diagram.getDiagramClass(supplier.supers[0].constructName);

  if( !props['from'] ) {
    errors.push( "Unknown FROM property " + client.supers[0].constructName + 
                 "  on " + construct.name );
  }

  if( !props['to'] ) {
    errors.push( "Unknown TO property " + supplier.supers[0].constructName + 
                 "  on " + construct.name );    
  }
  
  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
  } else {
    return new UmlCanvas.Dependency( props );
  }
};

UmlCanvas.Dependency.MANIFEST = {
  name : "dependency",
  properties : [ "client", "supplier", "stereotype" ],
  propertyPath : [ Canvas2D.Connector ],
  libraries : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape(UmlCanvas.Dependency);
UmlCanvas.Client = Class.extend({});
UmlCanvas.Supplier = Class.extend({});

UmlCanvas.Client.from = function(construct, diagram) {
    return null;
};

UmlCanvas.Supplier.from = function(construct, diagram) {
    return null;
};

UmlCanvas.Client.MANIFEST = {
    name : "client"
}

UmlCanvas.Supplier.MANIFEST = {
    name : "supplier"
}
    
Canvas2D.registerShape(UmlCanvas.Client);
Canvas2D.registerShape(UmlCanvas.Supplier);
UmlCanvas.Interface = UmlCanvas.Class.extend( {
    preprocess: function( props ) {
	props = this._super(props);

	if( props['stereotype'] ) {
	    props['stereotype'] = "interface " + props['stereotype'];
	} else {
	    props['stereotype'] = "interface";
	}
	props.isAbstract = true;
	return props;
    },
    
    getFontForClassName : function() {
        return this.getFont();
    },
    
    getFontForOperationName : function(operation) {
        return this.getFont();
    },
    
    asConstruct: function() {
	var construct = this._super();
	delete construct.modifiers["abstract"];
	delete construct.modifiers.stereotype;
	return construct;
    }
} );

UmlCanvas.Interface.from = function( construct, diagram ) {
    var props = {};
    
    // NAME
    props.name = construct.name;

    // MINIMUM WIDTH
    var minimumWidth = construct.modifiers.get( "minimumWidth" );
    if( minimumWidth ) {
        props.minimumWidth = parseInt(minimumWidth.value.value);
    }
    
    // STEREOTYPE
    var stereotype = construct.modifiers.get("stereotype" );
    if( stereotype ) {
	props.stereotype = stereotype.value.value;
    }

    var elem = new UmlCanvas.Interface( props );

    // SUPERCLASS
    if( construct.supers && construct.supers.length > 0 ) {
	construct.supers.iterate(function(superConstruct) {
	    var zuper = diagram.getDiagramClass(superConstruct.constructName);
	    elem.addSuper(zuper);
	    diagram.addRelation(new UmlCanvas.Inheritance({from:zuper, to: elem}));
	});
    }

    return elem;
};

UmlCanvas.Interface.MANIFEST = {
    name         : "interface",
    propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle, UmlCanvas.Class ],
    libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Interface);
UmlCanvas.Inheritance = Canvas2D.Connector.extend( {
    preprocess: function( props ) {
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	props.routing = props.routing || "vertical";
	return props;
    },

    initialBranchLength: function(top, bottom) {
	return 25;
    },

    asConstruct : function asConstruct() {
	return null;
    }
});

UmlCanvas.Inheritance.MANIFEST = {
    name         : "inheritance",
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape( UmlCanvas.Inheritance );
UmlCanvas.Realization = Canvas2D.Connector.extend( {
    preprocess: function( props ) {
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	props.lineStyle = "dashed";
	props.routing = props.routing || "vertical";
	return props;
    },
    initialBranchLength: function(top, bottom) {
	return 25;
    },

    asConstruct: function asConstruct() {
	return null;
    }
});

UmlCanvas.Realization.MANIFEST = {
    name         : "realization",
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape( UmlCanvas.Realization );
UmlCanvas.Enumeration = UmlCanvas.Class.extend( {
  preprocess: function( props ) {
    props = this._super(props);

    if( props['stereotype'] ) {
      props['stereotype'] = "enumeration " + props['stereotype'];
    } else {
      props['stereotype'] = "enumeration";
    }
    props.isAbstract = true;
    return props;
  },

  addOperation: function(operation) {
    return null;
  },

  getFontForClassName : function() {
    return this.getFont();
  },

  asConstruct: function() {
    var construct = this._super();
    delete construct.modifiers.isAbstract;
    delete construct.modifiers.stereotype;
    return construct;
  }
} );

// TODO: collapse with Class.from
UmlCanvas.Enumeration.from = function( construct, diagram ) {
  var props = {};

  // NAME
  props.name = construct.name;

  // MINIMUM WIDTH
  var minimumWidth = construct.modifiers.get( "minimumWidth" );
  if( minimumWidth ) {
    props.minimumWidth = parseInt(minimumWidth.value.value);
  }

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype ) {
    props.stereotype = stereotype.value.value;
  }

  var elem = new UmlCanvas.Enumeration( props );

  // SUPERCLASS
  if( construct.supers && construct.supers.length > 0 ) {
    construct.supers.iterate(function(superConstruct) {
      var zuper = diagram.getDiagramClass(superConstruct.constructName);
      if( zuper ) {
        elem.addSuper(zuper);
        var relation;
        if( zuper instanceof UmlCanvas.Interface ) {
          relation = new UmlCanvas.Realization( {from: zuper, to: elem} );
        } else {
          relation = new UmlCanvas.Inheritance( {from: zuper, to: elem} );
        }
        diagram.addRelation(relation);
      } else {
        warnings.push( "unknown superclass: " + superConstruct.constructName +
        ", referenced by " + construct.name );
      }
    });
  }

  return elem;
};

UmlCanvas.Enumeration.MANIFEST = {
  name         : "enumeration",
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle, UmlCanvas.Class ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Enumeration);
UmlCanvas.Note = Canvas2D.Rectangle.extend( {
  prepare: function(sheet) {
    if( this.prepared ) { return; }
    if( !this.width  ) { this.width  = this.getBoxWidth (sheet); }
    if( !this.height ) { this.height = this.getBoxHeight(sheet); }
    this.prepared = true;
  },

  postInitialize: function(props) {
    // keep short-hand local reference
    this.config = UmlCanvas.Note.Defaults;
  },

  draw: function(sheet, left, top) {
    this.prepare(sheet);
    this.renderTextBox(sheet, left, top);
    this.renderText(sheet, left, top);
  },

  renderTextBox: function renderTextBox(sheet, left, top) {
    sheet.fillStyle      = this.config.backgroundColor;
    sheet.strokeStyle    = this.config.lineColor;
    sheet.lineWidth      = this.config.lineWidth;
    sheet.useCrispLines  = this.config.useCrispLines;

    sheet.fillStrokeRect( left, top, this.getWidth(), this.getHeight() );
  },

  renderText: function renderText(sheet, left, top) {
    sheet.useCrispLines  = false;
    sheet.font           = this.config.font;
    sheet.fillStyle      = this.config.fontColor;
    sheet.textAlign      = "left";
    sheet.lineStyle      = "solid";

    var lines = this.getLines();
    for ( var i=1, len=lines.length; i<=len; ++i ){
      top += this.config.padding;
      sheet.fillText( lines[i-1],
        left + this.config.padding,
        top  + ( parseInt(this.config.font) * i )
      );
    }
  },

  getBoxWidth: function getBoxWidth(sheet) {
    var boxWidth = this.getWidth() + (this.config.padding * 2);
    this.getLines().iterate(function(line) {
      var width = sheet.measureText(line) + (this.config.padding * 2);
      if (width > boxWidth) {
        boxWidth = width;
      }
    }.scope(this) );
    return boxWidth;
  },

  getBoxHeight: function getBoxHeight(sheet) {
    var boxHeight = this.getHeight() + (this.config.padding * 2);
    var textHeight = this.getLines().length * 
    (parseInt(this.config.font) + this.config.padding)
    + this.config.padding;
    return (boxHeight > textHeight) ? boxHeight : textHeight;
  },

  getLines: function getLines() {
    return this.getText().split("\\n");
  },

  asConstruct: function() {
    var construct = this._super();

    delete construct.modifiers.geo;
    construct.modifiers.width  = '"' + this.getWidth() + '"';
    construct.modifiers.height = '"' + this.getHeight() + '"';

    if( this.getText() ) {
      construct.modifiers.text = '"' + this.getText() + '"';
    }

    if( this.getLinkedTo() ) {
      construct.modifiers.linkedTo = '"' + this.getLinkedTo() + '"';
    }

    return construct;
  }
} );

UmlCanvas.Note.from = function( construct, diagram ) {
  var props = {};

  props.name = construct.name;

  var text = construct.modifiers.get("text" );
  if( text && text.value ) {
    props.text = text.value.value;
  }

  var width = construct.modifiers.get( "width" );
  if( width && width.value ) {
    props.width = parseInt(width.value.value);
  }

  var height = construct.modifiers.get("height" );
  if( height && height.value ) {
    props.height = parseInt(height.value.value);
  }

  var linkedTo = construct.modifiers.get("linkedTo");
  if( linkedTo && linkedTo.value ) {
    props.linkedTo = linkedTo.value.value;
  }

  var elem = new UmlCanvas.Note( props );
  if( linkedTo && linkedTo.value ) {
    linkedTo.value.value.split(",").iterate(function(elementName) {
      var element = diagram.getDiagramClass(elementName);
      diagram.addRelation(new UmlCanvas.NoteLink( {
        note    : elem, 
        element : element
      } ));
    } );
  }

  return elem;
};

UmlCanvas.Note.MANIFEST = {
  name         : "note",
  properties   : [ "text", "width", "height", "linkedTo" ],
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Note);
UmlCanvas.NoteLink = Canvas2D.Connector.extend( {
    preprocess: function( props ) {
	props.routing = props.routing || "horizontal";
	props.lineStyle = props.lineStyle || "dashed";
	props.from = props.note;
	props.to   = props.element;
	return props;
    },

    asConstruct : function asConstruct() {
	return null;
    }
});

UmlCanvas.NoteLink.MANIFEST = {
    name         : "notelink",
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape( UmlCanvas.NoteLink );
UmlCanvas.State = Canvas2D.Rectangle.extend( {
  preprocess: function preprocess(props) {
    props.label = props.name;
    return props;
  },

  // UGLY HACK 
  // to override CompositeShape implementation and have more or less default 
  // Shape behavior again
  getHeight: function() { return this.getProperty("height") },
  getWidth : function() { return this.getProperty("width") }
} );

UmlCanvas.State.from = function( construct, diagram ) {
  var props = {};

  // name
  props.name = construct.name;

  // width
  var width = construct.modifiers.get("width");
  if( width && width.value ) {
    props["width"]   = width.value.value;
  }

  // height
  var height = construct.modifiers.get("height");
  if( height && height.value ) {
    props["height"]   = height.value.value;
  }

  // geo
  var geo = construct.modifiers.get("geo");
  if( geo && geo.value ) {
    props["width"]   = parseInt(geo.value.value.split("x")[0]);
    props["height"]  = parseInt(geo.value.value.split("x")[1]);
  }

  return new UmlCanvas.State( props );
}

UmlCanvas.State.MANIFEST = {
  name         : "state",
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle ],
  libraries    : [ "UmlCanvas", "State Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.State);

/////////////////////////////////////////////////////////////////////////////

UmlCanvas.Transition = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props.end = UmlCanvas.ConnectorHeads.Arrow;
    props['routing'] = props['routing'] || "horizontal";
    return props;
  }
} );

UmlCanvas.Transition.from = function(construct, diagram) {
  var props = [];

  props['routing'] = "horizontal";
  if( construct.annotation ) {
    if( construct.annotation.data.contains(":") &&
    construct.annotation.data.contains("-") ) 
    {
      var parts = construct.annotation.data.split(":");
      props["routing"] = "custom";
      props["routeStyle"] = parts[0];
      var ends = parts[1].split("-");
      props["routeBegin"] = ends[0];
      props["routeEnd"]   = ends[1];
    } else {
      props['routing'] = construct.annotation.data;
    }
  }  

  props['from'] = diagram.getDiagramClass(construct.name.split("-")[0]);
  props['to']   = diagram.getDiagramClass(construct.name.split("-")[1]);

  var errors = [];
  if( !props['from'] ) {
    errors.push( "Unknown FROM property " + client.supers[0].constructName + 
    "  on " + construct.name );
  }

  if( !props['to'] ) {
    errors.push( "Unknown TO property " + supplier.supers[0].constructName + 
    "  on " + construct.name );    
  }

  if( errors.length > 0 ) {
    return { errors: errors };
  } else {
    return new UmlCanvas.Transition( props );
  }
}

UmlCanvas.Transition.MANIFEST = {
  name         : "transition",
  propertyPath : [ Canvas2D.Connector ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape(UmlCanvas.Transition);
/**
 * Widget Class
 * Keeps a reference to all HTML elements that can interact with the 
 * UmlCanvas' model and synchronizes state between them.
 *
 * @TODO Should be back-ported to Canvas2D.
 */
UmlCanvas.Widget = Class.extend( {
  /**
   * Constructor, sets up all elements known to this Widget
   */
  init : function initialize(model) {
    this.model = model;
    
    this.setupConsole();
    this.setupSource();
    this.setupGeneratedSource();
    this.setupErrors();
    this.setupAbout();
    this.setupEditor();
  },
  
  /**
   * Returns the name of the model of this Widget.
   * @returns the name of the model of this Widget
   */
  getName : function getName() {
    return this.model.getName();
  },
  
  /**
   * Returns the Widget specific element.
   * @param name the (relative) name of the element.
   * @returns the element for this specific widget instance
   */
  getElement: function getElement(name) {
    return document.getElementById( "UC_" + name + "_for_" + this.getName() );
  },
  
  /**
   * Sets up the console element
   */
  setupConsole: function setupConsole() {
    this.console = this.getElement("console");
    if( this.console ) {
      this.model.console = this.console;
      this.model.log( "Widget: attached console : " + this.console.id );
    }
  },

  /**
   * Sets up the (static) source element
   */
  setupSource: function setupSource() {
    this.source = document.getElementById(this.getName() + "Source") 
                  || this.getElement("source");
    if( this.source ) {
      this.model.log( "Widget: attached source : " + this.source.id );
    }
  },

  /**
   * Sets up the generated (source) element
   */
  setupGeneratedSource: function setupGeneratedSource() {
    this.generated = document.getElementById(this.id + "Generated") 
                     || this.getElement("generated");
    if( this.generated ) {
      this.model.log( "Widget: attached generated : " + this.generated.id );
    }
  },

  /**
   * Sets up the editor element
   */
  setupEditor: function setupEditor() {
    this.editor = this.getElement("editor");
    if( this.editor ) {
      this.editor.onkeydown = this.handleInput.scope(this);
      this.model.on( "sourceUpdated", function(newSource) {
        if(!this.updatingCanvas && !this.updatedCanvas) {
          this.setSource(newSource);
        }
        this.updatedCanvas = false;
      }.scope(this) );
      this.updatingCanvas = false;
      this.autoSave();

      this.model.log( "Widget: attached editor : " + this.editor.id );
    }

    this.load();
  },
  
  /**
   * Sets up the errors element
   */
  setupErrors: function setupErrors() {
    this.errors = this.getElement("errors");
    if( this.errors ) {
      this.model.log( "Widget: attached errors : " + this.errors.id );
    }

  },
  
  /**
   * Shows error messages in the errors element
   * @param errors a string representing the errors to be shown
   */
  showErrors: function showErrors(errors) {
    if( ! this.errors ) { return; }
    this.errors.value = errors;
  },
  
  /**
   * Sets up the about element
   */
  setupAbout: function setupAbout() {
    this.about = this.getElement("about");
    
    if( this.about ) {
      var libraries = "";
      Canvas2D.extensions.iterate(function(library) {
          libraries += "\n<hr>\n";
          libraries += "<b>Library: " + 
            library.name + " " + library.version + "</b> " + 
            "by " + library.author + "<br>" + library.info;
      });
      this.about.innerHTML = '<b>Canvas2D ' + Canvas2D.version  + 
          '</b><br>Copyright &copy 2009, ' +
          '<a href="http://christophe.vg" target="_blank">Christophe VG</a>'+ 
          ' & <a href="http://thesoftwarefactory.be" ' +
          'target="_blank">The Software Factory</a><br>' + 
          'Visit <a href="http://thesoftwarefactory.be/wiki/Canvas2D" ' +
          'target="_blank">http://thesoftwarefactory.be/wiki/Canvas2D</a> ' +
          'for more info. Licensed under the ' +
          '<a href="http://thesoftwarefactory.be/wiki/BSD_License" ' + 
          'target="_blank">BSD License</a>.' + 
          libraries;
     }
  },
  
  /**
   * Gets the source from the editor and updates the UmlCanvas
   * Only does so when the source is valid (not empty) and "dirty". 
   * Guards against updates to the source by the UmlCanvas.
   */
  updateCanvas: function updateCanvas() {
    var src = this.getEditorSource();
    if( src && this.isInputDirty()) {
      if( src.replace( /^\s+|\s+$/g,"") != "" ) {
        this.updatingCanvas = true;
        this.load(src);
        this.showErrors(this.model.errors);
        if( this.model.errors == "" ) {
          this.updatedCanvas  = true;
          this.updatingCanvas = false;
        }
      }
      // canvas updated, so mark undirty
      this.handleInput();
    }
  },
  
  /**
   * Automagically saves the changes by the user in the editor to the 
   * actual canvas.
   */
  autoSave: function autoSave() {
    this.updateCanvas();
    setTimeout( this.autoSave.scope(this), 100 );
  },
  
  /**
   * Handle changes to the (editor) input
   */
  handleInput: function handleInput() {
    this.oldValue = this.editor.value;
  },
  
  /**
   * Check whether the input is dirty.
   * @return true if the editor is not in sync with the UmlCanvas.
   */
  isInputDirty: function isInputDirty() {
    return this.oldValue != this.editor.value;
  },

  /**
   * Sets the value of the editor.
   * @param src the src to set
   */
  setSource: function setSource(src) {
    this.editor.value = src;
    this.handleInput();
  },
  
  /**
   * Loads source into the model.
   * @param src Optional source, if omitted, the source is fetched
   */  
  load: function load(src) {
    src = src || this.getSource();
    // TODO: parsing an empty source causes havoc. this should be handled 
    //       more gracefully in Cavnas2D
    if( src != "" ) {
      this.model.load(src);
    }
  },

  /**
   * Fetches the source from either the editor or the source element
   * @return the source in the editor or in the source element or "empty"
   */
  getSource: function getSource() {
    return this.getEditorSource() || this.getLocalSource() || "";
  },

  /**
   * Provides the source in the editor.
   * @return the source in the editor or null
   */
  getEditorSource: function getEditorSource() {
    return this.editor ? this.editor.value : null;
  },
  
  /**
   * Provides the source in the source element.
   * @return the source in the source element or null
   */
  getLocalSource : function getLocalSource() {
    return this.source ?  (this.source.value || this.source.innerHTML) : null;
  }
});

/**
 * Static Factory method to setup a widget for a UmlCanvas.
 */
UmlCanvas.Widget.setup = function UmlCanvas_Widget_setup( model ) {
  model.Widget = new UmlCanvas.Widget( model ); 
};
UmlCanvas.KickStart = { plugins: {} };

UmlCanvas.KickStart.Starter = Canvas2D.KickStart.Starter.extend( {
  init: function init() {
    this.manager = new UmlCanvas.Manager();
    this.pluginManagerRepository = 
      new UmlCanvas.KickStart.PluginManagerRepository();
    this.setupPluginsFactories();
  },

  setupPluginsFactories : function setupPluginsFactories() {
    $H(UmlCanvas.KickStart.plugins).iterate(function(name, plugin) {
      if( plugin["Manager"] ) {
        this.pluginManagerRepository.setManager( name, new plugin.Manager() );
      }
    }.scope(this) );
  },

  getTag: function getTag() {
    return "UmlCanvas";
  },

  makeInstance: function makeInstance( modelId ) {
    // setup the Model
    var model = this.manager.setupModel( modelId );

    // activate the Widget Framework around the UmlCanvas
    UmlCanvas.Widget.setup(model);

    // create an instance of each plugin and add it to the UmlCanvas
    this.pluginManagerRepository.getManagers().iterate(function(manager) {
      if( manager.needsPlugin( model ) ) {
        model.addPlugin( manager.setup( model ) );
      }
    }.scope(this) );

    // activate all plugins on the UmlCanvas
    model.activatePlugins();

    return model;
  }
} );

ProtoJS.Event.observe(window, 'load', function() { 
  with( UmlCanvas.KickStarter = new UmlCanvas.KickStart.Starter() ) {
    on( "ready", function() { UmlCanvas.fireEvent("ready"); } );
    start(); 
  }
} );
UmlCanvas.KickStart.PluginManagerRepository = Class.extend( {

  /**
  * Creates a PluginManagerRepository.
  */
  init: function() {
    this.managers = {};
  },

  /**
  * Sets the Manager of a plugin.
  * @param plugin the name of a plugin
  * @param manager the manager
  */
  setManager: function setManager(plugin, manager) {
    this.managers[plugin] = manager;
  },

  /**
  * Gets the manager.
  * @param plugin the name of the plugin
  * @return the manager of the plugin 
  */
  getManager: function getManager(plugin) {
    return this.managers[plugin];
  },

  /**
  * Provides all managers.
  * @return all managers
  */
  getManagers: function getManagers() {
    return $H(this.managers).values();
  }
} );
/**
 * Plugin interface
 */
UmlCanvas.Plugin = Class.extend( {
  getName : function getName() {
    throw( "Plugin must implement getName()." );
  },

  activate : function activate() {
    throw( "Plugin must implement activate()." );
  }
} );

/**
 * Abstract PluginManager BaseClass
 */
UmlCanvas.PluginManager = Class.extend( {
  getPluginClass : function getPluginClass() {
    throw( "PluginManager must implement getPluginClass()." );
  },
  
  setup : function setup( model ) { 
    throw( "PluginManager must implement setup()." ) 
  },

  needsPlugin : function needsPlugin() { return false; },
  /**
   * Creates a new inspector.
   * @param model the UmlCanvas' model for which the Inspector is created.
   * @return an Inspector for the given model
   */
  setup: function setup(model) {
    return new (this.getPluginClass())(model);
  }
} );
/**
 * Inspector Plugin
 * Implementation of the Widget Framework.
 * Provides 
 *
 * @TODO Should be back-ported to Canvas2D.
 */
UmlCanvas.KickStart.plugins.Inspector = UmlCanvas.Plugin.extend( {
  init: function init(model) {
    this.model = model;

    this.initSheets();
  },
  
  getName: function getName() {
    return "inspector";
  },

  /**
  * Adds 3 default sheets to this inspector: source, console and about.
  * TODO when moved to Canvas2D, default should be set using defaults mechanism
  */
  initSheets: function initSheets() {
    this.sheets = {};
    this.sheetPositions = [];

    this.source = document.createElement('textarea');
    this.addSheet(0, 'source' , this.source );

    this.console = document.createElement('textarea');
    this.addSheet(1, 'console', this.console );

    this.addSheet(2, 'about');
  },

  activate: function activate() {
    this.insertInspector();
    this.wireActivation();
  },

  getElement : function getElement(name) {
    return document.getElementById( "UC_inspector_" + name + 
                                    "_for_" + this.model.getName() );
  },

  /**
  * Provides the sheet for the given label.
  * @param label a label
  * @return the sheet with the given label
  */
  getSheet: function getSheet(label) {
    return this.sheets[label];
  },

  /**
  * Adds a sheet to the inspector.
  * Shifts the element currently at that position (if any) and 
  * any subsequent elements to the right (adds one to their indices).
  * @param index at which the specified sheet is to be inserted
  * @param label a label for the sheet
  * @param element the html element representing the content of the sheet
  */
  addSheet: function addSheet(index, label, element) {
    var sheet = new UmlCanvas.KickStart.plugins.Inspector.Sheet(label, element);
    this.sheetPositions.splice(index, 0, sheet);
    this.sheets[sheet.getLabel()] = sheet;
  },

  /**
  * Removes the sheet with the given label.
  * @param label a label
  */
  removeSheet: function removeSheet(label) {
    this.sheetPositions.splice(
      this.sheetPositions.indexOf(this.getSheet(label)), 1);
    delete this.sheets[label];
  },
  
  getDefaultTab: function getDefaultTab() {
    return this.defaultTab || "source";
  },
  
  setDefaultTab: function setDefaultTab(tab) {
    this.defaultTab = tab || "source";
  },

  insertInspector: function insertInspector() {
    this.insertInspectorHTML();
    this.wireResizeAndDragHandling();

    this.setupSheets();
    this.gotoTab(this.getDefaultTab());

    this.resizeTo(0,0);
    this.moveTo( this.model.getLeft(), this.model.getTop() );
    this.shownBefore = false;

    UmlCanvas.Widget.setup(this.model);
  },

  insertInspectorHTML: function insertInspectorHTML() {
    this.inspector = document.createElement("DIV");
    this.inspector.id = "UC_inspector_for_" + this.model.getName();
    this.inspector.className = "UC_inspector";
    this.inspector.innerHTML = 
    '<table class="UC_inspector_header" width="100%" border="0" ' +
           'cellspacing="0" cellpadding="0"><tr>' +
    '<td class="UC_inspector_close" ' +
    'onclick="this.parentNode.parentNode.' +
    'parentNode.parentNode.style.display=\'none\';"></td>' +
    '<td><h1 id="UC_inspector_header_for_' + this.model.getName()  + '">' +
    'UmlCanvas Inspector</h1></td>' +
    '<td class="UC_inspector_corner"></td></tr></table>' +

    '<div id="UC_inspector_tabs_for_' + this.model.getName() + 
    '" class="UC_inspector_tabs"></div>' +
    '<div id="UC_inspector_content_for_' + this.model.getName() + 
    '"class="UC_inspector_content"></div>' +

    '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
    '<td class="UC_inspector_status">'+ UmlCanvas.version +'</td>' +
    '<td id="UC_inspector_resize_for_' + this.model.getName() + '"' +
    'class="UC_inspector_resize"></td>' +
    '</tr></table>';

    document.body.appendChild(this.inspector);
  },

  // TODO editor should be plugin
  // TODO generated source might be default
  setupSheets: function setupSheets() {
    this.tabs    = this.getElement( "tabs"    ) ;
    this.content = this.getElement( "content" );

    this.sheetPositions.iterate( function( sheet ) {
      var tab = document.createElement("A");
      tab.id = "UC_inspector_tab_" + sheet.getLabel() + 
      "_for_" + this.model.getName();
      tab.href = "javascript:";
      tab.className ="UC_inspector_tab";
      tab.onclick = function(tabName) { 
        return function() { this.gotoTab(tabName); }.scope(this) 
      }.scope(this)(sheet.getLabel());
      tab.appendChild(document.createTextNode(sheet.getLabel()));
      this.tabs.appendChild(tab);

      this.content.appendChild(sheet.getElement(this.model.getName()));
    }.scope(this) );
  },

  gotoTab: function gotoTab(tab) {
    if( this.currentTab   ) { 
      this.currentTab.className   = "UC_inspector_tab";   
    }
    if( this.currentSheet ) { 
      this.currentSheet.className = "UC_inspector_tab_content"; 
    }

    this.currentTab   = this.getElement( "tab_" + tab );
    this.currentSheet = 
    document.getElementById( "UC_" + tab + "_for_" + this.model.getName() );

    if( this.currentTab   ) { 
      this.currentTab.className = 
      "UC_inspector_tab_selected"; 
    }
    if( this.currentSheet ) { 
      this.currentSheet.className =  "UC_inspector_tab_content_selected";
    }
  },

  wireResizeAndDragHandling: function wireResizeAndDragHandling() {
    ProtoJS.Event.observe( this.getElement("resize"), 'mousedown', 
    function(event) {
      this.resizing = true; 
      this.handleMouseDown(event); 
    }.scope(this) );
    ProtoJS.Event.observe( this.getElement("header"), "mousedown",
    function(event) {
      this.handleMouseDown(event);
      this.dragging = true;
    }.scope(this) );
    ProtoJS.Event.observe( document, 'mouseup', 
    this.handleMouseUp.scope(this) );
    ProtoJS.Event.observe( document, 'mousemove', 
    this.handleMouseMove.scope(this) );
  },

  handleMouseDown : function handleMouseDown(event) {
    if( event.preventDefault ) { event.preventDefault(); }
    event.returnValue = false;
    this.currentPos = this.getXY(event);
  },

  handleMouseMove : function handleMouseMove(event) {
    if( this.resizing || this.dragging ) {
      var pos = this.getXY(event);
      if( this.resizing ) {
        this.resizeBy( pos.x - this.currentPos.x, pos.y - this.currentPos.y );
      } else if( this.dragging ) {
        this.moveBy( pos.x - this.currentPos.x, pos.y - this.currentPos.y );
      }
      this.currentPos = pos;
    }
  },

  handleMouseUp : function handleMouseMove(event) {
    this.resizing = false;
    this.dragging = false;    
  },

  // TODO: move this to ProtoJS and mix in (shared with Canvas2D)
  // maybe even whole resize/dragging code ?
  getXY: function getXY(e) {
    var x,y;
    if( ProtoJS.Browser.IE ) {
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    } else {
      x = e.pageX;
      y = e.pageY;
    }
    return { x: x, y: y };
  },

  resizeBy: function resizeBy(dx, dy) {
    this.resizeTo( parseInt(this.inspector.style.width) + dx, 
    parseInt(this.inspector.style.height) + dy );
  },

  resizeTo: function resizeTo(w, h) {
    this.inspector.style.width  = ( w >= 300 ? w : 300 ) + "px";
    this.inspector.style.height = ( h >= 150 ? h : 150 ) + "px";

    var widthDiff = ProtoJS.Browser.IE ? 0 : 10;

    this.content.style.width  = 
    ( parseInt(this.inspector.style.width) - widthDiff ) + "px";
    this.content.style.height = 
    ( parseInt(this.inspector.style.height) - 73 ) + "px";

    // FIXME
    if( ProtoJS.Browser.IE ) {
      this.console.style.height = this.content.style.height;
    }

    this.fireEvent( 'changeContentSize', 
    { w: parseInt(this.content.style.width),
      h: parseInt(this.content.style.height) } );
  },

  moveBy: function moveBy(dx, dy) {
    this.moveTo( parseInt(this.inspector.style.left) + dx, 
    parseInt(this.inspector.style.top ) + dy );
  },

  moveTo: function resizeTo(l, t) {
    this.inspector.style.left = (l >= 0 ? l : 0 ) + "px";
    this.inspector.style.top  = (t >= 0 ? t : 0 ) + "px";
  },

  getWidth: function getWidth() {
    return parseInt(this.inspector.style.width);
  },

  getHeight: function getHeight() {
    return parseInt(this.inspector.style.height);    
  },

  show: function show() {
    if( !this.shownBefore ) {
      this.resizeTo( this.model.getWidth(), this.model.getHeight() );
      this.shownBefore = true;
    }
    this.inspector.style.display = "block";
  },

  hide: function hide() {
    this.inspector.style.display = "none";
  },

  wireActivation: function wireActivation() {
    if (UmlCanvas.Config.Inspector.wireActivation) {
      Canvas2D.Keyboard.on( "keyup", 
      function(key) {
        if( this.model.canvas.mouseOver && key == "73" ) {
          this.show();
        }
      }.scope(this));
    }
  }
} );

// mix-in event handling to Canvas2D
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, 
  UmlCanvas.KickStart.plugins.Inspector.prototype );

/**
 * Manager for Inspector
 */
UmlCanvas.KickStart.plugins.Inspector.Manager = 
  UmlCanvas.PluginManager.extend( 
{
  /**
   * checks whether the model needs this plugin
   * @return boolean true if the plugin needs this plugin, false otherwise
   */
  needsPlugin : function needsPlugin(model) {
    return ! model.canvas.canvas.className.contains("withoutInspector");
  },

  getPluginClass : function getPluginClass() {
    return UmlCanvas.KickStart.plugins.Inspector;
  }
} );
UmlCanvas.KickStart.plugins.Inspector.Sheet = Class.extend( {

  /**
  * Sheet constructor
  * @param label label for the sheet
  * @param element the html element for the content of the sheet. Optional,
  * if not given, a div element is created.
  * @return a Sheet
  */
  init: function init(label, element) {
    this.label = label;
    if( element ) {
      this.element = element;
    } else {
      this.element = document.createElement('div');
    }
  },

  /**
  * Provides the label of the sheet.
  * @return the label
  */
  getLabel: function getLabel() {
    return this.label;
  },

  /**
  * Sets the label. 
  * @param label the label to set
  */
  setLabel: function setLabel(label) {
    this.label = label;
  },

  /**
  * Provides an html representation of the sheet and its content.
  * @param umlcanvasName name of the UmlCanvas for which the element is created
  * @return an html snippet
  */
  getElement: function getElement(umlcanvasName) {
    this.element.id = "UC_" + this.getLabel() + "_for_" + umlcanvasName;
    this.element.className = "UC_inspector_tab_content";
    this.element.style.resize = "none";

    return this.element;
  }

} );
// TODO koen - refactor: Editor/toolbar should be extracted to its own class

UmlCanvas.KickStart.plugins.HuC = UmlCanvas.Plugin.extend( {
  init: function init(model) {
    this.model = model;

    this.initSheets();
    this.setupSource();
  },

  getName: function getName() {
    return "huc";
  },

  activate: function activate() {
    // nothing to do ?
  },

  initSheets: function initSheets() {
    if( inspector = this.getInspector() ) {
      with(inspector) {
        addSheet(0, 'edit', this.createEditorSheet());
        addSheet(1, 'properties', this.createPropertiesSheet());
        removeSheet('source');
        on( 'changeContentSize', this.handleInspectorResize.scope(this) );
      }
      inspector.setDefaultTab('edit');
    }
  },

  handleInspectorResize: function handleInspectorResize(geo) {
    if( geo.h > 24 + 75 ) {
      this.editor.style.height = ( geo.h - 24 - 75 ) + "px";
    }
  },

  /**
  * Gets the umlcanvas element for the given name.
  * @param name the name of a component
  * @return an element
  */
  getElement: function getElement(name) {
    return this.model.Widget.getElement(name);
  },

  /**
  * Provides the editor element.
  * @return the editor element
  */
  getEditor: function getEditor() {
    return this.editor;
  },

  /**
  * Creates the editor element.
  * @return the editor element
  */
  createEditorSheet: function createEditorSheet() {
    var container = document.createElement('div');

    container.style.overflow = 'hidden';

    container.appendChild(this.createEditorToolbar());
    container.appendChild(this.createEditorTextPane());
    container.appendChild(this.createErrorTextPane());

    return container;
  },

  /**
  * Creates the properties element.
  * @return the properties element
  */
  // TODO koen - refactor: extract class
  createPropertiesSheet: function createPropertiesSheet() {
    var container = document.createElement('div');
    this.propertiesForm = document.createElement('form');
    this.propertiesForm.id = "UC_propertiesForm_for_" + this.model.getName();
    var table = document.createElement('table');
    table.className = "UC_inspector_properties";
    this.setupProperties();
    this.propertyFields = {};

    this.props.iterate(function (prop) {
      var tb = document.createElement('tbody');
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      var td = document.createElement('td');
      var errorSpan = document.createElement('span');
      var errorCell = document.createElement('td');

      var field;
      if ('string' == prop.type && 100 < prop.maxlength) {
        field = document.createElement('textarea');
      } else if ('string' == prop.type || 'integer' == prop.type) {
        field = document.createElement('input');
        field.name = "text";
      } else if ('author' == prop.id) {
        field = document.createElement('a');
        field.href = 'http://hosted.umlcanvas.org';
        field.target = '_blank';
      }

      // FIXME: find other solution for setAttribute (eg onkeypress)
      // field.setAttribute('maxlength', prop.maxlength);

      th.innerHTML = prop.label;
      field.id = "UC_" + prop.id + "_for_" + this.model.getName();
      ProtoJS.Event.observe(field, 'blur', function() {
        this.validateField(field, prop);
        this.updateDiagram();
      }.scope(this) );
      
      errorSpan.className = "invalid";
      errorSpan.id = "UC_" + prop.id + "_error_for_" + this.model.getName();
      
      td.appendChild(field);
      tr.appendChild(th);
      tr.appendChild(td);
      errorCell.appendChild(errorSpan);
      tr.appendChild(errorCell);
      tb.appendChild(tr);
      table.appendChild(tb);

      this.propertyFields[prop.id] = field;
    }.scope(this) );

    this.propertiesForm.appendChild(table);

    container.appendChild(this.createEditorToolbar());
    container.appendChild(this.propertiesForm);

    return container;
  },

  /**
  * Initializes diagram properties.
  */
  setupProperties : function setupProperties() {
    /*
    * array of (form) properties, consisting out of id, name, type, 
    * min length, max length
    */ 
    this.props = [
    { id : 'name', label : 'Name', type : 'string', minlength : 1, maxlength : 25 },
    { id : 'descr', label : 'Description', type : 'string', minlength : 1, maxlength : 1000 },
    { id : 'width', label : 'Width', type : 'integer', minlength : 2, maxlength : 3 },
    { id : 'height', label : 'Height', type : 'integer', minlength : 2, maxlength : 3 },
    { id : 'notes', label : 'Notes', type : 'string' , minlength : 0, maxlength : 1000 },
    { id : 'author', label : 'Author', type : 'link' , minlength : 0, maxlength : 1000 }
    ];
  },

  /**
  * Validates all fields.
  */
  validateFields : function validateFields() {
    var valid = true;
    this.props.iterate(function (prop) {
      valid = this.validateField(this.getElement(prop.id), prop) && valid;
    }.scope(this) );
    return valid;
  },

  /**
  * Validates whether the field fulfills its specification.
  * @param field the field element
  * @param prop the specification of the field
  */
  validateField : function validateField(field, prop) {
    var valid = true;

    var errorElement = this.getElement(prop.id + "_error");
    
    if (prop.type != 'link') {
      field.style.backgroundColor = '#FFF';
      errorElement.innerHTML = "";
      if ('integer' == prop.type) {
        if (isNaN(parseInt(field.value, 10))) {
          field.value = 0;
        } else {
          field.value = parseInt(field.value, 10);
        }
      }
      if (field.value.length > prop.maxlength) {
        field.value = field.value.substring(0, prop.maxlength);
      }
      if (field.value.length < prop.minlength) {
        field.style.backgroundColor = '#faa';
        errorElement.innerHTML = "minimal length: " + prop.minlength;
        valid = false;
      }
    }

    return valid;
  },

  /**
  * Creates the editor toolbar.
  * @return the editor toolbar
  */
  createEditorToolbar: function createEditorToolbar() {
    var toolbar = new UmlCanvas.KickStart.plugins.HuC.Toolbar();

    toolbar.addAction(
      UmlCanvas.Config.Inspector.Icons.save,
      "Save",
      function() {
        return function() {
          if (this.validateFields()) {
            this.saveDiagram( {
              id: this.model.getName(),
              src: this.getEditor().value,
              name: this.getElement('name').value,
              descr: this.getElement('descr').value,
              width: this.getElement('width').value,
              height: this.getElement('height').value,
              notes: this.getElement('notes').value
            } );
          } else {
            this.getInspector().gotoTab('properties'); 
          }
        }.scope(this);
      }.scope(this)());

    toolbar.addAction(
      UmlCanvas.Config.Inspector.Icons.reload, 
      "Reload",
      function() { 
        return function() { 
          if( confirm( "Do you want to reload this diagram? \n\n" + 
                       "If you reload this diagram, all changes made after " +
                       "your last save action will be lost." ) ) 
          {
            this.loadDiagram();
          }
        }.scope(this);
      }.scope(this)());

    return toolbar.getToolbar();
  },

  /**
   * Creates the editor text pane.
   * @return the editor text pane
   */
  createEditorTextPane: function createEditorTextPane() {
    this.editor = document.createElement('textarea');

    this.editor.id = "UC_editor_for_" + this.model.getName();
    this.editor.style.resize = "none";
    this.editor.style.border = "0px solid white";

    return this.editor;
  },

  createErrorTextPane: function createErrorTextPane() {
    var errorPane = document.createElement('textarea');

    errorPane.id = "UC_errors_for_" + this.model.getName();
    errorPane.style.resize = "none";
    errorPane.style.height = "75px";

    return errorPane;
  },

  /**
  * Gets the manager of the Inspector plugin.
  * @return the Inspector plugin manager
  */
  getInspector: function getInspector() {
    return this.model.getPlugin("inspector");
  },

  /**
  * Loads the diagram from HuC if the UmlCanvas has no (local) source.
  */
  setupSource: function setupSource() {
    if( this.model.Widget.getSource() == "" ) {
      this.loadDiagram();
    }
  },

  /**
  * Provides the UmlCanvas element of the document.
  * @return the UmlCanvas element
  */
  getCanvasElement: function getCanvasElement() {
    return this.model;
  },

  decodeHTMLSpecialCharacters: function decodeHTMLSpecialCharacters(str) {
    return str.replace( /&quot;/g, '"' );
  },

  /**
  * Loads the diagram from HuC.
  */
  loadDiagram: function loadDiagram() {
    if( this.model.getName() == "" ) { return this.loadProperties(); }
    this.load( this.model.getName() );
  },

  load: function load(id) {
    var url = UmlCanvas.Config.HuC.repository_url + id + ':json';
    new ProtoJS.Ajax().fetch( url, 
    function(properties) {
      this.model.load(this.decodeHTMLSpecialCharacters(properties.src));
      this.loadProperties(properties);
      this.updateDiagram();
    }.scope(this));
  },

  /**
  * Loads the properties of the diagram.
  * @param props the props to load
  */
  loadProperties: function loadProperties(props) {
    if( ! this.propertiesForm ) { return; }
    props = props || { width: this.getCanvasElement().getWidth(),
                       height: this.getCanvasElement().getHeight() };
      this.propertiesForm.reset();
      $H(props).iterate(function(name) {
        if ( this.propertyFields[name] != null) {
          // FIXME : encapsulate when properties sheet is extracted to its 
          //         own class
          if ('author' == name) {
            this.propertyFields[name].innerHTML = props[name];
            this.propertyFields[name].href = 
            UmlCanvas.Config.HuC.repository_url + '~'  + props[name];
          }
          this.propertyFields[name].value = props[name];
        }
      }.scope(this) );
    },

    /**
    * Updates the diagram.
    */
    updateDiagram: function updateDiagram() {
      if( ! this.propertyFields ) { return; }
      this.getCanvasElement().setSize( this.propertyFields['width'].value,
                                       this.propertyFields['height'].value );
    },

    /**
    * Saves the given diagram
    */
    saveDiagram: function saveDiagram(params) {
      var form = document.getElementById('submitForm');

      if (!form) {
        form = document.createElement("form");
        form.id = 'submitForm'; 
        form.method = 'post';
        form.action = UmlCanvas.Config.HuC.repository_submit_url;
        form.target = "formresult";

        this.submitFields = {};
        for(var key in params) {
          var hiddenField = document.createElement("input");
          this.submitFields[key] = hiddenField;

          hiddenField.type = "hidden";
          hiddenField.name = key;

          form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
      }      

      for(var key in params) {
        this.submitFields[key].value = params[key];
      }

      window.open('', 'formresult');

      form.submit();
    }

  } );

/**
* Toolbar for the HuC editor pane.
*/
UmlCanvas.KickStart.plugins.HuC.Toolbar = Class.extend( {

  /**
  * Creates a toolbar.
  */
  init: function init() {
    this.toolbar = document.createElement('div');
    this.toolbar.className = "UC_toolbar";
  },

  /**
  * Provides the toolbar element.
  * @return an element
  */
  getToolbar: function getToolbar() {
    return this.toolbar;
  },

  /**
  * Adds an action to the toolbar.
  * @param src the (img) src for the action
  * @param alt alternative text for the image
  * @param command the command that should be executed when the toolbar icon 
  * is clicked
  */
  addAction: function addAction(src, alt, command) {
    var action = document.createElement('img');

    action.src = src;
    action.alt = alt;
    action.onclick = command;

    this.toolbar.appendChild(action);
  }

} );

UmlCanvas.KickStart.plugins.HuC.Manager = UmlCanvas.PluginManager.extend( {
  /**
  * checks whether the model needs this plugin
  * @return boolean true if the plugin needs this plugin, false otherwise
  */
  needsPlugin: function needsPlugin(model) {
    return model.getPlugin("inspector") != null;
  },

  getPluginClass : function getPluginClass() {
    return UmlCanvas.KickStart.plugins.HuC;
  }
} );
UmlCanvas.Defaults = {}

UmlCanvas.Class.Defaults = {
    name              : "newClass",
    stereotype        : "",
    supers            : [],
    
    useCrispLines     : true,
    font              : "7pt Verdana",
    fontColor         : "black",
    fontAbstract      : "italic 7pt Verdana",
    abstractColor     : "black",
    decoration        : "none",
    decorationStatic  : "underline",

    lineWidth          : 1,
    lineColor          : "rgba(255,0,0,1)",
    backgroundColor    : "rgba(255,255,200,1)",

    padding            : 5,
    lineSpacing        : 5,
    compartmentSpacing : 3
};

UmlCanvas.Interface.Defaults   = {
  name : "newInterface"
}
UmlCanvas.Enumeration.Defaults = {
  name : "newEnumeration"
}

UmlCanvas.Association.Defaults = {
  name : "newAssociation"
}
UmlCanvas.Dependency.Defaults  = {
  name : "newDependency"
}

UmlCanvas.Inheritance.Defaults = {
  name : "newInheritance"
}
UmlCanvas.Realization.Defaults = {
  name : "newRealization"
}

UmlCanvas.Note.Defaults = {
  name            : "NewName",
  text		        : "New Note",
  width		        : 100,
  height		      : 40,
  padding		      : 5,
  font		        : "7pt Verdana",
  fontColor		    : "black",
  lineColor		    : "grey",
  backgroundColor	: "rgba(240,240,240,1)",
  lineWidth		    : 1,
  useCrispLines	  : true
};

UmlCanvas.NoteLink.Defaults = {};

UmlCanvas.State.Defaults = {
  name         : 'newState',
  roundCorners : true,
  lineColor    : 'rgb(250,125,0)',
  fillColor    : 'rgb(255,240,175)',
  labelColor   : 'rgb(250,125,0)',
  labelPos     : 'top-inner',
  width        : 100,
  height       : 50
};

UmlCanvas.Transition.Defaults = {
  name         : 'NewTransition',
  lineColor    : 'rgb(250,125,0)'
};
UmlCanvas.Config = {};

UmlCanvas.Config.Inspector = {
  wireActivation : true
};

UmlCanvas.Config.Inspector.Icons = {
  save   : 'http://static.thesoftwarefactory.be/images/icons/disk-black.png', 
  reload : 'http://static.thesoftwarefactory.be/images/icons/arrow-circle-315.png',
  left   : 'http://static.thesoftwarefactory.be/images/inspector/left.png',
  right  : 'http://static.thesoftwarefactory.be/images/inspector/right.png'
};

UmlCanvas.Config.HuC = {
  repository_url        : 'http://hosted.umlcanvas.org/',
  repository_submit_url : 'http://hosted.umlcanvas.org/submit/index.php'
};
var headID = document.getElementsByTagName("head")[0];         
var cssNode = document.createElement('link');
cssNode.type = 'text/css';
cssNode.rel = 'stylesheet';
cssNode.href = 'http://static.thesoftwarefactory.be/css/inspector.css';
cssNode.media = 'screen';
headID.appendChild(cssNode);
