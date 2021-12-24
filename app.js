require("./utils/conn.js");
const chalk = require('chalk');
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const Player = require('./model/Player');
const Bags = require('./model/Bags')

const Shop = JSON.parse(fs.readFileSync('./data/Shop.json'))
const Monster = JSON.parse(fs.readFileSync('./data/Monster.json'));
const Potions = JSON.parse(fs.readFileSync('./data/Potions.json'));

async function input (question) {
	return new Promise((resolve,reject) => {
		readline.question(question, res => resolve(res));
	})
}

function fight(player,monster){
	console.log(monster)
	while(true){
		if (player.hp <= 0 || monster.hp <= 0) return {win : false, msg : `Anda Dikalahkan oleh ${monster.name}\n\nKehilangan ${Math.round(20/100 * player.xp)}XP Dan ${Math.round(5/100 * player.money)} Gold`};
		console.log(chalk`{green ${player.name}} Menyerang Dengan {yellow Damage ${player.damage}}`);
		monster.hp -= player.damage;
		console.log(chalk`{red Darah ${monster.name}} Menjadi {red ${monster.hp}}\n\n`)
		if (player.hp <= 0 || monster.hp <= 0) return {win : true, msg : `Selamat ${player.name} Anda Menang\n\nMendapatkan ${monster.xp * monster.level}XP Dan ${monster.gold} Gold`};
		console.log(chalk`{red ${monster.name}} Menyerang Dengan {yellow Damage ${monster.damage}}`);
		player.hp -= monster.damage;
		console.log(chalk`{red Darah} {green ${player.name}} Menjadi {blue ${player.hp}}\n\n`)
	}
}

async function batle(player,monster,now){
	if (player.hp <= 0) {
		console.log("Tunggu 5 Detik Anda Akan Segera Respawn");
		if (player.cooldown != 0) {
			if (player.cooldown <= now.getTime()) {
				player.cooldown = 0;
				player.hp = player.maxhp;
				Player.findOneAndUpdate({id : "619c885485799984440f1689"}, player, (err,doc) => (err ? err : ''));
				console.log("HP Kembali Pulih")
			}else{
				console.log("Tunggu Sedang Respawn")
			}
		}else{
			future = new Date(now);
			future.setSeconds(now.getSeconds() + 10);
			player.cooldown = future.getTime(); 
			Player.findOneAndUpdate({id : "619c885485799984440f1689"}, player, (err,doc) => (err ? err : ''));
		}

		return;
	}
	result = await fight(player,monster);
	if (result.win) {
		player.xp += monster.xp * monster.level;
		player.money += monster.gold;
		Player.findOneAndUpdate({id : "619c885485799984440f1689"}, player, (err,doc) => {
			if (err) return err;
			console.log(result.msg);
		});

	}else{
		player.xp -= Math.round(20/100 * player.xp);
		player.money -= Math.round(5/100 * player.money);
		Player.findOneAndUpdate({id : "619c885485799984440f1689"}, player, (err,doc) => {
			if (err) return err;
			console.log(result.msg);
		});
	}
}

async function usePotion(player,id){
	switch (id){
		case '1':
			potions = await Potions.findOne({itemid : id});
			player.hp = ((player.hp + potions.effect) <= player.maxhp ? player.hp + potions.effect : player.maxhp)
			Player.findOneAndUpdate({id : "619c885485799984440f1689"}, player, (err,doc) => (err ? err : ''));
		break;
		default:
			console.log("Item ID tidak Sesuai")
		break;
	}
}

function menu(player){
	const lineColor = chalk.rgb(120, 255, 199).bold;
	const orange = chalk.keyword('orange');
	const hpbar = Math.round((player.hp / player.maxhp) * 20);
	console.log(lineColor("\n" + " ".repeat(25) + '+====================+'));
	console.log(" ".repeat(25)+ lineColor("|" + " ".repeat(20) + "|"))
	console.log(" ".repeat(25) + lineColor("| ") + orange("RGP GAME TXT BASED") + lineColor(" |"))
	console.log(" ".repeat(25)+ lineColor("|" + " ".repeat(20) + "|"))
	console.log(" ".repeat(25) + lineColor('+====================+\n'));
	// Status Biasa
	console.log(`Nama  : ${player.name.toUpperCase()}
Level  : ${player.level}\n` +
chalk`	    +${"-".repeat(20)}+\n` +
`Health : ` + chalk`${player.hp} |{bgRed ${" ".repeat(hpbar)}}${" ".repeat(20-hpbar)}|\n` +
chalk`	    +${"-".repeat(20)}+`)
	// Pilihan
	console.log(orange(`1.fight\n2.status\n3.use\n4.inv\n5.shop`))
}

async function Main(){
	const now = new Date();
	const player = await Player.findOne({id : "619c885485799984440f1689"});
	const monster = await Monster.find(m => m.name === "Slime");
	const bag = await Bags.findOne({id : player.nowa});
	menu(player)

	// batle(player,monster);
	// usePotion(player,'1')
	readline.question("Masukkan Perintah: ",async (command) => {
		switch(command){
  			case 'fight':
  				batle(player,monster,now)
  			break;
  			case 'status':
  			case 'stat':
  			setTimeout( () => {
  				console.log(chalk`\n{yellow.underline STATUS}`)
  				console.log(chalk`{cyan ${"=".repeat(20)}}`);
  				console.log(chalk`Name: ${player.name.toUpperCase()}\n{magenta Max HP: ${player.maxhp}}\n{green XP: ${player.xp}}\n{red Power: ${player.damage}}\n{rgb(237, 177, 26) Gold: ${player.money}}`)
  				console.log(chalk`{cyan ${"=".repeat(20)}}\n`);
  			},1500)
  			break;
  			case 'invent':
  			case 'inv':
  				console.table(bag.value)
  			break;
  			case 'shop':
  				console.table(Shop, ["name","desc","price"])
  			break;
  			case 'use':
  				console.log("1.Small Health Potions");
  				const id = await input("Masukkan Id Item: ");
  				usePotion(player,id)
  			break;
  			}
  		setTimeout(() => Main(),1000)
  		}
	);
}
	

Main();
