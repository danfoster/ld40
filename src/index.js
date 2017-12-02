import 'pixi';
import 'p2';
import Phaser from 'phaser';

import GameState from 'states/game';


class Game extends Phaser.Game {
	constructor() {
		super(800, 600, Phaser.AUTO, '');

		this.state.add('Game', GameState);
		this.state.start('Game');

    
	}


}

window.game = new Game;
