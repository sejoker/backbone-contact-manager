
(function(){

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

ContactManager.Services.Api = {
	getUsersAsync: function(){
		var deferred = Q.defer(),
			avatarTemplate = _.template("http://api.randomuser.me/0.3/portraits/<%= gender %>/<%= id %>.jpg");

		$.get(API_URL +"/users")
			.done(function(result){
				var users = [];
					_.each(result, function(userInfo){
						var imageId = _.random(0, 59),
							gender = userInfo.user.gender == 'male' ? 'men' : 'women';							

						users.push({
							id: userInfo.id,
							gender: userInfo.user.gender,
							title: userInfo.user.name.title,
							firstName: userInfo.user.name.first,
							lastName: userInfo.user.name.last,
							avatar: avatarTemplate({gender: gender, id: imageId})
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
			var contact = new ContactManager.Models.Contact();
			contactDetails = JSON.parse(result)[0];
			
			contact.set('firstName', contactDetails.user.name.first);
			contact.set('lastName', contactDetails.user.name.last);
			contact.set('title', contactDetails.user.name.title);
			contact.set('gender', contactDetails.user.gender);
			contact.set('street', contactDetails.user.location.street);
			contact.set('city', contactDetails.user.location.city);
			contact.set('state', contactDetails.user.location.state);
			contact.set('zip', contactDetails.user.location.zip);
			contact.set('email', contactDetails.user.email);
			contact.set('phone', contactDetails.user.phone);
			contact.set('cell', contactDetails.user.cell);
			contact.set('SSN', contactDetails.user.SSN);
			contact.set('id', contactDetails.id);
			contact.set('loadedDetails', true);
			
			deferred.resolve(contact);		

		}).fail(function(error){
			deferred.reject(new Error('backend error on get user details ' +  error.responseText))
		})

		return deferred.promise;	
	}
};

})();