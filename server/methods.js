Meteor.methods({
	sendEmail: function (from, to, subject, html) {
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Youraccount is not authorized!");			
		}

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
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Youraccount is not authorized!");			
		}

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
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

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
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

		// Arguments type checking
		check(userId, String);
		Meteor.users.remove({
			_id: userId
		});
	},

	/* ********************* PLACE RELATED ********************* */

	addPlace: function (name, address, description, imageId) {
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

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
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

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
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

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
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

		// Arguments type checking
		check([placeId, mapName, mapImageId], [String]);

		// TODO: May need to check for duplicate names

		var map = {
				name: mapName,
				mapImageId: mapImageId,
				seats: []
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
	editMap: function (placeId, oldMapName, newMapName, newMapImageId) {
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

		check([placeId, oldMapName, newMapName], [String]);
		check(newMapImageId, Match.OneOf(undefined, String));

		// Remove the old map image if newMapImageId exists
		if (newMapImageId !== undefined && newMapImageId.length > 0) {
			var oldMapImageId = Places.findOne({
									'_id': placeId,
									'maps.name': oldMapName
								}).maps[0].mapImageId;

			MapsImages.remove({
				_id: oldMapImageId
			});

			// Update Places document
			Places.update({
				'_id': placeId,
				'maps.name': oldMapName
			}, {
				$set: {
					'maps.$.name': newMapName,
					'maps.$.mapImageId': newMapImageId
				}
			});
		} else if (newMapImageId === undefined) {
			Places.update({
				'_id': placeId,
				'maps.name': oldMapName
			}, {
				$set: {
					'maps.$.name': newMapName
				}
			});
		}
	},

	deleteMap: function (placeId, mapName, mapImageId) {
		var currentUser = Meteor.user();
		if (!currentUser || currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Your account is not authorized!");
		}

		// Arguments type checking
		check([placeId, mapName, mapImageId], [String]);

		// $pull is a modifier for taking out an array's item by specifying the field to be checked (the map's name in this case)
		// http://stackoverflow.com/questions/9048424/removing-specific-items-from-array-with-mongodb
		Places.update({
			_id: placeId
		}, {
			$pull: {
				'maps': {
					'name': mapName
				}
			}
		});

		// Remove the corresponding map's blueprint image
		MapsImages.remove({
			_id: mapImageId
		});
	}
});