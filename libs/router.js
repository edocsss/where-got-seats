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

/* ************************************************************************************************ */

FlowRouter.route('/dashboard/places', {
	name: 'adminDashboardPlaces',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardPlaces'
		});
	},
	subscriptions: function () {
		this.register('placeList', Meteor.subscribe('placeList'));
	}
});

FlowRouter.route('/dashboard/view/place/:placeId', {
	name: 'adminDashboardViewPlace',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardViewPlace'
		});
	},
	subscriptions: function (params) {
		this.register('viewPlaceData', Meteor.subscribe('viewPlaceData', params.placeId));
	}
});

FlowRouter.route('/dashboard/edit/place/:placeId', {
	name: 'adminDashboardEditPlace',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardEditPlace'
		});
	},
	subscriptions: function (params) {
		this.register('editPlaceData', Meteor.subscribe('editPlaceData', params.placeId));
	}
});

/* ************************************************************************************************ */

FlowRouter.route('/dashboard/users', {
	name: 'adminDashboardUsers',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardUsers'
		});
	},
	subscriptions: function (params) {
		this.register('userList', Meteor.subscribe('userList'));
	}
});

FlowRouter.route('/dashboard/view/user/:userId', {
	name: 'adminDashboardViewUser',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardViewUser'
		});
	},
	subscriptions: function (params) {
		this.register('userData', Meteor.subscribe('userData', params.userId));
	}
});

FlowRouter.route('/dashboard/edit/user/:userId', {
	name: 'adminDashboardEditUser',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardEditUser'
		});
	},
	subscriptions: function (params) {
		this.register('userData', Meteor.subscribe('userData', params.userId));
	}
});

/* ************************************************************************************************ */

FlowRouter.route('/dashboard/view/map/:mapName', {
	name: 'adminDashboardViewMap',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardViewMap'
		});
	},
	subscriptions: function (params) {
		this.register('mapData', Meteor.subscribe('mapData', params.mapName));
	}
});

/* ************************************************************************************************ */

FlowRouter.route('/dashboard/edit/about', {
	name: 'editAbout',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardAbout'
		});
	}
});