if( ! window.Node ) {
    window.Node = {};
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

// IE misses indexOf ... and so do we ;-)
if( !Array.indexOf ) {
  Array.prototype.indexOf = function(obj){
    for(var i=0; i<this.length; i++){
      if(this[i]==obj){
        return i;
      }
    }
    return -1;
  };
}
var ProtoJS = {
  Browser: {
    IE:     !!(window.attachEvent &&
      navigator.userAgent.indexOf('Opera') === -1),
    Opera:  navigator.userAgent.indexOf('Opera') > -1,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 &&
      navigator.userAgent.indexOf('KHTML') === -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
  }
};

if( typeof console == "undefined" ) {
  console = { log: function() {} };
}
ProtoJS.mix = function(something, into, replace) {
  replace = replace || false;
  for( var key in something ) {
    if( replace || !into[key] ) {
      into[key] = something[key];
    } else {
      console.log( "ProtoJS: Found an implementation for " + key );
    }
  }
};
// this is a very minimalistic first stab
ProtoJS.Event = {
  observe: function(element, eventName, handler) {
    if(!element) { 
      console.log( "WARN: passed invalid element to ProtoJS.Event.observe." );
    } else {
      if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
      } else {
        element.attachEvent("on" + eventName, handler);
      }
    }
    return element;
  },

  enable: function enable( clazz ) {
    ProtoJS.mix( ProtoJS.Event.Handling, clazz );
  }
};

ProtoJS.Event.Handling = {
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
ProtoJS.Object = {
  isUndefined: function(object) {
      return typeof object == "undefined";
  }
};

ProtoJS.mix( ProtoJS.Object, Object );
ProtoJS.String = {
  contains : function contains( needle ) {
    return this.indexOf( needle ) > -1;
  },

  containsOneOf: function containsOneOf( needles ) {
    var result = false;
    needles.iterate( function( needle ) {
      result = result || this.contains( needle );
    }.scope(this) );
    return result;
  },

  trim : function trim( value ) {
    if( typeof this.replace == "function" ) { value = this; }
    return value.replace(/^\s*/, "").replace(/\s*$/, "");
  },

  isArray   : function isArray()    { return false; },
  isHash    : function isHash()     { return false; },
  isFunction: function isFunction() { return false; },
  isString  : function isString()   { return true;  },
  isNumber  : function isNumber()   { return false; },
  isClass   : function isClass()    { return false; }
};

ProtoJS.mix( ProtoJS.String, String.prototype );
ProtoJS.Number = {
    isArray   : function() { return false; },
    isHash    : function() { return false; },
    isFunction: function() { return false; },
    isString  : function() { return false; },
    isNumber  : function() { return true;  },
    isClass   : function() { return false; },

    toHex     : function() {
      number = this.valueOf() < 0 ? 
        0xFFFFFFFF + this.valueOf() + 1 : this.valueOf();
      return number.toString(16).toUpperCase();
    }
};

ProtoJS.mix( ProtoJS.Number, Number.prototype );
// from http://ejohn.org/blog/simple-javascript-inheritance/
// Inspired by base2 and Prototype
(function(){
  var initializing = false, 
  fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    /* 
    Instantiate a base class (but only create the instance,
    don't run the init constructor)
    */
    initializing = true;
    var prototype = new this();
    initializing = false;

    // A function to create a wrapped inherited method
    function _make_wrapped_method(name, fn) {
      return function() {
        var tmp = this._super;

        // Add a new ._super() method that is the same method
        // but on the super-class
        this._super = _super[name];

        // The method only need to be bound temporarily, so we
        // remove it when we're done executing
        var ret = fn.apply(this, arguments);
        this._super = tmp;

        return ret;
      };
    }

    // implement our type tests at Class-instance level
    prototype.isArray    = function() { return false; };
    prototype.isHash     = function() { return false; };
    prototype.isNumber   = function() { return false; };
    prototype.isString   = function() { return false; };
    prototype.isFunction = function() { return false; };

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
      typeof _super[name] == "function" && fnTest.test(prop[name]) ?
      _make_wrapped_method( name, prop[name] ) : prop[name];
    }

    // toString doesn't show up in the iterated properties in JScript
    // see: https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
    // quick fix: explicitly test for it
    if( ProtoJS.Browser.IE && prop.toString ) {
      prototype.toString =
      _make_wrapped_method( "toString", prop.toString);
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init ) {
        this.init.apply(this, arguments);
      }
    }

    // we're always a class, except for Hashes
    if( ! prototype.isHash() ) {
      prototype.isClass    = function() { return true;  };
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    // implement our type tests at Class level
    Class.isArray    = function() { return false; };
    Class.isHash     = function() { return false; };
    Class.isNumber   = function() { return false; };
    Class.isString   = function() { return false; };
    Class.isFunction = function() { return false; };
    Class.isClass    = function() { return true;  };

    return Class;
  };

  // provide a way to add extended functionality to
  Class.extendMethod  = function( clazz, method, extension, before ) {
    var originalMethod = clazz.prototype[method];
    clazz.prototype[method] = function() {
      if( before ) { extension.apply(this, arguments); }
      originalMethod.apply(this, arguments);
      if( ! before ) { extension.apply(this, arguments); }
    };
  };
}
)();
function $A(object) {
  var length = object.length || 0;
  var results = new Array(length);
  while (length--) { results[length] = object[length]; }
  return results;
}

ProtoJS.Array =  {
  compare: function(other) {
    if (this.length != other.length) { return false; }
    for (var i = 0; i < other.length; i++) {
      if (this[i].compare) { 
        if (!this[i].compare(other[i])) { return false; }
      }
      if (this[i] !== other[i]) { return false; }
    }
    return true;
  },

  has: function(needle) {
    return this.indexOf(needle) > -1;
  },

  unique: function unique() {
    var old = this.dup();
    this.clear();
    old.iterate( function(item) { 
      if( !this.has(item) ) { this.push(item); }
    }.scope(this) );
    return this;
  },

  iterate: function(handler, context) {
    for(var i=0, length=this.length; i<length; i++ ) {
      handler.call(context, this[i], i);
    }
  },

  dup: function() {
    return [].concat(this);
  },

  clear: function() {
    this.length = 0;
    return this;
  },

  remove: function(array) {
    var needles = array.isArray() ? array : $A(arguments);
    var old = this.dup();
    this.clear();
    old.iterate( function(item) { 
      if( !needles.has(item) ) { this.push(item); }
    }.scope(this) );
    return this;
  },

  min: function min() {
    var minimum = null;
    this.iterate(function(item) {
      if( minimum == null || item < minimum ) { minimum = item; }
    } );
    return minimum;
  },

  max: function max() {
    var maximum = null;
    this.iterate(function(item) {
      if( maximum == null || item > maximum ) { maximum = item; }
    } );
    return maximum;
  },

  isArray   : function() { return true;  },
  isHash    : function() { return false; },
  isFunction: function() { return false; },
  isString  : function() { return false; },
  isNumber  : function() { return false; },
  isClass   : function() { return false; }
};

ProtoJS.mix( ProtoJS.Array, Array.prototype );
var Hash = Class.extend( {
  init: function init(hash) {
    this.hash = hash || {};
  },

  set: function( key, value ) {
    this.hash[key] = value;
  },

  get: function( key ) {
    return this.hash[key];
  },

  keys: function keys() {
    var ks = [];
    this.iterate( function( key, value ) {
      ks.push( key );
    } );
    return ks;
  },

  values: function values() {
    var vals = [];
    this.iterate( function( key, value ) {
      vals.push( value );
    } );
    return vals;
  },

  hasKey: function has(key) {
    return this.keys().has(key);
  },

  hasValue: function has(value) {
    return this.values().has(value);
  },

  iterate: function each(handler, context) {
    for(var key in this.hash ) {
      handler.call(context, key, this.hash[key]);
    }
  },

  isArray   : function() { return false; },
  isHash    : function() { return true;  },
  isFunction: function() { return false; },
  isString  : function() { return false; },
  isNumber  : function() { return false; },
  isClass   : function() { return false; }
} );

var $H = function(hash) { return new Hash(hash); };
ProtoJS.Function = {
  after: function() {
    var method  = this;
    var args    = $A(arguments);
    var timeout = args.shift();
    return window.setTimeout(
      function() { return method.apply(method, args); }, timeout 
    );
  },

  scope: function scope(context) { 
    var method = this;
    return function() { return method.apply( context, arguments ); };
  },

  isArray   : function() { return false; },
  isHash    : function() { return false; },
  isFunction: function() { return true;  },
  isString  : function() { return false; },
  isNumber  : function() { return false; },
  isClass   : function() { return false; }
};

ProtoJS.mix( ProtoJS.Function, Function.prototype );
ProtoJS.Ajax = Class.extend( {
  init: function() {
    this.xmlhttp = null;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      this.xmlhttp=new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // code for IE6, IE5
      this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      alert("Your browser does not support XMLHTTP!");
    }
  },

  fetch: function(url, callback) {
    if( url.substring(0,4) == "http" ) { 
      return this.fetchUsingXDR(url, callback); 
    }
    this.xmlhttp.open("GET", url, typeof callback == "function" );
    if(callback) {
      this.xmlhttp.onreadystatechange = function() {
        callback.call(this, this.xmlhttp);
      }.scope(this);
    }
    this.xmlhttp.send(null);
    return this.xmlhttp.responseText;
  },

  fetchUsingXDR: function(url, callback) {
    ProtoJS.XDR.push(callback);
    var e  = document.createElement("script");
    var op = url.contains('?') ? "&" : "?";
    e.src  = url + op +"f=ProtoJS.XDR[" + (ProtoJS.XDR.length-1) +  "]";
    e.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(e); 
  }
});

// globally available array for storing callback functions 
// for our XDR implementation
ProtoJS.XDR = [];
ProtoJS.Timer = Class.extend( {
  init: function init() {
    this.reset();
  },
  
  start: function start() {
    this.startTime = this.startTime || this.getTime();
    this.stopTime  = null;
    return this;
  },

  stop: function stop() {
    this.stopTime = this.getTime();
    return this;
  },
  
  getTime: function getTime() {
    return new Date().getTime(); 
  },
  
  reset: function reset() {
    this.startTime = null;
  },
  
  getElapsed: function getElapsed() {
    var now = this.getTime();
    return ( this.stopTime || now ) - ( this.startTime || now );
  }
} );
ProtoJS.Font = Class.extend( {
  init: function init(font) {
    this.scale = null;
    this.size  = null;

    var result = font.match("(\\d+)([^\\s/]+)[\\s/]*");
    if( result ) {
      this.size  = result[1];
      this.scale = result[2];
    }
  },

  getSize: function getSize(as) {
    if( this.scale && this.size && ProtoJS.Font.SizeMap[this.scale]) {
      return ProtoJS.Font.SizeMap[this.scale][this.size][as];
    }
    return 0;
  },

  getPxSize : function getPxSize()  { return this.getSize("px");       },
  getPtSize : function getPtSize()  { return this.getSize("pt");       },
  getEmSize : function getEmSize()  { return this.getSize("em");       },
  getPctSize: function getPctSize() { return this.getSize("em") * 100; }
} );

/**
* expand the conversion table to a map
* http://www.reeddesign.co.uk/test/points-pixels.html
* pct = em * 100
*/
ProtoJS.Font.SizeMap = { px : {}, pt: {}, em: {} };

[ 
  { pt:5.5,  px:6,   em:0.375 }, { pt:6,    px:8,   em:0.5   },
  { pt:7,    px:9,   em:0.55  }, { pt:7.5,  px:10,  em:0.625 },
  { pt:8,    px:11,  em:0.7   }, { pt:9,    px:12,  em:0.75  },
  { pt:10,   px:13,  em:0.8   }, { pt:10.5, px:14,  em:0.875 },
  { pt:11,   px:15,  em:0.95  }, { pt:12,   px:16,  em:1     },
  { pt:13,   px:17,  em:1.05  }, { pt:13.5, px:18,  em:1.125 },
  { pt:14,   px:19,  em:1.2   }, { pt:14.5, px:20,  em:1.25  },
  { pt:15,   px:21,  em:1.3   }, { pt:16,   px:22,  em:1.4   },
  { pt:17,   px:23,  em:1.45  }, { pt:18,   px:24,  em:1.5   },
  { pt:20,   px:26,  em:1.6   }, { pt:22,   px:29,  em:1.8   },
  { pt:24,   px:32,  em:2     }, { pt:26,   px:35,  em:2.2   },
  { pt:27,   px:36,  em:2.25  }, { pt:28,   px:37,  em:2.3   },
  { pt:29,   px:38,  em:2.35  }, { pt:30,   px:40,  em:2.45  },
  { pt:32,   px:42,  em:2.55  }, { pt:34,   px:45,  em:2.75  },
  { pt:36,   px:48,  em:3     }
].iterate( function(size) {
  ProtoJS.Font.SizeMap.px[size.px] = size;
  ProtoJS.Font.SizeMap.pt[size.pt] = size;
  ProtoJS.Font.SizeMap.em[size.em] = size;
} );
ProtoJS.Test = Class.extend( {
	init: function init() {
		this.waitingFor = 0;
	},
	
	setTester: function setTester(tester) {
		this.tester = tester;
	},
	
	isReady: function isReady() {
		return this.waitingFor < 1;
	},
	
	assertEqual: function assertEqual( val1, val2, info ) {
    if( val1 == val2 ) {
			this.tester.success( this.currentTestName );
		} else {
      info = info || "";
			this.tester.fail( this.currentTestName, 
                        "  Expected:\n" + val2 + "\n" +
                        "  Got:\n" + val1 + "\n" +
                        "  " + info + "\n" );
    }
	},
	
	assertNotEqual: function assertEqual( val1, val2, info ) {
		if( val1 != val2 ) {
			this.tester.success( this.currentTestName );
		} else {
      info = info || "";
			this.tester.fail( this.currentTestName, 
                        "  Expected:\n" + val2 + "\n" +
                        "  Got:\n" + val1 + "\n" +
                        "  " + info + "\n" );
    }
	},
	
	assertTrue: function assertEqual( val, info ) {
		this.assertEqual( val, true, info );
	},

	assertFalse: function assertEqual( val, info ) {
		this.assertEqual( val, false, info );
	},
	
	assertEqualAfter: function assertEqualAfter( timeout, getValue, val, info ) {
		this.waitingFor++;
		var thisTest = this;
		window.setTimeout( function() {
			thisTest.assertEqual( getValue(), val, info );
			thisTest.waitingFor--;
		}, timeout );
	}

} );

ProtoJS.Test.RunDriver = Class.extend( {
	init : function init() {
		this.units = [];
		this.logDetails = true;
	},

	withoutDetails: function withoutDetails() {
		this.logDetails = false;
		return this;
	},

	log: function log(msg) {
		if( this.logDetails ) { print( msg ); }
	},

	addTestUnit: function addTestUnit( unit ) {
		this.units.push(unit);
		return this;
	},

	start : function start() {
		this.prepare();
		
		this.testNextUnit();

		// wait for all timers to execute before stopping
		if( Envjs.wait ) { Envjs.wait(); }
	},
	
	prepare: function prepare() {
		this.successful       = 0;
		this.failed           = 0;

		this.waitingFor       = 0;

		this.currentUnitIndex = -1;
		this.currentUnit      = null;		
	},
	
	testNextUnit: function testNextUnit() {
		if( this.currentUnit == null || this.currentUnit.isReady() ) {
			if( this.currentUnitIndex < this.units.length - 1 ) {
				this.currentUnitIndex++;
				this.currentUnit = new this.units[this.currentUnitIndex]();
				this.currentUnit.setTester(this);
				this.currentTests = 
					$H(this.units[this.currentUnitIndex].prototype).keys().sort();
				this.currentTestIndex = -1;
				if( this.currentUnit.getScope ) { 
					this.log( "Testing " + this.currentUnit.getScope() );
				}
				this.performNextTest();
				this.testNextUnit();
			} else {
				this.fireEvent( "ready", this );
			}
		} else {
			this.testNextUnit.scope(this).after(10);
		}
	},

	performNextTest: function performNextTest() {
		if( this.currentUnit.isReady() ) {
			if( this.currentTests.length > 0 && 
					this.currentTestIndex < this.currentTests.length ) 
			{
				this.currentTestIndex++;
				var name = this.currentTests[this.currentTestIndex];
				if( name && name.match(/^test/) ) {
					this.log( "- " + name );
					this.currentUnit.currentTestName = name;
					if( this.currentUnit.before ) { this.currentUnit.before(); }
					this.currentUnit[name].scope(this.currentUnit)();
					if( this.currentUnit.after ) { this.currentUnit.after(); }
				}
				// recursively go to next test
				this.performNextTest();
			} else {
				// done, will be picked up by unit loop
			}
		} else {
			this.performNextTest.scope(this).after(10);
		}
	},

	success : function success( name ) {
		this.successful++;
	},

	fail : function fail( name, info ) {
		this.failed++;
		this.log( "FAIL: " + name + "\n" + info );
	},
	
	getResults: function getResults() {
		return { 
			total     : this.failed + this.successful, 
			failed    : this.failed, 
			successful: this.successful
		};
	},

	test : function test( fnc ) {
		this.testFunction = fnc;
		this.prepare();
		return this;
	},

	using : function using( set ) {
		if( !this.testFunction ) {
			print( "Please provide a function to test first..." );
			return;
		}
		set.iterate(function(test) {
			var outcome = this.testFunction( test.data, test.msg, test.result );
      var expected = typeof test.expected == "boolean" ?
        test.expected : true;
			if( outcome.result === expected ) {
				this.success(test.name);
			} else {
			  this.fail(test.name, outcome.info);
		  }
		}.scope(this) );
		return this;
	}
} );

ProtoJS.Event.enable( ProtoJS.Test.RunDriver.prototype );
ProtoJS.Test.Runner = new ProtoJS.Test.RunDriver();

ProtoJS.version = "0.3-6";

