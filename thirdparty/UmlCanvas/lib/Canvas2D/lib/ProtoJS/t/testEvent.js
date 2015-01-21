ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Event"; },

		test001Basic: function() {
			var shared = "FAIL";

      var class1 = Class.extend( {
        doIt: function() { this.fireEvent( "action" ); }
      } );
      ProtoJS.Event.enable( class1.prototype );
      var obj1 = new class1();
      obj1.on( "action", function() {	shared = "OK"; } );
      obj1.doIt();
			this.assertEqual( shared, "OK" );
		}
		
	} )

);
