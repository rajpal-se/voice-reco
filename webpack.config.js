const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootFolder = path.resolve(__dirname, '.');
const port = process.env.PORT || 3000;
const mode = process.env.MODE || 'development';
const isDevelopmentMode = mode === 'development';
const paths = {
	src: path.resolve(rootFolder, 'src'),
	public: path.resolve(rootFolder, 'public'),
	build: path.resolve(rootFolder, 'build'),
};

const devServerConfig = isDevelopmentMode
	? {
			devServer: {
				static: {
					directory: paths.build,
				},
				port,
				open: true,
				hot: true,
				compress: true,
				historyApiFallback: true,
				liveReload: true,
				watchFiles: {
					paths: [
						path.resolve(paths.public, './**/*'),
						path.resolve(paths.src, './**/*'),
					],
					options: {
						usePolling: false,
					},
				},
			},
	  }
	: {};

const exportsConfig = {
	mode: mode,
	entry: path.resolve(paths.src, 'main.js'),
	// watch: true,
	watchOptions: {
		ignored: '**/node_modules',
	},
	output: {
		path: paths.build,
		filename: '[name].js',
		clean: !isDevelopmentMode,
	},
	...devServerConfig,
	module: {
		rules: [
			{
				test: /\.(c|sc|sa)ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.template.html',
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: paths.public, to: paths.build }],
			options: {
				concurrency: 100,
			},
		}),
	],
};

module.exports = exportsConfig;
