import '~/app';

export { default as template } from './signout.html';
export default ['$rootScope', '$window', 'apiToken', function ($rootScope, $window, apiToken) {
    apiToken.set(null);
    $window.location.href = $rootScope.returnUrl.get() || '/';
}];