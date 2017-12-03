import Phaser from 'phaser';

export default class HUD extends Phaser.Group {
	constructor(game) {
        super(game)
        this.game = game;

        this.healthbar = new HealthBar(game,100,10,10,10);

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
