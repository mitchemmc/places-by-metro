var detailsCard = require('./details-card');
!function(){
    var service;
	var drawer = {};
	drawer.obfuscatorClicked = null;
    drawer.filterType = 'bar';
    drawer.filterDistance = 500;

    window.onload = function(){
        service = new google.maps.places.PlacesService(document.createElement('div'));

        //Set up callback for when obfuscator is clicked
    	document.querySelector('.mdl-layout__obfuscator').addEventListener('click', function(e){
    		//e.stopPropagation();
    		if (typeof drawer.obfuscatorClicked === "function") {
    			drawer.obfuscatorClicked();
    		}
    	}, false);

        document.querySelector('.card-container').addEventListener('click', function(e){
            e = window.event || e; 
            if(this === e.target) {
                detailsCard.hide();
                detailsCard.depopulate(); 
            }
        }, false);

        //Click events for type menu
        var menuItems = document.querySelectorAll('.type-filter-menu__item');
        for(var i = 0; i < menuItems.length; i++)
        {
            menuItems[i].addEventListener('click', function(e){
                for(var j = 0; j < menuItems.length; j++)
                {
                    menuItems[j].removeAttribute("disabled");
                }
                this.setAttribute("disabled", "");
                var type = this.innerHTML.replace(/<[^>]*>/g, "").toLowerCase();
                drawer.filterType = type;
                document.querySelector('#type-menu-text-indicator').innerHTML = type;
                document.querySelector('#distance-filter-menu-lower-right').style.right = type.length * 7 + 44 + "px";

            });
        }
        //Click events for distance menu
        var distanceMenuItems = document.querySelectorAll('.distance-filter-menu__item');
        for(var i = 0; i < distanceMenuItems.length; i++)
        {
            distanceMenuItems[i].addEventListener('click', function(e){
                for(var j = 0; j < distanceMenuItems.length; j++)
                {
                    distanceMenuItems[j].removeAttribute("disabled");
                }
                this.setAttribute("disabled", "");
                var distance = parseInt(this.innerHTML.replace(/<[^>]*>/g, "").toLowerCase().slice(0, -1));
                drawer.filterDistance = distance;
                document.querySelector('#distance-menu-text-indicator').innerHTML = distance + 'm';

            });
        }
        //Click event for info icon
        document.querySelector('#info-button').addEventListener('click', function(e){
            var footer = d3.select("footer");
            if(footer.classed("footer-visible"))
                footer.classed("footer-visible", false);
            else
                footer.classed("footer-visible", true);

        }, false);

    };

    //Testing for valid picture url
    function urlExists(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          callback(xhr.status < 400);
        }
      };
      xhr.open('HEAD', url);
      xhr.send();
    }

    function filterResult(obj)
    {
        if(!isNaN(obj.rating))
            return true;
        else
            return false;
    }    

    drawer.populate = function(lat, lon, type, radius, station)
    {
        
       var longlatlocation = new google.maps.LatLng(lat, lon);

        var request = {
            location: longlatlocation,
            radius: radius,
            types: [type]
        };

        service.search(request, function(results, status){

            document.querySelector('#drawer-title').innerHTML = "Places | " + type;
            document.querySelector('#drawer-station-name').innerHTML = station;

            if(results.length === 0)
            {
                var no_results_text = document.createElement("p");
                no_results_text.style.padding = "10px";
                no_results_text.style.margin = "0";
                no_results_text.style.fontWeight = "200";
                no_results_text.innerHTML = "Sorry, no results found. Try either changing the filter type or search range.";
                document.querySelector('.mdl-navigation').appendChild(no_results_text);
            }
            else
            {

                var sorted = results.sort(function(a, b) {
                    if(isNaN(a.rating)) return 1;//move places with no ratings to the bottom
                    if(isNaN(b.rating)) return -1;
                    return (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0);//sort decending
                });

                sorted.forEach(function(el){

                    var card = document.createElement('div');
                    var card_media = document.createElement('div');
                    var card_meta = document.createElement('div');
                    var card_logo = document.createElement('div');
                    var card_title_container = document.createElement('div');
                    var card_title = document.createElement('strong');
                    var card_rating = document.createElement('span');
                    var card_rating_stars = document.createElement('i');
                    var card_fab = document.createElement('button');
                    var card_fab_icon = document.createElement('i');

                    card.className = 'mdl-card';
                    card_media.className = 'mdl-card__media mdl-color-text--grey-50';
                    card_meta.className = 'mdl-card__supporting-text meta mdl-color-text--grey-600';
                    card_logo.className = 'minilogo';
                    card_fab.className = 'mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored mdl-js-ripple-effect';
                    card_fab_icon.className = 'material-icons';
                    card_rating_stars.className = 'material-icons ratings-star';
                    
                    var directionsURL = 'https://www.google.com.au/maps/dir/' + lat + ",+" + lon + "/'" + el.geometry.location.G + ',' + el.geometry.location.K + "'/";
                    card_media.addEventListener('click', function(){
                       // window.open('http://www.google.com/search?q=' + el.name + " " + el.vicinity, '_blank');
                       detailsCard.hide();
                       detailsCard.depopulate();
                       detailsCard.directionsURL = directionsURL;
                       detailsCard.populate(el.place_id);
                       detailsCard.show();
                    });

                    card_fab.addEventListener('click', function(){
                        window.open(directionsURL, '_blank');
                    });

                    /* Card Name */
                    card_title.innerHTML = el.name;

                    /* Card Rating */
                    if(typeof el.rating !== 'undefined')
                    {
                        var rating = el.rating;
                        for(var i = 0; i < Math.floor(rating); i++)
                        {
                            card_rating_stars.innerHTML = card_rating_stars.innerHTML + "star ";
                        }
                        if(rating % 1 != 0)
                            card_rating_stars.innerHTML = card_rating_stars.innerHTML + "star_half";
                    }
                    else{
                        card_rating.innerHTML = 'no ratings';
                    }

                    /* Card fab icon */
                    card_fab_icon.innerHTML = 'directions';

                    /* Card Photo */
                    if(typeof el.photos !== 'undefined')
                    {
                        var photoURL = el.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400});//.photo_reference;
                        urlExists(photoURL, function(exists){
                            if(exists)
                                card_media.style.backgroundImage = "url('" + photoURL + "')";
                            else
                            {
                                card_media.style.backgroundImage = "url('images/pbmlogo-faded.png')";
                                card_media.style.backgroundSize = "contain";
                                card_media.style.backgroundRepeat = "no-repeat";
                            }
                        });
                    }
                    else
                    {
                        card_media.style.backgroundImage = "url('images/pbmlogo-faded.png')";
                        card_media.style.backgroundSize = "contain";
                        card_media.style.backgroundRepeat = "no-repeat";
                    }
                    
                    /* Card icon */
                    card_logo.style.backgroundImage = "url(" + el.icon +")";

                    /* Set up DOM structure */
                    card.appendChild(card_media);
                    card.appendChild(card_fab).appendChild(card_fab_icon);
                    card.appendChild(card_meta)
                        .appendChild(card_logo);
                    card_meta.appendChild(card_title_container);
                    card_title_container.appendChild(card_title);
                    card_title_container.appendChild(card_rating).appendChild(card_rating_stars);

                    componentHandler.upgradeElement(card);
                    document.querySelector('.mdl-navigation').appendChild(card);
                });
            }

        });
    }; 

    drawer.open = function()
    {
    	var d = document.querySelector('.mdl-layout__drawer');
        d.className = d.className + " drawer-visible is-visible";
    }
    drawer.close = function()
    {
    	var d = document.querySelector('.mdl-layout__drawer');
        d.className = 'mdl-layout__drawer';
    }

    drawer.depopulate = function(){
    	var parent = document.querySelector('.mdl-navigation');
    	while(parent.firstChild){
    		parent.removeChild(parent.firstChild);
    	}
    }

module.exports = drawer;

}();

