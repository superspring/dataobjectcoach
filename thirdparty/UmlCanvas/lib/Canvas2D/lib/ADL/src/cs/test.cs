using System;
using System.IO;

using TSF.ADL;

public class test {
  public static void Main(String[] Args) {
    Construct root = new Construct();

    root.setType( "rootConstruct" );

    root.setName( "rootName" );

    root.addAnnotation( "rootAnnotation1" );
    root.addAnnotation( "rootAnnotation2" );    

    root.addSuper( "rootSuper1" );
    root.addSuper( "rootSuper2" );
    
    root.addModifier( new Modifier( "rootSwitchModifier" ) );
    root.addModifier( new Modifier( "rootStringModifier", "abc" ) );
    root.addModifier( new Modifier( "rootIntegerModifier", 123 ) );
    root.addModifier( new Modifier( "rootBooleanModifier", false ) );    

    Construct child = new Construct();
    
    child.setType( "childConstruct" );

    child.setName( "childName" );

    child.addAnnotation( "childAnnotation1" );
    child.addAnnotation( "childAnnotation2" );    

    child.addSuper( "childSuper1" );
    child.addSuper( "childSuper2" );
    
    child.addModifier( new Modifier( "childSwitchModifier" ) );
    child.addModifier( new Modifier( "childStringModifier", "abc" ) );
    child.addModifier( new Modifier( "childIntegerModifier", 123 ) );
    child.addModifier( new Modifier( "childBooleanModifier", false ) );    
    
    root.addChild(child);
    
    Console.WriteLine( root );
  }
}
