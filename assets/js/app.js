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
        };
        Person.prototype.Age = function(){
            if(!this.alive){
                return false;
            }
            this.age++;
            if(this.age >= this.longevity){
                this.alive = false;
            }
        };

        var Colony = function(name, num_colonists){
            this.name = name;
            this.age = 0;
            this.alive = true;
            this.colonists = [];
            for (var i=0; i<=num_colonists; i++){
                this.colonists.push(new Person());
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

        var runLoop = function(colony){
            colony.Age();
            if(!colony.alive){
                $scope.colonyStarted = false;
                $interval.cancel($scope.theLoop);
            }
        }

        $scope.colonyStarted = false;
        $scope.colonyName = 'OMG Why?';
        $scope.numColonists = 6;

        $scope.startColony = function(){
            $scope.colony = new Colony($scope.colonyName, $scope.numColonists - 1);
            $scope.colonyStarted = true;
            $scope.theLoop = $interval(function(){runLoop($scope.colony);},1000);
        };
    }]);

})(window.angular, window._);
