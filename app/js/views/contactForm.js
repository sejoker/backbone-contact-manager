define([
	'marionette', 
	'underscore'
], function(Marionette, _) {

	var ContactForm = Marionette.ItemView.extend({
		template: '#tpl-new-contact',

		events: {
			'submit .contact-form': 'onFormSubmit'
		},

		triggers: {
			'click .form-cancel-btn': 'form:canceled'
		},


		serializeData: function(){
			return _.extend(this.model.toJSON(), {
				isNew: this.model.isNew()
			});
		},

		ui: {
			firstNameInput: '.contact-firstName-input',
			lastNameInput: '.contact-lastName-input',
			titleInput: '.contact-title-input',
			genderInput: '.contact-gender-input',
			phoneInput: '.contact-phone-input',
			cellInput: '.contact-cell-input',
			emailInput: '.contact-email-input',
			streetInput: '.contact-street-input',
			cityInput: '.contact-city-input',
			stateInput: '.contact-state-input',
			zipInput: '.contact-zip-input',
			ssnInput: '.contact-ssn-input'
		},

		onFormSubmit: function(e) {
			e.preventDefault();
			this.trigger('form:submitted',{
				firstName: this.ui.firstNameInput.val(),
				lastName: this.ui.lastNameInput.val(),
				title: this.ui.titleInput.val(),
				gender: this.ui.genderInput.val(),
				phone: this.ui.phoneInput.val(),
				cell: this.ui.cellInput.val(),
				email: this.ui.emailInput.val(),
				state: this.ui.stateInput.val(),
				stree: this.ui.streetInput.val(),
				city: this.ui.cityInput.val(),
				zip: this.ui.zipInput.val(),
				SSN: this.ui.ssnInput.val(),		
			});
		}
	});

	return ContactForm;
});