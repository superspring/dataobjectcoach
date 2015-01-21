ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Hash"; },
		
		test000Is: function() {
		  var hash = $H({1:1,2:2,3:3});
		  this.assertFalse( hash.isString()   );
		  this.assertFalse( hash.isNumber()   );
		  this.assertFalse( hash.isArray()    );
		  this.assertTrue ( hash.isHash()     );
		  this.assertFalse( hash.isFunction() );
		  this.assertFalse( hash.isClass()    );
	  },

		test001GetSet: function() {
			var aHash = this.createMixedValueHash();
    	this.assertEqual( aHash.get( "d" ), "apple" );
    	aHash.set( "d", "Apple" );
    	this.assertEqual( aHash.get( "d" ), "Apple" );
		},

		test002Keys: function() {
			var aHash = this.createMixedValueHash();
	    this.assertEqual( aHash.keys().sort().toString(), "a,b,c,d,e" );	
		},

		test003Values: function() {
			var aHash = this.createMixedValueHash();
	    this.assertEqual( aHash.values().sort().toString(), 
											  "10,20,30,apple,ibm" );	
		},

		test004HasKey: function() {
			var aHash = this.createMixedValueHash();
	    this.assertTrue( aHash.hasKey( "c" ) );
    	this.assertFalse( aHash.hasKey( 1 ) );
		},

		test005HasValue: function() {
			var aHash = this.createMixedValueHash();
	    this.assertTrue( aHash.hasValue( "apple" ) );
   		this.assertFalse( aHash.hasValue( 1 ) );
		},

		test006Iterate: function() {
			var aHash = this.createMixedValueHash();
	    var result = [];
    	aHash.iterate(function(key, value) { result.push(key + "=" + value); });
    	this.assertEqual( result.sort().join(""), "a=10b=20c=30d=applee=ibm" );
		},
		
		createMixedValueHash: function() {
			return $H( { a:10, b:20, c:30, d:"apple", e:"ibm" } );
		}
		
	} )
);
