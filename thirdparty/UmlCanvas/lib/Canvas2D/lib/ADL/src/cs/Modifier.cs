using System;

namespace TSF.ADL {
  public class Modifier {
    public String key { get; set; }
    private String  stringValue;
    private int     integerValue;
    private Boolean boolValue;
    private String  type;

    public String value {
      get {
        switch( this.type ) {
          case "String":  return this.stringValue;
          case "Integer": return this.integerValue.ToString();
          case "Boolean": return this.boolValue.ToString();
          default:        return string.Empty;
        }
      }
    }

    public Modifier(String key) {
      this.key = key;
    }

    public Modifier(String key, String value) {
      this.key = key;
      this.stringValue = value;
      this.type = "String";
    }

    public Modifier(String key, int value) {
      this.key = key;
      this.integerValue = value;
      this.type = "Integer";
    }

    public Modifier(String key, Boolean value) {
      this.key = key;
      this.boolValue = value;
      this.type = "Boolean";
    }

    public override String ToString() {
      String s = " +" + this.key;
      switch(this.type) {
        case "String":
          return s + "=\"" + this.stringValue + "\"";
        case "Integer":
          return s + "=" + this.integerValue;
        case "Boolean":
          return s + "=" + this.boolValue;
        }
      return s;
    }
  }
}
