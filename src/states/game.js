import Phaser from 'phaser';

import Level from 'level';
import Sentry from 'sentry';
import Pickup from 'pickup';
import HUD from 'hud';

export default class GameState extends Phaser.State {
	preload() {
		window.game.load.spritesheet('player', 'assets/player.png', 16, 24);
		window.game.load.spritesheet('enemy', 'assets/enemy.png', 16, 24);
		window.game.load.spritesheet('pickup', 'assets/pickup.png', 9, 9);
		window.game.load.spritesheet('dropoff', 'assets/dropoff.png', 48, 75);
		window.game.load.bitmapFont('font4', 'assets/font4.png', 'assets/font4.fnt');

		window.game.load.audio('destroy', 'assets/destroy.wav');
		window.game.load.audio('die', 'assets/die.wav');
		window.game.load.audio('dropoff', 'assets/dropoff.wav');
		window.game.load.audio('pickup', 'assets/pickup.wav');
		window.game.load.audio('win', 'assets/win.wav');
		window.game.load.audio('hurt', 'assets/hurt.wav');

		
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
		this.carrying = 0;

		this.sound = {};
		this.sound.destroy = window.game.add.audio('destroy');
		this.sound.die = window.game.add.audio('die');
		this.sound.dropoff = window.game.add.audio('dropoff');
		this.sound.pickup = window.game.add.audio('pickup');
		this.sound.win= window.game.add.audio('win');
		this.sound.hurt= window.game.add.audio('hurt');

		this.pickups = []
		for (let i=0; i<10; i++) {
			let s = new Pickup({
				game: window.game,
				level: this.level,
			});
			window.game.add.existing(s);
			this.pickups.push(s);
		}

		console.log("dropoffpos: ",this.level.dropoffpos);
		this.dropoff = window.game.add.sprite(
				(this.level.dropoffpos.x*this.level.tilesize)+(this.level.tilesize/2),
				(this.level.dropoffpos.y*this.level.tilesize)+(this.level.tilesize/2),
				'dropoff'
		);
		this.dropoff.anchor.setTo(0.5);
		window.game.physics.arcade.enable(this.dropoff);

		this.sentries = []
		for (let i=0; i<10; i++) {
			let s = new Sentry({
				game: window.game,
				level: this.level,
			});
			window.game.add.existing(s);
			this.sentries.push(s);
		}
	
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
		this.spacebar = window.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		this.spacebar.onDown.add(this.drop, this, 0);

		


		this.hud = new HUD(window.game);

	}

	drop() {
		if ( this.carrying > 0) {
			this.carrying--;
			for (let i=0; i<5; i++) {
				this.sound.destroy.play();
				let sid = Math.floor(Math.random()*this.sentries.length);
				let s = this.sentries[sid];
				this.sentries.splice[sid,1];
				s.destroy();
			}
			let p = new Pickup({
				game: window.game,
				level: this.level,
			});
			window.game.add.existing(p);
			this.pickups.push(p);
			this.hud.remain.set(this.pickups.length);
			this.hud.carrying.set(this.carrying);
		}
	}

	update() {
			window.game.physics.arcade.collide(this.player,this.level.layer);
			window.game.physics.arcade.collide(this.sentry,this.level.layer);

		if (this.playing) {
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
			let moving = false;

			// Are we being hit by an enemy?
			if (window.game.physics.arcade.overlap(this.player,this.sentries)) {
				this.hud.healthbar.health -= 5;
				this.sound.hurt.play();
			}

			// Are we dead?
			if (this.hud.healthbar.health == 0) {
				this.playing = false;
				this.sound.die.play();
				this.game.camera.onFadeComplete.addOnce(this._die,this);
				this.game.camera.fade('#000000');
			}

			// Are we picking up an item?
			for (let i=0;i<this.pickups.length;i++) {
				if ( window.game.physics.arcade.overlap(this.player,this.pickups[i])) {
					this.sound.pickup.play();
					let s = this.pickups[i];
					this.pickups.splice(i,1);
					s.destroy();
					this.hud.remain.set(this.pickups.length);
					this.carrying += 1;
					this.hud.carrying.set(this.carrying);
					for (let i=0; i<5; i++) {
						let s = new Sentry({
							game: window.game,
							level: this.level,
						});
						window.game.add.existing(s);
						this.sentries.push(s);
					}
				}
			}

			// Are we dropping off items?
			if (window.game.physics.arcade.overlap(this.player,this.dropoff)) {

				if ( this.carrying > 0) {
					this.sound.dropoff.play();
					for (let i=0; i<5*this.carrying; i++) {
						let sid = Math.floor(Math.random()*this.sentries.length);
						let s = this.sentries[sid];
						this.sentries.splice[sid,1];
						s.destroy();
					}
				}
				this.carrying=0;
				this.hud.carrying.set(this.carrying);

				// Check to see if we've won
				if (this.pickups.length == 0) {
					this.sound.win.play();
					this.playing = false;
					this.game.camera.onFadeComplete.addOnce(this._win,this);
					this.game.camera.fade('#000000');
				}
			}
				
			// Keyboard movement
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

	_win() {
		this.game.state.start('Win');
	}

	render() {
//		game.debug.body(this.player);
	}
}
