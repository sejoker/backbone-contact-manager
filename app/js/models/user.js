define(['backbone'], function(Backbone) {

	var User = Backbone.Model.extend({
		defaults: {
			signedIn: false,
			token: null,
			createNew: true,
			errorMessage: null
		}
	});

	return User;
});
