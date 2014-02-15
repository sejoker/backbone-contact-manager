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

	router.on('route:home', controller.home, controller);

	router.on('route:showContacts', controller.showContacts, controller);

	router.on('route:signupUser', controller.signupUser, controller);

	router.on('route:loginUser', controller.logon, controller);

	router.on('route:newContact', controller.newContact, controller);

	router.on('route:editContact', controller.editContact, controller);	

	router.on('route:removeContact', controller.removeContact, controller);	
});