import '~/app';
import '~/directives/input-email';
import './recaptcha.directive.js';

export { default as template } from './activate-resend.html';
export default ['$scope', '$http', '$location', function ($scope, $http, $location) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionSubmit = function() {

        $http.post('/api/v2013/users/'+encodeURIComponent($scope.email)+'/activations', angular.toJson({}), { headers : { 'x-captcha-v2-token' : $scope.grecaptchaToken } })
        .then(function onsuccess(data, status, headers, config) {

            $location.path('/signup/done');

        }).catch(function (data, status, headers, config) {
            $scope.error = status;
            $scope.resetCaptcha();
        })
    };
}];
