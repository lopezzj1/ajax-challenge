"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/


angular.module('ProductComment', ['ui.bootstrap'])
	.config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'E64kHkalV8ASYSG4dZoi6JgzAUmVzq6iuCz5ZUot';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'Nc4tpZnenugFXzNb2SwseW8w5QlFTpqrjmFI0N1n';
	})
	.controller('CommentController', function($scope, $http) {

        //get or refresh all tasks objects saved by my application on Parse.com 
        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get('https://api.parse.com/1/classes/comments?order=-scores')
                .success(function(responseData) {
                    //when returning a list of data, Parse.com will always
                    //return an object with on property called 'resuts'
                    //which will contain an array with all the data objects
                    if(responseData.results == 0){
                    	console.log("empty");
                    	$('#emptyComment').show();
                    }
                    $scope.comments = responseData.results;
                    
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function(){
                    $scope.loading = false;
                });
        };

        //call the refreshTasks() to get the initial set of comments on page load
        $scope.refreshComments();

        $scope.newComment = { done: false, scores: 0 };

		//function to add a new comment 
		$scope.addComment = function(comment) {
			//post will add comment to the class
			$http.post('https://api.parse.com/1/classes/comments', comment)
				.success(function(responseData){
					comment.objectId = responseData.objectId;

					//add comment to the comment list
					$scope.comments.push(comment);

					//reset the newComment to clear the form
					$scope.newComment = {done: false};
				});
		}; 

		//function to update an existing comment
		$scope.deleteComment = function(comment) {
			$scope.updating = true;
			$http.delete('https://api.parse.com/1/classes/comments/' + comment.objectId, comment)
				.success (function(responseData){
					$scope.refreshComments();
				})
				.error(function(err){
					console.log(err);
					//notifty the user in some way
				})
				.finally(function(){
					$scope.updating = false;
				});
		};

		
		$scope.orderComments = function(){
			$http.get('https://api.parse.com/1/classes/comments?order=-scores')
				.success(function(responseData) {
					$scope.comments = responseData.results;
				})
				.error(function(err){
					console.log(error);
				})
		};
		

		//upvote a comment
		var upVoteTask = {
			scores: {__op: 'Increment', amount: 1}	
		};

		//downvote a comment
		var downVoteTask = {
			scores: {__op: 'Increment', amount: -1}
		};


		$scope.upVotes = function(comment) {
			$http.put('https://api.parse.com/1/classes/comments/' + comment.objectId, upVoteTask)
				.success(function(responseData) {
					//$scope.refreshComments();
					$scope.orderComments();
				})
				.error(function(err){
					//something went wrong
				});
		};

		$scope.downVotes = function(comment) {
			$http.put('https://api.parse.com/1/classes/comments/' + comment.objectId, downVoteTask)
			.success(function(responseData) {
				//$scope.refreshComments();
				$scope.orderComments();
			})
			.error(function(err){
				//something went wrong
			});
		};

	});
