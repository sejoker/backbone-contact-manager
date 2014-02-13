ContactManager.Models.Contact = Backbone.Model.extend({
	defaults: {
		firstName: null,
		lastName: null,
		title: null,
		email: null,
		avatar: null,
		gender: null,
		loadedDetails: false,
		street: null,
		city: null,
		state: null,
		zip: null,
		phone: null,
		cell: null,
		SSN: null,
	},

	initialize: function() {
		this.set('avatar', _.random(1,15) + '.jpg');
	}
});