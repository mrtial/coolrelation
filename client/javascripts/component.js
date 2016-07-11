(function(){
	angular
		.module('coolrelation')
		.component('navbar',{
			bindings:{},
			controller:'navbarController',
			controllerAs:'vm',
			templateUrl:'./client/views/navbar.html'
		})

		.component('d3player',{
			bindings:{},
			controller:'d3playerController',
			controllerAs:'vm',
			templateUrl:'./client/views/d3player.html'
		})

		.component('d3Tutorial',{
			templateUrl:'./client/views/components/tutorial.html'
		})

		.component('d3ControlPanel',{
			templateUrl:'./client/views/components/controlpanel.html'
		})

})()