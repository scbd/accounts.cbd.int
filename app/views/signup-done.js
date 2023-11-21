import '~/app';

export { default as template } from './signup-done.html';
export default ['$scope','referrer', function ($scope,referrer) {
    $scope.referrer = referrer.get();
}];