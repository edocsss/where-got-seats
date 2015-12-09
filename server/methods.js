Meteor.methods({
	sendEmail: function (from, to, subject, html) {
		check([to, from, subject, html], [String]);
		this.unblock();

		Email.send({
			to: to,
			from: from,
			subject: subject,
			html: html
		});
	},

	addUser: function (name, email, department, jobTitle, address, contact) {
		var currentUser = Meteor.user();
		console.log("CURRENT USER: " + currentUser);

		if (currentUser.profile.type !== 'admin') {
			throw new Meteor.Error("Unauthorized account", "Youraccount is not authorized!");			
		}

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
	}	

});