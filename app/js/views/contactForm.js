ContactManager.Views.ContactForm = Marionette.ItemView.extend({
	template: '#tpl-new-contact',

	events: {
		'submit .contact-form': 'onFormSubmit'
	},

	serializeData: function(){
		return _.extend(this.model.toJSON(), {
			isNew: this.model.isNew()
		});
	},

	ui: {
		nameInput: '.contact-name-input',
		telInput: '.contact-tel-input',
		emailInput: '.contact-email-input'
	},

	onFormSubmit: function(e) {
		e.preventDefault();
		this.trigger('form:submitted',{
			name: this.ui.nameInput.val(),
			tel: this.ui.telInput.val(),
			email: this.ui.emailInput.val()
		});
	}
});