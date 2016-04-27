var Room = function(colony, tile){
    this.id = colony.rooms.length;
    this.colony = colony;
    this.tile = tile;
    this.type = 'living'; //farming, mining, living
    this.capacity = 4;
    this.cost = 2;
};
Room.prototype.AtCapacity = function(){
    var self = this;

    var capacity = _.reduce(self.colony.colonists,function(count, colonist){
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
    return _.filter(self.colony.colonists,function(colonist){
        if(colonist.room.id == self.id){
            return colonist;
        }
    });
};


//Create Room Under Construction Prototype
var UnderConstructionRoom = function(colony, room_type){
    Room.apply(this,arguments);
    this.id = colony.rooms.length;
    this.colony = colony;

    this.type = 'building';
    this.type_to_be_built = room_type;
    this.capacity = 1;
    this.building_time = 0;
};
UnderConstructionRoom.prototype = Object.create(Room.prototype, tile);
UnderConstructionRoom.prototype.constructor = UnderConstructionRoom;
UnderConstructionRoom.prototype.GetRoomType = function(){
    if(this.type_to_be_built == 'living'){
        var room = new LivingRoom(this.colony, this.tile);
    }
    else if(this.type_to_be_built == 'mining'){
        var room = new MiningRoom(this.colony, this.tile);
    }
    else if(this.type_to_be_built == 'farming'){
        var room = new FarmingRoom(this.colony, this.tile);
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
    var room = this.GetRoomType();
    room.id = this.id;
    room.tile = this.tile;
    room.AddColonist(colonist);
    this.colony.ReplaceRoom(this, room);
}

//Create Living Room Prototype
var LivingRoom = function(colony, tile){
    Room.apply(this,arguments);
    this.id = colony.rooms.length;
    this.colony = colony;
    this.tile = tile;
    this.type = 'living';
    this.cost = 2;
    this.build_time = 2;
};
LivingRoom.prototype = Object.create(Room.prototype);
LivingRoom.prototype.constructor = LivingRoom;

//Create Mining Room Prototype
var MiningRoom = function(colony, tile){
    Room.apply(this,arguments);
    this.id = colony.rooms.length;
    this.colony = colony;
    this.tile = tile;
    this.type = 'mining';
    this.cost = 5;
    this.capacity = 2;
    this.build_time = 4;
};
MiningRoom.prototype = Object.create(Room.prototype);
MiningRoom.prototype.constructor = MiningRoom;

//Create Farming Room Prototype
var FarmingRoom = function(colony, tile){
    Room.apply(this,arguments);
    this.id = colony.rooms.length;
    this.colony = colony;
    this.tile = tile;
    this.type = 'farming';
    this.cost = 3;
    this.capacity = 2;
    this.build_time = 3;
};
FarmingRoom.prototype = Object.create(Room.prototype);
FarmingRoom.prototype.constructor = FarmingRoom;
