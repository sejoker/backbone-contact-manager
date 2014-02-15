window.ContactManager = {
	Models: {},
	Collections: {},
	Views: {},
	Services: {},

	start: function(){
		var api = ContactManager.Services.Api;

			api.getUsersAsync().then(function(users){
				var contacts = new ContactManager.Collections.Contacts(users),
					user = new ContactManager.Models.User(),
					router = new ContactManager.Router(),
					mainRegion = new Marionette.Region({
						el: '.main-container'
					}),
				 	logon = function(callback, callbackArgs){
						var model = new ContactManager.Models.User();

						model.set('createNew', false);

						var loginForm = new ContactManager.Views.SignupForm({
							model: model
						});

						loginForm.on('form:submitted', function(attrs){
							api.loginAsync(attrs)
							.then(function(result){
								var signupResult = JSON.parse(result);
								user.set('signedIn', true);
								user.set('token', signupResult.token);

								if (callback){
									callback(callbackArgs);
								} else {
									router.navigate('contacts', true);		
								}
							})
							.fail(function(error){
								model.set('errorMessage', JSON.parse(error).error);
							});
							
						});

						mainRegion.show(loginForm);
					},

					editContact = function(id){
						if (user && user.get('signedIn')){
							var contact = contacts.get(id),
								editContactForm;

							if (contact){
								if (!contact.get('loadedDetails')){
									api.getContactDetails(id, user.get('token')).then(function(attrs){
										contact.set(attrs);

										editContactForm = new ContactManager.Views.ContactForm({
											model: contact
										});

										editContactForm.on('form:submitted', function(attrs){									
											contact.set(attrs);
											router.navigate('contacts', true);
										})

										mainRegion.show(editContactForm);
									});
								} else {
									editContactForm = new ContactManager.Views.ContactForm({
										model: contact
									});

									editContactForm.on('form:submitted', function(attrs){									
										contact.set(attrs);
										router.navigate('contacts', true);
									})

									maiRegion.show(editContactForm);
								}								
							} else {
								router.navigate('contacts', true);
							}
						} else {
							logon(editContact, id);
						}
					},
				removeContact = function(id){
					if (user && user.get('signedIn')){
						contacts.remove(id);
						router.navigate('contacts', true);
					} else {
						logon(removeContact, id);
					}
				}

				newContact = function(){
					if (user && user.get('signedIn')){
						var newContactForm = new ContactManager.Views.ContactForm({
							model: new ContactManager.Models.Contact()
						});

						newContactForm.on('form:submitted', function(attrs){
							var contact = new ContactManager.Models.Contact();
							contact.set('id', _.random(1, 1000));
							contact.set(attrs);
							contact.set('loadedDetails', true);
							contact.set('avatar', ContactManager.Services.Api.getAvatar(attrs.gender))
							contacts.add(contact);
							
							router.navigate('contacts', true);
						});

						mainRegion.show(newContactForm);
					}
					else {
						logon(newContact);
					}
				};


				router.on('route:home', function(){
					router.navigate('contacts', {
						trigger: true,
						replace: true
					});
				});

				router.on('route:showContacts', function(){
					
					var contactsView = new ContactManager.Views.Contacts({
						collection: contacts
					});

					mainRegion.show(contactsView);
				});

				router.on('route:signupUser', function(){
					var model = new ContactManager.Models.User() 
						signupForm = new ContactManager.Views.SignupForm({ model: model });

					signupForm.on('form:submitted', function(attrs){
						api.signupAsync(attrs)
						.then(function(result){
							var signupResult = JSON.parse(result);
							user.set('signedIn', true);
							user.set('token', signupResult.token);
							console.log(user);
							router.navigate('contacts', true);	
						})
						.fail(function(error){
							var errors = JSON.parse(error).errors,
								errorMessage = '';
								_.each(errors, function(e){
									var pairs = _.pairs(e);
									errorMessage += pairs[0][0] + ': ' + pairs[0][1] + '<br>';
								});
							model.set('errorMessage', errorMessage);
						});
						
					});

					mainRegion.show(signupForm);
				});

				router.on('route:loginUser', logon);

				router.on('route:newContact', newContact);

				router.on('route:editContact', editContact);	
				router.on('route:removeContact', removeContact);	

				Backbone.history.start();		

			}).fail(function(error){
				alert("Unexpected error occured: " + error);
				return;
			})
	}
};