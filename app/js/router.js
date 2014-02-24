define(['marionette'], function(Marionette) {
	var Router = Marionette.AppRouter.extend({
		routes: {
			'': 'home'
		},

		home: function(){
			this.navigate('contacts', {
				trigger: true,
				replace: true
			});
		},
	});

	return Router;
});
