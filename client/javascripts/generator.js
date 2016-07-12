(function(){
	angular 
		.module('coolrelation')
		.controller("generatorController", generatorController)

	function generatorController(FileUploader, store){
		var vm = this;
		vm.uploadText = true;
		vm.d3show = false;
		vm.loading = false;

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
			// vm.d3show = true;
			vm.uploadText = false;
			vm.loading=true;
		}

		// getting back from resopnse
		vm.uploaderD3.onCompleteItem = function(item, response, status, headers) {
			console.log("on complete!")
			window.response = response;
		};
	
	};

	function forceDirectedController(){
		var vm = this;


	}

	generatorController.$inject=['FileUploader','store'];

})()