ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Ajax"; },

		test001Synchronous: function() {
			var data = new ProtoJS.Ajax().fetch( "t/data.txt" );
			this.assertEqual( data, "123\n" );
		},

		test002Asynchronous: function() {
			var shared = "rubbish";
			new ProtoJS.Ajax().fetch( "t/data.txt", function(result) {
				shared = result.responseText;
			});
			this.assertEqualAfter( 15, function() { return shared; }, "123\n" );
		},

		test003CrossDomain: function() {
			// cannot test from command line ... yet ;-)
		}

	} )

);
