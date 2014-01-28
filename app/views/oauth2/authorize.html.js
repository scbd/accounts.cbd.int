require('app').controller('AuthorizeController', ['$scope', '$http', '$browser', '$window', function ($scope, $http, $browser, $window) {
	
	$scope.password   = "";
    $scope.email      = $browser.cookies().email || "";
    $scope.rememberMe = !!$browser.cookies().email;

    $scope.isForbidden = false;

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

        //$scope.isLoading = true;

        var credentials = { 'email': $scope.email, 'password': $scope.password };

        $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {

        	self.setCookie("authenticationToken", success.data.authenticationToken, 365, '/');
        	self.setCookie("email", $scope.rememberMe ? $scope.email : undefined, 365, '/');

        	$window.location = 'https://chm.cbd.int/#token=' + success.data.authenticationToken;

            // authentication.loadCurrentUser().then(function () {
             
            //     if ($location.search().returnUrl) 	$location.url($location.search().returnUrl);
            //     else								$location.path("/management"); 
            // });
            
            // authentication.signIn(sEmail, sPassword).then(function onsuccess (data) {

        }, function onerror(error) {

        	$scope.password     = "";
            $scope.errorInvalid = error.status == 403;
            $scope.errorTimeout = error.status != 403;
        });
    };

	//============================================================
    //
    //
    //============================================================
    this.clearErrors = function () {
        
        $scope.isError = false;
        $scope.error = null;
    }

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

        if(days || days == 0) {

            var expirationDate = new Date();

            expirationDate.setDate(expirationDate.getDate() + days);

            cookieString += "; expires=" + expirationDate.toUTCString();
        }

        document.cookie = cookieString
    };

}]);



            // //==============================
            // //
            // //==============================
            // $scope.isAuthenticated = function () {
            //     if (authentication.user())
            //         return authentication.user().isAuthenticated && !!authentication.token();

            //     return !!authentication.token();
            // }