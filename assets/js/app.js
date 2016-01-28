(function($angular, _) {
    'use strict';

    $angular.module('app', [])

    .controller('appController', ['$scope', '$interval', function($scope, $interval) {
        var Person = function(){
            this.gender = chance.gender();
            this.name = chance.name({ gender: this.gender });
            this.age = _.random(15,30);
            this.endurance = _.random(3,6);
            this.intelligence = _.random(-2,2);
            this.charisma = _.random(-2,2);
            this.alive = true;
            this.withChild = false;
            this.room = 0;
        };
        Person.prototype.Age = function() {
            if(!this.alive){
                return false;
            }

            //Do womanly things (I'm gonna get sued for this section)
            if(this.withChild > 0){
                this.withChild++;
            }
            if(this.gender == 'Female'){
                if(this.withChild >= 3){ //Give Birth
                    this.withChild = false;
                    var person = new Person();
                    person.id = $scope.colony.colonists.length;
                    person.age = 0;
                    $scope.colony.colonists.push(person);//@todo link newborn to parents
                }
                if(this.IsFertile()){
                    for(var i in $scope.colony.colonists){
                        var current_colonist = $scope.colony.colonists[i];
                        if(this.id != current_colonist.id
                        && this.room >= 1 && this.room <= 10
                        && this.room == current_colonist.room
                        && this.IsFertile()
                        && current_colonist.gender == 'Male'){
                            var roll = _.random(1,6);
                            var roll_with_mods = roll + this.charisma + current_colonist.charisma;
                            if(roll_with_mods >= 4){
                                this.withChild = 1;
                                break;
                            }
                        }
                    }
                }
            }

            this.age++;

            this.RollEndurance();
            if(this.endurance < 1){
                this.alive = false;
            }
        };
        Person.prototype.RollEndurance = function() {
            var roll = _.random(1,10);
            if(this.age <= 2 || this.age >=75){
                roll = roll - 2;
            }
            else if(this.age <= 5 || this.age >= 65) {
                roll = roll - 1;
            }
            if(roll <= 1){
                this.endurance--;
            }
        };
        Person.prototype.IsFertile = function() {
            if(!this.alive){
                return false;
            }
            if(this.age >= 18 && this.withChild == false) {
                if(this.gender == "Female" && this.age >= 51) {
                    return false;
                }
                return true;
            }
            return false;
        };

        var Colony = function(name, num_colonists) {
            num_colonists = num_colonists || 6;
            this.name = name;
            this.age = 0;
            this.alive = true;
            this.colonists = [];
            this.couples = [];

            for (var i=1; i<=num_colonists; i++){
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
