import Phaser from 'phaser';

export default class Pickup extends Phaser.Sprite {
	constructor({ game, level}) {

		let x = Math.floor(Math.random()*(level.width-2))+1;
		let y = Math.floor(Math.random()*(level.height-2))+1;
		let count = 0;
		while ( level.tilemap.getTile(x,y).index != 1 ) {
			x = Math.floor(Math.random()*(level.width-2))+1;
			y = Math.floor(Math.random()*(level.height-2))+1;
			count++;
			if (count > 10) {
				console.log('ERROR: Giving up finding space for enemy');
				return(null);
			}
		}

		x = (x*level.tilesize)+(level.tilesize/2);
		y = (y*level.tilesize)+(level.tilesize/2);

		super(game, x, y, 'pickup');
		this.anchor.setTo(0.5);
		game.physics.arcade.enable(this);
		this.body.immovable = true;
		this.level = level;
		this.animations.add('spin', [0,1,2,3], 10, true);
		this.animations.play('spin');

	}

	update() {

	}

}
