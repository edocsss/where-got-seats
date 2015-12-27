Meteor.startup(function () {
	Template.registerHelper('isSubscriptionReady', function (subscriptionName) {
		if (subscriptionName) {
			return FlowRouter.subsReady(subscriptionName);
		} else {
			return FlowRouter.subsReady();
		}
	});
});