Template.loadingSubscription.onRendered(function () {
	// For .spinner-container position --> use this hack since the parent's container is not WIDTH = HEIGHT = 100%!
	$(window).resize(function () {
		var sidebar = $('#sidebar-wrapper');
		var sidebarWidth = sidebar.length > 0 ? sidebar.width() : 0;

		$(".spinner-container").css('width', ($(window).width() - sidebarWidth + 'px'));
		$(".spinner-container").css('height', ($(window).height() - $(".navbar").height() + 'px'));
		$(".spinner-container").css('left', sidebarWidth + 'px');
	});

	$(window).resize();

	var options = {
		color: "#333333",
		shadow: true
	},
	
	spinner = new Spinner().spin(document.querySelector('.spinner-container'));
});