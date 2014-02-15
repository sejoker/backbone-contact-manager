ContactManager.Controller = Marionette.Controller.extend({
	initialize: function(options){
		this._contacts = options.contacts;
		this._router= options.router;
		this._mainRegion = options.mainRegion;
		this._user = options.user;
		this._api =options.api;
		this._json = JSON;
	},

	login: function(callback, callbackArgs){
			var model = new ContactManager.Models.User(),
				that = this;

			model.set('createNew', false);

			var loginForm = new ContactManager.Views.SignupForm({
				model: model
			});

			loginForm.on('form:submitted', function(attrs){				
				that._api.loginAsync(attrs)
					.then(function(result){
						var signupResult = that._json.parse(result);
						that._user.set('signedIn', true);
						that._user.set('token', signupResult.token);
						debugger;
						if (callback){
							callback.call(that, callbackArgs);
						} else {
							that._router.navigate('contacts', true);		
						}
					})
					.fail(function(error){
						debugger;
						model.set('errorMessage', that._json.parse(error).error);
					});
				
			});

			that._mainRegion.show(loginForm);
	},

	editContact: function(id){
		if (this._user && this._user.get('signedIn')){
			var contact = this._contacts.get(id),
				editContactForm,
				that = this;

			if (contact){
				if (!contact.get('loadedDetails')){
					this._api.getContactDetails(id, this._user.get('token'))
						.then(function(attrs){
							contact.set(attrs);

							editContactForm = new ContactManager.Views.ContactForm({
								model: contact
							});

							editContactForm.on('form:submitted', function(attrs){									
								contact.set(attrs);
								that._router.navigate('contacts', true);
							})

							that._mainRegion.show(editContactForm);
					});
				} else {
					editContactForm = new ContactManager.Views.ContactForm({
						model: contact
					});

					editContactForm.on('form:submitted', function(attrs){									
						contact.set(attrs);
						this._router.navigate('contacts', true);
					})

					this._mainRegion.show(editContactForm);
				}								
			} else {
				this._router.navigate('contacts', true);
			}
		} else {
			this.login(this.ditContact, id);
		}
	},

	removeContact: function(id){
		if (this._user && this._user.get('signedIn')){
			this._contacts.remove(id);
			this._router.navigate('contacts', true);
		} else {
			this.login(this.removeContact, id);
		}
	},

	newContact: function(){
		if (this._user && this._user.get('signedIn')){
			var newContactForm = new ContactManager.Views.ContactForm({
				model: new ContactManager.Models.Contact()
			});

			newContactForm.on('form:submitted', function(attrs){
				var contact = new ContactManager.Models.Contact();
				contact.set('id', _.random(1, 1000));
				contact.set(attrs);
				contact.set('loadedDetails', true);
				contact.set('avatar', ContactManager.Services.Api.getAvatar(attrs.gender))
				this._contacts.add(contact);
				
				this._router.navigate('contacts', true);
			});

			this._mainRegion.show(newContactForm);
		}
		else {
			this.login(this.newContact);
		}
	},

	showContacts: function(){
		var that = this;
		if (that._contacts.size() == 0){
			that._api.getUsersAsync().then(function(users){
				that._contacts.add(users);					
				var contactsView = new ContactManager.Views.Contacts({
					collection: that._contacts
				});

				that._mainRegion.show(contactsView);

			}).fail(function(error){
				alert("Unexpected error occured: " + error);
				return;
			});
		} else {
			var contactsView = new ContactManager.Views.Contacts({
					collection: that._contacts
				});

			that._mainRegion.show(contactsView);
		}
	},

	signupUser: function(){
		var model = new ContactManager.Models.User() 
			signupForm = new ContactManager.Views.SignupForm({ model: model })
			that = this;

		signupForm.on('form:submitted', function(attrs){
			this._api.signupAsync(attrs)
			.then(function(result){
				var signupResult = that._json.parse(result);
				user.set('signedIn', true);
				user.set('token', signupResult.token);
				console.log(user);
				this._router.navigate('contacts', true);	
			})
			.fail(function(error){
				var errors = that._json.parse(error).errors,
					errorMessage = '';
					_.each(errors, function(e){
						var pairs = _.pairs(e);
						errorMessage += pairs[0][0] + ': ' + pairs[0][1] + '<br>';
					});
				model.set('errorMessage', errorMessage);
			});
			
		});

		this._mainRegion.show(signupForm);
	}
});