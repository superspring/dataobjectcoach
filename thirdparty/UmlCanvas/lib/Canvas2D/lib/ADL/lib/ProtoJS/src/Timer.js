ProtoJS.Timer = Class.extend( {
  init: function init() {
    this.reset();
  },
  
  start: function start() {
    this.startTime = this.startTime || this.getTime();
    this.stopTime  = null;
    return this;
  },

  stop: function stop() {
    this.stopTime = this.getTime();
    return this;
  },
  
  getTime: function getTime() {
    return new Date().getTime(); 
  },
  
  reset: function reset() {
    this.startTime = null;
  },
  
  getElapsed: function getElapsed() {
    var now = this.getTime();
    return ( this.stopTime || now ) - ( this.startTime || now );
  }
} );
