ContactManager.Views.Contact = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'media col-md-6 col-lg-4',
	template: '#tpl-contact',

	modelEvents: {
		'remove': 'close'
	},

	triggers: {
		'click .delete-contact': 'delete:clicked',
		'click .edit-contact': 'edit:clicked'
	}
});