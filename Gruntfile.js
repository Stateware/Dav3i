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
		clean: grunt.file.readJSON('clean.json'),
		concat: grunt.file.readJSON('concat.json'),
		uglify: grunt.file.readJSON('uglify.json'),
		qunit: grunt.file.readJSON('qunit.json'),
		jshint: grunt.file.readJSON('jshint.json'),
		csslint: grunt.file.readJSON('csslint.json')
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
};
