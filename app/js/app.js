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
	var api = ContactManager.Services.Api,
		contacts = new ContactManager.Collections.Contacts(),
		user = new ContactManager.Models.User(),
		router = new ContactManager.Router(),
	 	controller = new ContactManager.Controller({
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