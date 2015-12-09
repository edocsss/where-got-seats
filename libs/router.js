var subsManager = new SubsManager();

FlowRouter.route('/', {
	name: 'home',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'placesList'
		});
	}
});

FlowRouter.route('/about', {
	name: 'aboutus',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'aboutUs'
		});
	},
});

FlowRouter.route('/contact', {
	name: 'contactus',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'contactUs'
		});
	}
});

FlowRouter.route('/login', {
	name: 'adminLogin',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminLogin'
		});
	}
});

FlowRouter.route('/dashboard', {
	name: 'adminDashboardHome',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardHome'
		});
	}
});

FlowRouter.route('/dashboard/places', {
	name: 'adminDashboardPlaces',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardPlaces'
		});
	}
});

FlowRouter.route('/dashboard/users', {
	name: 'adminDashboardUsers',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardUsers'
		});
	}
});

FlowRouter.route('/dashboard/edit-about', {
	name: 'editAbout',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardAbout'
		});
	}
});