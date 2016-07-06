(function(){

	angular 
		.module('coolrelation')
		.controller('LoginCtrl', LoginCtrl)

	function LoginCtrl(auth){
		var vm = this;
		vm.login = function(){
		    auth.signin();
		  }
	};

	LoginCtrl.$inject=['auth'];

})()