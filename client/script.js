angular.module('retroApp', ['pusher-angular', 'auth0', 'angular-storage', 'angular-jwt'])
  .config(function(authProvider) {
    authProvider.init({
      domain: 'app42371310.auth0.com',
      clientID: 'u6YtoLQEMlFEaUeNVTy1QrEB3fcJu9XL'
    });
  })
  .run(function(auth) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();
  })
  .run(function($rootScope, auth, store, jwtHelper, $location) {
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
          }
        } else {
          // Either show the login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }
    });
  });

angular.module('retroApp')
  .controller('appController', function($scope, $http, $pusher) {

    var client = new Pusher('b28b26456e66e4d0c1a8');
    var pusher = $pusher(client);

    $scope.app = {};

    $scope.app.message = 'test message';
    $scope.app.user = 'suman';
    $scope.app.room = 'room for suman';
    $scope.app.messageStream = [];

    var my_channel = pusher.subscribe('ads3r4');
    my_channel.bind('message',
      function(data) {
        $scope.app.messageStream.push(data);
      }
    );

    $scope.app.send = function() {
      var message = {
        user: $scope.app.user,
        message: $scope.app.message
      };
      $http.post('/sendmessage', message);
    };

    $scope.app.createRoom = function() {
      console.log('creating room : ' + $scope.app.room);
      $http.post('/createroom', {
        name: $scope.app.room
      });
    };
  });

angular.module('retroApp')
  .controller('AuthCtrl', ['$scope', '$http', 'auth', 'store', '$location',
    function($scope, $http, auth, store, $location) {
      if (auth) $scope.auth = auth;
      $scope.login = function() {
        auth.signin({}, function(profile, token) {
          // Success callback
          store.set('profile', profile);
          store.set('token', token);
          $location.path('/');
          $scope.auth = auth;
        }, function() {
          // Error callback
        });
      }
      $scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
      }

    }
  ]);
