/**
 * Angular Highcharts integration
 *
 * Usage:
 * 	<chart
 * 		value="variableWithItems"
 * 		name="Optional Chart Name"
 * 		type="pie"
 *		/>
 */
/* global angular, Highcharts */
angular.module('highCharts',[])
	.directive('chart', function () {
		return {
			restrict: 'E',
			template: '<div></div>',
			scope: {
				items: "=value",
				categories: "=",
				name: "@",
				type: "@"
			},
			transclude: true,
			replace: true,
			link: function ($scope, $element, $attrs) {
				// Generic Options
				var opts = {
					title: {
						text: $attrs.name,
					},
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						renderTo: $element[0],
					},
					series: [],
				};

				// Pie Chart Options
				if ( $attrs.type == 'pie' ){
					opts.tooltip = { pointFormat: '{point.y:,.0f} (<b>{point.percentage:.1f}%</b>)' };
					opts.plotOptions = {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								format: '<b>{point.name}</b>: {point.percentage:.1f} %',
							},
						},
					};
				}

				var chart = new Highcharts.Chart(opts);

				/**
				 * Watch the items attribute for changes
				 */
				$scope.$watch('items', function (newValue) {
					// Allow values to be passed in directly from CloudSearch Facets,
					// convert those to simple arrays
					var values = [];
					newValue.forEach(function(val){
						if(typeof val == 'object'){
							val = [val.value, val.count];
						}
						values.push(val);
					});
					newValue = values;

					// Handle Pie Charts
					if($attrs.type == 'pie'){
						var sid = 'pie';
						var series = chart.get(sid);
						if(series){
							series.setData(newValue);
						} else {
							series = {
								id: sid,
								type: $attrs.type,
								name: $attrs.name,
								data: newValue,
							};
							chart.addSeries(series, false);
						}
					} else {
						// Handle Other types of Charts
						for(var sid in newValue){
							var seriesdata = [];
							$($scope.categories).each(function(x, cat){
								seriesdata.push(newValue[sid][cat] || 0);
							});
							var series = chart.get(sid);
							if(series){
								series.setData(seriesdata);
							} else {
								series = {
									id: sid,
									type: $attrs.type,
									name: sid,
									data: seriesdata
								};
								chart.addSeries(series, false);
							}
						}
						// Remove any series not in the new value
						$(chart.series).each(function(x, series){
							if(!newValue[series.options.id]){
								series.remove(false);
							}
						});
					}
					chart.redraw();
				}, true);


			}
		};
	});
