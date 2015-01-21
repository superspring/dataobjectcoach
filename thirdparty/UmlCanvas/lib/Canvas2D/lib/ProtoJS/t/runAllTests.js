load( "lib/common.make/env.rhino.js" );
load( "build/ProtoJS.cli.min.js" );

[ 
  "Class", "Array", "Hash", "Function", "Object", "String", "Number",
  "Ajax", "Timer", "Font", "Event", "Test" 
].iterate( function( unit ) {
	load( "t/test" + unit + ".js"    );	
} );

function showResults(tester) {
	print( "-----------------------" );
	print( tester.getResults().total   + " tests run." );
	print( tester.getResults().failed  + " failed." );
	print();
}

ProtoJS.Test.Runner.on( "ready", showResults );
ProtoJS.Test.Runner.start();
