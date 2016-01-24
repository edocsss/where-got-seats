Template.adminDashboardEditPlace.helpers({
	getPlaceData: function () {
		return Places.findOne({
			_id: FlowRouter.getParam('placeId')
		});
	},
 
	setEditPlaceValidator: function (value) {
		Session.set('editPlaceDOMReady', value);
	}
});


/* ************************************************************************************** */


Template.adminDashboardEditPlaceForm.onRendered(function () {
	// The validator IS ONLY CREATED after the SUBSCRIPTION IS READY
	// The reason is because onRendered function is only executed when the template is rendered
	// However, when the template is rendered, the FORM is NOT CREATED yet due to the IF SUBSCRIPTION READY part
	// So, the validator should only be defined after the form is ready

	// This is a HACK
	// I think another possible way is to use Session and Tracker

	var self = this;
	var editPlaceValidator = self.$('#edit-place-form').validate({
			submitHandler: function (form, event) {
				event.preventDefault();

				var imageInputFiles = self.find('#edit-place-picture').files,
					name = self.$('#edit-place-name').val(),
					address = self.$('#edit-place-address').val(),
					description = self.$('#edit-place-description').val();

				// Replace place image
				if (imageInputFiles.length > 0) {
					PlacesImages.insert(imageInputFiles[0], function (error, doc) {
						if (error) {
							swal({
								title: "Image Upload",
								text: "Error during uploading place's image!",
								type: "error"
							});

							return false;
						} else {
							Meteor.call('editPlace', FlowRouter.getParam('placeId'), name, address, description, doc._id, function (error) {
								if (error) {
									swal({
										title: "Edit Place",
										text: error.reason,
										type: "error"
									});
								} else {
									swal({
										title: "Edit Place",
										text: "The place's details has been successfully modified!",
										type: "success"
									}, function () {
					 					self.$('#edit-place-back-button').click();
									});
								}
							});
						}
					});
				} 

				// Ignore image input
				else {
					Meteor.call('editPlace', FlowRouter.getParam('placeId'), name, address, description, function (error) {
						if (error) {
							swal({
								title: "Edit Place",
								text: error.reason,
								type: "error"
							});
						} else {
							swal({
								title: "Edit Place",
								text: "The place's details has been successfully modified!",
								type: "success"
							}, function () {
								self.$('#edit-place-back-button').click();
							});
						}
					});
				}
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

Template.adminDashboardEditPlaceForm.events({
	'click #edit-place-back-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardViewPlace', {
			placeId: this._id
		}));
	},

	'click #edit-place-file-remove-button': function () {
		var el = Template.instance().$('#edit-place-picture');

		el.wrap('<form>').parent('form').trigger('reset');
		el.unwrap();

		el.closest('div.form-group').removeClass('has-success has-error');		
	}
});