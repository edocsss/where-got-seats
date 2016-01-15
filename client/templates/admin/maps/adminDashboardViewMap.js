Template.adminDashboardViewMap.helpers({
	getMapData: function () {
		var map = Places.findOne({
					'_id': FlowRouter.getParam('placeId')
				}).maps[0];

		return map;
	},

	getNumberOfSeats: function () {
		return Seats.find({
			mapId: FlowRouter.getParam('mapId')
		}).count();
	},

	getNumberOfAvailableSeats: function () {
		return Seats.find({
			mapId: FlowRouter.getParam('mapId'),
			available: true
		}).count();
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
			Meteor.call('deleteMap', FlowRouter.getParam('placeId'), FlowRouter.getParam('mapId'), this.mapImageId, function (error) {
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
			mapId: FlowRouter.getParam('mapId')
		}));
	},

	'click #view-map-back-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardViewPlace', {
			placeId: FlowRouter.getParam('placeId')
		}));
	}
});

/* ************************************************************* */


/*
	IMPORTANT NOTE!!
	As for now, a seat editing process does not allow dragging of the circle to the new location.
	Instead, the user can delete the old seat and add a new one.

	One possible way to achieve dragging in the future is to use a MARKER with CUSTOM ICON --> need to create a CIRCLE ICON
	http://stackoverflow.com/questions/27061820/how-to-make-a-leaflet-circlemarker-draggable

	For current version, I do not think that dragging a seat into a new location adds a lot of value to the user since
	the user is unlikely to do location modification frequently.

	Another way is: just change the device ID instead of the location
*/

Template.adminDashboardViewMapLeaflet.onRendered(function () {
	var self = this;
	self.blueprint = L.map('map-viewer', {
		minZoom: 1,
		maxZoom: 4,
		center: [0, 0],
		zoom: 1,
		touchZoom: false,
		crs: L.CRS.Simple
	});

	var mapImageId = Places.findOne({
			'_id': FlowRouter.getParam('placeId')
		}).maps[0].mapImageId,

		mapImage = MapsImages.findOne({
			'_id': mapImageId
		}),

		mapImageURL = mapImage.url();
		
	// This trick is for calculating the blueprint's width and height
	var blueprintImage = new Image();
	blueprintImage.src = mapImageURL;
	blueprintImage.onload = function () {
		var mapImageWidth = blueprintImage.width,
		mapImageHeight = blueprintImage.height;

		self.$('#map-viewer').resize(function () {
			// calculate the edges of the image, in coordinate space
			var southWest = self.blueprint.unproject([0, mapImageHeight], self.blueprint.getMaxZoom() - 1);
			var northEast = self.blueprint.unproject([mapImageWidth, 0], self.blueprint.getMaxZoom() - 1);
			var bounds = new L.LatLngBounds(southWest, northEast);

			// Add image
			var imageOverlay = L.imageOverlay(mapImageURL, bounds).addTo(self.blueprint);			

			// Tell leaflet that the map is exactly as big as the image
			self.blueprint.setMaxBounds(bounds);
		});

		self.$('#map-viewer').trigger('resize');
	};


	// Store all seat circles created in the observe()
	var seatsStore = {};

	// Retrieve all seat objects from database --> populate data (using observe)
	Seats.find({
		mapId: FlowRouter.getParam('mapId')
	}).observe({
		added: function (newSeat) {
			var seatOutlineColor, seatFillColor, newSeatCircle;
			if (newSeat.available) {
				seatOutlineColor = 'green';
				seatFillColor = 'green';
			} else {
				seatOutlineColor = 'red';
				seatFillColor = '#F03';
			}

			// Only create a new circle when that seat's document ID is not registered yet in the seatsStore
			if (seatsStore[newSeat._id] === undefined) {
				newSeatCircle = L.circleMarker(newSeat.latLng, {
					color: seatOutlineColor,
					fillColor: seatFillColor,
					fillOpacity: 1,
					radius: 4
				});

				// Adding the newSeatCircle marker to the blueprint
				self.blueprint.addLayer(newSeatCircle);

				newSeatCircle.bindPopup(L.popup({
					minWidth: 150,
					keepInView: true,
					autoPanPaddingTopLeft: L.point(50, 50) // Make sure that there is some space between the top container and the popup
				}).setContent(Blaze.toHTMLWithData(Template.adminDashboardEditSeatForm, {
					deviceId: newSeat.deviceId,
					seatId: newSeat._id
				})));

				// Remove / close any marker on the map when the circle is opened
				newSeatCircle.on('click', function () {
					// Add the seat validator IF AND ONLY IF THE EDIT NEW SEAT FORM HAS BEEN ADDED TO THE POPUP CONTENT AREA!
					// Once this validator is added, it needs not be called again (or created) in contrast to the addNewSeatValidator below
					// It is because whenever the popup is opened (by clicking), the editSeatValidator is automatically created again by this listener
					var editSeatValidator = self.$('#edit-seat-form').validate({
						submitHandler: function (form, event) {
							event.preventDefault();

							var newDeviceId = form['device-id'].value;
							Meteor.call('editSeat', newSeat._id, newDeviceId, function (error, result) {
								if (error) {
									swal({
										title: "Edit New Seat",
										text: error.reason,
										type: "error"
									});
								} else {
									swal({
										title: "Edit New Seat",
										text: "You have successfully modified a seat!",
										type: "success"
									});
								}
							});
						},
						rules: {
							'device-id': {
								required: true,
								minlength: 3,
								maxlength: 10
							}
						},
						messages: {
							name: {
								required: "You must provide the hardware's device ID!",
								minlength: "The hardware's device ID must be between 3 to 50 characters!",
								maxlength: "The hardware's device ID must be between 3 to 50 characters!"
							}
						},
						highlight: function (element) {
							self.$(element).closest('.form-group').addClass('has-error');
							self.$(element).closest('.form-group').removeClass('has-success');
						},
						unhighlight: function (element) {
							self.$(element).closest('.form-group').addClass('has-success');
							self.$(element).closest('.form-group').removeClass('has-error');
						},
						errorElement: 'span',
						errorClass: 'help-block',
						errorPlacement: function (error, element) {
							if (element.parent('.input-group').length) {
								error.insertAfter(element.parent());
							} else {
								error.insertAfter(element);
							}
						}
					});

					// We cannot use Template.XXX.events() because the Blaze template is CONVERTED INTO HTML, instead of rendered (?)
					// I have tried to handle the CLICK event through .events() and it does not listen to the click
					self.$('#edit-seat-delete-button').click(function () {
						swal({
							title: "Are you sure?",
							text: "This will remove all details of the seat!",
							type: "warning",
							showCancelButton: true,
							confirmButtonText: "Delete",
							closeOnConfirm: false,
							confirmButtonColor: '#E51C23',
							html: false
						}, function () {
							Meteor.call('deleteSeat', newSeat._id, function (error) {
								if (error) {
									swal('Delete Seat', error.reason, 'error');
								} else {
									swal('Delete Seat', 'The seat has been successfully remove from the database!', 'success');
								}
							});
						});
					});

					// Close any opened marker, if there is one
					if (!self.possibleNewSeat) {
						return;
					} else {
						self.blueprint.removeLayer(self.possibleNewSeat);
						self.possibleNewSeat = null;
					}
				});
				
				seatsStore[newSeat._id] = newSeatCircle;
			}
		},

		changed: function (newSeat, oldSeat) {
			// Re-bind a new pop-up
			var circleMarker = seatsStore[oldSeat._id];
			circleMarker.bindPopup(L.popup({
				minWidth: 150,
				keepInView: true,
				autoPanPaddingTopLeft: L.point(50, 50) // Make sure that there is some space between the top container and the popup
			}).setContent(Blaze.toHTMLWithData(Template.adminDashboardEditSeatForm, {
				deviceId: newSeat.deviceId,
				seatId: newSeat._id
			})));

			var seatOutlineColor, seatFillColor;
			if (newSeat.available) {
				seatOutlineColor = 'green';
				seatFillColor = 'green';
			} else {
				seatOutlineColor = 'red';
				seatFillColor = '#F03';
			}

			circleMarker.setStyle({
				color: seatOutlineColor,
				fillColor: seatFillColor
			});
		},

		removed: function (oldSeat) {
			// Remove that circleMarker layer from self.blueprint
			// Take the object from seatsStore[oldeSeat.deviceId]
			// Pass the circleMarker object to the self.blueprint.removeLayer(circleMarkerObject)
			var removedCircleMarker = seatsStore[oldSeat._id];
			self.blueprint.removeLayer(removedCircleMarker);

			delete seatsStore[oldSeat._id];
		}
	});


	// Handle clicks on the blueprint --> open a popup and temporary marker where the seat may be added
	// Store in the template's instance object --> enable data access from the form validator for adding the seat form
	self.blueprint.on('click', function (e) {
		// The marker image is in the 'public' folder of the meteor apps, so there is a need to change the marker image URL
		// in the leaflet JS file
		if (!self.possibleNewSeat) {
			self.possibleNewSeat = L.marker(e.latlng, {
				draggable: true
			}).addTo(self.blueprint);

			self.possibleNewSeat.bindPopup(L.popup({
				minWidth: 150,
				keepInView: true,
				autoPanPaddingTopLeft: L.point(50, 50) // Make sure that there is some space between the top container and the popup
			}).setContent(Blaze.toHTML(Template.adminDashboardAddNewSeatForm))).openPopup();

			// Also open the pop up on dragend
			// Register event only on the first time the marker is created!
			self.possibleNewSeat.on('dragend', function (e) {
				self.possibleNewSeat.openPopup();
			});
		} else {
			// If there is already a marker defined, only need to re-position the marker and open the same popup
			self.possibleNewSeat.setLatLng(e.latlng).openPopup();
		}

		// Add the seat validator IF AND ONLY IF THE ADD NEW SEAT FORM HAS BEEN ADDED TO THE POPUP CONTENT AREA!
		// We cannot put the validator only in the first IF position --> when it is closed and opened, there will be submission problem
		// The problem is because once the marker is moved to a new location or closed, the form is destroyed BUT the validator created before refers to THAT PARTICULAR FORM (although using the same ID)
		// Thus, need to re-create a validator every time
		var addSeatValidator = self.$('#add-seat-form').validate({
			submitHandler: function (form, event) {
				event.preventDefault();

				var deviceId = self.$('#add-seat-device-id').val();
				Meteor.call('addSeat', FlowRouter.getParam('mapId'), deviceId, self.possibleNewSeat.getLatLng(), function (error, result) {
					if (error) {
						swal({
							title: "Add New Seat",
							text: error.reason,
							type: "error"
						});
					} else {
						self.blueprint.removeLayer(self.possibleNewSeat);
						self.possibleNewSeat = null;
						swal({
							title: "Add New Seat",
							text: "You have successfully added a new seat!",
							type: "success"
						});
					}
				});
			},
			rules: {
				'device-id': {
					required: true,
					minlength: 3,
					maxlength: 10
				}
			},
			messages: {
				name: {
					required: "You must provide the hardware's device ID!",
					minlength: "The hardware's device ID must be between 3 to 50 characters!",
					maxlength: "The hardware's device ID must be between 3 to 50 characters!"
				}
			},
			highlight: function (element) {
				self.$(element).closest('.form-group').addClass('has-error');
				self.$(element).closest('.form-group').removeClass('has-success');
			},
			unhighlight: function (element) {
				self.$(element).closest('.form-group').addClass('has-success');
				self.$(element).closest('.form-group').removeClass('has-error');
			},
			errorElement: 'span',
			errorClass: 'help-block',
			errorPlacement: function (error, element) {
				if (element.parent('.input-group').length) {
					error.insertAfter(element.parent());
				} else {
					error.insertAfter(element);
				}
			}
		});
		
		// Replacing the CROSS symbol on the popup
		self.$('#add-seat-close-button').click(function () {
			self.possibleNewSeat.closePopup();
		});
	});
});