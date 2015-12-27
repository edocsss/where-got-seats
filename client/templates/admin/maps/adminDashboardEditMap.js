Template.adminDashboardEditMap.helpers({
	getMapData: function () {
		// If there is an "undefined" error during this function's execution,
		// it is likely that that the $elemMatch operator in the publication returns nothing
		// because the URL is wrong --> the mapName / placeId
		// So, the findOne will only return the ID of the document

		var place = Places.findOne({
						_id: FlowRouter.getParam('placeId')
					});

		console.log(place, place === null);
		var maps = place.maps;
		var map = maps[0];

		return map;
	}
});

/* ****************************************************** */

Template.adminDashboardEditMapForm.onRendered(function () {
	var self = this;
	var editMapValidator = self.$('#edit-map-form').validate({
			submitHandler: function (form, event) {
				event.preventDefault();

				var imageInputFiles = self.find('#edit-map-blueprint').files,
					name = self.$('#edit-map-name').val();

				// Replace place image
				if (imageInputFiles.length > 0) {
					MapsImages.insert(imageInputFiles[0], function (error, doc) {
						if (error) {
							swal({
								title: "Image Upload",
								text: "Error during uploading map's blueprint!",
								type: "error"
							});

							return false;
						} else {
							Meteor.call('editMap', FlowRouter.getParam('placeId'), self.data.name, name, doc._id, function (error) {
								if (error) {
									swal({
										title: "Edit Map",
										text: error.reason,
										type: "error"
									});
								} else {
									// It seems that after the 'editMap' method is called, the template is re-rendered
									// If the map's name is changed, there will be a 'getMapData' error --> because the mapName is needed
									// in the publication (see the $elemMatch problem above)

									// There is a slight delay on the setParams(). It is only executed after the template is re-rendered
									// So, the getMapData error will still be there for a while only

									// This is actually useless as the user will go back to the previous page
									// FlowRouter.setParams({
									// 		mapName: name
									// });

									swal({
										title: "Edit Map",
										text: "The map's details has been successfully modified!",
										type: "success"
									}, function () {
					 					// SOMEHOW IT DOES NOT WORK WITH THE METEOR PROVIDED JQUERY SELECTOR
										// The problem is "Can's select in removed DomRange"
										// It seems after the re-rendering, the button DOM element is removed (dunno why)
										// $('#edit-map-back-button').click();

										// Use go() instead of click() --> easier to alter the params
										FlowRouter.go(FlowRouter.path('adminDashboardViewMap', {
											placeId: FlowRouter.getParam('placeId'),
											mapName: name
										}));
									});
								}
							});
						}
					});
				} 

				// Ignore image input
				else {
					Meteor.call('editMap', FlowRouter.getParam('placeId'), self.data.name, name, function (error) {
						if (error) {
							swal({
								title: "Edit Map",
								text: error.reason,
								type: "error"
							});
						} else {
							// It seems that after the 'editMap' method is called, the template is re-rendered
							// If the map's name is changed, there will be a 'getMapData' error --> because the mapName is needed
							// in the publication (see the $elemMatch problem above)

							// There is a slight delay on the setParams(). It is only executed after the template is re-rendered
							// So, the getMapData error will still be there for a while only

							// This is actually useless as the user will go back to the previous page
							// FlowRouter.setParams({
							// 	mapName: name
							// });

							swal({
								title: "Edit Map",
								text: "The map's details has been successfully modified!",
								type: "success"
							}, function () {
								// SOMEHOW IT DOES NOT WORK WITH THE METEOR PROVIDED JQUERY SELECTOR
								// The problem is "Can's select in removed DomRange"
								// It seems after the re-rendering, the button DOM element is removed (dunno why)
								// $('#edit-map-back-button').click();

								// Use go() instead of click() --> easier to alter the params
								FlowRouter.go(FlowRouter.path('adminDashboardViewMap', {
									placeId: FlowRouter.getParam('placeId'),
									mapName: name
								}));
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
				blueprint: {
					extension: 'jpg|jpeg|png'
				}
			},
			messages: {
				name: {
					required: "You must provide the map's name!",
					minlength: "The map's name must be between 3 to 50 characters!",
					maxlength: "The map's name must be between 3 to 50 characters!"
				},
				blueprint: {
					extension: "The map's blueprint must be in JPEG or PNG format!"
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

Template.adminDashboardEditMap.events({
	'click #edit-map-back-button': function () {
		FlowRouter.go(FlowRouter.path('adminDashboardViewMap', {
			placeId: FlowRouter.getParam('placeId'),
			mapName: FlowRouter.getParam('mapName')
		}));
	},

	'click #edit-map-file-remove-button': function () {
		var el = Template.instance().$('#edit-map-blueprint');

		el.wrap('<form>').parent('form').trigger('reset');
		el.unwrap();

		el.closest('div.form-group').removeClass('has-success has-error');		
	}
});