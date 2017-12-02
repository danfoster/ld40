var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
		entry: {
      app: [
				'babel-polyfill',
        path.resolve(__dirname, 'src/index.js')
      ],
    },
    module: {
        rules: [
						{ test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] }
        ]
    },
		watch: true,
		plugins: [
			new BrowserSyncPlugin({
				host: process.env.IP || 'localhost',
				port: process.env.PORT || 3000,
				server: {
					baseDir: ['./html']
				}
			})
		],
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
        },
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
		output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'html'),
        publicPath: '.',
				filename: 'game.js'
		}

};
