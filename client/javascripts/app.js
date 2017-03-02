(function(){

	// Config & Dependiencies Injection
	angular
		.module('coolrelation',['ngRoute', 'auth0', 'angular-storage', 'angular-jwt','angularFileUpload'])
		.config(config)
		.config(auth0)
		// .run(checkToken)
		.run(function(auth) {
  	// This hooks all auth events to check everything as soon as the app starts
  		auth.hookEvents();
		})
		// Get/ Re-Set State everytime user refresh the page (change location)
		.run(function($rootScope, auth, store, jwtHelper, $location) {
		  $rootScope.$on('$locationChangeStart', function() {
		  	console.log('locationChangeStart')
		  	

		    var token = store.get('token');
		    if (token) {
		    	$rootScope.watch = true;
		      if (!jwtHelper.isTokenExpired(token)) {
		        if (!auth.isAuthenticated) {
		          //Re-authenticate user if token is valid
		          auth.authenticate(store.get('profile'), token);
		        }
		      } else {
		        // Either show the login page or use the refresh token to get a new idToken
		        $location.path('/');
		      }
		    }
		  });
		});

	// ROUTES using $routeProvider
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

			// require login to see
			.when('/showcase',{
				templateUrl:'./client/views/showcase.html',
				controller:'showcaseController',
				controllerAs:'vm',
				requiresLogin: true,
			})
			.when('/login',{
				templateUrl:'./client/views/login.html',
				controller:'loginController',
				controllerAs:'vm'
			})

		$locationProvider.html5Mode(true).hashPrefix('*');
	}

	function auth0($routeProvider, authProvider, $httpProvider, $locationProvider, jwtInterceptorProvider){
		//Configure Auth0 with credentials
		authProvider.init({
		    domain: 'mrtial.auth0.com',
		    clientID: 'Uh0BNDPKcj5SGW2GoXN6v6wxqlLlx1T6',
		    loginUrl: '/login'
		});

		// CODE FORM AUTH0: 
		// Called when login is successful
		authProvider.on('loginSuccess', ['$location', 'profilePromise', 'idToken', 'store', '$rootScope',
		  function($location, profilePromise, idToken, store, $rootScope) {
		    var current_path = $location.path();
		    debugger
		    // Successfully log in
		    console.log("Login Success");
		    // Access to user profile and token
		    profilePromise.then(function(profile){
		      store.set('profile', profile);
		      store.set('token', idToken);
		      $rootScope.watch = true;
		    });
		    // $location.url(current_path); // location after login.
		  }]);

		//Called when login fails
		authProvider.on('loginFailure', function() {
			console.log("Error logging in");
		  // If anything goes wrong
		});

		//Angular HTTP Interceptor function
		jwtInterceptorProvider.tokenGetter = function(store) {
		    return store.get('token');
		}
		//Push interceptor function to $httpProvider's interceptors
		$httpProvider.interceptors.push('jwtInterceptor');
	}


	// function checkToken($rootScope, auth, store, jwtHelper, $location){
	// 	// Listen to a location change event
	//   $rootScope.$on('$locationChangeStart', function() {
	//     // Grab the user's token
	//     var token = store.get('token');
	//     // Check if token was actually stored
	//     if (token) {
	//       // Check if token is yet to expire
	//       if (!jwtHelper.isTokenExpired(token)) {
	//         // Check if the user is not authenticated
	//         if (!auth.isAuthenticated) {
	//           // Re-authenticate with the user's profile
	//           // Calls authProvider.on('authenticated')
	//           auth.authenticate(store.get('profile'), token);
	//         }
	//       } else {
	//         // Either show the login page
	//         // $location.path('/');
	//         // .. or
	//         // or use the refresh token to get a new idToken
	//         auth.refreshIdToken(token);
	//       }
	//     }
	//   });
	// }

	

	// INJECT
	config.$inject = ['$routeProvider', '$locationProvider'];
	auth0.$inject = ['$routeProvider', 'authProvider', '$httpProvider', '$locationProvider', 'jwtInterceptorProvider'];
	// checkToken.$inject = ['$rootScope', 'auth', 'store', 'jwtHelper', '$location'];

})()
