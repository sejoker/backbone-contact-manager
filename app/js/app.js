define([
	'backbone',
	'marionette',
	'models/contact',
	'services/api',
	'models/user',
	'collections/contacts',
	'controllers/controller',
	'router'
], function(Backbone, Marionette, Contact, Api, User, Contacts, Controller, Router){

	var ContactManager = new Marionette.Application({
		Models: {},
		Collections: {},
		Views: {},
		Services: {}
	});

	ContactManager.addRegions({
		mainRegion: '.main-container'
	});

	ContactManager.on('initialize:after', function(options){
		if (Backbone.history){
			Backbone.history.start();	
		}		
	});

	ContactManager.addInitializer(function(){
		var api = Api,
			contacts = new Contacts(),
			user = new User(),
			router = new Router(),
		 	controller = new Controller({
		 		contacts: contacts,
		 		router: router,
		 		mainRegion: this.mainRegion,
		 		user: user,
		 		api: api
		 	});

		router.processAppRoutes(controller, {
			'contacts': 'showContacts',
			'contacts/new': 'newContact',
			'contacts/edit/:id': 'editContact',
			'contacts/remove/:id': 'removeContact',
			'signup': 'signupUser',
			'login': 'login'
		});

	});

	return ContactManager;

});

