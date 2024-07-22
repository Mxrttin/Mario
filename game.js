/* global Phaser */

import  {createAnimations } from  "./animations.js";

const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244, // Resolución original de Super Mario Bros
    backgroundColor: "#049cd8",
    parent: 'game',
    physics:{
        default: 'arcade',
        arcade: {
            gravity:{ y: 300 },
            debug: false
        }
    },
    scene: {
        preload,  // se ejecuta para precargar recursos
        create,   // se ejecuta cuando el juego comenzó
        update    // se ejecuta en cada frame
    }
}

new Phaser.Game(config);


function preload(){

    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.spritesheet(
        'mario',//<-- id
        'assets/entities/mario.png',
        { frameWidth: 18 , frameHeight: 16 }
    )

    this.load.audio(
        'gameover',
        'assets/sound/music/gameover.mp3'
    )
}

function create(){

    this.add.image(100 ,50 ,'cloud1')
        .setScale(0.15)
        .setOrigin(0,0)
    


    this.floor = this.physics.add.staticGroup();

    this.floor
       .create(0 , config.height - 16,'floorbricks')
       .setOrigin(0,0.5)
       .refreshBody()
       

    this.floor
       .create(200 , config.height - 16,'floorbricks')
       .setOrigin(0,0.5)
       .refreshBody()



    this.mario = this.physics.add.sprite(50,100,'mario')
        .setOrigin(0,1)
        .setCollideWorldBounds(true)
        .setGravityY(300)

    this.physics.world.setBounds(0,0,2000,config.height)
    this.physics.add.collider(this.mario, this.floor)

    this.cameras.main.setBounds(0,0,2000,config.height)
    this.cameras.main.startFollow(this.mario)

    createAnimations(this)

    this.keys = this.input.keyboard.createCursorKeys()
}   

    

function update(){
    if(this.mario.isDead)return

    if (this.keys.left.isDown){
        this.mario.x -= 0.7
        this.mario.flipX = true
        this.mario.anims.play('mario-walk' , true)
    }else if (this.keys.right.isDown){
        this.mario.x += 0.7
        this.mario.flipX = false
        this.mario.anims.play('mario-walk' , true)
    } else {
        this.mario.anims.play('mario-idle',true)
    }

    if(this.keys.up.isDown && this.mario.body.touching.down){
        this.mario.setVelocityY(-200)
        this.mario.anims.play('mario-jump',true)
    }

    if(this.mario.y >= config.height ){
        this.mario.isDead = true
        this.mario.anims.play('mario-dead')
        this.mario.setCollideWorldBounds(false)
        this.sound.add('gameover',{volume: 0.2}).play()

        setTimeout(() =>{

            this.mario.setVelocityY(-350)
        },100)

        setTimeout(() =>{
            this.scene.restart()
        },10000)
    }
}