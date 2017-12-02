import Phaser from 'phaser';

import Level from 'level';

export default class GameState extends Phaser.State {
	preload() {
		window.game.load.image('player', 'assets/player.png');

		this.level = new Level;
		
	}


	create() {
		window.game.stage.backgroundColor = '#442200';
    window.game.physics.startSystem(Phaser.Physics.ARCADE);
		window.game.world.setBounds(
				0,0,
				this.level.width * this.level.tilesize,
				this.level.height * this.level.tilesize
		);
		this.level.createTilemap();

    
		this.player = window.game.add.sprite(
        10*this.level.tilesize,
        10*this.level.tilesize,
        'player'
    );
    window.game.physics.arcade.enable(this.player);
		window.game.camera.follow(this.player);

		this.cursors = window.game.input.keyboard.createCursorKeys();

	}

  update() {
		window.game.physics.arcade.collide(this.player,this.level.layer);

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
		
		if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x = -550;
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = 550;
    }

		if (this.cursors.up.isDown)
    {
        //  Move to the left
        this.player.body.velocity.y = -550;
    }
    else if (this.cursors.down.isDown)
    {
        //  Move to the right
        this.player.body.velocity.y = 550;
    }
  }
}
