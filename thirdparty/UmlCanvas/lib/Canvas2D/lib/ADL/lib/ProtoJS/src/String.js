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
