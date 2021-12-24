const mongoose = require("mongoose");

const Player = mongoose.model("Player", {
	name : {type : String, required : true},
	nowa : {type : String, required : true},
	level : {type : Number, required : true},
	hp : {type : Number, required : true},
	maxhp : {type : Number, required : true},
	damage : {type : Number, required :true},
	xp : {type : Number, required : true},
	mana : {type : Number, required : true},
	money : {type : Number, required : true },
	cooldown : {type : Number, required : true , default : 0}
})

// const player = new Player({nama : "muhamad alif", nowa : "0920387328" , level : 1, hp : 25, damage : 5, xp : 0,mana : 10, money : 100})

// player.save()
module.exports = Player;