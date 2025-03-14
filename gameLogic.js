		var COLOR  = { BLACK: '#000000', YELLOW: '#ECD078', SKY: '#8888FF', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', WHITE: '#FFFFFF' },
			COLORS = [ COLOR.BLACK, COLOR.YELLOW, COLOR.SKY, COLOR.PINK, COLOR.PURPLE, COLOR.GREY, COLOR.WHITE ];

		var MAP      = { tileX: 32, tileY: 20 }, // the size of the map (in tiles)
			TILE     = 32,                 	// the size of each tile (in game pixels)
			METER    = TILE,               	// abitrary choice for 1m
			//GRAVITY  = METER * 9.8 * 6,   // very exagerated gravity (6x)
			GRAVITY  = 7,    				//I'm too lazy to work out the physics so I'm just using fixed values for now
			MAXDX    = METER * 20,         	// max horizontal speed (20 tiles per second)
			MAXDY    = METER * 60,         	// max vertical speed   (60 tiles per second)
			//ACCEL    = MAXDX * 2,         // horizontal acceleration -  take 1/2 second to reach maxdx
			ACCEL    = 5,          			//I'm too lazy to work out the physics so I'm just using fixed values for now
			FRICTION = MAXDX * 6,          	// horizontal friction     -  take 1/6 second to stop from maxdx
			JUMP     = METER * 1500;       	// (a large) instantaneous jump impulse
			KEY      = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
			

		var canvas   = document.getElementById('levelCanvas'),
			ctx      = canvas.getContext('2d'),
			width    = canvas.width  = MAP.tileX * TILE,
			height   = canvas.height = MAP.tileY * TILE;
			
		var t2p      = function(t)     {return t*TILE;                  },
			p2t      = function(p)     {return Math.floor(p/TILE);      },
			cell     = function(x,y)   {return tcell(p2t(x),p2t(y));    },
			tcell    = function(tx,ty) {return cells[tx + (ty*MAP.tw)]; };
		
		var floor_00 		= document.getElementById('floor_tile_00');
		var floor_01 		= document.getElementById('floor_tile_01');
		var hitbox 			= document.getElementById('hit_box');
		var playerImage 	= document.getElementById('deano');
		var playerWalk 		= document.getElementById('deano_walk');
		var badAppleWalk 	= document.getElementById('crab_apple');
		var coinImage 		= document.getElementById('coin');
		var deadImage 		= document.getElementById('dead');
		var mountains 		= document.getElementById('mountains');
		var hills 			= document.getElementById('hills');
		var sky 			= document.getElementById('sky');
		var cloud 			= document.getElementById('cloud');
		var coincount		= 0;
		var frameDelay 		= 0;
		var levelX 			= 0;
		var cloudX 			= 1024
		
		var player 			= {image:playerWalk, x:t2p(3), y:0, moving:false, face:"left", speed:0, alive:true,frame:0, height:64, width:32, jump:false, fall: false};
		var clouds 			= {x:0,y:0,speed:10};
						
		var level001 = [
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,1,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,2,-3,2,-3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,1,1,1,1,1,1,1,1,1,1, 1,1, 1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,1,0,1,0,1,0,1,0,1,1, 1,1, 1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1, 1,1, 1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		
		var levelXSize 		= t2p(level001[1].length);

		
		if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(callback, element) {
					window.setTimeout(callback, 1000 / 60);
				}
			}
		

		
		function initPlayer(){
			//player.x = 3 * TILE;
			//player.y = 14 * TILE;
			
			while(!collide(player, "feet"))
				player.y++;
		};
		
		initPlayer();
		
		function drawTile(sourceImage, x, y){
			if(sourceImage.complete){
				ctx.drawImage(sourceImage, x, y)
			}else{
				ctx.fillStyle = COLOR.PINK;
				ctx.fillRect(x, y, TILE, TILE);
			}
		};
		
		
		function drawNoise(){
			for(x=0;x<1024;x++){
				for(y=0;y<648;y++){
					var value = Math.floor(Math.random() * 256);
					
					//value*=2.5;
					//value*=2.5;
					//value = value > 255 ? 255 : value;
					value = value < 150 ? 150 : value;
					ctx.fillStyle = 'rgba('+value+','+value+','+value+',0.2)';
					ctx.fillRect(x, y, TILE, TILE);
				};
			};
		};

		//function loadImages(){
		//	if(
		//	floor_00.complete && 
		//	floor_01.complete &&
		//	hitbox.complete &&
		//	playerImage.complete &&
		//	playerWalk.complete && 
		//	coinImage.complete &&
		//	deadImage.complete
		//	){
		//		return;
		//	}
		//};
		//
		//loadImages();
		
		function getAnimStep(){
			if(frameDelay<6){
				frameDelay++;
				return false;
			}else{
				frameDelay = 0;
				return true;
			}
		}
		
		function drawCoin(ctx, x=32, y=32){
			if(coincount < 9 ){
				ctx.drawImage(coinImage, 32*coincount,0,32,32,x,y,32,32);
				if(getAnimStep()){
					coincount++;
				}
			}else{
				coincount=0;
			};		
		};

		var deadYCount = 0;
					
		function monsterMash(entity){
			if(entity.face==="left"){
				entity.x--;
			}else{
				entity.x++;
			};
			
			if(collide(entity, entity.face) || !collide(entity, "feet")){
				if(entity.face === "left"){
					entity.face = "right";
				}else{
					entity.face = "left";
				};
			};
			
			if(!collide(entity, "feet")){
				entity.y+=GRAVITY;
			};
		};
					
		function updateEntity(entity, ctx){
			if(entity.y > height){
				entity.alive = false;
			};
			
			if(entity.alive){
				if(entity === player){
					movePlayer();
				}else{
					monsterMash(entity);
				};
				
				if(entity.moving){
					if(entity.frame<entity.frameCount){
						if(getAnimStep())
							entity.frame++;
					}else{
						entity.frame=0;
					};
				}else{
					entity.frame=0;
				};
				
				
				
				if(entity.face==="left"){
					// image, slice x, slice y, slice width, slice height, dest x, dest y, dest width, dest height
					ctx.drawImage(entity.image, entity.width*entity.frame,0,entity.width,entity.height,entity.x,entity.y+3,entity.width,entity.height);
				}else if(entity.face === "right"){
					mirrorImage(ctx, entity, true, false, entity.frame);
				};
			}else{
				if(entity === player){
					if(deadYCount<200)
					if(deadYCount<200)
						deadYCount+=5;
					drawTile(deadImage, 150, deadYCount);
				};
				
			};
		};	
					
		function mirrorImage(ctx, entity, horizontal = false, vertical = false, frame){
		
			var image = entity.image;
			let x = entity.x;
			let y = entity.y;
			
			ctx.save();  // save the current canvas state
			
			var a = horizontal ? -1 : 1; // set the direction of x axis
			var b = 0; 
			var c = 0;
			var d = vertical ? -1 : 1; //// set the direction of y axis
//			var e = x + horizontal ? image.width : 0; // set the x origin
//			var f = y + vertical ? image.height : 0 ; // set the y origin
			var e = horizontal ? x + entity.width : x; // set the x origin
			var f = vertical   ? y + entity.height: y; // set the y origin
			
			
			ctx.setTransform(a,b,c,d,e,f);
			//ctx.drawImage(image,0,0);
			ctx.drawImage(image, entity.width*frame,0,entity.width,entity.height,0,0,entity.width,entity.height);
			ctx.restore(); // restore the state as it was when this function was called
		};		
		
		function clippingDebug(x, y, width, height){
			ctx.fillStyle = COLOR.BLACK;
			ctx.fillRect(x,y,width,height);
		};
		
		function collide(entity, position){
			var collideX = entity.x + invertNumber(levelX);
			
			if(entity.y + entity.height > height || entity.y <= 0)return false;
					
			switch(position){
				case "feet":
					for(i=10;i<=entity.width-20;i++)
						if(level001[p2t(entity.y+entity.height)][p2t(collideX+i)]>0){return true;};
					break;
				case "head":
					for(i=0;i<=entity.width-20;i++)
						if(level001[p2t(entity.y)][p2t(collideX+i)]>0){return true;};
					break;
				case "left":
					for(i=entity.height-10;i>5;i--)
						if(level001[p2t(entity.y+i)][p2t(collideX)]>0){return true;};
					break;
				case "right":
					collideX = collideX + entity.width;
					for(i=entity.height-10;i>5;i--)
						if(level001[p2t(entity.y+i)][p2t(collideX)]>0){return true;};
					break;
			};
			return false;
		};
		
		function timestamp() {
		  if (window.performance && window.performance.now)
			return window.performance.now();
		  else
			return new Date().getTime();
		};
		
		var fps  = 60,
			step = 1/fps,
			dt   = 0,
			now, last = timestamp(),
			cells = [];
			
		function bound(x, min, max) {
			return Math.max(min, Math.min(max, x));
		};			

		function frame() {
		  now = timestamp();
		  dt = dt + Math.min(1, (now - last) / 1000);
		  while(dt > step) {
			dt = dt - step;
			update(step);
		  }
		  last = now;
		  requestAnimationFrame(frame, canvas);
		}

		frame(); // start the first frame
		
		function invertNumber(numberToInvert){
			return numberToInvert * -1;
		};	

		//Create rain array
		var rain = [];
		
		//Create a loop which add objects to the rain array
		function initRain(){
			for (i=0;i<500;i++)
				rain.push({x:Math.floor(Math.random() * 1500), y:Math.floor(Math.random() * 648)});
		};
		
		initRain();
		
		
		
		console.log(rain);
		
		function droplet(getSet, position, x, y){
			switch(getSet){
				case 'set':
					rain[position].x = x;
					rain[position].y = y;
					return;
				case 'get':
					//x = drop[position].x;
					//y = drop[position].y;
					return [rain[position].x, rain[position].y];
			};
		};

		
		function drawRain(ctx){
			for(i=0;i<500;i++){
				ctx.fillStyle = 'rgba('+150+','+150+','+255+',0.2)';
				ctx.fillRect(rain[i].x, rain[i].y, 2,8);
				if(rain[i].y<648 && rain[i].x>0){
					rain[i].y+=6;
					rain[i].x-=2;
				}else{
					rain[i].y = 0;
					rain[i].x = Math.floor(Math.random() * 1500);
				};
			};
		};
			
				
		function drawLevel(ctx){
			//These two variable set the portions of the screen that trigger scrolling of the level
			var upperBound = TILE * 22;
			var lowerBound = TILE * 10;
			
			//OPEN| These chunks sets the level X position and player X position for scrolling
			if(player.x > upperBound && levelX < levelXSize){
				levelX-=ACCEL;
				player.x = upperBound;
			};

			if(player.x < lowerBound && levelX < 0){
				levelX+=ACCEL;
				player.x = lowerBound;
			};
			//CLOSE|
			
			arrayX = p2t(invertNumber(levelX));

			//Draw Sky
			for(y=0;y<MAP.tileY;y++){
				for(x=0;x<MAP.tileX + 2;x++){
					if(y >= 0 && y < height){ 
						let drawX = levelX +t2p(x+arrayX);
						
						//levelX+((x+arrayX)*8)
						
						let drawY = t2p(y);
						
						//console.log(p2t(x + levelX));
						let character = level001[y][x+arrayX];
						switch(character){
							default:
								ctx.fillStyle = COLOR.SKY;
								ctx.fillRect(drawX, drawY, TILE, TILE);
								break;
						
						};
					};
				};
			};
			
			drawTile(sky, 0, 0);
			
			//Draw Background (This is a mess)
			//TODO make this bit sane
			
			var bg_width = 5000;
			

			//Draw Clouds
			drawTile(cloud, --cloudX, 20);
			if(cloudX < -766){
				cloudX = 1300;
			};
			
			drawTile(mountains, levelX/4, 0);
			drawTile(mountains, levelX/4+bg_width, 0);
			drawTile(mountains, levelX/4+bg_width+bg_width, 0);
			drawTile(hills, levelX/1.5, 0);
			drawTile(hills, levelX/1.5+bg_width, 0);
			drawTile(hills, levelX/1.5+bg_width+bg_width, 0);
			drawTile(hills, levelX/1.5+bg_width+bg_width+bg_width, 0);
			drawTile(hills, levelX/1.5+bg_width+bg_width+bg_width+bg_width, 0);
			
			
			drawRain(ctx);

			
			
			//Draw Foreground
			for(y=0;y<MAP.tileY;y++){
				for(x=0;x<MAP.tileX + 2;x++){
					if(y >= 0 && y < height){ 
						let drawX = levelX +t2p(x+arrayX);
						
						//levelX+((x+arrayX)*8)
						
						let drawY = t2p(y);
						
						//console.log(p2t(x + levelX));
						let character = level001[y][x+arrayX];
						switch(character){
							//default:
							//	ctx.fillStyle = COLOR.SKY;
							//	ctx.fillRect(drawX, drawY, TILE, TILE);
							//	break;
							case 1:
								if(drawY > 0 && level001[y-1][x+arrayX] === 0 ){
									drawTile(floor_00, drawX, drawY);
								}else{
									drawTile(floor_01, drawX, drawY);
								};
								break;
							case 2:
								drawTile(hitbox, drawX, drawY);
								break;
							case -3:
								ctx.fillStyle = COLOR.SKY;
								ctx.fillRect(drawX, drawY, TILE, TILE);
								drawCoin(ctx, drawX, drawY);
								break;
						};
					};
				};
			};
		};
		
		var inLMS = true;
		
		try{ trivPageScope; }
		catch(e) {
			if(e.name == "ReferenceError") {
				inLMS = false;
				console.log("not in lectora");
				document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
				document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);
			};
		};
			
		if(inLMS){
			console.log("in lectora");
			var thePage = document.getElementById('pageDIV');
			console.log("does the page work? = " + thePage);
			thePage.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
			thePage.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

		};		
		function onkey(ev, key, down) {
			if(down){
				switch(key) {
					case KEY.SPACE: player.jump = true;break;
					case KEY.LEFT:  player.moving = true; player.face = "left";/*console.log("you pressed the left key, player x:"+player.x)*/;break;
					case KEY.RIGHT: player.moving = true; player.face = "right";/*console.log("you pressed the right key, player x:"+player.x)*/;break;
				};
			}else{
				player.moving =  false;
			};
		};
				
		function update(dt){
			//drawNoise();
			drawLevel(ctx, dt);
			updateEntity(player, ctx)
			for(i=0;i<baddies.length;i++)
				updateEntity(baddies[i], ctx)
		};

		var jumpState = false;
		var jumpLimit;
		
		function aldronKeyUp(){
			player.moving = false;
		};
		
		function movePlayer(){
			
			if(jumpState != player.jump && !player.fall){
				jumpState = player.jump;
				
				jumpLimit = player.y - player.height * 2;
				
				console.log("You just jumped");
			};
			
			if(player.jump && !player.fall){
				if(player.y >= jumpLimit){
					player.y-=6;
				}else{
					player.jump = false;
					jumpState = false;
					player.fall=true;
				};
			};
			
			if(player.fall && !collide(player, "feet")){
				player.y+=GRAVITY;
			}else{
				player.fall = false;
			};
			
			if(!collide(player, "feet") && !player.jump){
				player.fall = true;
			};
			
			if(player.moving){	
				if(!collide(player, player.face)){
					if(player.face === "right")
						player.x = player.x + ACCEL;
					if(player.face === "left")
						player.x = player.x - ACCEL;
				};
			}else{
					player.speed = 0;
			};
		};
		
		//Create baddie array
		var baddies = [];
		
		function initBaddies(){
			let baddieNum = 2;
			for (i=0;i<baddieNum;i++){
//				let xPos = Math.floor(((levelXSize / baddieNum) * i)* TILE);
				let xPos =  32* i;
				baddies.push({image: badAppleWalk,x:t2p(3), y:200, moving:true, face:"left", speed:0, alive:true,frame:0,frameCount:6, height:84, width:64, jump:false, fall: false});
				baddies[i].x = xPos + TILE*10;
			};
			console.log(baddies);
			for(i=0;i<baddieNum;i++){
				console.log(i);

				let exitCond = false;

				tempEntity = baddies[i];
				
				while(!collide(tempEntity, "feet")){
					tempEntity.y++;
				};
			};
			
			console.log(baddies);
			
		};
		
		//initBaddies();
		
		//function drawBaddies(ctx){
		//	
		//	for(i=0;i<baddies.length;i++){
		//		if(baddies[i].face==="left"){
		//			// image, slice x, slice y, slice width, slice height, dest x, dest y, dest width, dest height
		//			ctx.drawImage(badAppleWalk, baddies[i].width*baddies[i].frame,0,baddies[i].width,baddies[i].height,baddies[i].x,baddies[i].y,baddies[i].width,baddies[i].height);
		//		}else if(baddies[i].face === "right"){
		//			mirrorImage(ctx, badAppleWalk, levelX - baddies[i].x, baddies[i].y, true, false, baddies[i].frame);
		//		};			
        //
		//	//ctx.drawImage(badAppleWalk, levelX + baddies[i].x, baddies[i].y);
		//	};
		//	
		//	
		//};

