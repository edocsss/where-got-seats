/*
*	A function that builds a regex based on a text input
*/
function buildRegExp(searchText) {
	var words = searchText.trim().split(/[ \-\:]+/);
	var exps = _.map(words, function (word) {
		return "(?=.*" + word + ")";
	});

	var fullExp = exps.join('') + ".+";
	return new RegExp(fullExp, "i");
}

/**
* Setup the publication for Search Source package --> for searching for Places in the Client side
**/
SearchSource.defineSource('places', function (searchText, options) {
	// If the fields are NOT specified, it will RETURN ALL fields
	// This SEARCH SOURCE package DOES NOT use the documents returned by the subscribed publication
	// It is like a bypass to the server's MongoDB (NOT USING THE MINIMONGO!!)
	var dbOptions = {
		sort: {
			'name': 1
		},
		fields: {
			'maps': 0
		}
	};

	if (searchText) {
		var regExp = buildRegExp(searchText);
		return Places.find({
			name: regExp
		}, dbOptions).fetch();
	} else {
		return Places.find({}, dbOptions).fetch();
	}
});