
Template.adminDashboardPlaces.helpers({
	isEmptyPlaceList: function () {
		return Places.find().count() === 0;
	},

	placeList: function () {
		return Places.find({}, {
			sort: {
				'name': 1
			}
		});
	}
});


Template.adminDashboardPlaces.events({
	'click .view-place': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardViewPlace', {
			placeId: this._id
		}));
	}
});

/* ****************************************************************************************** */

Template.adminDashboardPlacesAddForm.onRendered(function () {
	var self = this;
	var addPlaceValidator = self.$('#add-place-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();

			// Upload image to PlacesImages database first and get the document ID
			var imageFile = self.find('#add-place-picture').files[0];
			PlacesImages.insert(imageFile, function (error, doc) {
				if (error) {
					swal({
						title: "Image Upload",
						text: "Error during uploading place's image!",
						type: "error"
					});

					return false;
				} else {
					var name = self.$('#add-place-name').val(),
						address = self.$('#add-place-address').val(),
						description = self.$('#add-place-description').val();

					Meteor.call('addPlace', name, address, description, doc._id, function (error) {
						if (error) {
							swal({
								title: "Add New Place",
								text: error.reason,
								type: "error"
							});
						} else {
							swal({
								title: "Add New Place",
								text: "The new place has been successfully stored!",
								type: "success"
							}, function () {
								self.$("#add-place-modal").modal('hide');
			 					self.$('#add-place-form')[0].reset();
			 					self.$('#add-place-form .form-group').removeClass('has-success');
							});
						}
					});
				}
			});
		},
		rules: {
			name: {
				required: true,
				minlength: 3,
				maxlength: 50
			},
			address: {
				required: true,
				minlength: 5,
				maxlength: 100
			},
			description: {
				required: true,
				minlength: 10,
				maxlength: 300
			},
			picture: {
				required: true,
				extension: 'jpg|jpeg|png'
			}
		},
		messages: {
			name: {
				required: "You must provide the place's name!",
				minlength: "The place's name must be between 3 to 50 characters!",
				maxlength: "The place's name must be between 3 to 50 characters!"
			},
			address: {
				required: "You must provide the place's address!",
				minlength: "The place's address must be between 5 to 100 characters!",
				maxlength: "The place's address must be between 5 to 100 characters!"
			},
			description: {
				required: "You must provide the place's description!",
				minlength: "The place's description must be between 10 to 300 characters!",
				maxlength: "The place's description must be between 10 to 300 characters!"
			},
			picture: {
				required: "You must provide the place's picture!",
				extension: "The place's picture must be in JPEG or PNG format!"
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

	$.validator.addMethod("extension", function(value, element, param) {
		param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
		return this.optional(element) || value.match(new RegExp("\\.(" + param + ")$", "i"));
	}, $.validator.format("Please enter a value with a valid extension."));
});

Template.adminDashboardPlacesAddForm.events({
	'click #add-place-file-remove-button': function () {
		var el = Template.instance().$('#add-place-picture');

		el.wrap('<form>').parent('form').trigger('reset');
		el.unwrap();

		el.closest('div.form-group').removeClass('has-success has-error');
	}
});