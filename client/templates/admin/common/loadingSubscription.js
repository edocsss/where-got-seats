Template.loadingSubscription.onRendered(function () {
	// For .spinner-container position --> use this hack since the parent's container is not WIDTH = HEIGHT = 100%!
	$(window).resize(function () {
		$(".spinner-container").css('width', ($(window).width() - $("#sidebar-wrapper").width() + 'px'));
		$(".spinner-container").css('height', ($(window).height() - $(".navbar").height() + 'px'));
		$(".spinner-container").css('left', $("#sidebar-wrapper").width() + 'px');
	});

	$(window).resize();

	var options = {
		color: "#333333",
		shadow: true
	},
	
	spinner = new Spinner().spin(document.querySelector('.spinner-container'));
});