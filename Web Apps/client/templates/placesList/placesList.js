var shuffleController;
Template.placesList.onRendered(function () {
	// console.log("RENDErED");
	// console.log(document.getElementById('shuffle-container'));

	Session.set('shuffleContainerReady', false);
	var $shuffleContainer = $('#shuffle-container');
	Session.set('shuffleContainerReady', true);
});

Template.placesList.onDestroyed(function () {
	shuffleController = null;
});

Template.placesList.helpers({
	isEmptyPlaceList: function () {
		return Places.find().count() === 0;
	},
	
	getPlaceList: function () {
		return Places.find({}, {
			sort: {
				'name': 1
			}
		});
	},

	// If this is called in the onRendered event, it seems that the library does not handle if there is no '.place-item' item ready
	// So, we need to wait until all the items are rendered before calling
	// Otherwise, there is a problem with the auto-tracker when going back to the template from another template

	// The problem has something to do with "unable to read property X of undefined" --> so most likely because of the items are not 
	// fully rendered yet, then it cannot calculate a certain property
	// Thus, need to wait until all the items and container are fully rendered
	setupShuffleJs: function () {
		if (Session.get('shuffleContainerReady')) {
			shuffleController = $shuffleContainer.shuffle({
				itemSelector: '.place-item'
			});
		}
	}
});

Template.placesList.events({
	'keyup change #place-search-bar': function (e) {
		var searchKeyword = e.currentTarget.value;
		console.log(searchKeyword);
	}
});