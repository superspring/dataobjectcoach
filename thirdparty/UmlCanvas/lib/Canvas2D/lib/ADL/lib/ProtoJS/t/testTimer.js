ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Timer"; },

		test001Basic: function() {
			var shared = "FAIL";
      var timer = new ProtoJS.Timer();
      timer.start();
      var x = function() {
        timer.stop();
        if( Math.round(timer.getElapsed() / 10) == 11 ) {
					shared = "OK";
        }
      }.after(110);
			this.assertEqualAfter( 150, function() { return shared; }, "OK" );
		}
		
	} )

);
