define([
	'marionette', 
	'views/contact'
], function(Marionette, ContactView) {
	
	var ContactsView = Marionette.CompositeView.extend({
		template: '#tpl-contacts',
		itemView: ContactView,
		itemViewContainer: '.contacts-container',
		triggers: {
			'click .add-contact-btn': 'addContact:clicked'
		}
	});

	return ContactsView;
});
