var myApp = angular.module('myApp', ['angular.filter', 'ui.bootstrap']);

myApp.controller('myController', ['$scope', '$http', function ($scope, $http) {
		$scope.main = {
            page: 1,
            take: 12,
            max: 17
        };

        $scope.order = 'id';

        // Initialise the placeholder list on load
        getData();

		function getData() {
			// scope for categories
			$http.get('https://sephora-api-frontend-test.herokuapp.com/products?page[number]=' + $scope.main.page + '&page[size]=' + ($scope.main.take * $scope.main.max)).
			success(function(data, status, headers, config) {
				
				$scope.categories = data.data;

			}).error(function(data, status, headers, config) {
				// log error
				console.log(status);
			});

			// scope for list of products
			$http.get('https://sephora-api-frontend-test.herokuapp.com/products?page[number]=' + $scope.main.page + '&page[size]=' + $scope.main.take).
			success(function(data, status, headers, config) {
				
				$scope.list = data.data;

				for (var i = 0; i < $scope.list.length; i++) {
					$scope.list[i].attributes.price = ($scope.list[i].attributes.price/100).toFixed(2);	
				}
			}).error(function(data, status, headers, config) {
				// log error
				console.log(status);
			}).then(function(response) {
				$scope.totalItems = $scope.main.take * $scope.main.max;

				$scope.list = response.data.data;

			});
		}
		
		$scope.filters = {};

		//price filtering
		$scope.priceIncludes = [];
		$scope.ranges = [0, 0];

		$scope.includePrice = function(pricerange) {
		   var i = $.inArray(pricerange, $scope.priceIncludes);
		   if (i > -1) {
		       $scope.priceIncludes.splice(i, 1);
		       ranges = pricerange.split(',').splice(i, 1);
		   } else {
		       $scope.priceIncludes.push(pricerange);
		   }
		   var arrayString = $scope.priceIncludes.join();
		   var rangeArray = arrayString.split(',')
		   $scope.maxRange = function( rangeArray ){
		       return Math.max.apply( Math, rangeArray );
		   };
		   $scope.minRange = function( rangeArray ){
		       return Math.min.apply( Math, rangeArray );
		   };
		   $scope.ranges[1] = $scope.maxRange(rangeArray);
		   $scope.ranges[0] = $scope.minRange(rangeArray);
		   console.log($scope.ranges);
		}

		$scope.priceFilter = function(list) {
			console.log(list);
		   	if ($scope.list.length > 0) {
		   	    if ((parseInt(list.attributes.price) >= parseInt($scope.ranges[0])) && (parseInt(list.attributes.price) <= parseInt($scope.ranges[1]))) {

		   	    	return list;
		   	    } else if (parseInt($scope.ranges[0]) === 0 && parseInt($scope.ranges[1]) === 0) {
		   	    	$scope.ranges = [0, 1000000];

		   	    	return list;
		   	    }
		   	} 
		}

		// function below add class if item is sold out / on sales
		$scope.appliedClass = function(soldOut, sales) {
			if (soldOut === false && sales === false) {
				return "col-md-4";
			} else if (soldOut === true && sales === false) {
				return "col-md-4 c-product--sold-out";
			} else if (soldOut === true && sales === true) {
				return "col-md-4 c-product--sold-out c-product--sales";
			} else if (soldOut === false && sales === true) {
				return "col-md-4 c-product--sales";
			}
		}

		//get another portions of data on page changed
		$scope.pageChanged = function() {
			getData();
		};
		
	} ]
);
