(function(){
	angular
		.module('coolrelation')
		.component('navbar',{
			bindings:{},
			controller:'navbarController',
			controllerAs:'vm',
			templateUrl:'./client/views/navbar.html'
		})

		.component('d3Tutorial',{
			templateUrl:'./client/views/components/tutorial.html'
		})

		.component('d3ControlPanel',{
			templateUrl:'./client/views/components/controlpanel.html'
		})

		.component('exportToolBar',{
			templateUrl:'./client/views/components/toolbar.html'
		})

		.component('d3Player',{
			bindings:{},
			controller:'d3playerController',
			controllerAs:'vm',
			templateUrl:'./client/views/components/d3player.html'
		})

		.component('forceDirectedGraph',{
			bindings:{},
			controller:'forceDirectedController',
			controllerAs:'vm',
			templateUrl:'./client/views/components/fdg.html'
		})

})()