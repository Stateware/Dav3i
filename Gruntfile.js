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
			internal: {
				src: ['<%= pkg.scripts.internalLib %>'],
				dest: 'prod/<%= pkg.name %>.js'
			},
			index: {
				src: ['<%= pkg.scripts.index %>'],
				dest: 'prod/index.js'
			},
			appWideCss: {
				src: ['<%= pkg.css.appWide %>'],
				dest: 'prod/<%= pkg.name %>.css'
			},
			indexCss: {
				src: ['<%= pkg.css.index %>'],
				dest: 'prod/index.css'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			internal: {
				src: '<%= concat.internal.dest %>',
				dest: 'prod/<%= pkg.name %>.min.js'
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
				src: []
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
};
