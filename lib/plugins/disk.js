"usr strict";

var JDisk = require('jsdx-disk');

var disk = new JDisk();

var Disk = function() {
	var self = this;
};

Disk.prototype.constructor = function(callback) {
	var self = this;

	disk.init(function() {

		// Listen to event
		disk.on('BlockDeviceAdded', self.blockDeviceAddedHandler);
		disk.on('BlockDeviceRemoved', self.blockDeviceRemovedHandler);

		callback();

	});
};

Disk.prototype.blockDeviceAddedHandler = function(deviceName) {
	var self = this;

	disk.getBlockDevice(deviceName, function(err, device) {

		device.getDrive(function(err, drive) {

			// Mount removable device automatically
			if (!drive.removable)
				return;

			device.mount(function(err, mountPoint) {
				if (err)
					return;

				console.log('Mounted on ' + mountPoint);
			});
		});
	});
};

Disk.prototype.blockDeviceRemovedHandler = function(deviceName) {
	var self = this;
};

// Metadata
module.exports = {
	name: 'Disk',
	prototype: Disk
};
