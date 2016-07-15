(function(){
	angular 
		.module('coolrelation')
		.controller("mainController", mainController)
		.controller("aboutController", aboutController)
		.controller("docsController", docsController)
		// .controller("generatorController", generatorController) --> move out
		.controller("showcaseController", showcaseController)
		.controller("navbarController", navbarController)
		.controller("d3playerController", d3playerController)
		// .controller('loginController', loginController)

	function mainController(){
		var vm = this;
	};

	function aboutController(){
		var vm = this;
	};

	function docsController(){
		var vm = this;
	};


	function showcaseController(){
		var vm = this;
	};

	function navbarController(auth, store){
		var vm = this;

		// GET current user from local storage
		var current = store.get('profile');
		
		if(current){
			vm.username = current.name;
			vm.picture = current.picture;
		}
		
		vm.login = function(){
			// Set popup to true to use popup
			// Store 'profile' & 'token' in local storage
	    auth.signin({popup: true}, function(profile, token){
        store.set('profile', profile);
        store.set('token', token);
        // set username & picture inside navbar
      	vm.username = profile['name'];
      	vm.picture = profile['picture'];
	      }, function(err){
	        // If anything goes wrong
      	});
		}

		vm.logout = function(){
			store.remove('profile');
			store.remove('token');
			store.remove('tutorial')
		}
	};

	function d3playerController(){
		var vm = this;
	}

	navbarController.$inject=['auth', 'store'];
	// generatorController.$inject=['FileUploader','store'];

})()