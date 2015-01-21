ProtoJS.Test.Runner.addTestUnit( 
  ProtoJS.Test.extend( {
    getScope: function() { return "Construct"; },

    test001Constructor: function test001Constructor() {
      var construct = this.createEmptyConstruct();
      try {
        this.assertTrue( construct instanceof ADL.Construct() );
      } catch(e) {}
    },
    
    test002addModifier: function test002addModifier() {
      var construct = this.createEmptyConstruct();
      construct.addModifier( "someModifier", "someValue" );
      this.assertEqual( construct.getModifier("someModifier" ).getValue(),
                        "someValue" );
    },
    
    createEmptyConstruct: function createBasicConstruct() {
      return new ADL.Construct();
    }
  } )
);
