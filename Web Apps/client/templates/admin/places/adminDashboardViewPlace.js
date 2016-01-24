Template.adminDashboardViewPlace.helpers({
	getPlaceData: function () {
		return Places.findOne({
			_id: FlowRouter.getParam('placeId')
		});
	},

	isEmptyMapList: function () {
		return Places.findOne({
			_id: FlowRouter.getParam('placeId')
		}).maps.length === 0;
	},

	mapList: function () {
		var maps =  Places.findOne({
						_id: FlowRouter.getParam('placeId')
					}).maps;

		// Array of objects sort 
		maps.sort(function (a, b) {
			if (a.name > b.name) {
				return 1;
			} else if (a.name < b.name) {
				return -1;
			} else {
				return 0;
			}
		});

		return maps;
	},

	getPlaceImage: function () {
		var placeImageId = this.placeImageId;
		return PlacesImages.findOne({
			_id: placeImageId
		});
	}
});

Template.adminDashboardViewPlace.events({
	'click .delete-place-button': function () {
		swal({
			title: "Are you sure?",
			text: "This will remove all the place's details and maps!",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Delete",
			closeOnConfirm: false,
			confirmButtonColor: '#E51C23',
			html: false
		}, (function () {
			Meteor.call('deletePlace', this._id, this.placeImageId, function (error) {
				if (error) {
					swal('Delete Place', error.reason, 'error');
				} else {
					swal('Delete Place', 'The place has been successfully remove from the database!', 'success');
					FlowRouter.go(FlowRouter.path('adminDashboardPlaces'));
				}
			});
		}).bind(this));
	},

	'click .edit-place-details-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardEditPlace', {
			placeId: this._id
		}));
	}
});

/* ********************************************************************** */

Template.adminDashboardViewPlaceAddMapForm.onRendered(function () {
	var self = this;
	var addMapValidator = self.$('#add-map-form').validate({
		submitHandler: function (form, event) {
			event.preventDefault();

			var imageFile = self.find('#add-map-blueprint').files[0];
			MapsImages.insert(imageFile, function (error, doc) {
				if (error) {
					swal({
						title: "Image Upload",
						text: "Error during uploading place's image!",
						type: "error"
					});

					return false;
				} else {
					var name = self.$('#add-map-name').val();

					Meteor.call('addMap', FlowRouter.getParam('placeId'), name, doc._id, function (error) {
						if (error) {
							swal({
								title: "Add New Map",
								text: error.reason,
								type: "error"
							});
						} else {
							// This subscription is needed as the publication in the server side is NOT REACTIVE (only the returned cursor is reactive)!!
							Meteor.subscribe('mapImageData', doc._id);
							swal({
								title: "Add New Map",
								text: "The new map has been successfully stored!",
								type: "success"
							}, function () {
								self.$("#add-map-modal").modal('hide');
			 					self.$('#add-map-form')[0].reset();
			 					self.$('#add-map-form .form-group').removeClass('has-success');
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
			blueprint: {
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
			blueprint: {
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

Template.adminDashboardViewPlaceAddMapForm.events({
	'click #add-map-file-remove-button': function () {
		var el = Template.instance().$('#add-map-blueprint');

		el.wrap('<form>').parent('form').trigger('reset');
		el.unwrap();

		el.closest('div.form-group').removeClass('has-success has-error');
	}
});

/* ********************************************************************** */

Template.mapListItem.helpers({
	getMapImage: function () {
		var mapImageId = this.mapImageId;
		return MapsImages.findOne({
			_id: mapImageId
		});
	}
});

Template.mapListItem.events({
	'mouseenter .map-list-item-container': function (e) {
		Template.instance().$(e.currentTarget.firstElementChild).animate({
			'opacity': 1
		}, {
			queue: false
		});
	},

	'mouseleave .map-list-item-container': function (e) {
		Template.instance().$(e.currentTarget.firstElementChild).animate({
			'opacity': '0'
		}, {
			queue: false
		});
	},

	'click .map-list-item-container': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardViewMap', {
			placeId: FlowRouter.getParam('placeId'),
			mapId: this.mapId
		}));
	}
});