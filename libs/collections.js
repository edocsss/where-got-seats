/**
*	Author: Edwin Candinegara
**/

/**
*	Format:
*	- Name
*	- Address
*	- Seats --> another object
*		- Device ID
*		- Availability
*		- Building Level --> can be NA if there is only one floor
*	- Picture --> One picture of the building (for the main user interface --> places list)
*	- Map --> Array of blueprints --> for each floor
**/
Places = new Mongo.Collection('places');

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