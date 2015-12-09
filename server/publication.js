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
				'profile.email': 1,
			}
		});
	}
});