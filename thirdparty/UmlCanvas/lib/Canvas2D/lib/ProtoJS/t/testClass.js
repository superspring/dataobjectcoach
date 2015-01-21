ProtoJS.Test.Runner.addTestUnit( 

	ProtoJS.Test.extend( {
		getScope: function() { return "Class"; },

		test000Is: function() {
		  var class1 = Class.extend({});
		  this.assertFalse( class1.isString()   );
		  this.assertFalse( class1.isNumber()   );
		  this.assertFalse( class1.isArray()    );
		  this.assertFalse( class1.isHash()     );
		  this.assertFalse( class1.isFunction() );
		  this.assertTrue ( class1.isClass()    );
	  },

		test001MethodInvocation: function() {
			var class1 = this.createClassLoggingItsMethodCalls( "class1" );
			var obj1   = new class1();
			obj1.aMethod();
			this.assertEqual( obj1.log, "class1::init\nclass1::aMethod" );
		},

		test002OverriddenMethodInvocation: function() {
			var class2 = this.createClassOverridingOneMethodCall( "class2" );
			var obj2 = new class2();
			obj2.aMethod();
			this.assertEqual( obj2.log, "class1::init\nclass2::aMethod" );
		},

		test003ExtendedMethodInvocation: function() {
			var class3 = this.createClassExtendingOneMethodCall( "class3" );
			var obj3 = new class3();
			obj3.aMethod();
			this.assertEqual( obj3.log, "class1::init\n" + 
				"class1::aMethod\nclass3::aMethod" );
		},
		
		test004SecondGenerationExtension: function() {
			var class4 = this.createSecondGenerationExtendedClass( "class4" );
			var obj4 = new class4();
			obj4.aMethod();
			this.assertEqual( obj4.log, "class1::init\nclass4::init\n" + 
				"class1::aMethod\nclass2::aMethod\nclass4::aMethod" );
		},

		createClassLoggingItsMethodCalls: function( name ) {
			return Class.extend( {
				init: function() { this.log = name + "::init"; },
				aMethod: function() { this.log += "\n" + name + "::aMethod"; }
			} );
		},

		createClassOverridingOneMethodCall: function( name ) {
			var class1 = this.createClassLoggingItsMethodCalls( "class1" );
			return class1.extend( {
				aMethod: function() { this.log += "\n" + name + "::aMethod"; }				
			} );
		},

		createClassExtendingOneMethodCall: function( name ) {
			var class1 = this.createClassLoggingItsMethodCalls( "class1" );
			return class1.extend( {
				aMethod: function() { 
					this._super();
					this.log += "\n" + name + "::aMethod"; 
				}
			} );
		},
		
		createSecondGenerationExtendedClass: function( name ) {
			var class2 = this.createClassExtendingOneMethodCall( "class2" );
			return class2.extend( {
				init: function() {
					this._super();
					this.log += "\n" + name + "::init";
				},
				aMethod: function() { 
					this._super();
					this.log += "\n" + name + "::aMethod"; 
				}				
			} );
		}
	}
) );
