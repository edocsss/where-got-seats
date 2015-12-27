Template.adminDashboardViewUser.helpers({
	getUserData: function () {
		var user = Meteor.users.findOne({
			'_id': FlowRouter.getParam('userId')
		});

		return user;
	}
});

Template.adminDashboardViewUser.events({
	'click .delete-user-button': function () {
		swal({
            title: "Are you sure?",
            text: "You will not be able to recover this user!",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            closeOnConfirm: false,
            confirmButtonColor: "#E51C23",
            html: false
        }, (function() {
            Meteor.call('deleteUser', this._id, function (error, result) {
				if (error) {
					swal('Delete User', error.reason, 'error');
				} else {
					swal('Delete User', 'The user has been successfully removed from the database!', 'success');
					FlowRouter.go(FlowRouter.path('adminDashboardUsers'));
				}
			});
        }).bind(this));
	},

	'click .edit-user-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardEditUser', {
			userId: this._id
		}));
	}
});