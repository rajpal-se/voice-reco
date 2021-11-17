const gulp = require('gulp')
const {sync: delSync} = require('del')

const rename = require("gulp-rename")

const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')

const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const browserSync = require('browser-sync').create()

const path = {
	style: {
		src: ['./src/static/scss/**/*.scss'],
		dest: './public/static/css'
	},
	script: {
		src: ['./src/static/js/**/*.js'],
		dest: './public/static/js'
	},
	html: {
		src: ['./src/**/*.html'],
		dest: './public'
	},
	baseDir: {
		src: './src',
		dest: './public'
	}
}

const clean = (() => {
	const ret = {}
	const _cleanDir = (dir) => {
		return (cb) => {
			delSync(dir, {force:true})
			cb()
			console.log(`[${dir}] - directory cleaned.`)
		}
	}

	ret.cssFiles = _cleanDir( path.baseDir.dest + '/**/*.css' )
	ret.baseDestDir = _cleanDir( path.baseDir.dest + '/**/*' )

	return ret
})()

const copy = (() => {
	const ret = {}
	const _copyFiles = (src, dest) => {
		// [src] can be: Array or String
		return () => {
			return gulp.src( src )
			.pipe( gulp.dest( dest ) )
		}
	}

	ret.htmlFiles = _copyFiles( path.html.src, path.html.dest )

	return ret
})()

const expObj = (() => {
	const ret = {}

	ret.style = () => {
		return gulp.src( path.style.src )
			.pipe( sourcemaps.init() )
			.pipe( sass( {outputStyle: 'expanded'} ) )
			.pipe( autoprefixer( [">0.2%", "not dead", "not op_mini all"] ) )
			.pipe( rename( {suffix: ".min"} ) )
			.pipe( sourcemaps.write( '.' ) )
			.pipe( gulp.dest( path.style.dest ) )
			// .pipe( browserSync.stream() )
	}
	ret.script = () => {
		return gulp.src( path.script.src )
			.pipe( babel() )
			// .pipe( uglify() )
			.pipe( rename( {suffix: ".min"} ) )
			.pipe( gulp.dest(path.script.dest) )
			.on('error', console.error)
	}

	ret.watch = () => {
		browserSync.init({
			server: {
				baseDir: path.baseDir.dest
			},
			open: false
		})
	
		gulp.watch( path.style.src , ret.style)
		gulp.watch( path.html.src , copy.htmlFiles)
		gulp.watch( path.script.src, {}, gulp.series(ret.script) )
		// .on('change', file => {
		// 	console.log(file)	
		// })
	}

	ret.build = (() => {
		const style = () => {
			return gulp.src( path.style.src )
				.pipe( sass( {outputStyle: 'expanded'} ) )
				.pipe( autoprefixer( [">0.2%", "not dead", "not op_mini all"] ) )
				.pipe( cssnano() )
				.pipe( rename( {suffix: ".min"} ) )
				.pipe( gulp.dest( path.style.dest ) )
		}
		const script = () => {
			return gulp.src( path.script.src )
				.pipe( babel() )
				.pipe( uglify() )
				.pipe( rename( {suffix: ".min"} ) )
				.pipe( gulp.dest(path.script.dest) )
				.on('error', console.error)
		}
		
		return gulp.series(
			clean.baseDestDir,
			gulp.parallel(
				style,
				script,
				copy.htmlFiles
			)
		)
	})()

	return ret
})()

const obj = {...expObj, ...copy, ...clean}
Object.keys(obj).forEach(key => {
	exports[key] = obj[key]
})