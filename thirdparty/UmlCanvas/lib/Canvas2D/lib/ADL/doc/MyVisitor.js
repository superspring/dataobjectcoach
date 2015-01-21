MyVisitor = Class.create( {
    // the visitor gets a construct and some context data
    visit: function( construct, data ) {
	switch( construct.type ) {
	case "myConstructType":
	    // do something with domain specific construct
	    // ...
	    break;
	case "root":
	    // at the top is a root, you shouldn't do anything with it
	    break;
	default:
	    // be default we notify that there is an unhandled constructtype
	    alert( "unknown type " + construct.type );
	}
	// pass the visitor to the children
	construct.childrenAccept(this, elem);
	// return data (maybe modified) to be passed to the next constructs
	return data;
    }
} );
