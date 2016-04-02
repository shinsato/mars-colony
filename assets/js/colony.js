var Colony = function(name, num_colonists) {
    num_colonists = num_colonists || 6;
    this.starterCount = num_colonists;
    this.name = name;
    this.age = 0;
    this.alive = true;
    this.colonists = [];
    this.food = num_colonists * 7;
    this.ore = 100;
    this.rooms = [];

    var room_count = 0;
    var room = new LivingRoom(this);
    for (var i=1; i<=num_colonists; i++){
        var person = new Person(this);

        this.colonists.push(person);
        if(room_count < room.capacity){
            person.room = room;
            room_count++;
        }
        else {
            this.rooms.push(room);
            room = new LivingRoom(this);
            room_count = 0;
            person.room = room;
            room_count++;
        }
    }
    this.rooms.push(room);

    //Make mining and farming rooms
    var mining_room = new MiningRoom(this);
    this.rooms.push(mining_room);

    var farming_room = new FarmingRoom(this);
    this.rooms.push(farming_room);
};
Colony.prototype.RemoveRoom = function(room){
    this.rooms = _.reject(this.rooms, function(current_room){
        if(current_room.id == room.id){
            return true;
        }
    });
};
Colony.prototype.ReplaceRoom = function(find_room, replace_room){
    for(var i in this.rooms){
        if(this.rooms[i].id == find_room.id){
            this.rooms[i] = replace_room;
            return true;
        }
    }
    return false;
};
Colony.prototype.AddRoom = function(type, colonist){
    if(colonist.age < 16){
        return false;
    }
    if(['living','farming','mining'].indexOf(type) >= 0 ){
        var room = new UnderConstructionRoom(this, type);

        if(room.GetRoomCost() <= this.ore){
            this.ore -= room.GetRoomCost();
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
        if(!colonist.alive){//The dead dont work or reproduce, cuz that'd be disgusting
            return;
        }
        if(colonist.age < 16){ //Underage cant work or reproduce
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
                room.BuildRoom(colonist);
            }
            else{
                //@todo Add in roll check logic here
                room.building_time++;
            }
        }
    });

    this.alive = _.some(self.colonists, {alive: true});
};
