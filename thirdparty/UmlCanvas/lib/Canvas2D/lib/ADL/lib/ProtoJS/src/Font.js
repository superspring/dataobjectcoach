ProtoJS.Font = Class.extend( {
  init: function init(font) {
    this.scale = null;
    this.size  = null;

    var result = font.match("(\\d+)([^\\s/]+)[\\s/]*");
    if( result ) {
      this.size  = result[1];
      this.scale = result[2];
    }
  },

  getSize: function getSize(as) {
    if( this.scale && this.size && ProtoJS.Font.SizeMap[this.scale]) {
      return ProtoJS.Font.SizeMap[this.scale][this.size][as];
    }
    return 0;
  },

  getPxSize : function getPxSize()  { return this.getSize("px");       },
  getPtSize : function getPtSize()  { return this.getSize("pt");       },
  getEmSize : function getEmSize()  { return this.getSize("em");       },
  getPctSize: function getPctSize() { return this.getSize("em") * 100; }
} );

/**
* expand the conversion table to a map
* http://www.reeddesign.co.uk/test/points-pixels.html
* pct = em * 100
*/
ProtoJS.Font.SizeMap = { px : {}, pt: {}, em: {} };

[ 
  { pt:5.5,  px:6,   em:0.375 }, { pt:6,    px:8,   em:0.5   },
  { pt:7,    px:9,   em:0.55  }, { pt:7.5,  px:10,  em:0.625 },
  { pt:8,    px:11,  em:0.7   }, { pt:9,    px:12,  em:0.75  },
  { pt:10,   px:13,  em:0.8   }, { pt:10.5, px:14,  em:0.875 },
  { pt:11,   px:15,  em:0.95  }, { pt:12,   px:16,  em:1     },
  { pt:13,   px:17,  em:1.05  }, { pt:13.5, px:18,  em:1.125 },
  { pt:14,   px:19,  em:1.2   }, { pt:14.5, px:20,  em:1.25  },
  { pt:15,   px:21,  em:1.3   }, { pt:16,   px:22,  em:1.4   },
  { pt:17,   px:23,  em:1.45  }, { pt:18,   px:24,  em:1.5   },
  { pt:20,   px:26,  em:1.6   }, { pt:22,   px:29,  em:1.8   },
  { pt:24,   px:32,  em:2     }, { pt:26,   px:35,  em:2.2   },
  { pt:27,   px:36,  em:2.25  }, { pt:28,   px:37,  em:2.3   },
  { pt:29,   px:38,  em:2.35  }, { pt:30,   px:40,  em:2.45  },
  { pt:32,   px:42,  em:2.55  }, { pt:34,   px:45,  em:2.75  },
  { pt:36,   px:48,  em:3     }
].iterate( function(size) {
  ProtoJS.Font.SizeMap.px[size.px] = size;
  ProtoJS.Font.SizeMap.pt[size.pt] = size;
  ProtoJS.Font.SizeMap.em[size.em] = size;
} );
