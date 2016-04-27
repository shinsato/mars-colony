var Map = function(x_size, y_size){
    this.x_size = x_size;
    this.y_size = y_size;
    this.tiles = [];
}
Map.prototype.generateMap = function(){
    for(y=0; y<=this.y_size; y++){
        for(x=0; x<=this.x_size; x++){
            var tile = new Tile(this, x, y);
            this.tiles.push(tile);
        }
    }
}


var Tile = function(map, x, y){
    this.id = map.tiles.length;
    this.map = map;
    this.x = x;
    this.y = y;
    this.type = chance.weighted(['flat', 'mountian', 'hill', 'ore', 'ice'],[50, 10, 15, 15, 10]); //flat, mountian, hill, ore, ice
    this.build_time = 1;
};
