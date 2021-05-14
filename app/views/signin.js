define(['app', 'authentication'], function() {

    return ['$scope', '$http', 'authentication', 'user', 'apiToken', function ($scope, $http, authentication, user, apiToken) {

    var localStorage = window.localStorage;   
	$scope.password   = "";
    $scope.email      = localStorage.getItem("cbd_authentication_email") || "";
    $scope.rememberMe = !!localStorage.getItem("cbd_authentication_email");

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
            
            if($scope.rememberMe) localStorage.setItem('cbd_authentication_email', $scope.email);
            else                  localStorage.removeItem('cbd_authentication_email');

            if(success.data.expiration) localStorage.setItem("cbd_authentication_expiration", success.data.expiration);
            else      localStorage.removeItem("cbd_authentication_expiration");

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
