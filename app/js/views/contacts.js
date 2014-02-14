ContactManager.Views.Contacts = Backbone.View.extend({
	template: _.template($('#tpl-contacts').html()),

	renderOne: function(contact) {
		contact.set('name', contact.get('firstName') + ' ' +contact.get('lastName'));

		var itemView = new ContactManager.Views.Contact({model: contact});
		this.$('.contacts-container').append(itemView.render().$el);
	},


	render: function(){
		var html = this.template();
		this.$el.html(html);

		this.collection.each(this.renderOne, this);

		return this;
	}
});