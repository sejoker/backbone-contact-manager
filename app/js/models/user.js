ContactManager.Models.User = Backbone.Model.extend({
	defaults: {
		signedIn: false,
		token: null,
		createNew: true,
		errorMessage: null
	}

});