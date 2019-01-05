var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('background', 'assets/Lungo.png');
    game.load.tilemap('mappa', 'mappa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'Aladdin_tiles.png');
    game.load.spritesheet('dude', 'assets/dudeBIG.png',56,84);
    game.load.image('star', 'assets/star.png');
    game.load.image('cube', 'assets/50x50.png');
    game.load.image('pareteMobile', 'assets/pareteMobile.png');
    game.load.image('button', 'assets/button.png');
}

var player;
var jumpButton;
var cursors;
var drag; //tasto trascinamento
var take; //tasto presa
var drop; //tasto rilascio
var i=0; //check raccolta chiave
var j=0; //check contatto cassa-ostacoli (serve causa fisica arcade)
var k=0;
var direction = 1; //riferimento della direzione del personaggio
var button; //tasto per trappole
var trapbox; //parete mobile
var trapbox2;

function create() {
    
    sfondo = game.add.image(0, 0, 'background');
    map = game.add.tilemap('mappa');
    map.addTilesetImage('terreno', 'tiles')
    layer = map.createLayer('livello1');
    map.setCollisionBetween(1, 100);
	
	cube1 = createCubes(350,2100);
	cube1.anchor.x=0.25;
	cube1.anchor.y=0.25;
	cube2 = createCubes(600, 2100);
    cube2.anchor.x=0.25;
	cube2.anchor.y=0.25;
    
    button = game.add.sprite( 1330, 2240, 'button');
	button2 = game.add.sprite( 1680, 2240, 'button');
    trapbox = game.add.sprite( 1536, 1880, 'pareteMobile');
	trapbox2 = game.add.sprite( 1922, 1680, 'pareteMobile');
    
    player = game.add.sprite(100,2200,'dude');
	player.anchor.x=0.25;
	player.anchor.y=0.25;
    player.animations.add('right', [5,6,7,8], 10, true);
    player.animations.add('left', [0,1,2,3],10, true);
    player.dragging=false;
    
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1200;
    game.physics.p2.setImpactEvents(true);
    
    
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(button);
	game.physics.arcade.enable(button2);
    game.physics.arcade.enable(trapbox);
    game.physics.arcade.enable(trapbox2);
    trapbox.body.immovable = true;
    trapbox2.body.immovable = true;
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 600;
    player.body.bounce.y = 0.09;
    player.body.velocity.x = 0;
    

    key1 = createKeys(1500, 1850);
	key1.anchor.x=0.25;
	key1.anchor.y=0.25;    
   
    
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    drag = game.input.keyboard.addKey(Phaser.Keyboard.C);
	take = game.input.keyboard.addKey(Phaser.Keyboard.X);
	drop = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    
    game.world.setBounds(0,0, 4096, 2400);

    game.camera.follow(player);
    
    game.camera.deadzone = new Phaser.Rectangle(387, 400, 250, 100);
}




function update() {
	//console.log(j);
	
    player.dragging=false;


    updateCubes(cube2, player);
	updateCubes(cube1, player);

	
	updateKeys(key1, player);
	

	
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(player, trapbox, trapPlayer);
    game.physics.arcade.collide(player, trapbox2, trapPlayer);
    game.physics.arcade.collide(trapbox, cube2, trapCube);
    game.physics.arcade.collide(trapbox2, cube2);
    game.physics.arcade.collide(layer, trapbox);
    game.physics.arcade.collide(layer, trapbox2);    
    
	k=0;
    /* //parete mobile
    if( trapCube){
        j=1;
        trapbox.body.gravity.y= 0;
        trapbox.body.velocity.y = 0;
        trapbox2.body.gravity.y= 0;
        trapbox2.body.velocity.y = 0;
        
        if(cube2.body.touching.up){
            cube2.body.immovable= true;
        }
        //cube2.body.velocity.x= 0;
        //this.game.state.restart()
    }
    else{
        j=0;
    }
    
    if((trapPlayer||trapPlayer2) && (player.body.touching.up || player.body.touching.down)){
        this.game.state.restart()
    }*/

    
	button.height = 32;
	button2.height = 32;
	
    game.physics.arcade.overlap(player, button, trigger);
    game.physics.arcade.overlap(cube2, button, trigger);
	game.physics.arcade.overlap(player, button2, trigger);
    game.physics.arcade.overlap(cube2, button2, trigger);
	
		
	
	if((trapbox.position.y < 1900) && k===0 && j===0){
		trapbox.body.velocity.y= 200;
		trapbox2.body.velocity.y = -200;
	}
    
    /* //pulsante
    if (triggerPlayer === true || triggerCube === true){
        button.height = 0;
        trapbox.body.gravity.y = 0;
        j=0;
        if(trapbox.position.y > 1500){
            trapbox.body.velocity.y = -150;
            trapbox2.body.velocity.y= 150;
        }else{
            trapbox.body.velocity.y = 0;
            trapbox2.body.velocity.y = 0;
        }
    }
    else {
                    
      if((trapbox.position.y < 1900) && j===0 ){
            button.height = 32;
          trapbox.body.gravity.y= 400;
          trapbox2.body.gravity.y = -400;
        }

    }
	
	*/
    
    if(player.body.velocity.x < 0){
            player.animations.play('left');
            direction = -1;
        }
        else if (player.body.velocity.x > 0){
            player.animations.play('right');
            direction = 1;
        }else if(player.body.velocity.x === 0){
            player.animations.stop();
            player.frame=4;
        }
    
    if(player.dragging){
        
        player.body.velocity.x= 0;
        
        if(cursors.left.isDown && (player.body.onFloor() || player.body.touching.down)){
            player.body.velocity.x= -170;

        }
        else if(cursors.right.isDown && (player.body.onFloor() || player.body.touching.down)){
            player.body.velocity.x= 170;
        }
                
    }else{
        //Il personaggio non si ferma sul posto, ma scivola leggermente
        if((player.body.onFloor() || player.body.touching.down) /*&& (drag.isDown === false)*/){
            player.body.velocity.x = (player.body.velocity.x)*0.7;
            if(player.body.velocity.x<40 && player.body.velocity.x>-40){
                player.body.velocity.x=0;
            }
        } //quando il personaggio salta la velocità non cambia
        else{
            player.body.velocity.x = (player.body.velocity.x)*1;
        }
    
    
        if(cursors.left.isDown && (player.body.onFloor() || player.body.touching.down)){

            player.body.velocity.x= -230;


        }
        else if(cursors.right.isDown && (player.body.onFloor() || player.body.touching.down)){
            player.body.velocity.x= 230;

        }

        if(cursors.left.downDuration(150) && (player.body.onFloor() || player.body.touching.down) ){
            player.body.velocity.x= -80;
        }
        else if(cursors.right.downDuration(150) && (player.body.onFloor() || player.body.touching.down)){
            player.body.velocity.x= +80;
        }
    }
    
    if(jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)){
        
        player.body.velocity.y = -400;
    }
      
    
}

function trigger(obj, btn){
        btn.height = 0;
		k=1;
		j=0;
        trapbox.body.gravity.y = 0;
        if(trapbox.position.y > 1600){
            trapbox.body.velocity.y = -150;
            trapbox2.body.velocity.y= 150;
        }else{
            trapbox.body.velocity.y = 0;
            trapbox2.body.velocity.y = 0;
        }
	
}

function trapPlayer(){
	if(player.body.touching.up || player.body.touching.down){
        alert('Game Over'); //sostituire con restart fatto bene
    }
}

function trapCube(){
        
		if(cube2.body.touching.up){
			cube2.body.immovable = true;
			j=1;
        }
	
        trapbox.body.gravity.y= 0;
        trapbox.body.velocity.y = 0;
        trapbox2.body.gravity.y= 0;
        trapbox2.body.velocity.y = 0;
        

    }


function createCubes(x,y) {
	c = game.add.sprite(x,y,'cube');
	game.physics.arcade.enable(c);
  	c.body.velocity.x = 0;
	c.body.immovable = true;
	c.body.gravity.y = 800;
    //c.draggable=false;
  return c;
}

function updateCubes(cube, player){
	game.physics.arcade.collide(cube, layer);
	collideWithObj = game.physics.arcade.collide(player, cube);
	cube.body.velocity.x = 0;
	cube.body.immovable = true;
	
	//drag function
    console.log("j="+j);
	console.log("k="+k);
	if (drag.isDown && ((cube.position.x - player.position.x < 50) && (cube.position.x - player.position.x > -50)) && ((cube.position.y - player.position.y < 20) && (cube.position.y - player.position.y > -20)) && i===0 && j===0) {
        		
		//cube.draggable===true;
        player.dragging=true;
        
        if (cursors.left.isDown) {
            cube.body.velocity.x = player.body.velocity.x;
			cube.body.immovable = false;
        }
        
        else if (cursors.right.isDown) {  
            cube.body.velocity.x =  player.body.velocity.x;
			cube.body.immovable = false;
        }
		
		
        else {
            player.animations.stop();
            player.frame = 4;
        }
    }

}


function createKeys(x,y) {
	k = game.add.sprite(x,y,'star');
	game.physics.arcade.enable(k);
  	k.body.velocity.x = 0;
	k.body.immovable = true;
	k.body.gravity.y = 500;
    k.draggable=false;
  return k;
}

function updateKeys(key, player){
	game.physics.arcade.collide(key, layer);
	key.body.velocity.x = 0;
	key.body.immovable = true;
	
	if (take.downDuration(250) && ((key.position.x - player.position.x < 32) && (key.position.x - player.position.x > -33))) {
        
        i = 1;
        key.body.gravity.y = 0;
            //player.body.getChildAt(cube).alignTo(player, Phaser.TOP_CENTER);
        key.x = player.x;
        key.y = player.y - 32;
        
    }
    
    if (drop.downDuration(250) && ((key.position.x - player.position.x < 32) && (key.position.x - player.position.x > -33))) {
        
        if (direction === -1){
            i = 0;
            key.x = player.x - 25;
            key.y = player.y;   
        } 
        
        else if (direction === 1){
            i = 0;
            key.x = player.x + 25;
            key.y = player.y;   
        }
        
        key.body.gravity.y = 500;  
    }
	
	if(true || player.body.onFloor() && i === 1){
        
        if (i === 1){
			key.x = player.x;
        	key.y = player.y - 32;
		}
    }
}
