(function(){
	angular 
		.module('coolrelation')
		.controller("generatorController", generatorController)

	function generatorController(FileUploader, store, auth, $http ,$rootScope, $location){
		var vm = this;
		vm.msg = "parent controller"
		vm.path = $location.path();
		vm.uploadText=true;

		// ========= CONTROL PANEL =========



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
		vm.loader=false;
		vm.d3show = false;


		// uploaderD3 settings
		vm.uploaderD3 = new FileUploader();

		vm.uploaderD3.url = "http://localhost:3000/api/generate"
		vm.uploaderD3.autoUpload = true;
		vm.uploaderD3.removeAfterUpload = true;
		vm.uploaderD3.queueLimit = 1;

		// after upload file
		vm.uploaderD3.onProgressAll = function(event){
			console.log("process all!")
			// hide uploadText, display loader
			vm.uploadText=false;
			vm.loader=true;
		}

		// getting back from resopnse (# process csv in python and send json back)
		vm.uploaderD3.onCompleteItem = function(item, response, status, headers) {
			console.log("got reponse!")
			
			// FEED DATA TO D3
			vm.chartData = JSON.parse(response.chart_data);
			vm.chartOption = JSON.parse(response.chart_option);

			// debugger
			// show graph when get response from server
			vm.loader = false;
			vm.d3show = true;
		};

		// catch error while uploading!
		vm.uploaderD3.onErrorItem =function(item, response, status, headers) {
			console.log("there is an error!!!")
		}
		


		// ========= TOOL BAR FUNCTION ==============

		// RE-START THE GENERATOR 
		// ######################
		vm.cleanAll = function(){
			console.log("click cleanAll")
			// return to init
			vm.uploadText=true;
			vm.loader=false;
			vm.d3show = false;
			// clean d3 data & remove svg from DOM
			vm.removeNode();
			
		}

		vm.removeNode = function(){
			vm.chartData="";
			vm.chartOption="";

			var svg = document.getElementsByTagName('svg')[0];
			while (svg.firstChild) {
			    svg.removeChild(svg.firstChild);
			}
		}

		// DOWNLOAD FILE
		// #############
		vm.exportHTML = function(user_id, chartOption, chartData){
			// TODO: move this to service
			// check authentication === true
			if(!$rootScope.isAuthenticated){
				auth.signin({popup: true},function(){
					$location.path(vm.path);
				});
			}

			// check if this data has already been saved
			// if not, store data to db
			// if yes, move on
			vm.exportDB(chartOption, chartData)

			// set ajex request to get the file


		}

		// SHARE PNG FILE
		// ##############
		vm.exportPNG = function(user_id, chartOption, chartData){
			// TODO: move this to service
			// check authentication === true
			if(!$rootScope.isAuthenticated){
				auth.signin({popup: true},function(){
					$location.path(vm.path);
				});
			}

			// check if this data has already been saved
			// if not, store data to db
			// if yes, move on


		}


		// SAVE TO USER'S COLLECTION
		vm.exportDB = function(chartOption, chartData, user_id){
			// TODO: move this to service
			// check authentication === true
			if(!$rootScope.isAuthenticated){
				auth.signin({popup: true},function(profile, token){
					vm.currentUser = profile["user_id"];
					$location.path(vm.path);
				});
			}
			var data = [chartOption, chartData];
			
			// POST data to DB
			$http.post('/api/data', data).then(function successSend(){
				// redirect to collection or send flash msg!
				console.log("post complete!")

			}, function catchErr(){
				// some error handling

			});
		}


	}; // generator function

	generatorController.$inject=['FileUploader','store', 'auth', '$http', '$rootScope', '$location'];

})()







