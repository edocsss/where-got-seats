/**
*	Author: Edwin Candinegara
**/

Template.adminLogin.onRendered(function () {
	var loginValidator = $('#admin-login-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();
			var email = $('#admin-login-email').val(),
				password = $('#admin-login-password').val();

			Meteor.loginWithPassword(email, password, function (error) {
				if (error) {
					if (error.reason == "User not found") {
						loginValidator.showErrors({
							email: "Your email address is not registered!"
						});
					}

					if (error.reason == "Incorrect password") {
						loginValidator.showErrors({
							password: "Your password is wrong!"
						});
					}

					if (error.reason != "User not found" && error.reason != "Incorrect password") {
						swal('Admin Login', error.reason, 'error');
					}
				} else {
					swal({
						title: 'Admin Login', 
						text: 'Successful Login!', 
						type: 'success'
					}, function () {
						FlowRouter.go('adminDashboardHome');
					});
				}
			});
		},
		rules: {
			email: {
				minlength: 3,
				maxlength: 50,
				required: true
			},
			password: {
				minlength: 8,
				required: true
			}
		},
		messages: {
			email: {
				required: "You must enter your email!",
				minlength: "Your email must be between 3 to 50 characters!",
				maxlength: "Your email must be between 3 to 50 characters!"
			},
			password: {
				required: "You must enter your password!",
				minlength: "Your password must be at least 8 characters"
			}
		},
		highlight: function (element) {
			$(element).closest('.form-group').addClass('has-error');
			$(element).closest('.form-group').removeClass('has-success');
		},
		unhighlight: function (element) {
			$(element).closest('.form-group').addClass('has-success');
			$(element).closest('.form-group').removeClass('has-error');
		},
		errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function (error, element) {
			if (element.parent('.input-group').length) {
				error.insertAfter(element.parent());
			} else {
				error.insertAfter(element);
			}
		}
	});
});