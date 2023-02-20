const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootFolder = path.resolve(__dirname, '.');
const port = process.env.PORT || 5015;
const mode = (process.argv.includes('--mode=production') && 'production') || 'development';
const ROOT_URL = mode === 'development' ? `http://localhost:${port}` : '';
const isDevelopmentMode = mode === 'development';
const paths = {
	src: path.resolve(rootFolder, 'src'),
	public: path.resolve(rootFolder, 'public'),
	build: path.resolve(rootFolder, 'build'),
	dist: path.resolve(rootFolder, 'dist'),
	root: rootFolder,
};

const cleanTheFolder = (folderPath) => {
	if (fs.existsSync(folderPath)) {
		const files = fs.readdirSync(folderPath);
		for (const file of files) {
			const filePath = path.resolve(folderPath, file);
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				fs.rmdirSync(filePath, { recursive: true });
			}
		}
	}
};

cleanTheFolder(paths.build);
// console.log(rootFolder, paths, port, ROOT_URL);
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
						path.resolve(paths.build, './**/*'),
					],
					options: {
						usePolling: 1000,
					},
				},
				onListening: function (devServer) {
					if (!devServer) {
						throw new Error('webpack-dev-server is not defined');
					}
					console.log('');
					console.log('\n', 'Listening on port: ', `http://localhost:${port}`, '\n');
				},
				devMiddleware: {
					writeToDisk: true,
				},
			},
			devtool: 'source-map',
	  }
	: {};

const exportsConfig = {
	mode: mode,
	entry: {
		main: path.resolve(paths.src, 'main.js'),
	},
	// watch: true,
	context: paths.root,
	watchOptions: {
		ignored: '**/node_modules',
		poll: 200,
	},
	output: {
		filename: '[name].js',
		path: paths.build,
		clean: true,
		// clean: !isDevelopmentMode,
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
			template: path.resolve(paths.src, 'index.template.ejs'),
			inject: false, // To remove duplicate consoles.		(https://stackoverflow.com/a/38292765)

			options: {
				publicDir: paths.build,
				rootUrl: ROOT_URL,
			},
			meta: {
				viewport: 'width=device-width, initial-scale=1.0',
			},
			title: 'Speech Recognition',
			collapseWhitespace: false,
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
