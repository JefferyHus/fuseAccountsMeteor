var _youtubeScopes = [ 'https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtube.force-ssl', 'https://www.googleapis.com/auth/youtubepartner' ];
var _googlePlusScopes = [ 'https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.me' ];
var _googleDefaultScopes = [ 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile' ];

Jsama.signInWithFacebook = function() {
	Meteor.signInWithFacebook ( { 
		loginStyle: "popup",
		requestPermissions: ['user_friends', 'user_likes', 'user_posts', 'publish_actions'] 
	}, signInCallBack );
};

Jsama.signInWithYoutube = function() {
	Jsama.signInWithGoogle();
};

Jsama.signInWithGoogleplus = function() {
	Jsama.signInWithGoogle();
};

Jsama.signInWithInstagram = function() {
	Meteor.signInWithInstagram ( {
		loginStyle: "popup",
		requestPermissions: ['basic', 'public_content', 'likes', 'relationships', 'comments', 'follower_list']
	}, signInCallBack );
};

Jsama.signInWithTwitter = function() {
	Meteor.signInWithTwitter ({ loginStyle: "popup"}, signInCallBack );
};

Jsama.signInWithGoogle = function() {
	var scopes = [];
	scopes.push.apply(scopes, _googleDefaultScopes);
	scopes.push.apply(scopes, _youtubeScopes);
	scopes.push.apply(scopes, _googlePlusScopes);

	Meteor.signInWithGoogle ( { 
		loginStyle: "popup",
		requestPermissions: scopes, 
		"requestOfflineToken" : {"google": true},
		"forceApprovalPrompt" : {"google": true} 
	}, signInCallBack );
};

// retrieved from the meteor-accounts-merge-example
// Callback for signInWith<Provider>
signInCallBack = function (error, mergedUserId, mergedOrNot) {
	if(!mergedOrNot){
		console.log("an account already exists");
		return;
	}
	console.log("merged with:", mergedUserId);
};

//Accounts.onLogin(signInCallBack);