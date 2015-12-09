Template.navbar.helpers({
	isUserAdmin: function () {
		var userType = Meteor.user().profile.type;
		return (userType === 'admin');
	},
	activeLink: function (r) {
		// var currentRoute = Router.current().route.path(this);

		// // Need to differentiate on how to compare the currentRoute with "r"
		// // since the for r == '/', it cannot be compared using SUBSTRING
		// if (r === '/' && currentRoute === r) {
		// 	return "active";
		// } else if (r !== '/' && currentRoute.indexOf(r) > -1) {
		// 	return "active";
		// } else {
		// 	return "";
		// }
	}
});

Template.navbar.events({
	'click .logout-link': function (event) {
		event.preventDefault();
		Meteor.logout(function (error) {
			if (error) {
				console.log(error);
			} else {
				// Router.go('home');
			}
		});
	}
});