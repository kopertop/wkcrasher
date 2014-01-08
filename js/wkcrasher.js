/*
 * Angular App
 *
 * @author: Chris Moyer <cmoyer@newstex.com>
 */
/* global angular, $, io */
var wkcrasher = angular.module('wkcrasher',['angularMoment', 'ngSanitize', 'highCharts', 'ui.date'],function($routeProvider) {
	$routeProvider
	.when('/home',{
		templateUrl:'views/home.tmpl',
		controller:'WKCrashCtrl'})
	.otherwise({redirectTo:'/home'});

});

/**
 * Link Controls, handles setting up the menu at the
 * top as well as helping out with the location classes
 */
function LinkCntrl($scope, $location){
	$scope.location = $location;
	$scope.links = [
		{ url: '/home', name: 'Home' },
	];
	
}

/**
 * Crash Controller
 */
function WKCrashCtrl($scope, $routeParams, $filter, socket){
	socket.on('/', 'ready', function(){
		console.log('Socket ready...');
	});


}


/**
 * GroupBy Filter
 * @see http://stackoverflow.com/questions/14748449/angular-js-using-bootstrap-and-dynamically-creating-rows
 */
wkcrasher.filter('groupBy', function() {
	return function(items, groupedBy) {
		if (items) {
			var finalItems = [],
				thisGroup;
			for (var i = 0; i < items.length; i++) {
				if (!thisGroup) {
					thisGroup = [];
				}
				thisGroup.push(items[i]);
				if (((i+1) % groupedBy) === 0) {
					finalItems.push(thisGroup);
					thisGroup = null;
				}
			}
			if (thisGroup) {
				finalItems.push(thisGroup);
			}
			return finalItems;
		}
	};
});

/**
 * Linkification
 * @see http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
 */
wkcrasher.filter('linkify', function(){
	return function(text){
		if(text){
			var exp = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			return text.replace(exp,'<a href="$1" target="_blank">$1</a>');
		}
	};
});

/**
 * Simple String Escaping
 * @see http://stackoverflow.com/questions/14512583/how-to-generate-url-encoded-anchor-links-with-angularjs
 */
wkcrasher.filter('escape', function() {
	return window.escape;
});

/**
 * Convert a string into an ID-safe string
 */
wkcrasher.filter('toid', function(){
	return function(text){
		if(text){
			return btoa(text).replace(/=/g, '');
		}
	};
});
