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

						$('.main-container').html(loginForm.render().$el);
					},

					editContact = function(id){
						if (user && user.get('signedIn')){
							var contact = contacts.get(id),
								editContactForm;

							if (contact){
								if (!contact.get('loadedDetails')){
									api.getContactDetails(id, user.get('token'));
								}

								editContactForm = new ContactManager.Views.ContactForm({
									model: contact
								});

								editContactForm.on('form:submitted', function(attrs){
									contact.set(attrs);
									router.navigate('contacts', true);
								})

								$('.main-container').html(editContactForm.render().$el);
							} else {
								router.navigate('contacts', true);
							}
						} else {
							logon(editContact, id);
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

					$('.main-container').html(contactsView.render().$el);
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

					$('.main-container').html(signupForm.render().$el);
				});

				router.on('route:loginUser', logon);

				router.on('route:newContact', function(){
					var newContactForm = new ContactManager.Views.ContactForm({
						model: new ContactManager.Models.Contact()
					});

					newContactForm.on('form:submitted', function(attrs){
						attrs.id = contacts.isEmpty() ? 1: (_.max(contacts.pluck('id')) + 1);
						contacts.add(attrs);
						router.navigate('contacts', true);
					});

					$('.main-container').html(newContactForm.render().$el);
				});

				router.on('route:editContact', editContact);	

				Backbone.history.start();		

			}).fail(function(error){
				alert("Unexpected error occured: " + error);
				return;
			})
	}
};