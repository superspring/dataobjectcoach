ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Object"; },

		test001TypeChecks: function() {
			this.assertTrue( Object.isUndefined( blah ) );
			var blah = 1;
			this.assertFalse( Object.isUndefined( blah ) );
		},

		test002ClassBasedObjects: function() {
		  var clazz = Class.extend( {} );
		  var obj   = new clazz();
		  this.assertEqual( typeof obj.isArray, "function" );
	  }
	} )

);
