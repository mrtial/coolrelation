(function(){
	angular 
		.module('coolrelation')
		.controller("mainController", mainController)
		.controller("aboutController", aboutController)
		.controller("docsController", docsController)
		.controller("generatorController", generatorController)
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

	function generatorController(FileUploader, store){
		var vm = this;
		// tutorial page
		// save check in local storage - only show tutorial one time
		var checked = store.get('tutorial');
		if(checked){
			vm.checked = checked;
		}
		vm.tutorial = function(){
			store.set('tutorial', true)
			vm.checked = true;
		}


		// FILE UPLOAD
		vm.uploaderD3 = new FileUploader();

		// uploaderD3 settings
		vm.uploaderD3.url = "http://localhost:3000/api/generate"
		vm.uploaderD3.autoUpload = true;
		vm.uploaderD3.removeAfterUpload = true;
		vm.uploaderD3.queueLimit = 1;


		vm.uploaderD3.onCompleteAll = function(event){
			console.log("upload completed!")
		}

		// getting back from resopnse
		vm.uploaderD3.onCompleteItem = function(item, response, status, headers) {
			window.response = response;
		};
	

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
	
	// function loginController(auth, store){
	// 	var vm = this;
	// 	vm.login = function(){
	// 			// Set popup to true to use popup
	// 			// Store 'profile' & 'token' in local storage
	// 	    auth.signin({popup: true}, function(profile, token){
	// 	          store.set('profile', profile);
	// 	          store.set('token', token);
	// 	        }, function(err){
	// 	          // If anything goes wrong
	// 	        });

	// 	  }
	// };

	navbarController.$inject=['auth', 'store'];
	generatorController.$inject=['FileUploader','store'];

})()