define(['backbone'], function(Backbone){

	var Contact = Backbone.Model.extend({
		defaults: {
			firstName: null,
			lastName: null,
			title: null,
			email: null,
			avatar: null,
			gender: 'male',
			loadedDetails: false,
			street: null,
			city: null,
			state: null,
			zip: null,
			phone: null,
			cell: null,
			SSN: null,
			}
		});

	return Contact;
});

