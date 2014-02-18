require('app').controller('SignoutController', ['$location', '$window', function ($location, $window) {
	
    document.cookie = "authenticationToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    $window.location.href = $location.search().redirect_uri || '/';

}]);