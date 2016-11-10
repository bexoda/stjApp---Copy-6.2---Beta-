angular.module('starter')

.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;      
        var newString = $sanitize(text).replace(regex, "href=\"#\" onClick=\"JSEx.openWeb('$1'); return false;\"");

        return $sce.trustAsHtml(newString);
    }
})

 
.controller('MenuCtrl', function($scope, $http, $sce, $ionicScrollDelegate){
	var Url = 'http://stjosephtheworker-com8.rhcloud.com/api';
		$scope.categories = [];

		$http.get(Url+"/get_category_index/").then(function(returnedData){

			$scope.categories = returnedData.data.categories;
			$scope.categories.forEach(function(element, index, array){
				element.tilte = $sce.trustAsHtml(element.tilte);

				$scope.post_image = returnedData.data.post.thumbnail_images.medium.url;
			})

		}, function(err){
			console.log(err);
		})

})

.controller('MainCtrl', function($scope, $http, $sce, $ionicScrollDelegate, $stateParams, $rootScope){

	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){
			/*alert("result: " + JSON.stringify(notification));*/

			var googleDevToken = notification.regid;

			var data = {};
			data.os = 'Android';
			data.token = googleDevToken;

			$http({
				method : 'POST',

				url : 'http://stjosephtheworker-com8.rhcloud.com/pnfw/register/',

				data : 'os=Android&token='+googleDevToken,

				headers : {'Content-Type': 'application/x-www-form-urlencoded'}

			}).success(function(){
					/*alert("Welcome");*/
			}).error(function(err){
					alert("Oops Occured. An error Occured\n"+ err);
				});
	});

	var Url = 'http://stjosephtheworker-com8.rhcloud.com/api';
	$scope.offset = 0;
	$scope.count_total = 0;
	var state=false;

	

	
	$scope.doRefresh = function(){
		$scope.recent_posts = [];
		$http.get(Url+'/get_posts/').then(function(returnedData){
			
			$scope.recent_posts = returnedData.data.posts;
			$scope.post_image = returnedData.data.post.thumbnail_images.medium.url;
			$scope.recent_posts.forEach(function(element, index, array){
				element.excerpt = element.excerpt.substr(0,60);
				element.excerpt = element.excerpt + "...Read More";
				element.excerpt = $sce.trustAsHtml(element.excerpt);
			})

			$scope.offset = 0;
			$scope.$broadcast('scroll.refreshComplete');
			//state=false;
			//$scope.loadMore();
						
		},function(err){

		})
	}
		
	$scope.recent_posts = [];
		$http.get(Url+'/get_posts/').then(function(returnedData){
			
			$scope.recent_posts = returnedData.data.posts;
			$scope.recent_posts.forEach(function(element, index, array){
				element.excerpt = element.excerpt.substr(0,60);
				element.excerpt = element.excerpt + "...Read More";
				element.excerpt = $sce.trustAsHtml(element.excerpt);

			})
		},function(err){

			})

	$scope.canLoadMore = function()
	{
		if($scope.offset > $scope.count_total){
			return false;
		}
		return true;
	}

	
	$scope.loadMore = function(){		
		if(!state){
			console.log(state);
			state=true;
			$scope.$broadcast("scroll.infiniteScrollComplete");
			return;
		}
		$scope.offset += 10;
		$http.get(Url + '/get_posts/?offset=' + $scope.offset).then(function(returnedData){
			console.log($scope.offset);

			//$scope.count_total = returnedData.data.count_total;
			var newPosts = returnedData.data.posts;
			$scope.count_total = returnedData.data.count_total;

			newPosts.forEach(function(element, index, array){
				element.excerpt = element.excerpt.substr(0, 60);
				element.excerpt = element.excerpt + "...Read More";
				element.excerpt = $sce.trustAsHtml(element.excerpt);
			})
			$scope.recent_posts.push.apply($scope.recent_posts, newPosts);
			$scope.$broadcast("scroll.infiniteScrollComplete");
			
			console.log($scope.count_total);
		})

	}
		$scope.searchTextChange = function(){
			$ionicScrollDelegate.$getByHandle('scrollToTop').scrollToTop(true);
		}
})

.controller('PostCtrl', function($http, $sce, $stateParams, $scope){
	var Url = 'http://stjosephtheworker-com8.rhcloud.com/';

	$http.get(Url + 'api/get_post/?id=' + $stateParams.postId).then(function(returnedData){
		$scope.post_title = $sce.trustAsHtml(returnedData.data.post.title);

		$scope.post_category = function(){
			if (returnedData.data.categories.length === 2){
				return returnedData.data.categories[1].title;
			}else
				return returnedData.data.categories[0].title;
		};

		$scope.post_content = $sce.trustAsHtml(returnedData.data.post.content);
		$scope.post_date = returnedData.data.post.date;
		$scope.post_authorName = returnedData.data.post.author.name;
		
		if(typeof returnedData.data.post.thumbnail_images === 'undefined'){
			$scope.post_image = Url + '/wp-content/uploads/2016/04/stjlog1o-2.png';
			}
		else 
			$scope.post_image = returnedData.data.post.thumbnail_images.medium.url;
		
				
		$scope.post_url = returnedData.data.post.url;

	}, function(err){
		console.log(err);
	})

	$scope.Share = function(){
		window.plugins.socialsharing.share($scope.post_title, $scope.post_title, $scope.post_image, $scope.post_url);
	}

})

.controller('CatCtrl', function($http, $sce, $stateParams, $scope){
	
	var Url = 'http://stjosephtheworker-com8.rhcloud.com/api/get_category_posts/?slug=';

	$scope.doRefresh = function(){

		$http.get(Url + $stateParams.slugName).then(function(returnedData){
		$scope.categories_posts = returnedData.data.posts;
		$scope.categories_posts.forEach(function(element, index, array){
			element.excerpt = element.excerpt.substr(0, 60);
			element.excerpt = element.excerpt + "...Read More";
			element.excerpt = $sce.trustAsHtml(element.excerpt);
		})
		$scope.$broadcast('scroll.refreshComplete');
		$scope.category_title = returnedData.data.category.title;
		$scope.recent_posts = [];

		$scope.recent_posts.push.apply($scope.recent_posts, $scope.categories_posts);

	})
	}


	$http.get(Url + $stateParams.slugName).then(function(returnedData){
		$scope.categories_posts = returnedData.data.posts;
		$scope.categories_posts.forEach(function(element, index, array){
			element.excerpt = element.excerpt.substr(0, 60);
			element.excerpt = element.excerpt + "...Read More";
			element.excerpt = $sce.trustAsHtml(element.excerpt);
		})
		$scope.category_title = returnedData.data.category.title;
		$scope.recent_posts = [];

		$scope.recent_posts.push.apply($scope.recent_posts, $scope.categories_posts);

	})
})

.controller ('AboutUs', function(){
	var Url = 'http://stjosephtheworker-com8.rhcloud.com/api/get_page/?slug=about-us';

	$http.get('Url').then(function(returnedData){
		alert(returnedData);
	$scope.page_title = returnedData.data.title;
	})
})