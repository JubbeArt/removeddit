const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: [
		'./src/js/index.js'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',	
		publicPath: '/'	
	},
	resolve: {
		modules: [
			path.resolve('./src/js'),
			path.resolve('./src'),
			path.resolve('./node_modules')
		]
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ["@babel/preset-react"],
				}
			},			
			{
				test: /\.html$/,
				loader: 'html-loader'
			},			
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new CopyWebpackPlugin([
			{
				from: 'src/404.html',
				to: '404.html'
			},
			{
				from: 'src/images',
				to: 'images/'
			}
		]),
	],
	stats: {
		colors: true
	},
}