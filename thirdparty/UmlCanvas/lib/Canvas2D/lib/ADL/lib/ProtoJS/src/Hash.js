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
