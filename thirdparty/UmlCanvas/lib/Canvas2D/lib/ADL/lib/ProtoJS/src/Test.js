ProtoJS.Test = Class.extend( {
	init: function init() {
		this.waitingFor = 0;
	},
	
	setTester: function setTester(tester) {
		this.tester = tester;
	},
	
	isReady: function isReady() {
		return this.waitingFor < 1;
	},
	
	assertEqual: function assertEqual( val1, val2, info ) {
    if( val1 == val2 ) {
			this.tester.success( this.currentTestName );
		} else {
      info = info || "";
			this.tester.fail( this.currentTestName, 
                        "  Expected:\n" + val2 + "\n" +
                        "  Got:\n" + val1 + "\n" +
                        "  " + info + "\n" );
    }
	},
	
	assertNotEqual: function assertEqual( val1, val2, info ) {
		if( val1 != val2 ) {
			this.tester.success( this.currentTestName );
		} else {
      info = info || "";
			this.tester.fail( this.currentTestName, 
                        "  Expected:\n" + val2 + "\n" +
                        "  Got:\n" + val1 + "\n" +
                        "  " + info + "\n" );
    }
	},
	
	assertTrue: function assertEqual( val, info ) {
		this.assertEqual( val, true, info );
	},

	assertFalse: function assertEqual( val, info ) {
		this.assertEqual( val, false, info );
	},
	
	assertEqualAfter: function assertEqualAfter( timeout, getValue, val, info ) {
		this.waitingFor++;
		var thisTest = this;
		window.setTimeout( function() {
			thisTest.assertEqual( getValue(), val, info );
			thisTest.waitingFor--;
		}, timeout );
	}

} );

ProtoJS.Test.RunDriver = Class.extend( {
	init : function init() {
		this.units = [];
		this.logDetails = true;
	},

	withoutDetails: function withoutDetails() {
		this.logDetails = false;
		return this;
	},

	log: function log(msg) {
		if( this.logDetails ) { print( msg ); }
	},

	addTestUnit: function addTestUnit( unit ) {
		this.units.push(unit);
		return this;
	},

	start : function start() {
		this.prepare();
		
		this.testNextUnit();

		// wait for all timers to execute before stopping
		if( Envjs.wait ) { Envjs.wait(); }
	},
	
	prepare: function prepare() {
		this.successful       = 0;
		this.failed           = 0;

		this.waitingFor       = 0;

		this.currentUnitIndex = -1;
		this.currentUnit      = null;		
	},
	
	testNextUnit: function testNextUnit() {
		if( this.currentUnit == null || this.currentUnit.isReady() ) {
			if( this.currentUnitIndex < this.units.length - 1 ) {
				this.currentUnitIndex++;
				this.currentUnit = new this.units[this.currentUnitIndex]();
				this.currentUnit.setTester(this);
				this.currentTests = 
					$H(this.units[this.currentUnitIndex].prototype).keys().sort();
				this.currentTestIndex = -1;
				if( this.currentUnit.getScope ) { 
					this.log( "Testing " + this.currentUnit.getScope() );
				}
				this.performNextTest();
				this.testNextUnit();
			} else {
				this.fireEvent( "ready", this );
			}
		} else {
			this.testNextUnit.scope(this).after(10);
		}
	},

	performNextTest: function performNextTest() {
		if( this.currentUnit.isReady() ) {
			if( this.currentTests.length > 0 && 
					this.currentTestIndex < this.currentTests.length ) 
			{
				this.currentTestIndex++;
				var name = this.currentTests[this.currentTestIndex];
				if( name && name.match(/^test/) ) {
					this.log( "- " + name );
					this.currentUnit.currentTestName = name;
					if( this.currentUnit.before ) { this.currentUnit.before(); }
					this.currentUnit[name].scope(this.currentUnit)();
					if( this.currentUnit.after ) { this.currentUnit.after(); }
				}
				// recursively go to next test
				this.performNextTest();
			} else {
				// done, will be picked up by unit loop
			}
		} else {
			this.performNextTest.scope(this).after(10);
		}
	},

	success : function success( name ) {
		this.successful++;
	},

	fail : function fail( name, info ) {
		this.failed++;
		this.log( "FAIL: " + name + "\n" + info );
	},
	
	getResults: function getResults() {
		return { 
			total     : this.failed + this.successful, 
			failed    : this.failed, 
			successful: this.successful
		};
	},

	test : function test( fnc ) {
		this.testFunction = fnc;
		this.prepare();
		return this;
	},

	using : function using( set ) {
		if( !this.testFunction ) {
			print( "Please provide a function to test first..." );
			return;
		}
		set.iterate(function(test) {
			var outcome = this.testFunction( test.data, test.msg, test.result );
      var expected = typeof test.expected == "boolean" ?
        test.expected : true;
			if( outcome.result === expected ) {
				this.success(test.name);
			} else {
			  this.fail(test.name, outcome.info);
		  }
		}.scope(this) );
		return this;
	}
} );

ProtoJS.Event.enable( ProtoJS.Test.RunDriver.prototype );
ProtoJS.Test.Runner = new ProtoJS.Test.RunDriver();
