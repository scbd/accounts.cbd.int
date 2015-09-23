define(['urijs/URI', 'app', 'authentication'], function(URI) {


	return ['$scope', '$http', '$browser', '$location', 'authentication', '$window', 'user', function ($scope, $http, $browser, $location, authentication, $window, user) {

	$scope.password   = "";
    $scope.email      = $browser.cookies().email || "";
    $scope.rememberMe = !!$browser.cookies().email;

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
    this.authorize = function () {

        var client_id    = $location.search().client_id||'';
        var redirect_uri = $location.search().redirect_uri||'';
        var state        = $location.search().state||'';
        var authorized   = false;

        authorized = authorized || (client_id=='fbbb279e53ff814f4c23878e712dfe23ee66bd73a1cfc42b1842e2ab58c440fe' && redirect_uri=='https://absch.cbd.int:443/oauth2/callback');
        authorized = authorized || (client_id=='fbbb279e53ff814f4c23878e712dfe23ee66bd73a1cfc42b1842e2ab58c440fe' && redirect_uri=='http://absch.infra.cbd.int:80/oauth2/callback');
        authorized = authorized || (client_id=='fbbb279e53ff814f4c23878e712dfe23ee66bd73a1cfc42b1842e2ab58c440fe' && redirect_uri=='http://localhost:2010/oauth2/callback');

        authorized = authorized || (client_id=='55asz2laxbosdto6dfci0f37vbvdu43yljf8fkjacbq34ln9b09xgpy1ngo8pohd' && redirect_uri=='https://lifeweb.cbd.int:443/oauth2/callback');
        authorized = authorized || (client_id=='55asz2laxbosdto6dfci0f37vbvdu43yljf8fkjacbq34ln9b09xgpy1ngo8pohd' && redirect_uri=='http://lifeweb.infra.cbd.int:80/oauth2/callback');
        authorized = authorized || (client_id=='55asz2laxbosdto6dfci0f37vbvdu43yljf8fkjacbq34ln9b09xgpy1ngo8pohd' && redirect_uri=='http://localhost:2020/oauth2/callback');

        if(authorized) {
            $window.location.href = redirect_uri + '?code=' + $browser.cookies().authenticationToken + '&state=' + encodeURIComponent(state);
        } else {
            console.log('invalid client_id');
        }
    };

    //============================================================
    //
    //
    //============================================================
    this.redirect = function () {
        if($location.search().client_id) {
			self.authorize();
        } else {

			var returnUrl = $location.search().returnurl || $location.search().returnUrl;

			if(returnUrl)
			{
				var trustedHosts = [
					"absch.cbd.int", 'training-absch.cbd.int', 'dev-absch.cbd.int',
					"bch.cbd.int",
					"chm.cbd.int", 'dev-chm.cbd.int',
					'lifeweb.cbd.int',
					"www.cbd.int",
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
        }
    };

    if(user.isAuthenticated) {
		self.redirect();
    }

}];
});
