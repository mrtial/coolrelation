(function(){
	angular 
		.module('coolrelation')
		.controller("generatorController", generatorController)

	function generatorController(FileUploader, store){
		var vm = this;

		// ========= CONTROL PANEL =========
		// temporary:
		vm.upload=true;
		vm.graph1=false;
		vm.graph2=false;

		vm.uploader = function(){
			vm.upload = !vm.upload;
		}

		vm.changeChart=function(){
			vm.graph1 = !vm.graph1;
			vm.graph2 = !vm.graph2;
		}

		// ========= TUTORIAL PAGE =========
		// save check in local storage - only show tutorial one time
		var checked = store.get('tutorial');
		if(checked){
			vm.checked = checked;
		}
		vm.tutorial = function(){
			store.set('tutorial', true)
			vm.checked = true;
		}


		// ========= FILE UPLOAD =========
		// uploading steps show & hide
		vm.uploadText = true;
		vm.loading = false;
		vm.d3show = false;


		// uploaderD3 settings
		vm.uploaderD3 = new FileUploader();

		vm.uploaderD3.url = "http://localhost:3000/api/generate"
		vm.uploaderD3.autoUpload = true;
		vm.uploaderD3.removeAfterUpload = true;
		vm.uploaderD3.queueLimit = 1;

		// getting back from resopnse (# process csv in python and send json back)
		vm.uploaderD3.onCompleteItem = function(item, response, status, headers) {
			console.log("got reponse!")
			window.reponse
			vm.chartData = response.chart_data;
			vm.option = response.chart_option;
		};
	
		vm.uploaderD3.onCompleteAll = function(event){
			console.log("upload completed!")
			// hide uploadText
			vm.uploadText = false;
			vm.loading=true;
		}
		
	};

	generatorController.$inject=['FileUploader','store'];

})()