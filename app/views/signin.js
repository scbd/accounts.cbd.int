define(['urijs/URI', 'app', 'authentication'], function(URI) {


	return ['$scope', '$http', '$cookies', '$location', 'authentication', '$window', 'user', function ($scope, $http, $cookies, $location, authentication, $window, user) {

	$scope.password   = "";
    $scope.email      = $cookies.get("email") || "";
    $scope.rememberMe = !!$cookies.get("email");

    $scope.isForbidden = false;
	$scope.isAuthenticated = user.isAuthenticated;

	// init sevice location
    // $scope.clearErrors();

    var self = this;

    //============================================================
    //
    //
    //============================================================
	$scope.signIn = function () {

        $scope.errorInvalid = false;
        $scope.errorTimeout = false;
        $scope.waiting      = true;

        //$scope.isLoading = true;

        var credentials = { 'email': $scope.email, 'password': $scope.password };

        $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {

        	self.setCookie("authenticationToken", success.data.authenticationToken, 0, '/');
        	self.setCookie("email", $scope.rememberMe ? $scope.email : "", 365, '/');

            authentication.reset();

            self.redirect();
        }, function onerror(error) {

        	$scope.password     = "";
            $scope.errorInvalid = error.status == 403;
            $scope.errorTimeout = error.status != 403;
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
    // TODO: USE ANGULARJS EQUIVALENT
    //
    //============================================================
    this.setCookie = function (name, value, days, path) {

        var cookieString = escape(name) + "=";

        if(value) cookieString += escape(value);
        else      days = -1;

        if(path)
            cookieString += "; path=" + path;

        if(days) {

            var expirationDate = new Date();

            expirationDate.setDate(expirationDate.getDate() + days);

            cookieString += "; expires=" + expirationDate.toUTCString();
        }

        document.cookie = cookieString;
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
