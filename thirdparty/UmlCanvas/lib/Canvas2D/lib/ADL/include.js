(function(project, scripts) {
	var cwd = (function cwd() {
		var scripts = document.getElementsByTagName('script');
		var re = new RegExp( project + "\/include\.js$");
		for( var i in scripts) {
			if( scripts[i].src && scripts[i].src.match( re ) ) {
				return scripts[i].src.replace(/(.*)include\.js$/, '$1');
			}
		}
	})();

	var include = function include(url) {
		document.writeln( "<script type=\"text/javascript\" " + 
											"        src=\"" + url + "\"></scr" + "ipt>" );
	}

	for( var i=0; i<scripts.length; i++ ) {
		include( cwd + scripts[i]);
	}
})
(
	
// The name of the project is needed to select the correct include.js file.
// When reusing projects with nested include files this might be required.
"ADL",

// The following list are the separate Javascript files, in order, to be 
// loaded. They are relative to this include file.
[ 
	"lib/ProtoJS/include.js",
	"src/js/ADL.parser.js"
]
	
);
