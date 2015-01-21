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
