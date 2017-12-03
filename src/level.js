export default class Level {
	constructor() {

		this.width = 31;
		this.height = 31;
		this.tilesize = 32;
        this.numrooms = 3;

        window.game.load.image('tiles', 'assets/tiles.png');

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



		// Add Starting Room
		let values = this._addRoom(Math.floor(Math.random()*2)*2+2,false);
		let cell = values[0];
		this.startingpos = values[1];

		// Add Computer Room
		values = this._addRoom(Math.floor(Math.random()*2)*2+2,true);
		this.dropoffpos = values[1];

		// Add Empty rooms
		for (let i=0;i<this.numrooms;i++) {
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
			for (let y=startingpos.y-size-1;y<=startingpos.y+size+1;y++) {
				for (let x=startingpos.x-size-1;x<=startingpos.x+size+1;x++) {
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
		let cell = {};
        let safe = false;
        while ( !safe ) {
            let side = Math.floor(Math.random()*3);
            switch(side) {
                case 0:
                    cell.x = startingpos.x-size;
                    cell.y = startingpos.y;
                    if ( this.map[cell.x-2][cell.y] != 'v') {
                        safe = true;
                        if (makedoorway == true) {
                            this.map[cell.x-1][cell.y] = 'v';
                        }
                    }
                    break;
                case 1:
                    cell.x = startingpos.x;
                    cell.y = startingpos.y-size;
                    if ( this.map[cell.x][cell.y-2] != 'v') {
                        safe = true;
                        if (makedoorway == true) {
                            this.map[cell.x][cell.y-1] = 'v';
                        }
                    }
                    break;
                case 2:
                    cell.x = startingpos.x+size;
                    cell.y = startingpos.y;
                    if ( this.map[cell.x+2][cell.y] != 'v') {
                        safe = true;
                        if (makedoorway == true) {
                            this.map[cell.x+1][cell.y] = 'v';
                        }
                    }
                    break;
                case 3:
                default:
                    cell.x = startingpos.x;
                    cell.y = startingpos.y+size;
                    if ( this.map[cell.x][cell.y+2] != 'v') {
                        safe = true;
                        if (makedoorway == true) {
                            this.map[cell.x][cell.y+1] = 'v';
                        }
                    }
                    break;
            }
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



	createTilemap() {
		this.tilemap = window.game.add.tilemap();
		this.layer = this.tilemap.create(
			'level',
			this.width,
			this.height,
			this.tilesize,
			this.tilesize
		)

		this.tilemap.addTilesetImage('tiles');
		this.tilemap.setCollisionBetween(0,0);
		this.tilemap.setCollisionBetween(2,16);
		this.tilemap.setCollision(50);

		for (var x=0;x<this.width;x++) {
			for (var y=0;y<this.height;y++) {
				if (this.map[x][y] == 'w') {
                    let pattern = '';
                    for (let iy=y-1;iy<=y+1;iy++) {
                        for (let ix=x-1;ix<=x+1;ix++) {
                            if (iy < 0 || ix < 0 || ix >= this.width || iy >= this.height ) {
                                pattern += 'v';
                            } else {
                                pattern += this.map[ix][iy];
                            }
                        }
                    }
                    switch (pattern) {
                        case "vvvwwwvvv":
                        case "vvwwwwvvv":
                        case "wvvwwwvvv":
                        case "wvwwwwvvv":
                        case "vvwwwwvvw":
                        case "vvvwwwwvv":
                        case "vvwwwwwvv":
                        case "vvvwwwvvw":
                        case "vvvwwwwvw":
                        case "wvvwwwwvw":
                        case "wvvwwwwvv":
                        case "wvwwwwwvv":
                        case "vvwwwwwvw":
                        case "wvwwwwvvw":
                        case "wvvwwwvvw":
                        case "wvwwwwwvw":
                            this.tilemap.putTile(2,x,y, this.layer);
                            break;
                        case "vwvwwwvvv":
                            this.tilemap.putTile(3,x,y, this.layer);
                            break;
                        case "vwvvwvvwv":
                        case "wwvvwvvwv":
                        case "vwwvwvvwv":
                        case "wwwvwvwwv":
                        case "vwvvwvvww":
                        case "vwvvwvwwv":
                        case "wwvvwvvww":
                        case "vwwvwvwww":
                        case "vwvvwvwww":
                        case "wwwvwvvwv":
                        case "wwvvwvwww":
                        case "vwwvwvvww":
                        case "wwvvwvwwv":
                        case "wwwvwvvww":
                        case "vwwvwvwwv":
                        case "wwwvwvwww":
                            this.tilemap.putTile(4,x,y, this.layer);
                            break;
                        case "vwvvwvvvv":
                            this.tilemap.putTile(5,x,y, this.layer);
                            break;
                        case "vwvvwwvvv":
                            this.tilemap.putTile(6,x,y, this.layer);
                            break;
                        case "vvvvwwvwv":
                            this.tilemap.putTile(7,x,y, this.layer);
                            break;
                        case "vvvvwwvvv":
                            this.tilemap.putTile(8,x,y, this.layer);
                            break;
                        case "vvvwwvvvv":
                            this.tilemap.putTile(9,x,y, this.layer);
                            break;
                        case "vvvwwwvwv":
                            this.tilemap.putTile(10,x,y, this.layer);
                            break;
                        case "vvvwwvvwv":
                            this.tilemap.putTile(11,x,y, this.layer);
                            break;
                        case "vwvwwvvvv":
                            this.tilemap.putTile(12,x,y, this.layer);
                            break;
                        case "vvvvwvvwv":
                        case "vvvvwvwww":
                        case "vvvvwvwwv":
                        case "vvvvwvvww":
                            this.tilemap.putTile(13,x,y, this.layer);
                            break;
                        case "vwvvwwvwv":
                            this.tilemap.putTile(14,x,y, this.layer);
                            break;
                        case "vwvwwvvwv":
                            this.tilemap.putTile(15,x,y, this.layer);
                            break;
                        case "vwvwwwvwv":
                            this.tilemap.putTile(16,x,y, this.layer);
                            break;
                        default:
                            this.tilemap.putTile(50,x,y, this.layer);
                            break;
                    }
				} else {
					this.tilemap.putTile(1,x,y, this.layer)
                }

			}
		}
	}
}
