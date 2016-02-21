/*
* 	Client side Search Source setup
*/
var options = {
	keepHistory: 1000 * 60 * 10,
	localSearch: true
};

// When fields are given to the SearchSource constructor, it will put a bold text on the field "name" when searching
// is conduected.
// However, the name searching is still based on field "name".
// This fields array only SPECIFY whether you want to bold the search text on the matching document or not
// (See the example from Arunoda if not clear)

// Example --> Search Input: Lee
// Result  --> <b>Lee</b> Wee Nam
var fields = ['name'];
PlacesSearch = new SearchSource('places', fields, options);


/* ************************************************************************************************ */

Template.placesList.onRendered(function () {
	// This initializes the retrieval of all PLACES DATA only for the first display
	PlacesSearch.search('');
});

Template.placesList.helpers({
	isEmptyPlaceList: function () {
		return Places.find().count() === 0 || PlacesSearch.getData().length === 0;
	},
	
	getPlaceList: function () {
		return PlacesSearch.getData({
			sort: {
				'name': 1
			}
		});
	},

	isPlaceListLoading: function () {
		if (PlacesSearch.getStatus().loading) return "";
		else return "hide-search-loading-container";
	},

	isEmptySearchPlaceList: function () {
		return PlacesSearch.getData().length === 0;
	}

	// If this is called in the onRendered event, it seems that the library does not handle if there is no '.place-item' item ready
	// So, we need to wait until all the items are rendered before calling
	// Otherwise, there is a problem with the auto-tracker when going back to the template from another template

	// The problem has something to do with "unable to read property X of undefined" --> so most likely because of the items are not 
	// fully rendered yet, then it cannot calculate a certain property
	// Thus, need to wait until all the items and container are fully rendered
	// setupShuffleJs: function () {
	// 	var $shuffleContainer = $('#shuffle-container');
	// 	console.log($shuffleContainer);
	// 	Meteor.setTimeout(function() {
	// 		$shuffleContainer.shuffle();
	// 	}, 1000);
	// }
});

Template.placesList.events({
	// Use throttle so that we AVOID SENDING EVERY KEYSTROKE --> save bandwidth
	// https://meteorhacks.com/implementing-an-instant-search-solution-with-meteor.html
	'keyup #place-search-bar': _.throttle(function (e) {
		var keyword = $(e.target).val().trim();
		PlacesSearch.search(keyword);
	}, 200)
});