module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
			' Licensed <%= pkg.license.type %> (<%= pkg.license.url %>) */\n',
		// Task configuration.
		clean: {
			prod: {
				src: ['prod/*.js', 'prod/*.css', 'prod/*.html']
			},
			log: {
				src: ['log/*']
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			appWide: {
				src: ['<%= pkg.scripts.appWide %>'],
				dest: 'prod/app_lib.js'
			},
			index: {
				src: ['<%= pkg.scripts.index %>'],
				dest: 'prod/index.js'
			}
		},
		concat_css: {
			appWide: {
				src: ['<%= pkg.css.appWide %>'],
				dest: 'prod/app_style.css'
			},
			index: {
				src: ['<%= pkg.css.index %>'],
				dest: 'prod/index.css'
			}
		},
		cssmin: {
			target: {
				files: [
					{'prod/app_style.min.css': 'prod/app_style.css'},
					{'prod/index.min.css': 'prod/index.css'}
				]
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			appWide: {
				src: '<%= concat.internal.dest %>',
				dest: 'prod/app_lib.min.js'
			},
			index: {
				src: ['<%= concat.index.dest %>'],
				dest: 'prod/index.min.js'
			}
		},
		qunit: {
			files: ['test/*.html']
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: ['GUI/*.js']
			},
			test: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: ['test/*.js']
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: ['src/*.css']
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
};
