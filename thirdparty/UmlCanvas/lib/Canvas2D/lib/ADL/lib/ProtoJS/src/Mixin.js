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
