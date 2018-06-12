define(['grecaptcha', 'app', 'directives/input-email', 'directives/security/password-rules'], function(grecaptcha){

return ['$scope', '$http', 'authentication', 'apiToken', 'user', '$q', function ($scope, $http, authentication, apiToken, user, $q) {
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

        return $q.resolve(grecaptcha.executeEx({action:"signup"})).then(function(token){

            return $http.post('/api/v2013/users', data, { headers : { 'X-Captcha-Token' : token } });

        }).then(function(res) {

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
});
