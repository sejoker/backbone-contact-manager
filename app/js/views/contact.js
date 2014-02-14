ContactManager.Views.Contact = Marionette.ItemView.extend({
	tagName: 'li',
	className: 'media col-md-6 col-lg-4',
	template: '#tpl-contact',

	modelEvents: {
		'remove': 'close'
	},
});