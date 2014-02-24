define([
	'jquery', 
	'q', 
	'underscore'
], function($, Q, _) {

	var API_URL = 'http://www.jscacourse.co.vu',
		SECRET_TOKEN = 'SECRET-TOKEN';
		signupLoginAsync = function(userData, method) {
			var deferred = Q.defer();

			$.post(API_URL + '/' + method, { data: userData })
				.done(function(result){
					deferred.resolve(result);
				})
				.fail(function(xhr){
					deferred.reject(xhr.responseText);
				});

			return deferred.promise;
		};

	var Api = {

		getAvatar: function(gender){
			var imageId = _.random(0, 59),
				avatarTemplate = _.template("http://api.randomuser.me/0.3/portraits/<%= gender %>/<%= id %>.jpg");

			return avatarTemplate({gender: gender == 'male' ? 'men' : 'women', id: imageId});
		},

		getUsersAsync: function(){
			var deferred = Q.defer();			

			$.get(API_URL +"/users")
				.done(function(result){
					var users = [];
						_.each(result, function(userInfo){
							users.push({
								id: userInfo.id,
								gender: userInfo.user.gender,
								title: userInfo.user.name.title,
								firstName: userInfo.user.name.first,
								lastName: userInfo.user.name.last,
								avatar: Api.getAvatar(userInfo.user.gender)
							});							
						});

					deferred.resolve(users);
				})
				.fail(function(xhr){
					deferred.reject(result.responseText);
				});

			return deferred.promise;
		},

		signupAsync: function(userData) {
			return signupLoginAsync(userData, 'signup');
		},

		loginAsync: function(userData) {
			return signupLoginAsync(userData, 'login');
		},

		getContactDetails: function(userId, token){
			var deferred = Q.defer();

			$.ajax({
				type: "GET",
				beforeSend: function(request){
					request.setRequestHeader(SECRET_TOKEN, token);
				},
				url: API_URL + '/user/' + userId
			}).done(function(result){
				
				contactDetails = JSON.parse(result)[0];
				var details = {
					firstName: contactDetails.user.name.first,
					lastName: contactDetails.user.name.last,
					title: contactDetails.user.name.title,
					gender: contactDetails.user.gender,
					street: contactDetails.user.location.street,
					city: contactDetails.user.location.city,
					state: contactDetails.user.location.state,
					zip: contactDetails.user.location.zip,
					email: contactDetails.user.email,
					phone: contactDetails.user.phone,
					cell: contactDetails.user.cell,
					SSN: contactDetails.user.SSN,
					id: contactDetails.id,
					loadedDetails: true,				
				};
				
				deferred.resolve(details);

			}).fail(function(error){
				deferred.reject(new Error('backend error on get user details ' +  error.responseText))
			})

			return deferred.promise;	
		}
	};

	return Api;

});