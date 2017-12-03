import Phaser from 'phaser';

import Level from 'level';
import Sentry from 'sentry';
import HUD from 'hud';

export default class GameState extends Phaser.State {
	preload() {
		window.game.load.spritesheet('player', 'assets/player.png', 16, 24);
		window.game.load.spritesheet('enemy', 'assets/enemy.png', 16, 24);

		this.level = new Level;
        this.playing = true;
		
	}


	create() {
		window.game.stage.backgroundColor = '#000000';
        window.game.physics.startSystem(Phaser.Physics.ARCADE);
		window.game.world.setBounds(
				0,0,
				this.level.width * this.level.tilesize,
				this.level.height * this.level.tilesize
		);
		this.level.createTilemap();

    
		this.player = window.game.add.sprite(
            this.level.startingpos.x*this.level.tilesize,
            this.level.startingpos.y*this.level.tilesize,
            'player'
        );
        this.player.animations.add('down', [0,1,2], 10, true);
        this.player.animations.add('up', [9,10,11], 10, true);
        this.player.animations.add('left', [6,7,8], 10, true);
        this.player.animations.add('right', [3,4,5], 10, true);
        window.game.physics.arcade.enable(this.player);
        this.player.body.setSize(16,10,0,14);
		window.game.camera.follow(this.player);


		this.cursors = window.game.input.keyboard.createCursorKeys();

        this.sentries = []
        for (let i=0; i<10; i++) {
            let s = new Sentry({
                game: window.game,
                level: this.level,
            });
            window.game.add.existing(s);
            this.sentries.push(s);
        }

        this.hud = new HUD(window.game);

	}

    update() {
		window.game.physics.arcade.collide(this.player,this.level.layer);
		window.game.physics.arcade.collide(this.sentry,this.level.layer);

        if (this.playing) {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            let moving = false;

            if (window.game.physics.arcade.overlap(this.player,this.sentries)) {
                this.hud.healthbar.health -= 5;
            }
            if (this.hud.healthbar.health == 0) {
                this.playing = false;
				this.game.camera.onFadeComplete.addOnce(this._die,this);
                this.game.camera.fade('#000000');
            }
                
            if (this.cursors.left.isDown)
            {
                //  Move to the left
                this.player.body.velocity.x = -150;
                this.player.animations.play('left');
                moving = true;
            }
            else if (this.cursors.right.isDown)
            {
                //  Move to the right
                this.player.body.velocity.x = 150;
                this.player.animations.play('right');
                moving = true;
            }

            if (this.cursors.up.isDown)
            {
                //  Move to the left
                this.player.body.velocity.y = -150;
                this.player.animations.play('up');
                moving = true;
            }
            else if (this.cursors.down.isDown)
            {
                //  Move to the right
                this.player.body.velocity.y = 150;
                this.player.animations.play('down');
                moving = true;
            }

            if (!moving) {
                this.player.animations.stop();
                this.player.frame = 1;
            }
        }
    }

	_die() {
		this.game.state.start('Dead');
	}

    render() {
//        game.debug.body(this.player);
    }
}
