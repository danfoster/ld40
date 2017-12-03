import Phaser from 'phaser';

export default class HUD extends Phaser.Group {
	constructor(game) {
		super(game)
		this.game = game;

		this.healthbar = new HealthBar(game,100,10,10,10);
		this.remain = new RemainCounter(game,10,25,game.state.getCurrentState().pickups.length);
		this.carrying = new CarryingCounter(game,10,40,game.state.getCurrentState().carrying);
	}

	update() {
	}

}

class HealthBar extends Phaser.Group {
	constructor(game,width,height,x,y) {
		super(game);
		this.game = game;
		this.health = 100;
		this.prev_health = this.health;

		var bmd = this.game.add.bitmapData(width,height);
		bmd.ctx.fillStyle = "#484570";
		bmd.ctx.rect(0, 0, width, height);
		bmd.ctx.fill();
		bmd.update();

		this.healthborder = this.game.add.sprite(x,x,bmd);
		this.healthborder.fixedToCamera = true;

		var bmd = this.game.add.bitmapData(width,height);
		bmd.ctx.fillStyle = "#a3a1a8";
		bmd.ctx.rect(0, 0, width-2, height-2);
		bmd.ctx.fill();
		bmd.update();

		this.healthbackground = this.game.add.sprite(x+1,x+1,bmd);
		this.healthbackground.fixedToCamera = true;

		var bmd = this.game.add.bitmapData(width,height);
		bmd.ctx.fillStyle = "#991924";
		bmd.ctx.rect(0, 0, (width-2)*(this.health/100), height-2);
		bmd.ctx.fill();
		bmd.update();

		this.healthbar = this.game.add.sprite(x+1,x+1,bmd);
		this.healthbar.fixedToCamera = true;


	}

	update() {

		if (this.health != this.prev_health) {
			if (this.health < 0) {
				this.health = 0;
			}
			this.healthbar.scale.x = (this.health/100);
		}

	}
}

class RemainCounter extends Phaser.Group {
	constructor(game,x,y,num) {
		super(game)
		this.game = game;
		this.count = num;


		var bmd = this.game.add.bitmapData(40,20);
		bmd.ctx.fillStyle = "#484570";
		bmd.ctx.alpha = 0.9;
		bmd.ctx.rect(0, 0, 100, 16);
		bmd.ctx.fill();
		bmd.update();

		this.border= this.game.add.sprite(x,y,bmd);
		this.border.fixedToCamera = true;

		var bmd = this.game.add.bitmapData(38,20);
		bmd.ctx.fillStyle = "#cdcdd1";
		bmd.ctx.alpha = 0.9;
		bmd.ctx.rect(0, 0, 98, 14);
		bmd.ctx.fill();
		bmd.update();

		this.background = this.game.add.sprite(x+1,y+1,bmd);
		this.background.fixedToCamera = true;

		this.text = game.add.bitmapText(x+2,y,'font4','R: '+this.count,16);
		this.text.fixedToCamera = true;
	}

	set(num) {
		this.count = num;
		this.text.setText('R: '+this.count);
	}
}


class CarryingCounter extends Phaser.Group {
	constructor(game,x,y,num) {
		super(game)
		this.game = game;
		this.count = num;


		var bmd = this.game.add.bitmapData(40,20);
		bmd.ctx.fillStyle = "#484570";
		bmd.ctx.alpha = 0.9;
		bmd.ctx.rect(0, 0, 100, 16);
		bmd.ctx.fill();
		bmd.update();

		this.border= this.game.add.sprite(x,y,bmd);
		this.border.fixedToCamera = true;

		var bmd = this.game.add.bitmapData(38,20);
		bmd.ctx.fillStyle = "#cdcdd1";
		bmd.ctx.alpha = 0.9;
		bmd.ctx.rect(0, 0, 98, 14);
		bmd.ctx.fill();
		bmd.update();

		this.background = this.game.add.sprite(x+1,y+1,bmd);
		this.background.fixedToCamera = true;

		this.text = game.add.bitmapText(x+2,y,'font4','C: '+this.count,16);
		this.text.fixedToCamera = true;
	}

	set(num) {
		this.count = num;
		this.text.setText('C: '+this.count);
	}
}
