define(['urijs/URI', 'app', 'scbd-angularjs-services/authentication'], function(URI) {


	return ['$scope', '$http', '$cookies', '$location', 'authentication', '$window', 'user', '$rootScope', 
    function ($scope, $http, $cookies, $location, authentication, $window, user, $rootScope) {

	$scope.password   = "";
    $scope.email      = $cookies.get("email") || "";
    $scope.rememberMe = !!$cookies.get("email");

    $scope.isForbidden = false;
	$scope.isAuthenticated = user.isAuthenticated;

    var self = this;
    ///////////////
    // Incase if the user clicks header signIn which shows login 
    // popup redirect to home after successful login
    ///////////////
    $rootScope.$on('signIn', function(){
        console.log('test')
        self.redirect();
    });

    //============================================================
    //
    //
    //============================================================
	$scope.signIn = function () {

        $scope.errorInvalid = false;
        $scope.errorTimeout = false;
        $scope.waiting      = true;

        authentication.signIn($scope.email, $scope.password)
        .then(function(user){ 
            self.redirect();
        })
        .catch(function onerror(error) {
            $scope.password     = "";
            $scope.errorInvalid = error.errorCode == 403;
            $scope.errorTimeout = error.errorCode != 403;
        })
        .finally(function(){
            $scope.waiting      = false;
        });
    };

	//============================================================
    //
    //
    //============================================================
    this.clearErrors = function () {

        $scope.isError = false;
        $scope.error = null;
    };


    //============================================================
    //
    //
    //============================================================
    this.redirect = function () {

        var returnUrl = $location.search().returnurl || $location.search().returnUrl;

        if(returnUrl)
        {
            var trustedHosts = [
                "absch.cbd.int", 'training-absch.cbd.int', 'dev-absch.cbd.int',
                "eunomia.cbd.int",
                "bch.cbd.int",
                "chm.cbd.int", 'dev-chm.cbd.int',
                'lifeweb.cbd.int',
                "www.cbd.int",
                '192.168.1.68',
                "localhost"
            ];

            var url = URI.parse(returnUrl);

            if(!url.hostname) {
                $location.url(returnUrl);
                return;
            }

            if(trustedHosts.indexOf(url.hostname)>=0)  {
                $window.location = returnUrl;
                return;
            }
        }

        $location.path('/');
    };

    if(user.isAuthenticated) {
		self.redirect();
    }

}];
});
