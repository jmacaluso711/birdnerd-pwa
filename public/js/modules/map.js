/**
 * Base options for map view
 */
const mapOptions = {
  center: { lat: 40.5, lng: -73.9 },
  zoom: 10
}

/**
 * Load and render our Birds on the map
 */
function loadBirdsOnMap(map, lat = 40.5, lng = -73.9) {

  hoodie.store
    .findAll()
    .then(res => {

      const birds = res;

      if (!birds.length) return;

      // create a bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      const markers = birds.map(bird => {
        const [birdLng, birdLat] = bird.coordinates;
        const position = { lat: parseFloat(birdLat), lng: parseFloat(birdLng) };
        bounds.extend(position);
        const marker = new google.maps.Marker({
          map,
          position
        });
        marker.place = bird;
        return marker;
      });

    })
    .catch(
      (err) => {
        console.error(err);
      }
    )

}

export default function makeMap(mapDiv) {
  if (!mapDiv) return;
  // Make map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadBirdsOnMap(map);

  // const input = $('[name="geolocate"]');
  // const autocomplete = new google.maps.places.Autocomplete(input);

  // autocomplete.addListener('place_changed', () => {
  //   const place = autocomplete.getPlace();

  //   loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
  // })

}