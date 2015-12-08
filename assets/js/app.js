(function($angular, _) {
    'use strict';

    $angular.module('app', [])

    .controller('appController', ['$scope', '$interval', function($scope, $interval) {
        var Person = function(){
            this.gender = chance.gender();
            this.name = chance.name({ gender: this.gender });
            this.longevity = _.random(0,80);
            this.age = _.random(15,30);
            this.compatibilty = _.random(100);
            this.fertility = _.random(100);
            this.alive = true;
            this.withChild = false;
        };
        Person.prototype.Age = function(){
            if(!this.alive){
                return false;
            }
            this.age++;
            if(this.age >= this.longevity){
                this.alive = false;
            }

            //Do womanly things (I'm gonna get sued for this section)
            if(this.gender == 'Female'){
                if(this.withChild){ //Give Birth
                    this.withChild = false;
                    var person = new Person();
                    person.id = $scope.colony.colonists.length;
                    $scope.colony.colonists.push();//@todo link newborn to parents
                }
            }
        };

        var Colony = function(name, num_colonists){
            this.name = name;
            this.age = 0;
            this.alive = true;
            this.colonists = [];
            this.couples = [];
            for (var i=0; i<=num_colonists; i++){
                var person = new Person();
                person.id = this.colonists.length;
                this.colonists.push(person);
            }
        };
        Colony.prototype.Age = function(){
            var anyone_alive = false;
            this.age++;
            for(var i in this.colonists){
                this.colonists[i].Age();
                if(this.colonists[i].alive){
                    anyone_alive = true;
                }
            }
            this.alive = anyone_alive;
        };

        $scope.game = {
            'theLoop': false,
            'started': false,
            'colonyStarted': false,
            'colonyName': 'OMG Why?',
            'numColonists': 6,
        };

        $scope.beginColony = function(){
            $scope.colony = new Colony($scope.game.colonyName, $scope.game.numColonists - 1);
            $scope.game.started = true;
            $scope.game.colonyStarted = true;
            $scope.startColony();
        }
        $scope.startColony = function(){
            $scope.game.theLoop = $interval(function(){
                $scope.colony.Age();
                if(!$scope.colony.alive){
                    $scope.game.colonyStarted = false;
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
