ContactManager.Views.SignupForm = Marionette.ItemView.extend({
	template: '#tpl-signup',

	events:{
		'submit .signup-form': 'onFormSubmit'
	},

	triggers: {
		'click .form-cancel-btn': 'form:canceled'
	},

	ui: {
		login: '.signup-login-input',
		password: '.signup-password-input',
		passwordConfirmation: '.signup-password2-input'
	},

	serializeData: function(){
		return _.extend(this.model.toJSON(), {
			createNew: this.model.get("createNew"),
			errorMessage: this.model.get("errorMessage"),
			hasError: this.model.get("errorMessage") != null
		});
	},

	onFormSubmit: function(e){
		e.preventDefault();
		this.trigger('form:submitted',{
			login: this.ui.login.val(),
			password: this.ui.password.val(),
			passwordConfirmation: this.ui.passwordConfirmation.val()
		});
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	}
});