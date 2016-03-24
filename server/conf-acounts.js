//set the start function of accounts settings
_startAccountsSettings = function(){
	// first, remove configuration entry in case service is already configured
	Accounts.loginServiceConfiguration.remove({
	  service: "twitter"
	});
	Accounts.loginServiceConfiguration.remove({
	  service: "facebook"
	});
	Accounts.loginServiceConfiguration.remove({
	  service: "google"
	});
	//then insert the new configurations
	Accounts.loginServiceConfiguration.insert({
	  service: "twitter",
	  consumerKey: Meteor.settings.twitterConsumerKey,
	  secret: Meteor.settings.twitterSecret
	});
	
	Accounts.loginServiceConfiguration.insert({
		service: "facebook",
		appId: Meteor.settings.facebookAppId,
		secret: Meteor.settings.facebookSecret
	});
	
	Accounts.loginServiceConfiguration.insert({
		service: "google",
		clientId: Meteor.settings.googleClientId,
		secret: Meteor.settings.googleSecret
	});
}

JsamaMerge.beforeFuse = function(oldAccount, newAccount){

	var mergeItOrNot = true;

	console.log(oldAccount);
	console.log(newAccount);

	var users = Meteor.users.find().fetch(); //get all the current user object

	var currentUserProviderID = "foolish"; //this variable is where we gonna store the provider id

	if(newAccount.id) {
		currentUserProviderID = newAccount.id;
	} else {
		//loop through the user's services object and store the provider id
		for(let service in newAccount.services){
			currentUserProviderID = newAccount.services[service].id;
		}
	}
	//console.log(currentUserProviderID);
	//loop over the user collection object services and compare its provider id with the current one
	//if equals break out the loop and warn the user
	for(let object of users){
		for(let insObj in object.services){
			if(object.services[insObj].id && object.services[insObj].id === currentUserProviderID){
				console.log("this user already exist, please try another provider");
				mergeItOrNot = false;
				break;
			}
		}
	}

	console.log("newAccount._id", newAccount._id);
	var newAccountProfile = Profiles.findOne( { owner : newAccount._id } );
	if( newAccountProfile ) {
		mergeItOrNot = false;
		console.log("This Account is already used in Alerti");
	}

    //return the false or true
	return mergeItOrNot;
};

Meteor.methods( {
	"initProfile" : function() {
		var userID = this.userId;
		var profile = Profiles.findOne( { owner : userID } );
		if( profile ) return;
		Profiles.insert( { owner : userID } );
	}
} );