import Phaser from 'phaser';

import Level from 'level';

export default class GameState extends Phaser.State {
	preload() {
		window.game.load.image('player', 'assets/player.png');

		this.level = new Level;
		
	}


	create() {
		window.game.stage.backgroundColor = '#442200';
		this.level.createTilemap();

    
    window.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.player = window.game.add.sprite(
        10*this.level.tilesize,
        10*this.level.tilesize,
        'player'
    );
    window.game.physics.arcade.enable(this.player);

		this.cursors = window.game.input.keyboard.createCursorKeys();

	}

  update() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
		
		if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x = -150;
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = 150;
    }

		if (this.cursors.up.isDown)
    {
        //  Move to the left
        this.player.body.velocity.y = -150;
    }
    else if (this.cursors.down.isDown)
    {
        //  Move to the right
        this.player.body.velocity.y = 150;
    }
  }
}
