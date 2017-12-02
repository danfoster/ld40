import Phaser from 'phaser';

import Level from 'level';

export default class GameState extends Phaser.State {
	preload() {
		this.level = new Level;
	}


	create() {
		window.game.stage.backgroundColor = '#440000';
		this.level.createTilemap();
	}


}
