

// top-level ADL namespace
var ADL = {};

ADL.base = Class.extend( {
	getValue: function getValue() {
		return this.value;
	}
} );

ADL.Boolean = ADL.base.extend( {
  init: function( value ) {
    this.value = value == "true" ? true : false;
  },

  toString: function() {
    return this.value ? "true" : "false";
  }
});

ADL.Integer = ADL.base.extend( {
  init: function( value ) {
    this.value = parseInt(value);
  },

  toString: function() {
    return this.value;
  }
});

ADL.String = ADL.base.extend( {
  init: function( value ) {
    this.value = value;
  },

  toString: function() {
    return '"' + this.value + '"';
  }
});

ADL.Value = Class.extend( {
	init: function( value ) {
		this.value = value;
	},
	
	getValue: function getValue() {
		return this.value.getValue();
	},
	
	toString: function() {
		return " <= " + this.value.toString();
	}
} );

ADL.Annotation = ADL.base.extend( {
  init: function( value ) {
    this.value = value;
  },

  toString: function() {
    return "[@" + this.value + "]";
  }
});

ADL.Multiplicity = Class.extend( {
  init: function( low, high ) {
    this.low = low;
    this.high = high;
  },

	getLow: function getLow() {
		return this.low;
	},
	
	getHigh: function getHigh() {
		return this.high;
	},

  toString: function() {
    return "[" + this.low + ( this.high ? ".." + this.high : "" ) + "]";
  }
});

ADL.Reference = Class.extend( {
  init: function( constructName, multiplicity ) {
    this.constructName = constructName;
    this.multiplicity = multiplicity;
  },

	getConstructName: function getConstructName() {
		return this.constructName;
	},
	
	getMultiplicity: function getMultiplicity() {
		return this.multiplicity;
	},

  toString: function() {
    return this.constructName + 
    ( this.multiplicity ? this.multiplicity.toString() : "" );
  }
});

ADL.Modifier = ADL.base.extend( {
  init: function( name, value ) {
    this.name = name;
    this.value = value;
  },

	getName: function getName() {
		return this.name;
	},

  toString: function() {
    return "+" + this.name + 
    ( this.value ? "=" + this.value.toString() : "" );
  }
});

ADL.Construct = Class.extend( {
  init: function(type, name, value, annotations, supers, modifiers, children){
    this.type        = type;
    this.name        = name;
    this.value       = value       || null;
    this.annotations = annotations || new Array();
    this.supers      = supers      || new Array();
    this.children    = children    || new Array();
    this.modifiers   = new Hash();
		if( modifiers ) {
			modifiers.iterate( function(modifier) {
				this.addModifier(modifier);
			}.scope(this) );
		}
  },

	getType: function getType() {
		return this.type;
	},
	
	getName: function getName() {
		return this.name;
	},
	
	setName: function setName(name) {
		this.name = name
	},
	
	getValue: function getValue() {
		return this.value;
	},
	
	setValue: function setValue(value) {
		if( ! ( value instanceof ADL.Value ) ) { value = new ADL.Value(value); }
		this.value = value;
	},
	
	getAnnotations: function getAnnotations() {
		return this.annotations;
	},
	
	addAnnotation: function addAnnotation(annotation) {
		if( ! ( annotation instanceof ADL.Annotation ) ) {
			annotation = new ADL.Annotation(annotation);
		}
		this.annotations.push(annotation);
		return this;
	},
	
	getSupers: function getSupers() {
		return this.supers;
	},
	
	addSuper: function addSuper(zuper) {
		this.supers.push(zuper);
		return this;
	},
	
	getModifiers: function getModifiers() {
		return this.modifiers.values();
	},
	
	getModifier: function getModifier(name) {
		return this.modifiers.get(name);
	},
	
	addModifier: function addModifier(modifier, value) {
		if( ! ( modifier instanceof ADL.Modifier ) ) {
			modifier = new ADL.Modifier(modifier, value);
		}
		this.modifiers.set(modifier.getName(), modifier);
	},

	getChildren: function getChildren() {
		return this.children;
	},
	
	addChild: function addChild(child) {
		this.children.push(child);
		return this;
	},

  toString: function(ident) {
    ident = ident || "";

    var annotations = new Array();
    this.annotations.iterate(function(value) { 
      annotations.push( value.toString() ); 
    });

    var modifiers = new Array();
    this.modifiers.iterate(function(key, value) { 
      modifiers.push( value.toString() ); 
    });

    var children = new Array();
    this.children.iterate( function(item) { 
      children.push( item.toString("  " + ident) ); 
    });

		return ( annotations.length > 0 ? 
			ident + annotations.join("\n" + ident) + "\n" : "" ) 
			+ ident + this.type 
			+ " " + this.name
			+ ( this.supers.length > 0 ? " : " + this.supers.join(" : ") : "" )
			+ ( modifiers.length  > 0 ? " "   + modifiers.join(" ") : "" )
			+ ( this.value ? this.value.toString() : "" )
			+ ( children.length > 0 ? 
				" {" + "\n" + children.join( "\n") + "\n" + ident + "}" : ";" );
  },

  accept: function( visitor, data ) {
    return visitor.visit(this, data);
  },

  childrenAccept: function( visitor, data ) {
    this.children.iterate(function(child) { visitor.visit(child, data); } );
    return data;
  }
} );

ADL.include = function( file ) {
  var adl = new ProtoJS.Ajax().fetch( file.value + ".adl" );
  return new ADL.Parser().parse(adl).getRoot().getChildren();
}

ADL.AST = Class.extend( {
  init: function(children) {
	  this.root = 
			new ADL.Construct( "", "root", null, null, null, null, children );
  },

  getRoot: function() {
    return this.root;
  }
});

ADL.ast = null;

ADL.Parser = Class.extend( {
  parse: function( src ) {
    var error_cnt = 0;
    var error_off = new Array();
    var error_la  = new Array();

    ADL.ast = null;

    try {
      if( ( error_cnt = __parse( src, error_off, error_la ) ) > 0 ) {
        var i;
        var errors = "";
        for( i = 0; i < error_cnt; i++ ) {
          errors += "Parse error: " + src.substr( error_off[i], 30 ) + 
          ". Expecting \"" + error_la[i].join() + "\n";
        }
        this.errors = errors;
        return null;
      }
    } catch(e) {
      this.errors = "Semantic error: " + e;
      return null;
    }
    this.errors = "";
    return ADL.ast;
  }
});

function makeList() {
  var ar = new Array();
  if( arguments ) {
    for( var v=0; v<arguments.length; v++ ) {
      if( !Object.isUndefined(arguments[v]) && arguments[v].isArray() ) {
        for( var vv=0; vv<arguments[v].length; vv++ ) {
          if( arguments[v][vv] ) { 
            ar.push(arguments[v][vv]); 
          }
        }
      } else {
        if( arguments[v] ) { ar.push(arguments[v]); }
      }
    }
  }

  return ar;
}


/*
	Default template driver for JS/CC generated parsers running as
	browser-based JavaScript/ECMAScript applications.
	
	WARNING: 	This parser template will not run as console and has lesser
				features for debugging than the console derivates for the
				various JavaScript platforms.
	
	Features:
	- Parser trace messages
	- Integrated panic-mode error recovery
	
	Written 2007, 2008 by Jan Max Meyer, J.M.K S.F. Software Technologies
	
	This is in the public domain.
*/

var _dbg_withtrace		= false;
var _dbg_string			= new String();

function __dbg_print( text )
{
	_dbg_string += text + "\n";
}

function __lex( info )
{
	var state		= 0;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos			= info.offset + 1;

	do
	{
		pos--;
		state = 0;
		match = -2;
		start = pos;

		if( info.src.length <= start )
			return 49;

		do
		{

switch( state )
{
	case 0:
		if( ( info.src.charCodeAt( pos ) >= 9 && info.src.charCodeAt( pos ) <= 10 ) || info.src.charCodeAt( pos ) == 13 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 40 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 41 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 4;
		else if( info.src.charCodeAt( pos ) == 43 ) state = 5;
		else if( info.src.charCodeAt( pos ) == 44 ) state = 6;
		else if( info.src.charCodeAt( pos ) == 45 ) state = 7;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 8;
		else if( info.src.charCodeAt( pos ) == 47 ) state = 9;
		else if( info.src.charCodeAt( pos ) == 48 ) state = 10;
		else if( info.src.charCodeAt( pos ) == 58 ) state = 11;
		else if( info.src.charCodeAt( pos ) == 59 ) state = 12;
		else if( info.src.charCodeAt( pos ) == 60 ) state = 13;
		else if( info.src.charCodeAt( pos ) == 61 ) state = 14;
		else if( info.src.charCodeAt( pos ) == 62 ) state = 15;
		else if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 101 ) || ( info.src.charCodeAt( pos ) >= 103 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 91 ) state = 17;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 18;
		else if( info.src.charCodeAt( pos ) == 123 ) state = 19;
		else if( info.src.charCodeAt( pos ) == 124 ) state = 20;
		else if( info.src.charCodeAt( pos ) == 125 ) state = 21;
		else if( info.src.charCodeAt( pos ) == 33 ) state = 30;
		else if( ( info.src.charCodeAt( pos ) >= 49 && info.src.charCodeAt( pos ) <= 57 ) ) state = 31;
		else if( info.src.charCodeAt( pos ) == 34 ) state = 33;
		else if( info.src.charCodeAt( pos ) == 35 ) state = 34;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 47;
		else if( info.src.charCodeAt( pos ) == 102 ) state = 49;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 22;
		match_pos = pos;
		break;

	case 5:
		if( info.src.charCodeAt( pos ) == 48 ) state = 10;
		else if( ( info.src.charCodeAt( pos ) >= 49 && info.src.charCodeAt( pos ) <= 57 ) ) state = 31;
		else state = -1;
		match = 17;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 16;
		match_pos = pos;
		break;

	case 7:
		if( info.src.charCodeAt( pos ) == 48 ) state = 10;
		else if( ( info.src.charCodeAt( pos ) >= 49 && info.src.charCodeAt( pos ) <= 57 ) ) state = 31;
		else state = -1;
		match = 18;
		match_pos = pos;
		break;

	case 8:
		if( info.src.charCodeAt( pos ) == 46 ) state = 24;
		else state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 9:
		if( info.src.charCodeAt( pos ) == 42 ) state = 36;
		else if( info.src.charCodeAt( pos ) == 47 ) state = 37;
		else state = -1;
		match = 23;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 11:
		if( info.src.charCodeAt( pos ) == 58 ) state = 25;
		else state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 12:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 13:
		if( info.src.charCodeAt( pos ) == 61 ) state = 26;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 14:
		state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 15:
		state = -1;
		match = 27;
		match_pos = pos;
		break;

	case 16:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 17:
		if( info.src.charCodeAt( pos ) == 64 ) state = 38;
		else state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 18:
		state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 19:
		state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 20:
		state = -1;
		match = 24;
		match_pos = pos;
		break;

	case 21:
		state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 22:
		state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 23:
		state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 24:
		state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 25:
		state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 26:
		state = -1;
		match = 21;
		match_pos = pos;
		break;

	case 27:
		state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 28:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 29:
		state = -1;
		match = 28;
		match_pos = pos;
		break;

	case 30:
		if( info.src.charCodeAt( pos ) == 61 ) state = 22;
		else state = -1;
		break;

	case 31:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 31;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 32:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 28;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 33:
		if( info.src.charCodeAt( pos ) == 34 ) state = 23;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 33 ) || ( info.src.charCodeAt( pos ) >= 35 && info.src.charCodeAt( pos ) <= 254 ) ) state = 33;
		else state = -1;
		break;

	case 34:
		if( info.src.charCodeAt( pos ) == 105 ) state = 35;
		else state = -1;
		break;

	case 35:
		if( info.src.charCodeAt( pos ) == 110 ) state = 39;
		else state = -1;
		break;

	case 36:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 254 ) ) state = 36;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 40;
		else state = -1;
		break;

	case 37:
		if( info.src.charCodeAt( pos ) == 10 ) state = 1;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 9 ) || ( info.src.charCodeAt( pos ) >= 11 && info.src.charCodeAt( pos ) <= 254 ) ) state = 37;
		else state = -1;
		break;

	case 38:
		if( info.src.charCodeAt( pos ) == 93 ) state = 27;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 92 ) || ( info.src.charCodeAt( pos ) >= 94 && info.src.charCodeAt( pos ) <= 254 ) ) state = 38;
		else state = -1;
		break;

	case 39:
		if( info.src.charCodeAt( pos ) == 99 ) state = 41;
		else state = -1;
		break;

	case 40:
		if( info.src.charCodeAt( pos ) == 47 ) state = 1;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 254 ) ) state = 36;
		else if( info.src.charCodeAt( pos ) == 42 ) state = 40;
		else state = -1;
		break;

	case 41:
		if( info.src.charCodeAt( pos ) == 108 ) state = 42;
		else state = -1;
		break;

	case 42:
		if( info.src.charCodeAt( pos ) == 117 ) state = 43;
		else state = -1;
		break;

	case 43:
		if( info.src.charCodeAt( pos ) == 100 ) state = 44;
		else state = -1;
		break;

	case 44:
		if( info.src.charCodeAt( pos ) == 101 ) state = 29;
		else state = -1;
		break;

	case 45:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 117 ) state = 32;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 46:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 32;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 47:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 45;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 48:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 108 ) state = 46;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 49:
		if( ( info.src.charCodeAt( pos ) >= 45 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 97 ) state = 48;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( 1 > -1 && match == 1 );

	if( match > -1 )
	{
		info.att = info.src.substr( start, match_pos - start );
		info.offset = match_pos;
		
switch( match )
{
	case 2:
		{
		 info.att = new ADL.Boolean( info.att ); 
		}
		break;

	case 3:
		{
		 info.att = new ADL.Integer( info.att ); 
		}
		break;

	case 4:
		{
		 info.att = new ADL.String( info.att.substr( 1, info.att.length - 2 ) ); 
		}
		break;

	case 5:
		{
		 info.att = new ADL.Annotation(info.att.substr(2, info.att.length - 3)); 
		}
		break;

}


	}
	else
	{
		info.att = new String();
		match = -1;
	}

	return match;
}


function __parse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		act;
	var		go;
	var		la;
	var		rval;
	var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
	var		info			= new parseinfo();
	
/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* Program' */, 1 ),
	new Array( 31/* Program */, 1 ),
	new Array( 30/* Statements */, 2 ),
	new Array( 30/* Statements */, 0 ),
	new Array( 32/* Statement */, 1 ),
	new Array( 32/* Statement */, 1 ),
	new Array( 33/* Construct */, 8 ),
	new Array( 34/* Directive */, 2 ),
	new Array( 35/* Annotations */, 2 ),
	new Array( 35/* Annotations */, 0 ),
	new Array( 43/* Generic */, 3 ),
	new Array( 44/* GenericArgument */, 1 ),
	new Array( 42/* GenericArguments */, 3 ),
	new Array( 42/* GenericArguments */, 1 ),
	new Array( 42/* GenericArguments */, 0 ),
	new Array( 38/* Name */, 1 ),
	new Array( 38/* Name */, 2 ),
	new Array( 37/* Type */, 1 ),
	new Array( 37/* Type */, 2 ),
	new Array( 39/* Supers */, 2 ),
	new Array( 39/* Supers */, 0 ),
	new Array( 45/* Super */, 3 ),
	new Array( 46/* Multiplicity */, 3 ),
	new Array( 46/* Multiplicity */, 5 ),
	new Array( 46/* Multiplicity */, 0 ),
	new Array( 36/* Modifiers */, 2 ),
	new Array( 36/* Modifiers */, 0 ),
	new Array( 47/* Modifier */, 2 ),
	new Array( 47/* Modifier */, 4 ),
	new Array( 40/* Value */, 2 ),
	new Array( 40/* Value */, 0 ),
	new Array( 48/* Constant */, 1 ),
	new Array( 48/* Constant */, 1 ),
	new Array( 48/* Constant */, 1 ),
	new Array( 41/* Children */, 3 ),
	new Array( 41/* Children */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 49/* "$" */,-3 , 28/* "IncludeDirective" */,-3 , 29/* "Identifier" */,-3 , 5/* "Annotation" */,-3 , 17/* "+" */,-3 ),
	/* State 1 */ new Array( 49/* "$" */,0 ),
	/* State 2 */ new Array( 28/* "IncludeDirective" */,7 , 49/* "$" */,-1 , 17/* "+" */,-9 , 29/* "Identifier" */,-9 , 5/* "Annotation" */,-9 ),
	/* State 3 */ new Array( 49/* "$" */,-2 , 28/* "IncludeDirective" */,-2 , 29/* "Identifier" */,-2 , 5/* "Annotation" */,-2 , 17/* "+" */,-2 , 9/* "}" */,-2 ),
	/* State 4 */ new Array( 49/* "$" */,-4 , 28/* "IncludeDirective" */,-4 , 29/* "Identifier" */,-4 , 5/* "Annotation" */,-4 , 17/* "+" */,-4 , 9/* "}" */,-4 ),
	/* State 5 */ new Array( 49/* "$" */,-5 , 28/* "IncludeDirective" */,-5 , 29/* "Identifier" */,-5 , 5/* "Annotation" */,-5 , 17/* "+" */,-5 , 9/* "}" */,-5 ),
	/* State 6 */ new Array( 5/* "Annotation" */,8 , 29/* "Identifier" */,-26 , 17/* "+" */,-26 ),
	/* State 7 */ new Array( 4/* "String" */,10 ),
	/* State 8 */ new Array( 17/* "+" */,-8 , 29/* "Identifier" */,-8 , 5/* "Annotation" */,-8 ),
	/* State 9 */ new Array( 29/* "Identifier" */,13 , 17/* "+" */,14 ),
	/* State 10 */ new Array( 49/* "$" */,-7 , 28/* "IncludeDirective" */,-7 , 29/* "Identifier" */,-7 , 5/* "Annotation" */,-7 , 17/* "+" */,-7 , 9/* "}" */,-7 ),
	/* State 11 */ new Array( 29/* "Identifier" */,-25 , 17/* "+" */,-25 , 21/* "<=" */,-25 , 8/* "{" */,-25 , 12/* ";" */,-25 ),
	/* State 12 */ new Array( 29/* "Identifier" */,16 ),
	/* State 13 */ new Array( 26/* "<" */,18 , 29/* "Identifier" */,-17 , 10/* "[" */,-17 , 17/* "+" */,-17 , 21/* "<=" */,-17 , 8/* "{" */,-17 , 12/* ";" */,-17 , 13/* ":" */,-17 ),
	/* State 14 */ new Array( 29/* "Identifier" */,19 ),
	/* State 15 */ new Array( 17/* "+" */,-20 , 21/* "<=" */,-20 , 8/* "{" */,-20 , 12/* ";" */,-20 , 13/* ":" */,-20 ),
	/* State 16 */ new Array( 26/* "<" */,18 , 13/* ":" */,-15 , 17/* "+" */,-15 , 21/* "<=" */,-15 , 8/* "{" */,-15 , 12/* ";" */,-15 ),
	/* State 17 */ new Array( 29/* "Identifier" */,-18 , 10/* "[" */,-18 , 17/* "+" */,-18 , 21/* "<=" */,-18 , 8/* "{" */,-18 , 12/* ";" */,-18 , 13/* ":" */,-18 ),
	/* State 18 */ new Array( 29/* "Identifier" */,24 , 27/* ">" */,-14 , 16/* "," */,-14 ),
	/* State 19 */ new Array( 19/* "=" */,25 , 29/* "Identifier" */,-27 , 17/* "+" */,-27 , 21/* "<=" */,-27 , 8/* "{" */,-27 , 12/* ";" */,-27 ),
	/* State 20 */ new Array( 13/* ":" */,28 , 21/* "<=" */,-26 , 8/* "{" */,-26 , 12/* ";" */,-26 , 17/* "+" */,-26 ),
	/* State 21 */ new Array( 13/* ":" */,-16 , 17/* "+" */,-16 , 21/* "<=" */,-16 , 8/* "{" */,-16 , 12/* ";" */,-16 ),
	/* State 22 */ new Array( 16/* "," */,29 , 27/* ">" */,30 ),
	/* State 23 */ new Array( 27/* ">" */,-13 , 16/* "," */,-13 ),
	/* State 24 */ new Array( 27/* ">" */,-11 , 16/* "," */,-11 ),
	/* State 25 */ new Array( 4/* "String" */,32 , 3/* "Integer" */,33 , 2/* "Boolean" */,34 ),
	/* State 26 */ new Array( 17/* "+" */,-19 , 21/* "<=" */,-19 , 8/* "{" */,-19 , 12/* ";" */,-19 , 13/* ":" */,-19 ),
	/* State 27 */ new Array( 21/* "<=" */,36 , 17/* "+" */,14 , 8/* "{" */,-30 , 12/* ";" */,-30 ),
	/* State 28 */ new Array( 29/* "Identifier" */,13 ),
	/* State 29 */ new Array( 29/* "Identifier" */,24 ),
	/* State 30 */ new Array( 29/* "Identifier" */,-10 , 13/* ":" */,-10 , 17/* "+" */,-10 , 21/* "<=" */,-10 , 8/* "{" */,-10 , 12/* ";" */,-10 , 10/* "[" */,-10 ),
	/* State 31 */ new Array( 29/* "Identifier" */,-28 , 17/* "+" */,-28 , 21/* "<=" */,-28 , 8/* "{" */,-28 , 12/* ";" */,-28 ),
	/* State 32 */ new Array( 29/* "Identifier" */,-31 , 17/* "+" */,-31 , 21/* "<=" */,-31 , 8/* "{" */,-31 , 12/* ";" */,-31 ),
	/* State 33 */ new Array( 29/* "Identifier" */,-32 , 17/* "+" */,-32 , 21/* "<=" */,-32 , 8/* "{" */,-32 , 12/* ";" */,-32 ),
	/* State 34 */ new Array( 29/* "Identifier" */,-33 , 17/* "+" */,-33 , 21/* "<=" */,-33 , 8/* "{" */,-33 , 12/* ";" */,-33 ),
	/* State 35 */ new Array( 8/* "{" */,40 , 12/* ";" */,41 ),
	/* State 36 */ new Array( 4/* "String" */,32 , 3/* "Integer" */,33 , 2/* "Boolean" */,34 ),
	/* State 37 */ new Array( 10/* "[" */,44 , 17/* "+" */,-24 , 21/* "<=" */,-24 , 8/* "{" */,-24 , 12/* ";" */,-24 , 13/* ":" */,-24 ),
	/* State 38 */ new Array( 27/* ">" */,-12 , 16/* "," */,-12 ),
	/* State 39 */ new Array( 49/* "$" */,-6 , 28/* "IncludeDirective" */,-6 , 29/* "Identifier" */,-6 , 5/* "Annotation" */,-6 , 17/* "+" */,-6 , 9/* "}" */,-6 ),
	/* State 40 */ new Array( 9/* "}" */,-3 , 28/* "IncludeDirective" */,-3 , 29/* "Identifier" */,-3 , 5/* "Annotation" */,-3 , 17/* "+" */,-3 ),
	/* State 41 */ new Array( 49/* "$" */,-35 , 28/* "IncludeDirective" */,-35 , 29/* "Identifier" */,-35 , 5/* "Annotation" */,-35 , 17/* "+" */,-35 , 9/* "}" */,-35 ),
	/* State 42 */ new Array( 8/* "{" */,-29 , 12/* ";" */,-29 ),
	/* State 43 */ new Array( 17/* "+" */,-21 , 21/* "<=" */,-21 , 8/* "{" */,-21 , 12/* ";" */,-21 , 13/* ":" */,-21 ),
	/* State 44 */ new Array( 3/* "Integer" */,46 ),
	/* State 45 */ new Array( 9/* "}" */,47 , 28/* "IncludeDirective" */,7 , 17/* "+" */,-9 , 29/* "Identifier" */,-9 , 5/* "Annotation" */,-9 ),
	/* State 46 */ new Array( 11/* "]" */,48 , 25/* ".." */,49 ),
	/* State 47 */ new Array( 49/* "$" */,-34 , 28/* "IncludeDirective" */,-34 , 29/* "Identifier" */,-34 , 5/* "Annotation" */,-34 , 17/* "+" */,-34 , 9/* "}" */,-34 ),
	/* State 48 */ new Array( 17/* "+" */,-22 , 21/* "<=" */,-22 , 8/* "{" */,-22 , 12/* ";" */,-22 , 13/* ":" */,-22 ),
	/* State 49 */ new Array( 3/* "Integer" */,50 ),
	/* State 50 */ new Array( 11/* "]" */,51 ),
	/* State 51 */ new Array( 17/* "+" */,-23 , 21/* "<=" */,-23 , 8/* "{" */,-23 , 12/* ";" */,-23 , 13/* ":" */,-23 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 31/* Program */,1 , 30/* Statements */,2 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array( 32/* Statement */,3 , 33/* Construct */,4 , 34/* Directive */,5 , 35/* Annotations */,6 ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array( 36/* Modifiers */,9 ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array(  ),
	/* State 9 */ new Array( 47/* Modifier */,11 , 37/* Type */,12 ),
	/* State 10 */ new Array(  ),
	/* State 11 */ new Array(  ),
	/* State 12 */ new Array( 38/* Name */,15 ),
	/* State 13 */ new Array( 43/* Generic */,17 ),
	/* State 14 */ new Array(  ),
	/* State 15 */ new Array( 39/* Supers */,20 ),
	/* State 16 */ new Array( 43/* Generic */,21 ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array( 42/* GenericArguments */,22 , 44/* GenericArgument */,23 ),
	/* State 19 */ new Array(  ),
	/* State 20 */ new Array( 45/* Super */,26 , 36/* Modifiers */,27 ),
	/* State 21 */ new Array(  ),
	/* State 22 */ new Array(  ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  ),
	/* State 25 */ new Array( 48/* Constant */,31 ),
	/* State 26 */ new Array(  ),
	/* State 27 */ new Array( 47/* Modifier */,11 , 40/* Value */,35 ),
	/* State 28 */ new Array( 37/* Type */,37 ),
	/* State 29 */ new Array( 44/* GenericArgument */,38 ),
	/* State 30 */ new Array(  ),
	/* State 31 */ new Array(  ),
	/* State 32 */ new Array(  ),
	/* State 33 */ new Array(  ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array( 41/* Children */,39 ),
	/* State 36 */ new Array( 48/* Constant */,42 ),
	/* State 37 */ new Array( 46/* Multiplicity */,43 ),
	/* State 38 */ new Array(  ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array( 30/* Statements */,45 ),
	/* State 41 */ new Array(  ),
	/* State 42 */ new Array(  ),
	/* State 43 */ new Array(  ),
	/* State 44 */ new Array(  ),
	/* State 45 */ new Array( 32/* Statement */,3 , 33/* Construct */,4 , 34/* Directive */,5 , 35/* Annotations */,6 ),
	/* State 46 */ new Array(  ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array(  ),
	/* State 49 */ new Array(  ),
	/* State 50 */ new Array(  ),
	/* State 51 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"Program'" /* Non-terminal symbol */,
	"WHITESPACE" /* Terminal symbol */,
	"Boolean" /* Terminal symbol */,
	"Integer" /* Terminal symbol */,
	"String" /* Terminal symbol */,
	"Annotation" /* Terminal symbol */,
	"(" /* Terminal symbol */,
	")" /* Terminal symbol */,
	"{" /* Terminal symbol */,
	"}" /* Terminal symbol */,
	"[" /* Terminal symbol */,
	"]" /* Terminal symbol */,
	";" /* Terminal symbol */,
	":" /* Terminal symbol */,
	"::" /* Terminal symbol */,
	"." /* Terminal symbol */,
	"," /* Terminal symbol */,
	"+" /* Terminal symbol */,
	"-" /* Terminal symbol */,
	"=" /* Terminal symbol */,
	"!=" /* Terminal symbol */,
	"<=" /* Terminal symbol */,
	"*" /* Terminal symbol */,
	"/" /* Terminal symbol */,
	"|" /* Terminal symbol */,
	".." /* Terminal symbol */,
	"<" /* Terminal symbol */,
	">" /* Terminal symbol */,
	"IncludeDirective" /* Terminal symbol */,
	"Identifier" /* Terminal symbol */,
	"Statements" /* Non-terminal symbol */,
	"Program" /* Non-terminal symbol */,
	"Statement" /* Non-terminal symbol */,
	"Construct" /* Non-terminal symbol */,
	"Directive" /* Non-terminal symbol */,
	"Annotations" /* Non-terminal symbol */,
	"Modifiers" /* Non-terminal symbol */,
	"Type" /* Non-terminal symbol */,
	"Name" /* Non-terminal symbol */,
	"Supers" /* Non-terminal symbol */,
	"Value" /* Non-terminal symbol */,
	"Children" /* Non-terminal symbol */,
	"GenericArguments" /* Non-terminal symbol */,
	"Generic" /* Non-terminal symbol */,
	"GenericArgument" /* Non-terminal symbol */,
	"Super" /* Non-terminal symbol */,
	"Multiplicity" /* Non-terminal symbol */,
	"Modifier" /* Non-terminal symbol */,
	"Constant" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __lex( info );

	while( true )
	{
		act = 53;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == la )
			{
				act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}

		if( _dbg_withtrace && sstack.length > 0 )
		{
			__dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 53 )
		{
			if( _dbg_withtrace )
				__dbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
			err_cnt++;
			err_off.push( info.offset - info.att.length );			
			err_la.push( new Array() );
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
				err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
			
			//Remember the original stack!
			var rsstack = new Array();
			var rvstack = new Array();
			for( var i = 0; i < sstack.length; i++ )
			{
				rsstack[i] = sstack[i];
				rvstack[i] = vstack[i];
			}
			
			while( act == 53 && la != 49 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 53 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 53;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 53 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __lex( info );
			}
			
			if( act == 53 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( _dbg_withtrace )
				__dbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 53 )
			break;
		*/
		
		
		//Shift
		if( act > 0 )
		{			
			if( _dbg_withtrace )
				__dbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __lex( info );
			
			if( _dbg_withtrace )
				__dbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( _dbg_withtrace )
				__dbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
			if( _dbg_withtrace )
				__dbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		 ADL.ast = new ADL.AST(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 2:
	{
		 rval = makeList( vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 3:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 4:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 5:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 6:
	{
		 rval = new ADL.Construct( vstack[ vstack.length - 6 ], vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ], vstack[ vstack.length - 8 ], vstack[ vstack.length - 4 ], makeList( vstack[ vstack.length - 7 ], vstack[ vstack.length - 3 ]), vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 7:
	{
		 rval = ADL.include( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 8:
	{
		 rval = makeList( vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 9:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 10:
	{
		
  if( vstack[ vstack.length - 2 ] ) {
    rval = vstack[ vstack.length - 3 ] + vstack[ vstack.length - 2 ].join(",") + vstack[ vstack.length - 1 ] 
  } else {
    throw( "Missing GenericArguments" );
  }

	}
	break;
	case 11:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 12:
	{
		 rval = makeList( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ) 
	}
	break;
	case 13:
	{
		 rval = makeList( vstack[ vstack.length - 1 ] ) 
	}
	break;
	case 14:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 15:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 16:
	{
		 rval = vstack[ vstack.length - 2 ]+vstack[ vstack.length - 1 ] 
	}
	break;
	case 17:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 18:
	{
		 rval = vstack[ vstack.length - 2 ]+vstack[ vstack.length - 1 ] 
	}
	break;
	case 19:
	{
		 rval = makeList( vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 20:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 21:
	{
		 rval = new ADL.Reference( vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 22:
	{
		 rval = new ADL.Multiplicity( vstack[ vstack.length - 2 ] );  
	}
	break;
	case 23:
	{
		 rval = new ADL.Multiplicity( vstack[ vstack.length - 4 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 24:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 25:
	{
		 rval = makeList( vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 26:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 27:
	{
		 rval = new ADL.Modifier( vstack[ vstack.length - 1 ] );     
	}
	break;
	case 28:
	{
		 rval = new ADL.Modifier( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 29:
	{
		 rval = new ADL.Value( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 30:
	{
		rval = vstack[ vstack.length - 0 ];
	}
	break;
	case 31:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 32:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 33:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 34:
	{
		 rval = vstack[ vstack.length - 2 ];   
	}
	break;
	case 35:
	{
		 rval = null; 
	}
	break;
}



			if( _dbg_withtrace )
				__dbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				sstack.pop();
				vstack.pop();
			}
									
			go = -1;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					go = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			if( act == 0 )
				break;
				
			if( _dbg_withtrace )
				__dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
		
		if( _dbg_withtrace )
		{		
			alert( _dbg_string );
			_dbg_string = new String();
		}
	}

	if( _dbg_withtrace )
	{
		__dbg_print( "\nParse complete." );
		alert( _dbg_string );
	}
	
	return err_cnt;
}




ADL.version = "0.5";

