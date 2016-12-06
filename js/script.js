// The M-V-VM Model is used here for the Map Locations
var map;

function initMap() {
       map = new google.maps.Map(document.getElementById('map'),{
        center:{lat:10.957025,lng:78.066409},
        zoom:10,
        mapTypeControl: false
       });
   }
//ViewModel
var ViewModel = function(){
	
	self = this;
	self.locations = ko.observableArray(locations);

	//Add markers to the location
    	for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          markers.push(marker);
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
        //Function to create an infowindow 
        function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker(null);
          });
        }
      }
}; 

//Model

var Model = function()
{

var locations = [
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

};

ko.applyBindings(new ViewModel());