Template.adminDashboardEditUser.helpers({
	getUserData: function () {
		return Meteor.users.findOne({
			_id: FlowRouter.getParam('userId')
		});
	}
});

/* ************************************************************************************ */

Template.adminDashboardEditUserForm.onRendered(function () {
	var self = this;
	var editUserValidator = self.$('#edit-user-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();

			var name = self.$('#edit-user-name').val(),
				department = self.$('#edit-user-department').val(),
				jobTitle = self.$('#edit-user-job-title').val(),
				address = self.$('#edit-user-address').val(),
				contact = self.$('#edit-user-contact').val();

			Meteor.call('editUser', FlowRouter.getParam('userId'), name, department, jobTitle, address, contact, function (error) {
				if (error) {
	 				swal('Edit New User', error.reason, 'error');
	 			} else {
	 				swal({
	 					title: 'Edit User',
	 					text: 'The  user has successfully been modified!',
	 					type: 'success'
	 				}, function () {
	 					self.$('#edit-user-back-button').click();
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
				minlength: "The user's name must be between 3 to 100 characters!",
				maxlength: "The user's name must be between 3 to 100 characters!",
				required: "You must enter the user's name!"
			},
			department: {
				minlength: "The user's department name must be between 1 to 50 characters!",
				maxlength: "The user's department name must be between 1 to 50 characters!",
				required: "You must enter the user's department name!"
			},
			jobTitle: {
				minlength: "The user's job title must be between 1 to 50 characters!",
				maxlength: "The user's job title must be between 1 to 50 characters!",
				required: "You must enter the user's job title!"
			},
			address: {
				minlength: "The user's address must be between 3 to 100 characters!",
				maxlength: "The user's address must be between 3 to 100 characters!",
				required: "You must enter the user's address!"
			},
			contact: {
				minlength: "The user's contact number must be exactly 8 digits!",
				maxlength: "The user's contact number must be exactly 8 digits!",
				digits: "The user's contact number must consist of valid digits only!",
				required: "You must enter the user's contact number!"
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

Template.adminDashboardEditUserForm.events({
	'click #edit-user-back-button': function (e) {
		FlowRouter.go(FlowRouter.path('adminDashboardViewUser', {
			userId: this._id
		}));
	}
});