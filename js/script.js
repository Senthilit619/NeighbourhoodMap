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
        self.searchlocations = ko.observableArray([]);

        self.locations().forEach(function(loc){
            var marker = new google.maps.Marker({
            title:loc.title,
            position:loc.location,
            map:map
            });
            loc.marker=marker;
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
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }


