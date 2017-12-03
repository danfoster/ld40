import 'pixi';
import 'p2';
import Phaser from 'phaser';

import GameState from 'states/game';
import DeadState from 'states/dead';


class Game extends Phaser.Game {
	constructor() {
		super(800, 600, Phaser.AUTO, '');

		this.state.add('Game', GameState);
		this.state.add('Dead', DeadState);
		this.state.start('Game');

    
	}


}

window.game = new Game;
