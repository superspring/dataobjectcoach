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
