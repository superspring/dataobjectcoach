ProtoJS.Ajax = Class.extend( {
  init: function() {
    this.xmlhttp = null;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      this.xmlhttp=new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // code for IE6, IE5
      this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      alert("Your browser does not support XMLHTTP!");
    }
  },

  fetch: function(url, callback) {
    if( url.substring(0,4) == "http" ) { 
      return this.fetchUsingXDR(url, callback); 
    }
    this.xmlhttp.open("GET", url, typeof callback == "function" );
    if(callback) {
      this.xmlhttp.onreadystatechange = function() {
        callback.call(this, this.xmlhttp);
      }.scope(this);
    }
    this.xmlhttp.send(null);
    return this.xmlhttp.responseText;
  },

  fetchUsingXDR: function(url, callback) {
    ProtoJS.XDR.push(callback);
    var e  = document.createElement("script");
    var op = url.contains('?') ? "&" : "?";
    e.src  = url + op +"f=ProtoJS.XDR[" + (ProtoJS.XDR.length-1) +  "]";
    e.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(e); 
  }
});

// globally available array for storing callback functions 
// for our XDR implementation
ProtoJS.XDR = [];
