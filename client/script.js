angular.module('retroApp', ['pusher-angular']);

angular.module('retroApp')
  .controller('appController', function($scope, $http, $pusher) {

    var client = new Pusher('b28b26456e66e4d0c1a8');
    var pusher = $pusher(client);

    $scope.app = {};

    $scope.app.message = 'test message';
    $scope.app.user = 'suman';
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
  });
