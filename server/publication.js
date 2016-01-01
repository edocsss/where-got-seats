/**
*	REMEMBER!!
*	Publication and Subscription are ways to FILLING IN the MINIMONGO ONLY!
*	If let say, the first subscription gets Field A only and the second subscription gets Field B only,
*	a fetch() in the CLIENT side will read both Field A AND Field B!!
**/

// This publication IS NOT APPLICABLE TO THE CURRENT USER DATA!!
// Meteor.user() will still return ADDRESS, CONTACT, ETC.!
Meteor.publish('userList', function () {
	if (!this.userId) return this.ready();
	else {
		return Meteor.users.find({}, {
			fields: {
				'_id': 1,
				'profile.department': 1,
				'profile.jobTitle': 1,
				'profile.name': 1,
				'profile.email': 1
			}
		});
	}
});

Meteor.publish('userData', function (userId) {
	if (!this.userId) return this.ready();
	else {
		return Meteor.users.find({
			'_id': userId
		}, {
			fields: {
				'_id': 1,
				'profile.name': 1,
				'profile.email': 1,
				'profile.contact': 1,
				'profile.address': 1,
				'profile.department': 1,
				'profile.jobTitle': 1,
				'profile.type': 1
			}
		});
	}
});

Meteor.publish('placeList', function () {
	if (!this.userId) return this.ready();
	else {
		return Places.find({}, {
			fields: {
				'placeIamgeId': 0,
				'maps': 0
			}
		});
	}
});

Meteor.publish('viewPlaceData', function (placeId) {
	if (!this.userId) return this.ready();
	else {
		var placeCursor = Places.find({
						'_id': placeId
					});
		
		// It seems that the place and placeCursor definition must be separated (?) --> otherwise, place is undefined
		var place = placeCursor.fetch()[0];
		var placeImageCursor = PlacesImages.find({
							_id: place.placeImageId
						 }),	
			mapIds = place.maps.map(function (map) {
						return map.mapImageId;
					 }),
			mapImagesCursor = MapsImages.find({
							_id: {
								$in: mapIds
							}
						});

		return [placeCursor, placeImageCursor, mapImagesCursor];
	}
});

Meteor.publish('editPlaceData', function (placeId) {
	if (!this.userId) return this.ready();
	else {
		return Places.find({
			'_id': placeId
		}, {
			fields: {
				'maps': 0
			}
		});
	}
});

Meteor.publish('mapImageData', function (mapImageId) {
	if (!this.userId) return this.ready();
	else {
		return MapsImages.find({
			_id: mapImageId
		});
	}
});

Meteor.publish('mapData', function (placeId, mapId) {
	if (!this.userId) return this.ready();
	else {
		var placeDataCursor = Places.find({
								_id: placeId
							}, {
								fields: {
									_id: 1,
									maps: {
										$elemMatch: {
											mapId: mapId // This filters out which map data is shown to the user
										}
									}
								}
							});

		var place = placeDataCursor.fetch()[0];
		var mapImageId = place.maps[0].mapImageId;
		var mapImageCursor = MapsImages.find({
								_id: mapImageId
 							 });

		var seatsCursor = Seats.find({
			mapId: mapId
		});

		return [placeDataCursor, mapImageCursor, seatsCursor];
	}
});

Meteor.publish('editMapData', function (placeId, mapId) {
	if (!this.userId) return this.ready();
	else {
		var placeDataCursor = Places.find({
			_id: placeId
		}, {
			fields: {
				_id: 1,
				maps: {
					$elemMatch: {
						mapId: mapId
					}
				}
			}
		});

		return [placeDataCursor];
	}
});