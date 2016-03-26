(function($angular, _) {
    'use strict';

    $angular.module('app', ['ngDraggable'])

    .controller('appController', ['$scope', '$interval', function($scope, $interval) {

        $scope.totalCount = 0;

        var Room = function(){
            this.id = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.type = 'living'; //farming, mining, living
            this.capacity = 4;
            this.cost = 2;
        };
        Room.prototype.AtCapacity = function(){
            var self = this;
            var capacity = _.reduce($scope.colony.colonists,function(count, colonist){
                if(colonist.room.id == self.id){
                    return count + 1;
                }
                return count;
            },0);
            if(capacity >= self.capacity){
                return true;
            }
            return false;
        };
        Room.prototype.AddColonist = function(colonist){
            if(!this.AtCapacity()){
                colonist.room = this;
                return true;
            }
            return false;
        };
        Room.prototype.GetColonists = function(){
            var self = this;
            return _.filter($scope.colony.colonists,function(colonist){
                if(colonist.room.id == self.id){
                    return colonist;
                }
            });
        };


        //Create Room Under Construction Prototype
        var UnderConstructionRoom = function(room_type){
            Room.apply(this,arguments)
            this.type = 'building';
            this.type_to_be_built = room_type;
            this.capacity = 1;
            this.building_time = 0;
        };
        UnderConstructionRoom.prototype = Object.create(Room.prototype);
        UnderConstructionRoom.prototype.constructor = UnderConstructionRoom;
        UnderConstructionRoom.prototype.GetRoomType = function(){
            if(this.type_to_be_built == 'living'){
                var room = new LivingRoom();
            }
            else if(this.type_to_be_built == 'mining'){
                var room = new MiningRoom();
            }
            else if(this.type_to_be_built == 'farming'){
                var room = new FarmingRoom();
            }
            return room;
        }
        UnderConstructionRoom.prototype.GetRoomCost = function(){
            var room = this.GetRoomType();
            return room.cost;
        };
        UnderConstructionRoom.prototype.GetRoomBuildTime = function(){
            var room = this.GetRoomType();
            return room.build_time;
        }
        UnderConstructionRoom.prototype.BuildRoom = function(colonist){
            $scope.colony.RemoveRoom(this);
            var room = this.GetRoomType();
            room.AddColonist(colonist);
            $scope.colony.rooms.push(room);
        }

        //Create Living Room Prototype
        var LivingRoom = function(){
            Room.apply(this,arguments)
            this.type = 'living';
            this.cost = 2;
            this.build_time = 2;
        };
        LivingRoom.prototype = Object.create(Room.prototype);
        LivingRoom.prototype.constructor = LivingRoom;

        //Create Mining Room Prototype
        var MiningRoom = function(){
            Room.apply(this,arguments)
            this.type = 'mining';
            this.cost = 5;
            this.capacity = 2;
            this.build_time = 4;
        };
        MiningRoom.prototype = Object.create(Room.prototype);
        MiningRoom.prototype.constructor = MiningRoom;

        //Create Farming Room Prototype
        var FarmingRoom = function(){
            Room.apply(this,arguments)
            this.type = 'farming';
            this.cost = 3;
            this.capacity = 2;
            this.build_time = 3;
        };
        FarmingRoom.prototype = Object.create(Room.prototype);
        FarmingRoom.prototype.constructor = FarmingRoom;

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

            this.alive = true;
            this.withChild = false;
            this.room = 0;
            $scope.totalCount++;
        };
        Person.prototype.Age = function() {
            if(!this.alive){
                return false;
            }

            //Do womanly things (I'm gonna get sued for this section)
            if(this.withChild > 0){
                this.withChild++;
            }
            if(this.gender == 'Female' && this.withChild >= 3){//Give Birth
                var room = this.room;
                if(!room.AtCapacity()){ // cant give birth in a full room; hold it in! @todo fix this with a better mechanic
                    this.withChild = false;
                    var person = new Person();
                    person.id = $scope.colony.colonists.length;
                    person.age = 0;
                    $scope.colony.colonists.push(person);//@todo link newborn to parents
                    room.AddColonist(person);
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
            return roll + (this.strength.attr - 5);
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
            this.ore = 0;
            this.rooms = [];

            var room_count = 0;
            var room = new LivingRoom();
            room.id = this.rooms.length;
            for (var i=1; i<=num_colonists; i++){
                var person = new Person();
                person.id = this.colonists.length;
                this.colonists.push(person);
                if(room_count < room.capacity){
                    person.room = room;
                    room_count++;
                }
                else {
                    this.rooms.push(room);
                    room = new LivingRoom();
                    room_count = 0;
                    room.id = this.rooms.length;
                    person.room = room;
                    room_count++;
                }
            }
            this.rooms.push(room);

            //Make mining and farming rooms
            var mining_room = new MiningRoom();
            mining_room.id = this.rooms.length;
            this.rooms.push(mining_room);

            var farming_room = new FarmingRoom();
            farming_room.id = this.rooms.length;
            this.rooms.push(farming_room);
        };
        Colony.prototype.RemoveRoom = function(room){
            this.rooms = _.reject(this.rooms, function(current_room){
                if(current_room.id == room.id){
                    return true;
                }
            });
        }
        Colony.prototype.AddRoom = function(type, colonist){
            if(['living','farming','mining'].indexOf(type) >= 0 ){
                var room = new UnderConstructionRoom(type);
                if(room.GetRoomCost() <= this.ore){
                    this.ore -= room.GetRoomCost();
                    room.id = this.rooms.length;
                    room.AddColonist(colonist);
                    this.rooms.push(room);
                    return true;
                }
            }
            return false;
        };
        Colony.prototype.Age = function(){
            var self = this;
            self.age++;
            self.food--;

            _.each(self.colonists,function(colonist){
                colonist.Age();
                if(!colonist.alive){
                    return;
                }
                var room = colonist.room;
                var colonists_in_room = colonist.room.GetColonists();
                if(room.type == 'living'){
                    _.find(colonists_in_room, function(current_colonist){

                        if(colonist.id != current_colonist.id
                        && colonist.IsFertile()
                        && current_colonist.IsFertile()
                        && colonist.gender == "Female"
                        && current_colonist.gender == 'Male'){
                            var roll = _.random(1,6);
                            console.log("Roll to conceive");
                            var roll_with_mods = roll + colonist.charisma.attr + current_colonist.charisma.attr;
                            if(roll_with_mods >= 4){
                                colonist.withChild = 1;
                                console.log("With child!");

                                return true;
                            }
                        }
                    });
                }
                else if(room.type == "farming") {
                    var farmed = colonist.RollStrength();
                    if(farmed > 5)
                    self.food++;
                    console.log("Food Farmed", farmed);
                }
                else if(room.type == "mining") {
                    console.log("Mining!");
                    var attempt = colonist.RollStrength();
                    if(attempt > 7) {
                        self.ore++;
                        console.log("mining success!");
                    }
                    else if (attempt >= 2) {
                        colonist.endurance.attr--;
                        console.log("Ouch.");

                    }
                    else if(attempt === 0) {
                        colonist.alive = false;
                        console.log("NOOOOOOOO.");
                    }
                }
                else if (room.type == "building"){
                    if(room.building_time >= room.GetRoomBuildTime()){
                        room.BuildRoom();
                    }
                    else{
                        //@todo Add in roll check logic here
                        room.building_time++;
                    }
                }
            });

            this.alive = _.some(self.colonists, {alive: true});
        };

        $scope.onDragSucces = function(index,obj,evt) {
                var otherObj = $scope.draggableObjects[index];
                var otherIndex = $scope.draggableObjects.indexOf(obj);
                $scope.draggableObjects[index] = obj;
                $scope.draggableObjects[otherIndex] = otherObj;
            };

        $scope.changeRoom=function(person,evt,newRoom){
            newRoom.AddColonist(person);
        }

        $scope.createRoomandMove=function(person,evt,newRoom){
            console.log(arguments);
            $scope.colony.AddRoom('living', person);
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
