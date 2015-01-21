using System;
using System.Collections.Generic;

namespace TSF.ADL {
  public class Construct {
    private String type;

    public String name { get; set; }

    private List<String> _annotations = new List<String>();
    public List<String> annotations {
      get { return this._annotations;  }
      set { this._annotations = value; }
    }

    private List<String> _supers = new List<String>();
    public List<String> supers {
      get { return this._supers; }
      set { this._supers = value; }
    }

    private List<Modifier> _modifiers = new List<Modifier>();
    public List<Modifier> modifiers {
      get { return this._modifiers;  }
      set { this._modifiers = value; }
    }

    private List<Construct> _children = new List<Construct>();
    public  List<Construct> children {
      get { return this._children; }
      set { this._children = value; }
    }

    public Construct setType(String type) {
      this.type = type.ToLower();
      return this;
    }

    public Construct setName(String name) {
      this.name = name;
      return this;
    }

    public Construct addAnnotation(String annotation) {
      this.annotations.Add(annotation);
      return this;
    }

    public Construct addSuper(String name) {
      this.supers.Add(name);
      return this;
    }

    public Construct addModifier(Modifier modifier) {
      this.modifiers.Add(modifier);
      return this;
    }

    public Construct addChild(Construct construct) {
      this.children.Add(construct);
      return this;
    }

    public String getType() {
      return this.type;
    }

    public String getName() {
      return this.name;
    }

    public String getAnnotationsAsString(String prefix) {
      String s = "";
      foreach( String annotation in this.annotations ) {
        s += prefix + "[@" + annotation + "]\r\n";
      }
      return s;
    }

    public String getSuperAsString() {
      String s = "";
      foreach( String zuper in this.supers ) {
        s += " :" + zuper;
      }
      return s;
    }

    public String getModifiersAsString() {
      String s = "";
      foreach( Modifier modifier in this.modifiers ) {
        s += modifier.ToString() + " ";
      }
      return s;
    }

    public String getChildrenAsString(String prefix) {
      if( this.children.Count < 1 ) { return ";"; }
      String s = " {\r\n";
      foreach( Construct child in this.children ) {
        s += child.ToString(prefix + "  ") + "\r\n";
      }
      s += prefix + "}";
      return s;
    }

    public List<String> getDependencies() {
      List<String> deps = new List<String>();
      foreach( Construct child in this.children ) {
        deps.AddRange(child.getDependencies());
      }
      deps.AddRange(this.supers);
      return deps;
    }

    public virtual void prepare() {
      // TODO: find a better way to handle the modifiers like abstract and 
      //       static
      // remove all modifiers except for the stereotypes
      for( int i = this.modifiers.Count-1; i>=0; i-- ) {
        if (this.modifiers[i].key != "stereotype") {
          this.modifiers.RemoveAt(i);
        }
      }
    }

    public String ToString(String prefix) {
      this.prepare();
      return this.getAnnotationsAsString(prefix) 
          + prefix + this.type + " " + this.name
          + this.getSuperAsString()
          + this.getModifiersAsString()
          + this.getChildrenAsString(prefix);
    }
    
    public override String ToString() {
      return this.ToString("");
    }
  }
}
