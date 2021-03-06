(function($angular, _) {
    'use strict';

    $angular.module('app', ['ngDraggable'])

    .controller('appController', ['$scope', '$interval', function($scope, $interval) {
        $scope.onDragSucces = function(index,obj,evt) {
                var otherObj = $scope.draggableObjects[index];
                var otherIndex = $scope.draggableObjects.indexOf(obj);
                $scope.draggableObjects[index] = obj;
                $scope.draggableObjects[otherIndex] = otherObj;
            };

        $scope.changeRoom=function(person,evt,newRoom){
            newRoom.AddColonist(person);
            person.active = false;
        }

        $scope.createRoom=function(person, type){
            $scope.colony.AddRoom(type, person);
            console.log(arguments);
            person.active = false;
        }

        $scope.game = {
            'theLoop': false,
            'started': false,
            'colonyStarted': false,
            'colonyName': 'OMG Why?',
            'numColonists': 6,
        };

        $scope.beginColony = function(){
            $scope.colony = new Colony($scope.game.colonyName, $scope.game.numColonists);
            $scope.game.started = true;
            $scope.game.colonyStarted = true;
            $scope.startColony();
        }
        $scope.startColony = function(){
            $scope.game.theLoop = $interval(function(){
                $scope.colony.Age();
                if(!$scope.colony.alive){
                    $scope.game.colonyStarted = false;
                    $scope.stopColony();
                }
            },1000);
        };
        $scope.stopColony = function(){
            $interval.cancel($scope.game.theLoop);
            $scope.game.theLoop = false;
        }
        $scope.togglePause = function(){
            if(!$scope.game.colonyStarted){
                return;
            }
            if($scope.game.theLoop !== false){
                $scope.stopColony();
            } else {
                $scope.startColony();
            }
        }


            $scope.rows = 35;
            $scope.startup = function(rows) {

            var startY = _.random(0, rows - 1);
            var startX = _.random(0, (!!(startY % 2) ? 9 : 8));
            $scope.active = {
            y: startY,
            x: startX
            };

            $scope.selected = [$scope.active];

            };

            $scope.startup($scope.rows);

            $scope.map = _buildMap($scope.rows);

            $scope.click = function(plot, selected){
            if (!_hit(selected, plot)) {
            _.each(selected, function(lot) {
                if (_possibles(plot, lot)) {
                    selected.push(angular.copy(plot));
                }
            });
            }
            };

            $scope.setClass = function(plot, active) {
            return _setClass(plot, active, $scope.selected);
            };

            $scope.$watch('rows', function(n) {
            $scope.map = _buildMap(n);
            });


    }])
    .controller('manageCrew', ['$scope', function($scope) {



    }])
    .directive('pressSpace', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 32) {
                scope.$apply(function (){
                    scope.$eval(attrs.pressSpace);
                });

                event.preventDefault();
            }
        });
    };
});;

})(window.angular, window._);


