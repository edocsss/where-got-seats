var subsManager = new SubsManager();

// Router.configure({
// 	layoutTemplate: 'mainBody'
// });

FlowRouter.route('/', {
	name: 'home',
	action: function (params) {
		console.log("TESTING ACTION!");
		BlazeLayout.render('mainBody', {
			main: 'placesList'
		});
	},

	triggersEnter: function () {
		console.log("TESTING ENTER!");
	},

	triggersExit: function () {
		console.log("TESTING EXIT!");
	}
});

// Router.route('home', {
// 	path: '/',
// 	template: 'placesList'
// });

FlowRouter.route('/about', {
	name: 'aboutus',
	action: function (params) {
		console.log("TESTING ACTION ABOUT");
		BlazeLayout.render('mainBody', {
			main: 'aboutUs'
		});
	},

	triggersEnter: function () {
		console.log('TESTING ENTER ABOUT');
	},

	triggersExit: function () {
		console.log('TESTING EXIT ABOUT');
	}
});

// Router.route('aboutus', {
// 	path: '/about',
// 	template: 'aboutUs'
// });

// Router.route('contactus', {
// 	path: '/contact',
// 	template: 'contactUs'
// });

// Router.route('adminLogin', {
// 	path: '/login',
// 	template: 'adminLogin'
// });

// Router.route('adminDashboardHome', {
// 	path: '/dashboard',
// 	template: 'adminDashboardHome'
// });

// Router.route('adminDashboardPlaces', {
// 	path: '/dashboard/places',
// 	template: 'adminDashboardPlaces'
// });

// Router.route('adminDashboardUsers', {
// 	path: '/dashboard/users',
// 	waitOn: function () {
// 		return [subsManager.subscribe('userList')];
// 	},
// 	action: function () {
// 		this.render('adminDashboardUsers');
// 		console.log('Rendering...');
// 	}
// });

// Router.route('adminDashboardAbout', {
// 	path: '/dashboard/about',
// 	template: 'adminDashboardAbout'
// });