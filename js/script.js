 var favlocations=[
            {title: 'Isha Yoga', location:{lat: 10.9789623,lng: 76.7365913},id:1}, 
            {title: 'Ajantha Theatres',location: {lat: 10.9601563,lng: 78.0708733},id:2}, 
            {title: 'Erode Bus Stand',location: {lat: 11.3467973,lng: 77.7172613},id:3}, 
            {title: 'Hotel Hemala',location: {lat: 10.9610723,lng: 78.0804773},id:4}, 
            {title: 'Dindigal Thalapakkati',location: {lat: 10.9590474,lng: 78.0735335},id:5}, 
            {title: 'The Chennai Silks',location: {lat: 10.9624398,lng: 78.0679048},id:6}, 
            {title: 'Kolli Hills',location: {lat: 11.3392332,lng: 78.2381341},id:7}, 
            {title: 'Adyar Anandha Bhavan',location: {lat: 10.9613173,lng: 78.0666256},id:8}, 
            {title: 'NTS Palace',location: {lat: 10.9616167,lng: 78.0620733},id:9}, 
            {title: 'Joy Alukkas',location: {lat: 10.9616167,lng: 78.0620733},id:10}
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
        self.searchterm = ko.observable('');

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
          infowindow.marker = marker;
        var client_id = 'XX02XSETTBB01M0KZUF5SLTEWX5NG0M4401FCHWJZLLYWM15',
            client_secret = 'VXPOQENZXZ2QI2WCKGFBIOSBWK134ARVM05E2PB15A5XKAZI',
            lat=marker.position.lat(),
            lng=marker.position.lng();
            var pos = lat +','+ lng;
            var url = 'https://api.foursquare.com/v2/venues/search?ll=' + pos + '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20161129&m=foursquare';
                $.ajax({
                        method: 'GET',
                        url: url,
                        dataType: 'jsonp',
                        success: function (data) {
                                  var name=data.response.venues[0].name;
                                  var venue_id = data.response.venues[0].id;
                                  var address = data.response.venues[0].location.address;
                                  var counts = data.response.venues[0].stats.checkinsCount;
                                  
                                  //Second ajax request for fetching the photos.
                                  //api.foursquare.com/v2/venues/43695300f964a5208c291fe3/photos?client_id=XX02XSETTBB01M0KZUF5SLTEWX5NG0M4401FCHWJZLLYWM15&client_secret=VXPOQENZXZ2QI2WCKGFBIOSBWK134ARVM05E2PB15A5XKAZI&v=20161208
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
                                              infowindow.setContent('<div><span id="name">' + name + '</span><br>Address:'+ address+'<br>Check-ins:'+ counts + '</div><div>No photos available for this location</div>');
                                              infowindow.open(map, marker);
                                              // Make sure the marker property is cleared if the infowindow is closed.
                                              infowindow.addListener('closeclick', function() {
                                              infowindow.marker = null;
                                              });
                                            }
                                            else
                                            {
                                              var prefix = data.response.photos.items[0].prefix;
                                              var suffix = data.response.photos.items[0].suffix;
                                              var src = prefix + '100x100' +suffix;
                                              infowindow.setContent('<div><span id="name">' + name + '</span><br>Address:'+ address+'<br>Check-ins:'+ counts + '</div><div>Photo:<br><img src="'+src+'"></div>');
                                              infowindow.open(map, marker);
                                              // Make sure the marker property is cleared if the infowindow is closed.
                                              infowindow.addListener('closeclick', function() {
                                              infowindow.marker = null;
                                              });
                                            }
                                          },
                                          error: function(){
                                            infowindow.setContent('<div>Error Fetching Data</div>');
                                          }
                                      });
                                    },
                                    error: function (data) {
                                       contentString = "Content Failed to Load Try Again!!!";
                                       getinfowindow(contentString);
                                    }
                          });
        }


