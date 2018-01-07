import { $ } from './bling';

/**
 * Base options for map view
 */
const mapOptions = {
  center: { lat: 40.5, lng: -73.9 },
  zoom: 8
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

      // when someone clicks on marker show details
      markers.forEach(marker => marker.addListener('click', function() {
        const html = `
          <div class="bird-popup">
            <img src="${this.place.photo}" alt="${this.place.species}" />
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

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
  //   loadBirdsOnMap(map, place.geometry.location.lat(), place.geometry.location.lng())
  // });

}