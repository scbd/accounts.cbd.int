require('app').controller('SignupController', ['$scope','referrer', function ($scope,referrer) {

  $scope.referrer = referrer.get();

}]);