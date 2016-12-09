 //Model
 var favlocations=[
            {title: 'Delhi sweats & bakery', location:{lat: 10.956583,lng:78.081597}}, 
            {title: 'Hotel Hemala',location: {lat: 10.96106536392226 ,lng: 78.08258976687684}}, 
            {title: 'Planet Fashion',location: {lat: 10.959212 ,lng:  78.079608}}, 
            {title: 'Karur Bus Terminus',location: {lat: 10.9593501,lng:78.0741122}}, 
            {title: 'Dindigal Thalapakatti',location: {lat: 10.9590758,lng:78.0756299}}, 
            {title: 'Basics life',location: {lat: 10.959771,lng: 78.074313}}, 
            {title: 'Adyar Anandha Bhavan',location: {lat: 10.9592703,lng:78.0761873}}, 
            {title: 'NTS Palace',location: {lat: 10.961620,lng:78.064263}}, 
            {title: 'Hotel Valluvar',location: {lat: 10.9606905,lng:78.0759959}}
  ];                                                 

// Global variables
var map;
var markers=[];
var vm;
function initMap() {
       map = new google.maps.Map(document.getElementById('map'),{
        center:{lat:10.957025,lng:78.066409},
        zoom:10,
        mapTypeControl: false
       }); 
       //Instantiate ViewModel
       vm = new ViewModel();
       //Apply bindings
       ko.applyBindings(vm);
  }
var ViewModel=function(){
        "use strict";
        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        var self = this;
        self.locations= ko.observableArray(favlocations);
        //Input given by the user as search term.
        self.searchterm = ko.observable('');
        // Marker for all the locations in the locations array.
        self.locations().forEach(function(loc){
            var marker = new google.maps.Marker({
            title:loc.title,
            position:loc.location,
            map:map
            });
            loc.marker=marker;
            loc.updatelist = ko.observable(true);
            loc.venue = ko.observable('venue');
            markers.push(marker);
            //Add an event listener to open the Infowindow
            marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
        });
        //Add the position to the bounds
        for(var i=0;i<markers.length;i++) {
            bounds.extend(markers[i].getPosition());
        }
        //Set the center of the map to the center of all the bounds 
        map.setCenter(bounds.getCenter());
        // Fit the bounds of all the markers
        map.fitBounds(bounds);
        //Search Function
        self.searchfunction = ko.computed(function(){
         var search = self.searchterm();
         //Iterate through all the location in the array and find if the search location is available and set the corresponding marker as visible. 
         for (var i = 0; i < self.locations().length; i++) {
            if (self.locations()[i].title.toLowerCase().indexOf(search)>=0) 
                {
                    self.locations()[i].updatelist(true);
                    self.locations()[i].marker.setVisible(true);
                }
            else 
                {
                    self.locations()[i].updatelist(false);
                    self.locations()[i].marker.setVisible(false);
                }
              }
          });
    
    }

//Function to execute when the user clicks the listview 
self.selectloc = function(loc){
        loc.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
        loc.marker.setAnimation(null);
        }, 1400);
    }



// Function to open the InfoWindow onclick
function populateInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) 
          {
            infowindow.marker = marker;
            infowindow.setContent("Loading...");
            infowindow.open(map,marker);
          }
        // Client ID and Secret for making the Fooursquare API request
        var client_id = 'XX02XSETTBB01M0KZUF5SLTEWX5NG0M4401FCHWJZLLYWM15',
            client_secret = 'VXPOQENZXZ2QI2WCKGFBIOSBWK134ARVM05E2PB15A5XKAZI',
            lat=marker.position.lat(),
            lng=marker.position.lng();
            var pos = lat +','+ lng;
            //AJax request for the foursquare API to get the location data.
            var url = 'https://api.foursquare.com/v2/venues/search?ll=' + pos + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20161129&m=foursquare';
                $.ajax({
                        method: 'GET',
                        url: url,
                        dataType: 'jsonp',
                        success: function (data) {
                                  //Store the data from the ajax request.
                                  var name=data.response.venues[0].name;
                                  //venue id is for making the second ajax request to foursquare to get the photos of that place. 
                                  var venue_id = data.response.venues[0].id;
                                  var address = data.response.venues[0].location.address;
                                  var counts = data.response.venues[0].stats.checkinsCount;
                                  //Second ajax request for fetching the photos.
                                  var secondurl = 'https://api.foursquare.com/v2/venues/' + venue_id +'/photos?client_id=' + client_id + '&client_secret=' + client_secret + '&v=20161129';
                                  $.ajax({
                                          method: 'GET',
                                          url: secondurl,
                                          dataType: 'jsonp',
                                          success: function(data){
                                            //var prefix = data.response.photos.items[0].prefix;
                                            //var suffix = data.response.photos.items[0].suffix;
                                            var item = data.response.photos.items[0];
                                            if(item==undefined)
                                            { 
                                              //If there is no photo, then display the message.
                                              infowindow.setContent('<div><span class="bold"> ' + name + '</span><br><span class="bold">Address: </span>'+ address+'<br><span class="bold">Check-ins: </span>'+ counts + '</div><div>No photos available for this location</div>');
                                              infowindow.open(map, marker);
                                              infowindow.addListener('closeclick', function() {
                                              infowindow.marker = null;
                                              });
                                            }
                                            else
                                            {
                                              //If there are photos, display the first one.
                                              var prefix = data.response.photos.items[0].prefix;
                                              var suffix = data.response.photos.items[0].suffix;
                                              var src = prefix + '100x100' +suffix;
                                              infowindow.setContent('<div><span class="bold"> ' + name + '</span><br><span class="bold">Address: </span>'+ address+'<br><span class="bold">Check-ins: </span>'+ counts + '</div><div>Photo :<br><img src="'+src+'"></div>');
                                              infowindow.open(map, marker);
                                              infowindow.addListener('closeclick', function() {
                                              infowindow.marker = null;
                                              });
                                            }
                                          },
                                          //On error function to display the error message in the Infowindow.
                                          error: function(){
                                            infowindow.setContent('<div>Error Fetching Data</div>');
                                          }
                                      });
                                  },
                        //On error function to display the error message in the Infowindow.
                        error: function () {
                                infowindow.setContent('<div>Error Fetching Data</div>');
                                  }
                        });
        }

//Function to display the error message
function erroralert(){
  alert("Error loading data. Please check the connection or try again later.");
}



