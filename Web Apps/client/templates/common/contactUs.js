Template.contactUs.onRendered(function () {
	var self = this;
	var contactValidator = self.$('#contact-us-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();

			var name = self.$('#contact-us-name').val(),
				email = self.$('#contact-us-email').val(),
				subject = self.$('#contact-us-subject').val(),
				message = self.$('#contact-us-message').val();

			Meteor.call('sendEmail', name + " <" + email + ">", "Where Got Seats Customer Support <support@wheregotseats.com>", subject, message, function (error) {
				if (error) {
					swal({
						title: 'Contact Us', 
						text: error.reason, 
						type: 'error'
					});
				} else {
					swal({
						title: 'Contact Us', 
						text: 'Message is sent successfully!', 
						type: 'success'
					}, function () {
						self.find('#contact-us-form').reset();
					});
				}
			});
		},
		rules: {
			name: {
				minlength: 3,
				maxlength: 50,
				required: true,
			},
			email: {
				minlength: 3,
				maxlength: 50,
				required: true
			},
			subject: {
				minlength: 5,
				maxlength: 100,
				required: true
			},
			message: {
				minlength: 10,
				maxlength: 300,
				required: true
			}
		},
		messages: {
			name: {
				required: "Please enter your name",
				minlength: "Your name must be between 3 to 50 characters",
				maxlength: "Your name must be between 3 to 50 characters"
			},
			email: {
				required: "Please enter your email address",
				minlength: "Your email must be between 3 to 50 characters",
				maxlength: "Your email must be between 3 to 50 characters"
			},
			subject: {
				required: "Please enter the message subject",
				minlength: "The message subject must be between 5 to 100 characters",
				maxlength: "The message subject must be between 5 to 100 characters"
			},
			message: {
				required: "Please enter the message",
				minlength: "The message must be between 10 to 300 characters",
				maxlength: "The message must be between 10 to 300 characters"
			}
		},
		highlight: function (element) {
			self.$(element).closest('.form-group').addClass('has-error');
			self.$(element).closest('.form-group').removeClass('has-success');
		},
		unhighlight: function (element) {
			self.$(element).closest('.form-group').addClass('has-success');
			self.$(element).closest('.form-group').removeClass('has-error');
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