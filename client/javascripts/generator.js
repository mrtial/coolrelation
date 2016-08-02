(function(){
	angular 
		.module('coolrelation')
		.controller("generatorController", generatorController)

	function generatorController(FileUploader, store, auth, $http, $location, $scope){
		var vm = this;
		vm.auth = auth;
		vm.path = $location.path();
		console.log(vm.path)
		vm.uploadText=true;
		
		// ========= CONTROL PANEL =========
		// STYLE SETTING
		// STRUCTURE SETTING
		// SCHEMA SETTING

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
		
		// get path to decide post url
		var protocol = $location.protocol();
		var host = $location.host();
		var url = protocol+"://"+host+"/api/generate";

		if(host==="localhost"){
			url = "http://localhost:3000/api/generate"
		}


		vm.uploaderD3.url = url;
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
			vm.removeNode();
			
		}

		vm.removeNode = function(){
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
			if(!isAuthenticated){
				auth.signin({popup: true},function(){
					$location.path(vm.path);
				});
			}
			// check if this data has already been saved
			// if not, store data to db
			// if yes, move on
			vm.exportDB(chartOption, chartData)
			// set ajex request to get the file

			console.log("EXPORT HTML function is not available for now.")
		}

		// SHARE PNG FILE
		// ##############
		vm.exportPNG = function(chartOption, chartData, $event){
			// TODO: move this to service
			var svg = document.getElementsByTagName('svg')[0];
			// check authentication === true
			if(svg.childElementCount){
				if(!auth.isAuthenticated){
					// $event.preventDefault();
					requireLogin();
					// save svg to png
					var canvas = document.getElementById("canvas");
					canvg('canvas', document.getElementById('mySvg').innerHTML)
					// canvg()
					var img = canvas.toDataURL("image/png");
					// debugger

					/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
					  img = img.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
					  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
					  img = img.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
					  document.getElementById('dl').href = img;
				} else{
					// save svg to png
					var canvas = document.getElementById("canvas");
					canvg('canvas', document.getElementById('mySvg').innerHTML)
					var img = canvas.toDataURL("image/png");

					/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
					  img = img.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
					  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
					  img = img.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
					  document.getElementById('dl').href = img;
				}
			}
		}


		// SAVE TO USER'S COLLECTION
		vm.exportDB = function(chartOption, chartData){
			// POST data to DB, only when data exist
			var svg = document.getElementsByTagName('svg')[0];
			if(svg.childElementCount){
				// check authentication & set user info
				if(!auth.isAuthenticated){
					requireLogin();
					// var user_id = auth.profile.user_id;
					// var data = [chartOption, chartData, user_id];
				} else{
					var user_id = auth.profile.user_id
					var data = [vm.chartOption, vm.chartData, user_id];

					// STOP post to db for now
					console.log("tempory stop adding data to DB for now")
					// $http.post('/api/data', data).then(function successSend(){
					// 	// send flash msg!
					// 	console.log("post complete!")
					// }, function catchErr(){
					// 	// some error handling
					// });
				}
			} // if(data)
		} // exportDB

		// ============= HELPER FUNCTION ==============
		function requireLogin(){
			// auth.signin({popup: true},function(profile, token){
			// 	$location.path(vm.path);
			// });
			auth.signin();
			// $location.path(vm.path);
		}


	}; // generator function

	generatorController.$inject=['FileUploader','store', 'auth', '$http', '$location', '$scope'];

})()







