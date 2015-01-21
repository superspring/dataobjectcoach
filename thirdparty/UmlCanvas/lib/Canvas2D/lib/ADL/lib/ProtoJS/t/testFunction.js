ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Function"; },
		
		test000Is: function() {
		  var func = function() {};
		  this.assertFalse( func.isString()   );
		  this.assertFalse( func.isNumber()   );
		  this.assertFalse( func.isArray()    );
		  this.assertFalse( func.isHash()     );
		  this.assertTrue ( func.isFunction() );
		  this.assertFalse( func.isClass()    );
	  },

		test001Scope: function() {
    	var obj = { x: "data",  };
    	var f = function() { return this.x; };
    	this.assertEqual( f.scope(obj)(), "data" );
		},
		
		test002After: function() {
			var shared = "FAIL";
    	var x = function(result) { 
				shared = result; 
			}.after(10, "OK");
			this.assertEqualAfter( 15, function() { return shared; }, "OK" );
		}
	} )

);
