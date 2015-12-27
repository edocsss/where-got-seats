Template.adminDashboardViewMap.helpers({
	getMapData: function () {
		var map = Places.findOne({
					'_id': FlowRouter.getParam('placeId')
				}).maps[0];

		return map;
	},

	getNumberOfSeats: function () {
		var seats = Places.findOne({
			_id: FlowRouter.getParam('placeId')
		}).maps[0].seats;

		return seats.length;
	},

	getNumberOfAvailableSeats: function () {
		var seats = Places.findOne({
			_id: FlowRouter.getParam('placeId')
		}).maps[0].seats;

		// Filtering 
		var availableSeats;

		if (seats.length > 0) {
			availableSeats = seats.filter(function (seat) {
				return seat.available;
			});
		} else {
			availableSeats = [];
		}

		return availableSeats.length;
	}
});

Template.adminDashboardViewMap.events({
	'click #delete-map-button': function () {
		swal({
			title: "Are you sure?",
			text: "This will remove all the map's details, including seats!",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Delete",
			closeOnConfirm: false,
			confirmButtonColor: '#E51C23',
			html: false
		}, (function () {
			Meteor.call('deleteMap', FlowRouter.getParam('placeId'), this.name, this.mapImageId, function (error) {
				if (error) {
					swal('Delete Map', error.reason, 'error');
				} else {
					swal('Delete Map', 'The map has been successfully remove from the database!', 'success');
					FlowRouter.go(FlowRouter.path('adminDashboardViewPlace', {
						placeId: FlowRouter.getParam('placeId')
					}));
				}
			});
		}).bind(this));
	},

	'click #edit-map-details-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardEditMap', {
			placeId: FlowRouter.getParam('placeId'),
			mapName: FlowRouter.getParam('mapName')
		}));
	},

	'click #view-map-back-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardViewPlace', {
			placeId: FlowRouter.getParam('placeId')
		}));
	}
});