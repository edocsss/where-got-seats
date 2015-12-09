Template.navbar.onRendered(function () {
	Tracker.autorun(function() {
		FlowRouter.watchPathChange();
		var currentPath = FlowRouter.current().path;
		Session.set('currentPath', currentPath);
	});
});

Template.navbar.helpers({
	isUserAdmin: function () {
		var userType = Meteor.user().profile.type;
		return (userType === 'admin');
	},
	activeLink: function (r) {
		var path = Session.get('currentPath');

		// Need to differentiate on how to compare the currentRoute with "r"
		// since the for r == '/', it cannot be compared using SUBSTRING
		if (r === '/' && path === r) {
			return "active";
		} else if (r !== '/' && path.indexOf(r) > -1) {
			return "active";
		} else {
			return "";
		}
	}
});

Template.navbar.events({
	'click .logout-link': function (event) {
		event.preventDefault();
		Meteor.logout(function (error) {
			if (error) {
				console.log(error);
			} else {
				FlowRouter.go('home');
			}
		});
	}
});