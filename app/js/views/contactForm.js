ContactManager.Views.ContactForm = Backbone.View.extend({
	template: _.template($('#tpl-new-contact').html()),
	render: function() {
		var html = this.template();
		this.$el.append(html);
		return this;
	},

	events: {
		'submit .contact-form': 'onFormSubmit'
	},

	onFormSubmit: function(e) {
		e.preventDefault();
		this.trigger('form:submitted',{
			name: this.$('.contact-name-input').val(),
			tel: this.$('.contact-tel-input').val(),
			email: this.$('.contact-email-input').val()
		});
	}
});