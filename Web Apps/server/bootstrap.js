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

	// Setting up Restivus package
	var restivusAPI = new Restivus({
		useDefaultAuth: true,
		prettyJSON: true
	}); 

	// Add route for the hardware to update its availability
	// DEFAULT URL: http://[base url here]/api/[REST End Point Route]
	restivusAPI.addRoute('hardware/update/seat', {
		authRequired: true
	}, {
		put: {
			action: function () {
				var updateResult = false;
				if (this.user.profile.type === 'hardware_updater') {
					// Need to PARSE the bodyParams since the data was received in the form of a JSON string --> 'false' and 'true' are considered String
					// The hardwareId MUST BE in the form of String --> for query selector deviceid
					var hardwareId = this.bodyParams.hardwareId;
					var seatAvailability = JSON.parse(this.bodyParams.availability);

					// JSON.parse() convert the seatAvailability String to Boolean --> the request data is in the form of String
					// This is simply a HACK!!
					Meteor.call('updateSeatAvailability', hardwareId, seatAvailability, function (error, result) {
						if (error) {
							console.log('Updating seat availability failed!');
							console.log('Hardware ID: ' + hardwareId);
							console.log('Seat Availabilty: ' + seatAvailability);
							console.log('Reason: ' + (error.reason || error.sanitizedError.reason) );

							updateResult = false;
						} else {
							updateResult = true;
						}
					});
				}

				// Return the correct message based on the update result
				// There is a problem with RESTIVUS that it does NOT read the statusCode property
				// So, assume that the statusCode is in the return body instead

				// The problem is here:
				// if (responseData.body && (responseData.statusCode || responseData.headers)) --> Route.prototype.addToApi
				// So, in this case, responseData.body === false, and this IF part is skipped
				// So, the result CANNOT be put in the RESPONSE BODY DIRECTLY, MUST BE IN THE FORM OF ANOTHER OBJECT
				if (updateResult) {
					return {
						statusCode: 200,
						body: {
							result: true
						}
					};
				} else {
					return {
						statusCode: 500,
						body: {
							result: false
						}
					};
				}
			}
		}
	});
});