ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "String"; },

		test000Is: function() {
		  this.assertTrue ( "123".isString()   );
		  this.assertFalse( "123".isNumber()   );
		  this.assertFalse( "123".isArray()    );
		  this.assertFalse( "123".isHash()     );
		  this.assertFalse( "123".isFunction() );
		  this.assertFalse( "123".isClass()    );
	  },

		test001Contains: function() {
    	this.assertTrue( "123".contains( "2" ) );
		},
		
		test002ContainsOneOf: function() {
    	this.assertTrue(  "123".containsOneOf( [ "a", "2", "b" ] ) );
    	this.assertFalse( "123".containsOneOf( [ "a", "b", "c" ] ) );
		},
		
		test003Trim : function() {
    	this.assertEqual( " 123 ".trim(), "123" );
    	this.assertEqual( ProtoJS.String.trim( " 123\n\t "), "123");
		}
	} )

);
