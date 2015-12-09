Meteor.startup(function () {
	if (Meteor.users.find().count() === 0) {
		Accounts.createUser({
			email: 'admin@ntu.edu.sg',
			password: '12345678',
			profile: {
				name: 'Administrator',
				email: 'admin@ntu.edu.sg',
				contact: '12345678',
				address: 'Admin Address',
				department: 'Library',
				jobTitle: 'Lao Pan',
				type: 'admin',
				createdBy: 'system'
			}
		});
	}

	// Setting up Accounts EMAIL TEMPLATE
	Accounts.emailTemplates.siteName = 'Where Got Seats?';
	Accounts.emailTemplates.from = "Where Got Seats Team <no-reply@wheregotseats.com>";

	// Setting up Accounts Enrollment Email Template
	Accounts.emailTemplates.enrollAccount.subject = function (user) {
		return "Your new account has been created!";
	};

	Accounts.emailTemplates.enrollAccount.html = function (user, url) {
		url = url.replace('/#', '');
		var html = "Hi, " + user.profile.name + "!" +
				   "<br><br>" +
				   "We just created an account for you using this email address!" +
				   "<br>" +
				   "Before you are able to login using this email address, we need you to set up your account's password." +
				   "<br>" +
				   "Please click on " + "<a href='" + url + "'>this link</a> " + "to set your account's pasword." +
				   "<br><br>" +
				   "Thank you!" +
				   "<br><br>" +
				   "Regards," +
				   "<br>" +
				   "Where Got Seats Administrator";

		return html;
	};
});