/**
 * Socket.IO AngularJS Factory
 * Copied from: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
 * @author Chris Moyer <cmoyer@newstex.com>
 */
/* global wkcrasher, io */
wkcrasher.factory('socket', function ($rootScope) {
	/*
	 * ELB doesn't support websockets (yet), so we instead
	 * make sure we use the next-best thing
	 */
	var transports = [
		'flashsocket',
		'htmlfile',
		'xhr-polling',
		'jsonp-polling'
	];

	/*
	 * Sockets allows us to specify multiple socket
	 * connections, per namespace
	 */
	var sockets = {};
	var getSocket = function(namespace){
		if(!sockets[namespace]){
			sockets[namespace] = io.connect(namespace, {
				transports: transports,
				'connect timeout': 500,
				'reconnect': true,
				'reconnection delay': 500,
				'reopen delay': 500,
				'max reconnection attempts': 10
			});
		}
		return sockets[namespace];
	};

	return {
		on: function (namespace, eventName, callback) {
			var socket = getSocket(namespace);
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (namespace, eventName, data, callback) {
			var socket = getSocket(namespace);
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});
