export default class Level {
	constructor() {

		this.width = 128;
		this.height = 128;
		this.tilesize = 16;

		// Create a blank wall map
		this.walls = new Array(this.width);
		for (var i=0;i<this.height;i++) {
			this.walls[i] = new Array(this.height);
		}

		// Create walls against the edges
		for (var y=0;y<this.height;y++) {
			this.walls[0][y] = 1;
			this.walls[this.width-1][y] = 1;
		}
		for (var x=0;x<this.width;x++) {
			this.walls[x][0] = 1;
			this.walls[x][this.height-1] = 1;
		}

		this._createTileSet();

	}

	_createTileSet() {
		this.ts = window.game.make.bitmapData(2 * this.tilesize, 2 * this.tilesize);
		this.ts.rect(0,0,this.tilesize*2,this.tilesize * 2,'#0000ff');
	}

	createTilemap() {
		this.map = window.game.add.tilemap();
		let layer = this.map.create(
			'level',
			this.width,
			this.height,
			this.tilesize,
			this.tilesize
		)

		this.map.addTilesetImage('tiles', this.ts);

		for (var x=0;x<this.width;x++) {
			for (var y=0;y<this.height;y++) {
				if (this.walls[x][y] == 1) {
					this.map.putTile(0,x,y, layer)
				}
			}
		}
		this.map.putTile(0, 2, 2, layer);
		this.map.putTile(0, 3, 3, layer);
	}
}
