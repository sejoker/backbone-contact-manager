
require.config({
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [ 
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		marionette: {
			deps: [ 'backbone'
			],
			exports: 'Marionette'
		},
		q: {
			exporsts: 'Q'
		}
	},
	paths: {
		jquery: '../../bower_components/jquery/jquery',
		underscore: '../../bower_components/underscore/underscore',
		backbone: '../../bower_components/backbone/backbone',
		marionette: '../../bower_components/marionette/lib/backbone.marionette',
		text: '../../bower_components/requirejs-text/text',
		q: '../../bower_components/q/q'
	}
});

require(['app'], function(ContactManager){
	ContactManager.start();
});