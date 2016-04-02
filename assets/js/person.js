var Person = function(colony){
    this.id = colony.colonists.length;
    this.colony = colony;

    this.gender = chance.gender();
    this.first_name = chance.first({ gender: this.gender });
    this.last_name = chance.last();
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
            var person = new Person(this.colony);
            person.id = this.colony.colonists.length;
            person.age = 0;
            person.last_name = this.last_name;
            this.colony.colonists.push(person);//@todo link newborn to parents
            room.AddColonist(person);
        }
    }

    this.age++;

    this.RollEndurance();

    if(this.endurance.attr < 1){
        this.alive = false;
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
