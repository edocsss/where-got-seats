function checkCurrentUser () {
	var currentUser = Meteor.user();
	if (!currentUser || currentUser.profile.type !== 'admin') {
		throw new Meteor.Error("Unauthorized account", "Youraccount is not authorized!");			
	}
}

Meteor.methods({
	sendEmail: function (from, to, subject, html) {
		checkCurrentUser();

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
		checkCurrentUser();

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
				createdBy: currentUser.emails[0].address
			}
		});

		Accounts.sendEnrollmentEmail(newOperatorId);
	},

	editUser: function (userId, name, department, jobTitle, address, contact) {
		checkCurrentUser();

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
		checkCurrentUser();

		// Arguments type checking
		check(userId, String);
		Meteor.users.remove({
			_id: userId
		});
	},

	/* ********************* PLACE RELATED ********************* */

	addPlace: function (name, address, description, imageId) {
		checkCurrentUser();

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
		checkCurrentUser();

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
		checkCurrentUser();

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
		checkCurrentUser();

		// Arguments type checking
		check([placeId, mapName, mapImageId], [String]);

		// TODO: May need to check for duplicate names

		var map = {
				mapId: Random.id(),
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
		checkCurrentUser();

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
		checkCurrentUser();

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

	addSeat: function (mapId, deviceId, latLng) {
		checkCurrentUser();

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
			available: false,
			latLng: latLng
		});
	},

	editSeat: function (seatId, newDeviceId) {
		checkCurrentUser();

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
		checkCurrentUser();

		// Arguments type checking
		check(seatId, String);

		Seats.remove({
			_id: seatId
		});
	}
});