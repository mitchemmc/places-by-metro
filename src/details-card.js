var $ = require('jquery');
(function(){
	var card = {};
	card.directionsURL = "";
	card.populate = function(placeId){

		var request = {
			placeId: placeId
		};

  		var service = new google.maps.places.PlacesService(document.createElement('div'));

  		service.getDetails(request, function(place, status) {
    		if (status == google.maps.places.PlacesServiceStatus.OK) {

    			var detailsCard = document.createElement('div');

    			var detailsCardTitle = document.createElement('div');
    			var detailsCardTitleLogo = document.createElement('div');
    			var detailsCardTitleContainer = document.createElement('div');
    			var detailsCardTitleText = document.createElement('h2');
    			var detailsCardSubTitleText = document.createElement('div');
    			var detailsCardSubTitleTextStars = document.createElement('i');

    			var detailsCardMedia = document.createElement('div');

    			var detailsCardActions = document.createElement('div');
    			var detailsCardDetails = document.createElement('div');
    			var detailsCardDetailsAddress = document.createElement('p');
    			var detailsCardDetailsPhone = document.createElement('p');
    			var detailsCardDetailsHours = document.createElement('p');
    			var detailsCardDetailsDiectionsButton = document.createElement('a');

    			var detailsCardReviewsContainer = document.createElement('div');

    			var detailsCardPoweredByGoogleBanner = document.createElement('img');


    			//Class names
    			detailsCard.className = "mdl-card mdl-shadow--2dp detailed-info-card";
    			detailsCardTitle.className = "mdl-card__title";
    			detailsCardTitleLogo.className = "minilogo";
    			detailsCardTitleContainer.className = "dl-card__title-container";
    			detailsCardTitleText.className = "mdl-card__title-text";
    			detailsCardSubTitleText.className = "mdl-card__subtitle-text";
    			detailsCardSubTitleTextStars.className = "material-icons ratings-star";

    			detailsCardMedia.className = "mdl-card__media";

    			detailsCardActions.className = "mdl-card__actions mdl-card--border";
    			detailsCardDetails.className = "mdl-card__details";
    			detailsCardDetailsAddress.className = "mdl-card__details-field";
    			detailsCardDetailsPhone.className = "mdl-card__details-field";
    			detailsCardDetailsHours.className = "mdl-card__details-field";
    			detailsCardDetailsDiectionsButton.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--raised";

    			detailsCardReviewsContainer.className = "mdl-card__supporting-text mdl-card--border";

    			detailsCardPoweredByGoogleBanner.className = "powered-by-google-banner";

    			//Set Place icon
    			detailsCardTitleLogo.style.backgroundImage = "url(" + place.icon +")";

    			//Set Title
    			detailsCardTitleText.innerHTML = place.name;

    			//Set Sub Title
    			if(typeof place.rating !== 'undefined')
                {
                	detailsCardSubTitleText.appendChild(detailsCardSubTitleTextStars);
                    var rating = place.rating;
                    for(var i = 0; i < Math.floor(rating); i++)
                    {
                        detailsCardSubTitleTextStars.innerHTML = detailsCardSubTitleTextStars.innerHTML + "star ";
                    }
                    if(rating % 1 != 0)
                        detailsCardSubTitleTextStars.innerHTML = detailsCardSubTitleTextStars.innerHTML + "star_half";
                    detailsCardSubTitleText.innerHTML = detailsCardSubTitleText.innerHTML + "  " + rating + " (" + place.user_ratings_total + ")";
                }
                else{
                    detailsCardSubTitleText.innerHTML = 'no ratings';
                }

                //Set Card Media
                if(typeof place.photos !== 'undefined')
                {
					var slickOuter = document.createElement('div');
			    	for(var i = 0; i < place.photos.length; i++)
			    	{
			    		var slickInner = document.createElement('div');
			    		slickInner.style.backgroundImage = "url('" + place.photos[i].getUrl({'maxWidth': 800, 'maxHeight': 1000}) + "')";
			    		slickOuter.appendChild(slickInner);    		
			    	}
			    	slickOuter.className = "slick-outer";
			    	detailsCardMedia.appendChild(slickOuter);
			      	var slider = $(slickOuter).slick();
			      	$(window).trigger('resize');//force slick to refresh elements
			      	
		      	}
		      	else
		      	{
  		            detailsCardMedia.style.backgroundImage = "url('images/pbmlogo-faded.png')";
                    detailsCardMedia.style.backgroundSize = "contain";
                    detailsCardMedia.style.backgroundRepeat = "no-repeat";
		      	}

		      	//Set Card Actions
		      	if(typeof place.formatted_address !== 'undefined')
		      		detailsCardDetailsAddress.innerHTML = "<strong>Address: </strong>" + place.formatted_address;

		      	if(typeof place.formatted_phone_number !== 'undefined')
		      		detailsCardDetailsPhone.innerHTML = "<strong>Phone: </strong>" + place.formatted_phone_number;

		      	if(typeof place.opening_hours !== 'undefined')
		      		detailsCardDetailsHours.innerHTML = "<strong>Hours: </strong>" + (place.opening_hours.open_now ? "open" : "closed");

		      	//Set up Directions button
		      	detailsCardDetailsDiectionsButton.innerHTML = "Directions";
		      	detailsCardDetailsDiectionsButton.href = card.directionsURL;
		      	detailsCardDetailsDiectionsButton.target = "_blank";

		      	//Needed powered by google banner
		      	detailsCardPoweredByGoogleBanner.src = "images/powered-by-google-on-white.png";

		      	//Setup DOM
    			detailsCard.appendChild(detailsCardTitle);
    			detailsCard.appendChild(detailsCardMedia);
    			detailsCard.appendChild(detailsCardActions);
    			detailsCard.appendChild(detailsCardReviewsContainer);
    			detailsCard.appendChild(detailsCardPoweredByGoogleBanner);

    			detailsCardTitle.appendChild(detailsCardTitleLogo);
    			detailsCardTitle.appendChild(detailsCardTitleContainer);
    			detailsCardTitleContainer.appendChild(detailsCardTitleText);
    			detailsCardTitleContainer.appendChild(detailsCardSubTitleText);

    			detailsCardActions.appendChild(detailsCardDetails);
    			detailsCardDetails.appendChild(detailsCardDetailsAddress);
    			detailsCardDetails.appendChild(detailsCardDetailsPhone);
    			detailsCardDetails.appendChild(detailsCardDetailsHours);
    			detailsCardActions.appendChild(detailsCardDetailsDiectionsButton);


    			if(typeof place.reviews !== 'undefined')
    			{
    				for(var i = 0; i < place.reviews.length; i++)
    				{
    					var reviewData = place.reviews[i];
    					
    					//create reviews
    					var review = document.createElement('div');
    					var avatar = document.createElement('div');
    					var reviewHeader = document.createElement('header');
    					var reviewAuthor = document.createElement('div');
    					var reviewRating = document.createElement('i');
    					var reviewText = document.createElement('div');

    					//Classes
    					review.className = "review";
    					avatar.className = "minilogo";
    					reviewHeader.className = "review__header";
    					reviewAuthor.className = "review__author";
    					reviewRating.className = "material-icons ratings-star";
    					reviewText.className = " review__text";


    					//Convert time to formated string
    					var time = new Date(reviewData.time) * 1000;
    					var days = Math.ceil((new Date() - time) / (1000*60*60*24));
    					var years = Math.floor(days / 365);
    					var reviewTimeText = days < 365 ? (days == 1 ? "a day ago" : days + " days ago") : (years == 1 ? "a year ago" : years + " years ago");

    					reviewAuthor.innerHTML = "<strong> " + reviewData.author_name + "</strong>  " + reviewTimeText;

    					//Rating Stars
	                    var rating = reviewData.rating;
	                    for(var j = 0; j < Math.floor(rating); ++j)
	                    {
	                        reviewRating.innerHTML = reviewRating.innerHTML + "star ";
	                    }
	                    if(rating % 1 != 0)
	                        reviewRating.innerHTML = reviewRating.innerHTML + "star_half";
		      			
		      			if(typeof reviewData.text !== 'undefined')
	                   		reviewText.innerHTML = reviewData.text;

	                   	//Setup DOM
    					review.appendChild(avatar);
    					review.appendChild(reviewHeader);
    					review.appendChild(reviewText);
    					reviewHeader.appendChild(reviewAuthor);
    					reviewHeader.appendChild(reviewRating);

    					//Avatar
    					detailsCardReviewsContainer.appendChild(review);
    					if(typeof reviewData.author_url !== 'undefined')
						{
    						var usrId = reviewData.author_url.match(/.com\/(.*)/)[1];
    						var avatarAPIURL = 'http://picasaweb.google.com/data/entry/api/user/' + usrId + '?alt=json';
    						avatar.id = usrId;
	    					$.ajax({
							  url: avatarAPIURL,
							  dataType: 'jsonp',
							  success: function(data){
						    	var id = data.entry.author[0].uri.$t.match(/.com\/(.*)/)[1];
						    	document.getElementById(id).style.backgroundImage = "url('" + data.entry.gphoto$thumbnail.$t.replace("s64-c", "s128-c") + "')";
	    						}
							});
						}
						else
						{
							//If no ID field give them a default avatar icon
							avatar.style.backgroundImage = "url('images/gplusdefault.jpg')";
						}
    				}
    			}

    			//Upgade for material UI
    			componentHandler.upgradeElement(detailsCard);
                document.querySelector('.card-container').appendChild(detailsCard);

      		}
  		});
	}

	card.show = function(){
		document.querySelector('.card-container').className = "card-container";
	}

	card.depopulate = function(){
		var parent = document.querySelector('.card-container');
    	while(parent.firstChild){
    		parent.removeChild(parent.firstChild);
    	}
	}

	card.hide = function(){
		document.querySelector('.card-container').className = "card-container hidden";
	}

	module.exports = card;
})();