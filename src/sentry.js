import Phaser from 'phaser';

export default class Sentry extends Phaser.Sprite {
	constructor({ game, asset, level}) {
		let x = Math.floor(Math.random()*(level.width-2))+1;
		let y = Math.floor(Math.random()*(level.height-2))+1;
		console.log("want to start at",x,y);
		while ( level.tilemap.getTile(x,y) != null ) {
			x = Math.floor(Math.random()*(level.width-2))+1;
			y = Math.floor(Math.random()*(level.height-2))+1;
			console.log("trying again at",x,y);
		}

		x = (x*level.tilesize)+(level.tilesize/2);
		y = (y*level.tilesize)+(level.tilesize/2);

		super(game, x, y, asset);
		this.anchor.setTo(0.5)
		game.physics.arcade.enable(this)
		this.body.immovable = true;
		this.level = level;
		this.prev_tilex = Math.floor(this.x/this.level.tilesize);
		this.prev_tiley = Math.floor(this.y/this.level.tilesize);
		this.v = 100;
		let newdir = this._pickDirection(this.prev_tilex,this.prev_tiley);
		this.body.velocity.x = newdir[0];
		this.body.velocity.y = newdir[1];
	}

	update() {
		let tilex = Math.floor((this.x)/this.level.tilesize);
		let tiley = Math.floor((this.y)/this.level.tilesize);

		if (
			!(this.prev_tilex == tilex && this.prev_tiley == tiley) &&
			this.x % this.level.tilesize > 14 &&
			this.x % this.level.tilesize < this.level.tilesize-14  &&
			this.y % this.level.tilesize > 14 &&
			this.y % this.level.tilesize < this.level.tilesize-14 
		   ) {
			this.prev_tilex = tilex;
			this.prev_tiley = tiley;
			let newdir = this._pickDirection(tilex,tiley);
			this.body.velocity.x = newdir[0];
			this.body.velocity.y = newdir[1];
		}

	}

	_pickDirection(tilex,tiley) {
		let valid_directions = [];
		let last_resort = [];
		let d = [];
		let layer = this.level.tilemap.getLayer('level');
		if ( this.level.tilemap.getTile(tilex,tiley-1,layer) == null ) {
			d = [0,-1*this.v];
			if (this.body.velocity.y == this.v) {
				last_resort = d
			} else {
				valid_directions.push(d);
			}
		}
		if ( this.level.tilemap.getTile(tilex,tiley+1,layer) == null ) {
			d = [0,this.v];
			if (this.body.velocity.y == -1 * this.v) {
				last_resort = d
			} else {
				valid_directions.push(d);
			}
		}
		if ( this.level.tilemap.getTile(tilex-1,tiley,layer) == null ) {
			d = [-1*this.v,0];
			if (this.body.velocity.x == this.v) {
				last_resort = d
			} else {
				valid_directions.push(d);
			}
		}
		if ( this.level.tilemap.getTile(tilex+1,tiley,layer) == null ) {
			d = [this.v,0];
			if (this.body.velocity.x == -1 * this.v) {
				last_resort = d
			} else {
				valid_directions.push(d);
			}
		}

		if (valid_directions.length > 0) {
			return(valid_directions[Math.floor(Math.random()*valid_directions.length)]);
		} else {
			return(last_resort);
		}
	}
}
