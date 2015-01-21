ProtoJS.Object = {
  isUndefined: function(object) {
      return typeof object == "undefined";
  }
};

ProtoJS.mix( ProtoJS.Object, Object );
