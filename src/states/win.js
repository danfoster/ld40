import Phaser from 'phaser';


export default class WinState extends Phaser.State {
	preload() {
		window.game.load.bitmapFont('font1', 'assets/font1.png', 'assets/font1.fnt');
		window.game.load.bitmapFont('font2', 'assets/font2.png', 'assets/font2.fnt');
		window.game.load.bitmapFont('font3', 'assets/font3.png', 'assets/font3.fnt');

	}

	create() {
		window.game.stage.backgroundColor = '#000000';
		this.title = window.game.add.bitmapText(this.game.width/2, this.game.height*0.25, 'font1', 'You Won!', 96);
		this.title.anchor.setTo(0.5,0.5);

		this.text1 = window.game.add.bitmapText(this.game.width/2, this.game.height*0.5, 'font3', 'Press Y to play again', 40);
		this.text1.anchor.setTo(0.5,0.5);

		window.game.input.keyboard.onPressCallback = function() {
			this.game.camera.fade('#000000');
			window.game.state.start('Game');
			window.game.input.keyboard.onPressCallback = null;
		};


	}

	update() {
	}
}
