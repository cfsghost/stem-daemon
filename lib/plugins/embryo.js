'usr strict';

var child_process = reuqire('child_process');

var Embryo = function() {
	var self = this;
};

Embryo.prototype.constructor = function(callback) {
	var self = this;

	process.nextTick(callback);
};

Embryo.prototype.launch = function(appPath, opts, callback) {
	var self = this;

	var app = child_process.fork(appPath);

	process.nextTick(callback);
};


// Metadata
module.exports = {
	name: 'Embryo',
	prototype: Embryo
};
