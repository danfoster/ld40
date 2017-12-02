export default class Level {
	constructor() {

		this.width = 100;
		this.height = 100;
		this.tilesize = 16;

		// Create a blank maze
		this.map = new Array(this.width);
		for (var i=0;i<this.height;i++) {
			this.map[i] = new Array(this.height);
		}

		// Create walls a grid of walls
		for (var x=0;x<this.width;x++) {
			for (var y=0;y<this.height;y++) {
				if (x%2 == 0 || y%2 == 0 )  {
					this.map[x][y] = 'w';
				}
			}
		}


		let values = this._addRoom(Math.floor(Math.random()*3)*2+2,false);
		let cell = values[0];
		this.startingpos = values[1];

		for (let i=0;i<20;i++) {
			this._addRoom(Math.floor(Math.random()*2)*2+2,true);
		}

		// Fill in the maze
		this.map[cell.x][cell.y] = 'v';

		let walllist = [];
		this._addWalls(walllist,cell);

		while (walllist.length > 0) {
			// Get a random wall
			let wallid = Math.floor(Math.random()*walllist.length);
			let wall = walllist[wallid];
			walllist.splice(wallid,1);
			
			// Get neighbouring cell
			cell.x = wall.x+wall.dirx;
			cell.y = wall.y+wall.diry;
			if ( this.map[cell.x][cell.y] != 'v') {
				this.map[cell.x][cell.y] = 'v';
				this.map[wall.x][wall.y] = 'v';
				this._addWalls(walllist,cell);
			}
			
		}
		

		this._createTileSet();

	}

	_addRoom(size,makedoorway) {
		// Pick a random starting position
		let startingpos = {};
		let conflict = true;
		let count = 0;

		console.log("making room of size", size);

		while (conflict == true) {
			startingpos.x = Math.floor(Math.random()*(this.width-((size+3)*2)))+(size+3);
			if (startingpos.x % 2 == 0) {
				startingpos.x++;
			}
			startingpos.y = Math.floor(Math.random()*(this.height-((size+3)*2)))+(size+3);
			if (startingpos.y % 2 == 0) {
				startingpos.y++;
			}

			conflict = false;
			// Check we won't overlap with another room if we build here
			for (let y=startingpos.y-size;y<=startingpos.y+size;y++) {
				for (let x=startingpos.x-size;x<=startingpos.x+size;x++) {
					if (this.map[x][y] == 'v') {
						conflict = true;
					}
				}
			}
			if (conflict) {
				count++;
				if (count > 10) {
					return [];
				}
			}
		}

		//Make a starting room.
		// Make walls
		for (let y = startingpos.y-size-1;y<=startingpos.y+size+1;y++) {
			this.map[startingpos.x-size-1][y] = 'w';
			this.map[startingpos.x+size+1][y] = 'w';
		}
		for (let x = startingpos.x-size;x<=startingpos.x+size;x++) {
			this.map[x][startingpos.y-size-1] = 'w';
			this.map[x][startingpos.y+size+1] = 'w';
		}
		// Mark inside as visited
		for (let y=startingpos.y-size;y<=startingpos.y+size;y++) {
			for (let x=startingpos.x-size;x<=startingpos.x+size;x++) {
				this.map[x][y] = 'v';
			}
		}
		// Pick a doorway
		let side = Math.floor(Math.random()*3);
		let cell = {};
		switch(side) {
			case 0:
				cell.x = startingpos.x-size;
				cell.y = startingpos.y;
				if (makedoorway == true) {
					this.map[cell.x-1][cell.y] = 'v';
				}
				break;
			case 1:
				cell.x = startingpos.x;
				cell.y = startingpos.y-size;
				if (makedoorway == true) {
					this.map[cell.x][cell.y-1] = 'v';
				}
				break;
			case 2:
				cell.x = startingpos.x+size;
				cell.y = startingpos.y;
				if (makedoorway == true) {
					this.map[cell.x+1][cell.y] = 'v';
				}
				break;
			case 3:
			default:
				cell.x = startingpos.x;
				cell.y = startingpos.y+size;
				if (makedoorway == true) {
					this.map[cell.x][cell.y+1] = 'v';
				}
				break;
		}
		return [cell,startingpos];
	}

	_addWalls(walllist,cell) {
		// Add suitable walls to the walllsit
		if (cell.x-1 > 0) {
			let w = {
				x: cell.x-1,
				y: cell.y,
				dirx: -1,
				diry: 0
			}
			if (this.map[w.x][w.y] == 'w') {
				walllist.push(w);
			}
		}
		if (cell.x < this.width-2) {
			let w = {
				x: cell.x+1,
				y: cell.y,
				dirx: 1,
				diry: 0
			};
			if (this.map[w.x][w.y] == 'w') {
				walllist.push(w);
			}
		}
		if (cell.y-1 > 0) {
			let w = {
				x: cell.x,
				y: cell.y-1,
				dirx: 0,
				diry: -1 
			};
			if (this.map[w.x][w.y] == 'w') {
				walllist.push(w);
			}
		}
		if (cell.y < this.height-2) {
			let w = {
				x: cell.x,
				y: cell.y+1,
				dirx: 0,
				diry: 1 
			};
			if (this.map[w.x][w.y] == 'w') {
				walllist.push(w);
			}
		}
	}


	_createTileSet() {
		this.ts = window.game.make.bitmapData(2 * this.tilesize, 2 * this.tilesize);
		this.ts.rect(0,0,this.tilesize,this.tilesize ,'#0000ff');
		this.ts.rect(this.tilesize,0,this.tilesize,this.tilesize*2 ,'#00ff00');
	}

	createTilemap() {
		this.tilemap = window.game.add.tilemap();
		this.layer = this.tilemap.create(
			'level',
			this.width,
			this.height,
			this.tilesize,
			this.tilesize
		)

		this.tilemap.addTilesetImage('tiles', this.ts);
		this.tilemap.setCollisionBetween(0,0);

		for (var x=0;x<this.width;x++) {
			for (var y=0;y<this.height;y++) {
				if (this.map[x][y] == 'w') {
					this.tilemap.putTile(0,x,y, this.layer)
				} else if (this.map[x][y] == 'v') {
					this.tilemap.putTile(1,x,y, this.layer)
				}
			}
		}
	}
}
