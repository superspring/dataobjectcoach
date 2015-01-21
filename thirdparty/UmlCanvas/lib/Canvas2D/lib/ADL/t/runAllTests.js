load( "lib/common.make/env.rhino.js" );
load( "lib/ProtoJS/build/ProtoJS.js" );
load( "build/ADL.cli.min.js" );

load( "t/testSyntax.js"    );	

print( "-----------------------" );
print( ProtoJS.Test.Runner.getResults().total   + " tests run." );
print( ProtoJS.Test.Runner.getResults().failed  + " failed." );
print();

// API tests

[
  "Construct"
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
