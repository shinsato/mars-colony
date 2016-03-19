(function($angular, _) {
    'use strict';

    $angular.module('app', ['ngDraggable'])

    .controller('appController', ['$scope', '$interval', function($scope, $interval) {





        $scope.totalCount = 0;


        var Person = function(){
            this.gender = chance.gender();
            this.name = chance.name({ gender: this.gender });
            this.age = _.random(15,30);
            //
            // this.endurance = _.random(3,6);
            // this.intelligence = _.random(-2,2);
            // this.charisma = _.random(-2,2);

            this.charisma = {};
            buildOut(this.charisma);
            this.strength = {};
            buildOut(this.strength);
            this.intelligence = {};
            buildOut(this.intelligence);
            this.endurance = {};
            buildOut(this.endurance);
            this.uid = this.charisma.gene.concat(this.endurance.gene, this.strength.gene, this.intelligence.gene);

            this.farming = false;

            this.alive = true;
            this.withChild = false;
            this.room = 0;
            $scope.totalCount++;
        };
        Person.prototype.Age = function() {
            if(!this.alive){
                return false;
            }
            // Farming -> http://FunnyOrDie.com/m/e2h

            if(this.farming) {
                var attempt = this.RollStrength();
                if(attempt > 5) { Colony.food++; } else if (attempt >= 9) { Colony.food = Colony.food + 2}
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
                if(this.IsFertile() && !this.farming){
                    console.log("trying", this.farming);

                    for(var i in $scope.colony.colonists){
                        var current_colonist = $scope.colony.colonists[i];
                        if(this.id != current_colonist.id
                        && this.room >= 1 && this.room <= 10
                        && this.room == current_colonist.room
                        && this.IsFertile()
                        && current_colonist.gender == 'Male'
                        && current_colonist.farming === false){
                            var roll = _.random(1,6);
                            console.log("Roll to conceive");
                            var roll_with_mods = roll + this.charisma.attr + current_colonist.charisma.attr;
                            if(roll_with_mods >= 4){
                                this.withChild = 1;
                                console.log("With child!");

                                break;
                            }
                        }
                    }
                }
            }

            this.age++;

            this.RollEndurance();

            if(this.endurance.attr < 1){
                this.alive = false;
                $scope.totalCount--;
            }

            //this.RollStrength();
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
                this.endurance.attr--;
            }
        };

        Person.prototype.RollStrength = function() {
            var roll = _.random(1,10);
            return roll + (this.endurance.attr - 5);
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
            this.starterCount = num_colonists;
            this.name = name;
            this.age = 0;
            this.alive = true;
            this.colonists = [];
            this.couples = [];
            this.food = num_colonists * 7;

            for (var i=1; i<=num_colonists; i++){
                var person = new Person();
                person.id = this.colonists.length;
                this.colonists.push(person);
            }
        };
        Colony.prototype.Age = function(){
            var anyone_alive = false;
            var that = this;
            this.age++;
            this.food--;


            for(var i in this.colonists){
                this.colonists[i].Age();
                if(this.colonists[i].alive){
                    anyone_alive = true;
                }
                if(this.colonists[i].farming) {
                    var farmed = this.colonists[i].RollStrength();
                    if(farmed > 5)
                    that.food++;
                    console.log("Food Fired", farmed);
                }
            }
            this.alive = anyone_alive;
        };

        $scope.onDragSucces = function(index,obj,evt) {
                var otherObj = $scope.draggableObjects[index];
                var otherIndex = $scope.draggableObjects.indexOf(obj);
                $scope.draggableObjects[index] = obj;
                $scope.draggableObjects[otherIndex] = otherObj;
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
