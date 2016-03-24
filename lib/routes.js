Router.route('/',{
	path:'/',
	template:'signin',
	onBeforeAction: function(){
		if( Meteor.userId() ){
			Router.go('/welcomen');
		}
		this.next();
	}
});

Router.route('/welcomen');