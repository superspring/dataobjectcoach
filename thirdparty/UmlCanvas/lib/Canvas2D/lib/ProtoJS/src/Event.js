// this is a very minimalistic first stab
ProtoJS.Event = {
  observe: function(element, eventName, handler) {
    if(!element) { 
      console.log( "WARN: passed invalid element to ProtoJS.Event.observe." );
    } else {
      if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
      } else {
        element.attachEvent("on" + eventName, handler);
      }
    }
    return element;
  },

  enable: function enable( clazz ) {
    ProtoJS.mix( ProtoJS.Event.Handling, clazz );
  }
};

ProtoJS.Event.Handling = {
  on: function on( event, handler ) {
    if( !this.eventHandlers ) { this.eventHandlers = []; }
    if( !this.eventHandlers[event] ) { this.eventHandlers[event] = []; }
    this.eventHandlers[event].push(handler);
  },

  fireEvent: function fireEvent( event, data ) {
    if( !this.eventHandlers ) { return; }
    if( this.eventHandlers[event] ) {
      this.eventHandlers[event].iterate( function(handler) {
        handler(data);
      } );
    }
  }
};
