Template.adminDashboardLayout.helpers({
	activeLink: function (r) {
		if (Router.current().route.path(this) === r) {
			return "active";
		} else {
			return "";
		}
	}
});

Template.adminDashboardLayout.events({
	'click #menu-toggle': function (e) {
		e.preventDefault();
		$('#wrapper').toggleClass('toggled');
	},
});