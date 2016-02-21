function isLoggedIn () {
	var currentUser = Meteor.user();
	return !!currentUser;
}

function isAdmin () {
	var currentUser = Meteor.user();
	return currentUser.profile.type === 'admin';
}

function isHardwareUpdater () {
	var currentUser = Meteor.user();
	return currentUser.profile.type === 'hardware_updater';
}

function checkCurrentUserAdmin () {
	if (!isLoggedIn() || !isAdmin()) {
		throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");			
	}
}

function checkCurrentUserHardwareUpdater () {
	if (!isLoggedIn() || !isHardwareUpdater()) {
		throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
	}
}

Meteor.methods({
	sendEmail: function (from, to, subject, html) {
		checkCurrentUserAdmin();

		check([to, from, subject, html], [String]);
		this.unblock();

		Email.send({
			to: to,
			from: from,
			subject: subject,
			html: html
		});
	},

	/* ********************* USER RELATED ********************* */

	addUser: function (name, email, department, jobTitle, address, contact) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([name, email, department, jobTitle, address, contact], [String]);

		var newOperatorId = Accounts.createUser({
			email: email,
			profile: {
				name: name,
				email: email,
				contact: contact,
				address: address,
				department: department,
				jobTitle: jobTitle,
				type: 'admin',
				createdBy: Meteor.user().emails[0].address
			}
		});

		Accounts.sendEnrollmentEmail(newOperatorId);
	},

	editUser: function (userId, name, department, jobTitle, address, contact) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([userId, name, department, jobTitle, address, contact], [String]);

		Meteor.users.update({
				_id: userId
			}, {
			$set: {
				'profile.name': name,
				'profile.department': department,
				'profile.jobTitle': jobTitle,
				'profile.address': address,
				'profile.contact': contact
			}
		});
	},

	deleteUser: function (userId) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check(userId, String);
		Meteor.users.remove({
			_id: userId
		});
	},

	/* ********************* PLACE RELATED ********************* */

	addPlace: function (name, address, description, imageId) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([name, address, description, imageId], [String]);
		var placeCheck = Places.findOne({
			name: name
		});

		if (placeCheck) {
			throw new Meteor.Error("Duplicate Place", "There is another place with the same name in the database!");
		}

		Places.insert({
			name: name,
			address: address,
			description: description,
			placeImageId: imageId,
			maps: []
		});
	},

	editPlace: function (placeId, name, address, description, newImageId) {
		checkCurrentUserAdmin();

		check([placeId, name, address, description], [String]);
		check(newImageId, Match.OneOf(undefined, String));

		// If newImageId exists --> need to remove old picture
		if (newImageId !== undefined && newImageId.length > 0) {
			var oldImageId =  Places.findOne({
									_id: placeId
								}).placeImageId;

			PlacesImages.remove({
				_id: oldImageId
			});

			// Update Places document
			Places.update({
				_id: placeId
			}, {
				$set: {
					name: name,
					address: address,
					description: description,
					placeImageId: newImageId
				}
			});
		} else if (newImageId === undefined) {
			Places.update({
				_id: placeId
			}, {
				$set: {
					name: name,
					address: address,
					description: description
				}
			});
		}
	},

	deletePlace: function (placeId, imageId) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([placeId, imageId], [String]);

		// This 'remove' is a BLOCKING function call
		PlacesImages.remove({
			_id: imageId
		});

		// Only call this AFTER the places image is REMOVED from PlacesImages collection
		Places.remove({
			_id: placeId
		});
	},

	/* ********************* MAP / BLUEPRINT RELATED ********************* */

	addMap: function (placeId, mapName, mapImageId) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([placeId, mapName, mapImageId], [String]);

		// TODO: May need to check for duplicate names

		var map = {
				mapId: Random.id(), // Need make a random ID for the map since map does not have its own collection!
				name: mapName,
				mapImageId: mapImageId
			};

		// Array Push on Collection Update --> http://stackoverflow.com/questions/21907425/add-element-to-array-collections-update-in-meteor
		Places.update({
			_id: placeId
		}, {
			$push: {
				'maps': map
			}
		});
	},

	// oldMapName is needed to get the Map object to be modified --> without this, we cannot select which object to $set
	editMap: function (placeId, mapId, newMapName, newMapImageId) {
		checkCurrentUserAdmin();

		check([placeId, mapId, newMapName], [String]);
		check(newMapImageId, Match.OneOf(undefined, String));

		// Remove the old map image if newMapImageId exists
		if (newMapImageId !== undefined && newMapImageId.length > 0) {
			var oldMapImageId = Places.findOne({
									'_id': placeId,
									'maps.mapId': mapId
								}).maps[0].mapImageId;

			MapsImages.remove({
				_id: oldMapImageId
			});

			// Update Places document
			Places.update({
				'_id': placeId,
				'maps.mapId': mapId
			}, {
				$set: {
					'maps.$.name': newMapName,
					'maps.$.mapImageId': newMapImageId
				}
			});

			// Remove all seats
			Seats.remove({
				mapId: mapId
			});
		} else if (newMapImageId === undefined) {
			Places.update({
				'_id': placeId,
				'maps.mapId': mapId
			}, {
				$set: {
					'maps.$.name': newMapName
				}
			});
		}
	},

	deleteMap: function (placeId, mapId, mapImageId) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([placeId, mapId, mapImageId], [String]);

		// $pull is a modifier for taking out an array's item by specifying the field to be checked (the map's name in this case)
		// http://stackoverflow.com/questions/9048424/removing-specific-items-from-array-with-mongodb
		Places.update({
			_id: placeId
		}, {
			$pull: {
				'maps': {
					'mapId': mapId
				}
			}
		});

		// Remove the corresponding map's blueprint image
		MapsImages.remove({
			_id: mapImageId
		});
	},

	/* ********************* SEAT RELATED ********************* */

	addSeat: function (mapId, deviceId, latLng) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([mapId, deviceId], [String]);
		check(latLng, { lat: Number, lng: Number });

		var deviceExistence = Seats.findOne({
			deviceId: deviceId
		});

		if (deviceExistence) {
			throw new Meteor.Error("Duplicate Device ID", "There is another device with the same device ID in the database!");
		}

		Seats.insert({
			mapId: mapId,
			deviceId: deviceId,
			available: true,
			latLng: latLng
		});
	},

	editSeat: function (seatId, newDeviceId) {
		checkCurrentUserAdmin();

		// Arguments type checking
		check([seatId, newDeviceId], [String]);

		Seats.update({
			_id: seatId
		}, {
			$set: {
				deviceId: newDeviceId
			}
		});
	},

	deleteSeat: function (seatId) {
		checkCurrentUserAdmin();

		console.log(seatId);

		// Arguments type checking
		check(seatId, String);

		Seats.remove({
			_id: seatId
		});
	},

	/* ********************* HARDWARE RELATED ********************* */

	// Restivus LOGIN API does NOT really LOG the user INTO the system
	// Thus, Meteor.user() === null
	// So, the USER TYPE checking is done in the ENDPOINT ACTION option
	// It seems that the value of the Meteor.user() is assigned to this.user of Restivus, but not assigned globally in Meteor.user()
	// UNLIKE REAL LOGIN
	// Not really sure how it really works behind the scene
	updateSeatAvailability: function (hardwareId, availability) {

		// Arguments type checking
		check(hardwareId, String);
		check(availability, Boolean);

		Seats.update({
			deviceId: hardwareId
		}, {
			$set: {
				available: availability
			}
		});
	}
});