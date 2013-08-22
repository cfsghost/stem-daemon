"usr strict";

var JDisk = require('jsdx-disk');

var disk = new JDisk();

var Disk = function() {
	var self = this;

	self.removableDrives = [];
};

Disk.prototype.constructor = function(callback) {
	var self = this;

	disk.init(function() {

		disk.on('interfaces_added', self.interfaceAddedHandler.bind(self));
		disk.on('interfaces_removed', self.interfaceRemovedHandler.bind(self));

		callback();

	});
};

Disk.prototype.interfaceAddedHandler = function(interfaceData) {
	var self = this;

	// Removable Drive
	if (interfaceData.objectType == 'Drive') {
		if (interfaceData.interfaces.Drive.Removable) {
			self.removableDrives.push(interfaceData.objectName);

			return;
		}
	}

	// Automount drive
	if (interfaceData.objectType == 'Block') {

		// This block device can be mounted
		if (interfaceData.interfaces.Filesystem) {

			// This device was mounted already.
			if (interfaceData.interfaces.Filesystem.MountPoints.length > 0)
				return;

			// Mount this block device
			disk
				.getStorageObject(interfaceData.objectType, interfaceData.objectName)
				.mount(function(err, mountPoint) {

					console.log('Mounted on ' + mountPoint);
				});
		}
	}
};

Disk.prototype.interfaceRemovedHandler = function(interfaceData) {
	var self = this;

	// Remove this drive
	if (interfaceData.objectType == 'Drive') {
		var index = self.removableDrives.indexOf(interfaceData.objectName);
		if (index > -1) {
			self.removableDrives.splice(index, 1);
		}
	}
};

// Metadata
module.exports = {
	name: 'Disk',
	prototype: Disk
};
