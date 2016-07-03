(function(){

	angular
		.module('coolrelation',['ngRoute'])
		.config(config);

	function config($routeProvider, $locationProvider){
		$routeProvider
			.when('/',{
				templateUrl:'./client/views/index.html',
				controller:'mainController',
				controllerAs:'vm'
			})
			.when('/about',{
				templateUrl:'./client/views/about.html',
				controller:'aboutController',
				controllerAs:'vm'
			})
			.when('/doc',{
				templateUrl:'./client/views/doc.html',
				controller:'docsController',
				controllerAs:'vm'
			})
			.when('/generator',{
				templateUrl:'./client/views/generator.html',
				controller:'generatorController',
				controllerAs:'vm'
			})
			.when('/showcase',{
				templateUrl:'./client/views/showcase.html',
				controller:'showcaseController',
				controllerAs:'vm'
			})
			.when('/login',{
				templateUrl:'./client/views/login.html',
				controller:'loginController',
				controllerAs:'vm'
			})
		$locationProvider.html5Mode(true).hashPrefix('*');
	}

	config.$inject = ['$routeProvider', '$locationProvider']


})()
