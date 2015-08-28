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
                // clean prod and log directories
		clean: {
			prod: {
				src: ['prod/*.js', 'prod/*.css', 'prod/*.html']
			},
			log: {
				src: ['log/*.txt']
			}
		},
                // concatenate javascript files
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
				dest: 'prod/index_lib.js'
			},
			upload: {
				src: ['<%= pkg.scripts.upload %>'],
				dest: 'prod/upload_lib.js'
			}
		},
                // concatenate css files
		concat_css: {
			appWide: {
				src: ['<%= pkg.css.appWide %>'],
				dest: 'prod/app_style.css'
			},
			index: {
				src: ['<%= pkg.css.index %>'],
				dest: 'prod/index_style.css'
			},
			upload: {
				src: ['<%= pkg.css.upload %>'],
				dest: 'prod/upload_style.css' 
			}
		},
                // minify css files
		cssmin: {
			target: {
				files: [
					{'prod/app_style.min.css': '<%= concat_css.appWide.dest %>'},
					{'prod/index_style.min.css': '<%= concat_css.index.dest %>'},
					{'prod/upload_style.min.css': '<%= concat_css.upload.dest %>'}
				]
			}
		},
                // minify javascript files
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			appWide: {
				src: '<%= concat.appWide.dest %>',
				dest: 'prod/app_lib.min.js'
			},
			index: {
				src: ['<%= concat.index.dest %>'],
				dest: 'prod/index_lib.min.js'
			},
			upload: {
				src: ['<%= concat.upload.dest %>'],
				dest: 'prod/upload_lib.min.js'
			}
		},
                // javascript unit tests
		qunit: {
			files: ['tst/**/*.html']
		},
                // javascript linting
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
				src: ['tst/**/*.js']
			}
		},
                // css linting
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: ['res/*.css']
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
