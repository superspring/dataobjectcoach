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
