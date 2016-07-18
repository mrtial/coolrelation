(function(){
	angular 
		.module('coolrelation')
		.controller("mainController", mainController)
		.controller("aboutController", aboutController)
		.controller("docsController", docsController)
		.controller("showcaseController", showcaseController)
		.controller("navbarController", navbarController)
		.controller("d3playerController", d3playerController)

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

	function navbarController(auth, store, $scope, $rootScope){
		var vm = this;
		vm.dropdown = false;

		$rootScope.$watch('watch',function(newValue,oldValue){
			// debugger
			if($rootScope.watch){
				var current = store.get('profile');
				vm.username = current.name;
				vm.picture = current.picture;
			}
		})
		
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
			$rootScope.watch = false;
		}
	};

	function d3playerController(){
		var vm = this;
	}

	navbarController.$inject=['auth', 'store','$scope','$rootScope'];
	// generatorController.$inject=['FileUploader','store'];

})()