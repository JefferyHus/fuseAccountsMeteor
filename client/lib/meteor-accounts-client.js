_createMethodForService = function(service) {
  // Capitalize the first letter of the service name
  var serviceName = _capitalizeWord(service);

  // Register a meteor method for this service
  Meteor['signInWith' + serviceName] = function (options, callback) {
    Meteor.signInWithExternalService ('loginWith' + serviceName, options, callback);
  };
}

Meteor.startup(function () {

  // Do nothing if no accounts packages with oauth are loaded
  if (typeof Accounts !== 'object' || ! Accounts.oauth) {
    return;
  }

  // Get the names of the registered oauth services from the Accounts package
  var services = Accounts.oauth.serviceNames();

  // Create a meteor method for each service
  _.each(services, _createMethodForService);
});

Meteor.signInWithExternalService = function (service, options, callback) {

  var oldUserId = Meteor.userId();
  var oldLoginToken = Accounts._storedLoginToken();

  Meteor[service](options, function (error) {

    if (error) {
      if (typeof callback === 'function') callback (error);
      return;
    }

    var newUserId = Meteor.userId();

    // Not logged in, logging in now.
    if (!oldUserId) {
      Meteor.call("initProfile", function(error, result) { 
        if( error ) {
          console.log("Error on initProfile");
          return;
        }
        console.log("initProfile OK");
      });
      if (typeof callback === 'function') callback ();
      return;
    }

    // Login service has already been added, just logging in
    if (newUserId == oldUserId) {
      if (typeof callback === 'function') callback ();
      return;
    }

    // Adding the new login service
    Meteor.call ('fuseAccounts', oldUserId, function (error, result) {

      if (error) {
        if (typeof callback === 'function') callback (error);
        return;
      }

      // Log back in as the original (destination) user
      Meteor.loginWithToken(oldLoginToken, function (error) {
        if (error) {
          if (typeof callback === 'function') callback (error);
          return;
        }
        if (typeof callback === 'function') callback (undefined, newUserId, result);
      });
    });
  });
};