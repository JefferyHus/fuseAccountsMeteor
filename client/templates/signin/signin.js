Template.signin.helpers({
	provider: function () {
		return _supportedProviders;
	}
});

Template.signin.events({
	'click .provider': function (e, template) {
		e.preventDefault();

		var provider = this.name;
		
		var functionSignInWith = "signInWith" + _capitalizeWord(provider);

		

		Jsama[functionSignInWith]();
	}
});