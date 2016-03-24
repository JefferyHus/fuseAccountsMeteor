Template.welcomen.helpers({
	user: function () {
		return Meteor.user();
	},
	provider: function(){
		return _supportedProviders;
	},
	connectedProviders: function(providerName){
		if(Meteor.user()){
			var services = Meteor.user().services;
			for(let provider in services){
				if(provider == providerName){
					return "active";
					break;
				}
			}
		}else{
			return false;
		}
	}
});

Template.welcomen.onRendered(function(){
	;(function(){

		// Menu settings
		$('#menuToggle, .menu-close').on('click', function(){
			$('#menuToggle').toggleClass('active');
			$('body').toggleClass('body-push-toleft');
			$('#theMenu').toggleClass('menu-open');
		});


	})(jQuery)
});

Template.welcomen.events({
	'click #logout': function () {
		Meteor.logout(function (error) {
			if (error) {
				console.log('error', error);
			}
			// Clear all keys
			Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
			Session.keys = {};
			//redirect to singin
			Router.go("/", {}, {replaceState: true});
		});
	},
	'click .provider': function(e, template){
		e.preventDefault();

		var provider = this.name;
		
		var functionSignInWith = "signInWith" + _capitalizeWord(provider);

		

		Jsama[functionSignInWith]();
	}
});