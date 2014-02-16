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
						if (callback){
							callback.call(that, callbackArgs);
						} else {
							that.showContacts();
						}
					})
					.fail(function(error){
						model.set('errorMessage', that._json.parse(error).error);
					});
				
			});

			that.listenTo(loginForm, 'form:canceled', function(){
				that.showContacts();
			})

			that._mainRegion.show(loginForm);
	},

	editContact: function(id){
		if (!(this._user && this._user.get('signedIn'))){
			return this.login(this.editContact, id);
		}
			
		var contact = this._contacts.get(id),
			editContactForm,
			that = this,
			showContactForm = function(){
				editContactForm = new ContactManager.Views.ContactForm({
					model: contact
				});

				that.listenTo(editContactForm, 'form:submitted', function(attrs){									
					contact.set(attrs);
					that.showContacts();
				});

				that.listenTo(editContactForm, 'form:canceled', function(){
					that.showContacts();
				})

				that._mainRegion.show(editContactForm);
			};

		if (contact){
			if (!contact.get('loadedDetails')){
				that._api.getContactDetails(id, this._user.get('token'))
					.then(function(attrs){
						contact.set(attrs);

						showContactForm();
				});
			} else {
				showContactForm();
			}

			that._router.navigate('contacts/edit/' + id);

		} else {
			that.showContacts();
		}		
	},

	removeContact: function(id){
		if (!(this._user && this._user.get('signedIn'))){		
			return this.login(this.removeContact, id);
		}

		this._contacts.remove(id);
		this.showContacts();
	},

	newContact: function(){
		if (!(this._user && this._user.get('signedIn'))){
			this.login(this.newContact);
		}

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
			
			this.showContacts();
		});

		this.listenTo(newContactForm, 'form:canceled', function(){
			this.showContacts();
		})

		this._mainRegion.show(newContactForm);
		this._router.navigate('contacts/new');
	},

	showContacts: function(){
		var that = this,
			showContactsView = function(){
				var contactsView = new ContactManager.Views.Contacts({
					collection: that._contacts
				});

				that.listenTo(contactsView, 'addContact:clicked', function(){
					that._router.navigate('contacts/new');
					that.newContact();
				});

				that.listenTo(contactsView, 'itemview:delete:clicked', function(contactView){
					that.removeContact(contactView.model.id);
				});

				that.listenTo(contactsView, 'itemview:edit:clicked', function(contactView){
					that.editContact(contactView.model.id);
				})

				that._mainRegion.show(contactsView);
			};

		if (that._contacts.isEmpty()){
			that._api.getUsersAsync().then(function(users){
				that._contacts.add(users);					
				showContactsView();

			}).fail(function(error){
				alert("Unexpected error occured: " + error);
				return;
			});
		} else {
			showContactsView();
		}

		that._router.navigate('contacts');
	},

	signupUser: function(){
		var model = new ContactManager.Models.User() 
			signupForm = new ContactManager.Views.SignupForm({ model: model })
			that = this;

		signupForm.on('form:submitted', function(attrs){
			that._api.signupAsync(attrs)
			.then(function(result){
				var signupResult = that._json.parse(result);
				user.set('signedIn', true);
				user.set('token', signupResult.token);
				console.log(user);
				that.showContacts();
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

		that.listenTo(signupForm, 'form:canceled', function(){
			that.showContacts();
		})

		that._mainRegion.show(signupForm);
	}
});