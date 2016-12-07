 var favlocations=[
            {title: 'Isha Yoga', location:{lat: 10.9789623,lng: 76.7365913}}, 
            {title: 'Ajantha Theatres',location: {lat: 10.9601563,lng: 78.0708733}}, 
            {title: 'Erode Bus Stand',location: {lat: 11.3467973,lng: 77.7172613}}, 
            {title: 'Hotel Hemala',location: {lat: 10.9610723,lng: 78.0804773}}, 
            {title: 'Dindigal Thalapakkati',location: {lat: 10.9590474,lng: 78.0735335}}, 
            {title: 'The Chennai Silks',location: {lat: 10.9624398,lng: 78.0679048}}, 
            {title: 'Kolli Hills',location: {lat: 11.3392332,lng: 78.2381341}}, 
            {title: 'Adyar Anandha Bhavan',location: {lat: 10.9613173,lng: 78.0666256}}, 
            {title: 'NTS Palace',location: {lat: 10.9616167,lng: 78.0620733}}, 
            {title: 'Joy Alukkas',location: {lat: 10.9616167,lng: 78.0620733}}
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
        var self = this;
        self.locations= ko.observableArray(favlocations);
        self.locations().forEach(function(loc){
          var marker = new google.maps.Marker({
            title:loc.title,
            position:loc.location,
            map:map
          });
          loc.marker=marker;
          markers.push(marker);
        });
      };


