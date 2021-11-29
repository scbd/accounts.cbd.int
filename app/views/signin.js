define(['app', 'authentication'], function() {

    return ['$scope', '$http', '$cookies', 'authentication', 'user', 'apiToken', function ($scope, $http, $cookies, authentication, user, apiToken) {

	$scope.password   = "";
    $scope.email      = $cookies.get("email") || "";
    $scope.rememberMe = !!$cookies.get("email");

    $scope.isForbidden = false;
    $scope.isAuthenticated = user.isAuthenticated;

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

            apiToken.set(success.data.authenticationToken);

            var expires = new Date();

            expires.setDate(expires.getDate()+365);

            
            if($scope.rememberMe)       $cookies.put   ('email', $scope.email, { expires: expires, path:'/', samesite: 'None', secure: true });
            else                        $cookies.remove('email',               { expires: expires, path:'/', samesite: 'None', secure: true });

            if(success.data.expiration) $cookies.put   ("expiration", success.data.expiration,   { path:'/', samesite: 'None', secure: true });
            else                        $cookies.remove('expiration',                            { path:'/', samesite: 'None', secure: true });

            authentication.reset();

            $scope.$root.returnUrl.goBack();

        }).catch(function(error) {

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

    if(user.isAuthenticated) {
		$scope.$root.returnUrl.goBack();
    }
}];
});
