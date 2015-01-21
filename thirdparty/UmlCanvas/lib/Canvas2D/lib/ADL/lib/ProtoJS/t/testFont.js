ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Font"; },

		test001Basic: function() {
      var font = new ProtoJS.Font( "italic bold 15pt/30px Georgia, serif" );
      this.assertEqual( font.getPtSize(),   15   );
      this.assertEqual( font.getPxSize(),   21   );
      this.assertEqual( font.getEmSize(),    1.3 );
      this.assertEqual( font.getPctSize(), 130   );
		}
		
	} )

);
