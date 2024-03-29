import '~/app';
import '~/directives/input-email';
import '~/directives/security/password-rules';
import './recaptcha.directive.js';

export { default as template } from './signup.html';
export default ['$scope', '$http', 'authentication', 'apiToken', 'user', function ($scope, $http, authentication, apiToken, user) {
    $scope.passwordType = 'password';

    if(user.isAuthenticated)
        $scope.$root.returnUrl.navigate('/');

    $scope.$watch('document.Password', updatePasswordValidity);
    $scope.$watch('passwordValid',     updatePasswordValidity);

    //============================================================
    //
    //
    //============================================================
    $scope.onPostSave = createUser;

    //============================================================
    //
    //
    //============================================================
    function createUser() {

        $scope.isLoading = true;

        var data = {
            FirstName    : $scope.document.FirstName,
            LastName     : $scope.document.LastName,
            Organization : $scope.document.Organization,
            Email        : $scope.document.Email,
            Password     : $scope.document.Password,
        };

        return $http.post('/api/v2013/users', data, { headers : { 'x-captcha-v2-token' : $scope.grecaptchaToken } })
        .then(function(res) {

            var credentials = {  // auto signin
                'email':    $scope.document.Email, 
                'password': $scope.document.Password 
            };

            return $http.post('/api/v2013/authentication/token', credentials);

        }).then(function (res) {
    
            apiToken.set(res.data.authenticationToken);
            authentication.reset();

            $scope.$root.returnUrl.navigate('/signup/done');

        }).catch(function (res) {
            $scope.error = res.data || res;
            $scope.resetCaptcha();
        })
        .finally(function(){
            $scope.isLoading = false;
        });
    }

    //============================================================
    //
    //
    //============================================================
    function updatePasswordValidity() {
        $scope.form.password.$setValidity("rules", $scope.passwordValid||false);
    }
    

    //============================================================
    //
    //
    //============================================================
    $scope.togglePassword = function(){
        $scope.passwordType = $scope.passwordType != 'password' ? 'password' : 'text';
    };
}];
