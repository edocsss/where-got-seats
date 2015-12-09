Template.adminDashboardUsers.onRendered(function () {
	var addUserValidator = $('#add-user-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();
			var name = $('#add-user-name').val(),
				email = $('#add-user-email').val(),
				department = $('#add-user-department').val(),
				jobTitle = $('#add-user-job-title').val(),
				address = $('#add-user-address').val(),
				contact = $('#add-user-contact').val();

			Meteor.call('addUser', name, email, department, jobTitle, address, contact, function (error) {
				if (error) {
	 				swal('Add New User', error.reason, 'error');
	 			} else {
	 				swal({
	 					title: 'Add New User',
	 					text: 'The new user has successfully been registered!',
	 					type: 'success'
	 				}, function () {
	 					$("#add-user-modal").modal('hide');
	 					$('#add-user-form')[0].reset();
	 					$('#add-user-form .form-group').removeClass('has-success');
	 				});
	 			}
			});
		},
		rules: {
			name: {
				minlength: 3,
				maxlength: 100,
				required: true
			},
			email: {
				minlength: 3,
				maxlength: 50,
				required: true
			},
			department: {
				minlength: 1,
				maxlength: 50,
				required: true
			},
			jobTitle: {
				minlength: 1,
				maxlength: 50,
				required: true
			},
			address: {
				minlength: 3,
				maxlength: 100,
				required: true
			},
			contact: {
				minlength: 8,
				maxlength: 8,
				digits: true,
				required: true
			}
		},
		messages: {
			name: {
				minlength: "The new user's name must be between 3 to 100 characters!",
				maxlength: "The new user's name must be between 3 to 100 characters!",
				required: "You must enter the new user's name!"
			},
			email: {
				minlength: "The new user's email address must be between 3 to 50 characters!",
				maxlength: "The new user's email address must be between 3 to 50 characters!",
				required: "You must enter the new user's email address!"
			},
			department: {
				minlength: "The new user's department name must be between 1 to 50 characters!",
				maxlength: "The new user's department name must be between 1 to 50 characters!",
				required: "You must enter the new user's department name!"
			},
			jobTitle: {
				minlength: "The new user's job title must be between 1 to 50 characters!",
				maxlength: "The new user's job title must be between 1 to 50 characters!",
				required: "You must enter the new user's job title!"
			},
			address: {
				minlength: "The new user's address must be between 3 to 100 characters!",
				maxlength: "The new user's address must be between 3 to 100 characters!",
				required: "You must enter the new user's address!"
			},
			contact: {
				minlength: "The new user's contact number must be exactly 8 digits!",
				maxlength: "The new user's contact number must be exactly 8 digits!",
				digits: "The new user's contact number must consist of valid digits only!",
				required: "You must enter the new user's contact number!"
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

Template.adminDashboardUsers.helpers({
	isEmptyUserList: function () {
		return Meteor.users.find().count() === 0;
	},

	userList: function () {
		return 	Meteor.users.find({}, {
					sort: {
						'profile.name': 1
					}
				});
	}
});

Template.adminDashboardUsers.events({
	'click #user-table tbody tr': function (e) {
		console.log(e.target, this);
	}
});