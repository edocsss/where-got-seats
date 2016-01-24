/**
*	Author: Edwin Candinegara
**/

var baseAddress = '';
if (Meteor.isServer) {
	baseAddress = process.env.MONGO_URL;
}

/**
*	Format:
*	- Name
*	- Address
*	- Description
*	- Picture --> One picture of the building (for the main user interface --> places list) --> an Image URL
*	- Maps --> an array of object
			{
				mapId: generated using "random" package --> Random.id()
				name: the map's name
				mapImageId: for joining with the MapsImages
			}
**/
Places = new Mongo.Collection('places');

/**
*	One seat is RELATED to ONE MAP of ONE PLACE --> it is like a ONE to MANY between Maps (inside Places) with Seats
*	Format:
*	- placeId		Primary Key
*	- mapId			Primary Key
*	- deviceId		From hardware
*	- available 	From hardware sensor
*	- latLng		From adding on the leaflet
*
**/
Seats = new Mongo.Collection('seats');

// Stores ONLY PLACES pictures --> https://medium.com/@victorleungtw/how-to-upload-files-with-meteor-js-7b8e811510fa#.mvbjhdotr
// placesImageStore --> file system adapter
// PlacesImages 	--> MongoDB database

// GridFS is a specification for storing nd retrieving files in MongoDB
// That is why the FILE CANNOT BE FOUND in any folder --> in contrast with FileSystem
var placesImageStore = new FS.Store.GridFS('placesImages'); // The name of the adapter is not used actually!

PlacesImages = new FS.Collection('placesImages', {
	stores: [placesImageStore]
});

// Stores ONLY MAPS pictures
var mapsImageStore = new FS.Store.GridFS('mapsImages');

MapsImages = new FS.Collection('mapsImages', {
	stores: [mapsImageStore]
});

// Allow and Deny --> ensure that the CLIENT side CANNOT modify database
// IF the CLIENT is ALLOWED to modify database AND there is NO DENIAL from the SERVER for that action, the action is EXECUTED
// The DENY part is like an OVERRIDING of the ALLOW
Places.deny({
	insert: function () {
		return true;
	},

	update: function () {
		return true;
	},

	remove: function () {
		return true;
	}
});

Places.allow({
	insert: function () {
		return false;
	},

	update: function () {
		return false;
	},

	remove: function () {
		return false;
	}
});

Seats.deny({
	insert: function () {
		return true;
	},

	update: function () {
		return true;
	},

	remove: function () {
		return true;
	}
});

Seats.allow({
	insert: function () {
		return false;
	},

	update: function () {
		return false;
	},

	remove: function () {
		return false;
	}
});

Meteor.users.deny({
	insert: function () {
		return true;
	},

	update: function () {
		return true;
	},

	remove: function () {
		return true;
	}
});

Meteor.users.allow({
	insert: function () {
		return false;
	},

	update: function () {
		return false;
	},

	remove: function () {
		return false;
	}
});

// Recommended to ALLOW INSERT FROM THE CLIENT --> Reduce Complexity
// Need to change DENY and ALLOW with Administrator checking
PlacesImages.deny({
	insert: function () {
		return false;
	},

	// https://github.com/CollectionFS/Meteor-CollectionFS/issues/217
	update: function () {
		return false;
	},

	remove: function () {
		return true;
	},

	download: function () {
		return false;
	}
});

PlacesImages.allow({
	insert: function () {
		return true;
	},
	// https://github.com/CollectionFS/Meteor-CollectionFS/issues/217
	update: function () {
		return true;
	},

	remove: function () {
		return false;
	},

	download: function () {
		return true;
	}
});

MapsImages.deny({
	insert: function () {
		return false;
	},

	// https://github.com/CollectionFS/Meteor-CollectionFS/issues/217
	update: function () {
		return false;
	},

	remove: function () {
		return true;
	},

	download: function () {
		return false;
	}
});

MapsImages.allow({
	insert: function () {
		return true;
	},
	// https://github.com/CollectionFS/Meteor-CollectionFS/issues/217
	update: function () {
		return true;
	},

	remove: function () {
		return false;
	},

	download: function () {
		return true;
	}
});