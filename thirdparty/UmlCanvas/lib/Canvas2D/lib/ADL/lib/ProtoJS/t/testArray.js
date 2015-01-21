ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Array"; },
		
		test000Is: function() {
		  this.assertFalse( [1,2,3].isString()   );
		  this.assertFalse( [1,2,3].isNumber()   );
		  this.assertTrue ( [1,2,3].isArray()    );
		  this.assertFalse( [1,2,3].isHash()     );
		  this.assertFalse( [1,2,3].isFunction() );
		  this.assertFalse( [1,2,3].isClass()    );
	  },

		test001Has: function() {
			var anArray = this.createMixedValueArray();
    	this.assertTrue( anArray.has( "apple" ) );
    	this.assertFalse( anArray.has( "microsoft" ) );
		},
		
		test002Iterate: function() {
			var anArray = this.createMixedValueArray();
			var result  = "";
    	anArray.iterate( function(part) { result += part; } );
    	this.assertEqual( result, "-10102030appleibm" );
		},
		
		test003Compare: function() {
			var anArray = this.createMixedValueArray();
			var theSameArray = this.createMixedValueArray();
    	this.assertTrue( anArray.compare( theSameArray ) );

			var anOtherArray = this.createOtherMixedValueArray();
    	this.assertFalse( anArray.compare( anOtherArray ) );
		},
		
		test004Remove: function() {
			var anArray = this.createMixedValueArray();
			var anOtherArray = this.createOtherMixedValueArray();
			var diff = this.createArrayWithDifferences();
    	this.assertTrue( anArray.remove( anOtherArray ).compare( diff ) );
    	this.assertTrue( anArray.remove( 10, 20, "apple" ).compare( diff ) );
		},

		test005Clear: function() {
			var anArray = this.createMixedValueArray();
    	this.assertTrue( anArray.clear().compare( [] ) );
		},

		test006Dup: function() {
    	var anArray = this.createMixedValueArray();
    	var aCopy = anArray.dup();
    	this.assertTrue( anArray != aCopy && anArray.compare(aCopy) );
		},

		test007Unique: function() {
    	var anArray = this.createMixedValueArray();
			var anArrayWithDoubles = this.createArrayWithDoubles();
		  this.assertTrue( anArrayWithDoubles.unique().compare( anArray ) );
		},

   	test008MinMax: function() {
    	var anArray = this.createMixedValueArray();
			this.assertEqual( anArray.min(), -10 );
			this.assertEqual( anArray.max(),  30 );
		},
		
		createMixedValueArray: function() {
			return [ -10, 10, 20, 30, "apple", "ibm" ];
		},

		createOtherMixedValueArray: function() {
			return [ -10, 10, 20, "apple" ];
		},
		
		createArrayWithDifferences: function() {
			return [ 30, "ibm" ];
		},
		
		createArrayWithDoubles: function() {
			return [ -10, 10, 10, 20, 30, "apple", "apple", "ibm", "ibm", "ibm" ];
		}

	} )
);
