import '../sass/app.scss';
import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

/**
 * Base options for map view
 */
const mapOptions = {
  center: {lat: 40.5, lng: -73.9},
  zoom: 8
}

/**
 * Get all our Bird Form DOM Elements
 */
const addBirdForm = document.querySelector('form.add-bird');
const clearButton = document.querySelector('[data-action="clear"]');

/**
 * Load and render our Birds on the map
 */
function loadBirdsOnMap(map, lat = 40.5, lng = -73.9) {
  hoodie.store
    .findAll()
    .then(res => {

      const birds = res;

      if(!birds.length) return;
    
      // create a bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();
    
      const markers = birds.map(bird => {
        const [birdLng, birdLat] = bird.coordinates;
        const position = {lat: parseFloat(birdLat), lng: parseFloat(birdLng)};
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

function makeMap(mapDiv) {
  if(!mapDiv) return;
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

makeMap( $('#map') );

/**
 * load and render birds in list
 */
function loadAndRenderBirds() {
  hoodie.store
    .findAll()
    .then(render)
    .catch(
      (err) => {
        console.error(err);
      }
    )
}


/**
 * Watch for changes in our Hoodie store
 */
hoodie.store.on('change', loadAndRenderBirds);
// hoodie.store.on('clear',  () => {
//   render([]);
// });

/**
 * Clear the hoodie store
 */
clearButton.addEventListener('click', () => {
  hoodie.store.removeAll();
})

/**
 * Autocomplete address fields
 */
autocomplete( $('#address'), $('#lat'), $('#lng') );

/**
 * Add Bird from our form
 */
addBirdForm.addEventListener('submit', (e) => {
  
  e.preventDefault();
  
  const species = addBirdForm.querySelector('[name="species"]').value;  
  const description = addBirdForm.querySelector('[name="description"]').value;
  const address = addBirdForm.querySelector('[name="address"]').value;
  const lng = addBirdForm.querySelector('[name="lng"]').value;
  const lat = addBirdForm.querySelector('[name="lat"]').value;  
  
  addBirdForm.reset();
  
  hoodie.store.add({
    species: species,
    description: description,
    address: address,
    coordinates: [lng, lat]
  });

});

/** 
 * Render Birds
 */
function render(birds) {
  console.log(birds);
}