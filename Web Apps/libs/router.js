// var subsManager = new SubsManager();

/* ************************************************************************************************ */

FlowRouter.route('/', {
	name: 'home',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'placesList'
		});
	},
	subscriptions: function () {
		this.register('userPlaceList', Meteor.subscribe('userPlaceList'));
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

/* ************************************************************************************************ */

function checkLoginStatus (context, redirect) {
	if (!Meteor.loggingIn() && !Meteor.userId()) {
		swal({
			title: "User Not Authorized!",
			text: "Please login as an admin to access the page!",
			type: "error"
		});
		
		FlowRouter.go('adminLogin');
	}
}

var adminRoutes = FlowRouter.group({
	prefix: '/dashboard',
	name: 'dashboard',
	triggersEnter: [checkLoginStatus]
});

adminRoutes.route('/', {
	name: 'adminDashboardHome',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardHome'
		});
	}
});

adminRoutes.route('/places', {
	name: 'adminDashboardPlaces',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardPlaces'
		});
	},
	subscriptions: function () {
		this.register('adminPlaceList', Meteor.subscribe('adminPlaceList'));
	}
});

adminRoutes.route('/users', {
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

adminRoutes.route('/about/edit', {
	name: 'editAbout',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardAbout'
		});
	}
});

/* ************************************************************************************************ */

var placeRoutes = adminRoutes.group({
	prefix: '/place',
	name: 'place'
});

placeRoutes.route('/view/:placeId', {
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

placeRoutes.route('/edit/:placeId', {
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

var userRoutes = adminRoutes.group({
	prefix: '/user',
	name: 'user'
});

userRoutes.route('/view/:userId', {
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

userRoutes.route('/edit/:userId', {
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

var mapRoutes = adminRoutes.group({
	prefix: '/map',
	name: 'map'
});

mapRoutes.route('/view/:placeId/:mapId', {
	name: 'adminDashboardViewMap',
	action: function (params) {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardViewMap'
		});
	},
	subscriptions: function (params) {
		this.register('mapData', Meteor.subscribe('mapData', params.placeId, params.mapId));
	}
});

mapRoutes.route('/edit/:placeId/:mapId', {
	name: 'adminDashboardEditMap',
	action: function () {
		BlazeLayout.render('mainBody', {
			main: 'adminDashboardLayout',
			adminDashboardContentPlaceholder: 'adminDashboardEditMap'
		});
	},
	subscriptions: function (params) {
		this.register('editMapData', Meteor.subscribe('editMapData', params.placeId, params.mapId));
	}
});

/* ************************************************************************************************ */