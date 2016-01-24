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
	'click .view-user': function (e) {
		FlowRouter.go(FlowRouter.path('adminDashboardViewUser', {
			userId: this._id
		}));
	}
});

/* ******************************************************************************** */

Template.adminDashboardUsersAddForm.onRendered(function () {
	var self = this;
	var addUserValidator = self.$('#add-user-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();
			
			var name = self.$('#add-user-name').val(),
				email = self.$('#add-user-email').val(),
				department = self.$('#add-user-department').val(),
				jobTitle = self.$('#add-user-job-title').val(),
				address = self.$('#add-user-address').val(),
				contact = self.$('#add-user-contact').val();

			Meteor.call('addUser', name, email, department, jobTitle, address, contact, function (error) {
				if (error) {
	 				swal('Add New User', error.reason, 'error');
	 			} else {
	 				swal({
	 					title: 'Add New User',
	 					text: 'The new user has successfully been registered!',
	 					type: 'success'
	 				}, function () {
	 					self.$("#add-user-modal").modal('hide');
	 					self.$('#add-user-form')[0].reset();
	 					self.$('#add-user-form .form-group').removeClass('has-success');
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