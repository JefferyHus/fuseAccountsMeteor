JsamaMerge = {};

Meteor.methods({

  fuseAccounts: function (oldAccountId) {
    // This method will try and fuse two accounts if an existing account is there else it wont
    if (! this.userId) {
      return;
    }

    // Get the old and new account details
    var oldAccount    = Meteor.users.findOne(oldAccountId);
    var newAccount    = Meteor.users.findOne(this.userId);
    var mergitOrNot   = true;
    // Get the names of the registered oauth services from the Accounts package
    _services = Accounts.oauth.serviceNames();

    // Run the server side beforeFuse() hook if it exists
    if(JsamaMerge.beforeFuse){
      oldAccount = Meteor.users.findOne(oldAccount._id);
      newAccount = Meteor.users.findOne(newAccount._id);
      mergitOrNot = JsamaMerge.beforeFuse(oldAccount, newAccount);
    }
    // Check if we have the right to merge or no
    if(mergitOrNot){
      // Move login services from old to new user
      for (i=0; i<_services.length; i++) {

        if (newAccount.services[_services[i]]) {

          // Remove service from current user to avoid duplicate key error
          query = {};
          query['services.'+_services[i]] = "";
          try {
            Meteor.users.update (Meteor.userId(), {$unset: query});
          } catch (e) {
            console.log('error', e.toString());
          }

          // Add the service to the old account and profile.name from the new service.
          query = {};
          query['services.'+_services[i]] = newAccount.services[_services[i]];
          if (!oldAccount.profile || !oldAccount.profile.name) {
            query['profile.name'] = newAccount.profile.name;
          }
          try {
            Meteor.users.update (oldAccountId, {$set: query});
          } catch (e) {
            console.log('error', e.toString());
          }
        }
      }
      // Mark the old user as merged, and to which user it was merged with.
      // fusedWith holds the _id of the new account.
      try {
        Meteor.users.update(newAccount._id, {$set: {fusedWith: oldAccountId}});
      } catch (e) {
        console.log('error', e.toString());
      }

      // Run the server side onFuse() hook if it exists.
      if (JsamaMerge.onFuse) {
        oldAccount = Meteor.users.findOne(oldAccount._id);
        newAccount = Meteor.users.findOne(newAccount._id);
        JsamaMerge.onFuse(oldAccount, newAccount);
      }
    }

    return mergitOrNot;
  }
});