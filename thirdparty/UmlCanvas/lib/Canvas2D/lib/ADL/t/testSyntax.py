import json

from adl import adl

tests = json.loads( open( "testSyntax.json").read() )

failed = 0

print "Testing python Parser"

for test in tests:
  result   = False
  output   = ""
  input    = test.get("data","")
  expected = test.get("result", input);
  model    = adl.parse(input)
  
  if model != None:
    output   = "\n".join( ["%s" % (l) for l in model] )
    result   = output == expected
  
  if result != test.get( "expected", True ):
    print "Test %s failed:" % test.get("name", "unknown")
    print "GOT -->%s<--\nEXPECTED -->%s<--" % ( output, expected )
    failed += 1
    
print "-" * 23
print "%i tests run.\n%i tests failed.\n" % ( len(tests), failed )
