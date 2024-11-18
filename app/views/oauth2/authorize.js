// define
import app from '~/app';

//jshint ignore:line
export { default as template } from './authorize.html';
export default ['$scope', '$http', '$browser', '$window', '$location', 'user', function($scope, $http, $browser, $window, $location, user) {

  $scope.scope = $location.search().scope || '';
  $scope.scopeArray = ['First Name', 'Last Name', 'Email', 'Account ID'];
  var redirect_uri = $location.search().redirect_uri || '';
  var client_id = $scope.client_id = $location.search().client_id || '';
  setClientInfo();

  //============================================================
  //
  //
  //============================================================
  function setClientInfo() {
    $http.post('/api/v2015/user-agent-oa2/authorizations/' + client_id + '/client-info').then(function onsuccess(success) { // jshint ignore:line
      if (success.data.clientName)
        $scope.clientName = success.data.clientName;
    }, function onerror(error) {
      console.log(error.stack);
    });
  }; // setClientInfo


  //============================================================
  //
  //
  //============================================================
  function authorizeClient() {
    if ($('#myModal').hasClass('in')) // if modal is popped
      var credentials = {
      'client_id': client_id,
      'redirect_uri': redirect_uri,
      request_type: 'code',
      'scope': $scope.scope
    };
    else
      var credentials = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        request_type: 'client_auth_exists',
        'scope': $scope.scope
      }; //jshint ignore:line

    return $http.post('/api/v2015/user-agent-oa2/authorizations/' + client_id + '/code', credentials); //jshint ignore:line
  };

  //============================================================
  //
  //
  //============================================================
  $scope.resOwnerDeniesAccess = function() {
    alert('You will now be redirected back to the origin site and may be shown an error as a result of your refusal to share information');
    var state = $location.search().state || '';
    $window.location.href = redirect_uri + '?error=access_denied' + '&state=' + encodeURIComponent(state);
  };



  //============================================================
  //$('#myModal').hasClass('in');
  //
  //============================================================
  $scope.authorize = function() {

    var state = $location.search().state || '';
    var rOwnerAuthenticated = user.isAuthenticated;

    if (rOwnerAuthenticated) {
      authorizeClient().then(function onsuccess(success) { // jshint ignore:line
        $window.location.href = redirect_uri + '?code=' + success.data.code + '&state=' + encodeURIComponent(state);
      }, function onerror(error) { //jshint ignore:line
        if ($('#myModal').hasClass('in')) { //if modal is poped and client not authorized even after resource owner grants auth ie. bad redirect url or client id
          alert('bad client id or redirect url');
          $window.location.href = redirect_uri + '?error=unauthorized_client'; //as per RFC

        } else {
          $(document).ready(function() {
            $('#myModal').modal('toggle');
          });
        }
      }); ///self.authorizeClient()
    } // if(rOwnerAuthenticated)
  }; // scope.authorize

  $(document).ready(function() {
    $scope.authorize();
  });
}]; //return
