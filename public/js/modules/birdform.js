import { $, $$ } from './bling';
import autocomplete from './autocomplete';

/**
 * Get all our Bird Form DOM Elements
 */
const addBirdForm = document.querySelector('form.add-bird');
const clearButton = document.querySelector('[data-action="clear"]');
const birdList = document.querySelector('.bird-list ul');
const capture = document.querySelector('[name="capture"]');
const emptyPreview = document.querySelector('.empty-preview');

if (addBirdForm) {

  /**
   * load and render birds in list
   */
  function loadAndRenderBirds() {
    
    if(!addBirdForm) return;

    hoodie.store
      .findAll()
      .then(render)
      .catch(
        (err) => {
          console.error(err);
        }
      )

  }
  loadAndRenderBirds();

  /**
   * Watch for changes in our Hoodie store
   */
  hoodie.store.on('change', loadAndRenderBirds);
  hoodie.store.on('clear', () => {
    render([]);
  });

  /**
   * Clear the hoodie store
   */
  function clearStore(clearButton) {
    
    if(!clearButton) return;

    clearButton.addEventListener('click', function() {
      hoodie.store.removeAll();
    });

  }
  clearStore(clearButton);

  /**
   * Image capture/upload
   */
  function capturePhoto(capture) {

    if(!capture) return;

    capture.addEventListener('change', function() {
      const fReader = new FileReader();
      fReader.readAsDataURL(this.files[0]);
      fReader.onloadend = function (event) {
        const img = document.getElementById("photo-preview");
        img.src = event.target.result;
      }
      document.body.setAttribute('data-photo-preview-state', 'not-empty');
    });

  }
  capturePhoto(capture);

  function emptyPhotoPreview(emptyPreview) {
    
    if(!emptyPreview) return;

    emptyPreview.addEventListener('click', function() {
      const img = document.getElementById("photo-preview");
      img.src = "";
      capture.value = "";
      document.body.setAttribute('data-photo-preview-state', 'empty');      
    });

  }
  emptyPhotoPreview(emptyPreview);

  /**
   * Static Map Image
   */
  function staticMap([lng, lat]) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=AIzaSyCHWdhmwfys2Ts_5YQSVw7xPRXKu69Kp2Q&markers=${lat},${lng}&scale=2`
  }

  /**
   * Autocomplete address fields
   */
  autocomplete($('#address'), $('#lat'), $('#lng'));

  /**
   * Add Bird from our form
   */
  addBirdForm.addEventListener('submit', function(e) {

    e.preventDefault();

    const species = addBirdForm.querySelector('[name="species"]').value;
    const description = addBirdForm.querySelector('[name="description"]').value;
    const address = addBirdForm.querySelector('[name="address"]').value;
    const lng = addBirdForm.querySelector('[name="lng"]').value;
    const lat = addBirdForm.querySelector('[name="lat"]').value;
    const photo = document.getElementById('photo-preview').src;

    addBirdForm.reset();

    hoodie.store.add({
      species: species,
      description: description,
      address: address,
      coordinates: [lng, lat],
      photo: photo,
    });

  });

  /** 
   * Render Birds
   */
  function render(birds) {

    if (birds.length === 0) {
      document.body.setAttribute('data-store-state', 'empty');
      return;
    }

    document.body.setAttribute('data-store-state', 'not-empty');

    birdList.innerHTML = birds
      .sort(orderByCreatedAt)
      .map(function (bird) {
        return `
          <li class="bird-item">
            <img src="${bird.photo ? bird.photo : 'images/placeholder.png'}" alt="${bird.species}">
            <a href="map.html"><img src="${staticMap(bird.coordinates)}" /></a>
            <h2>${bird.species}</h2>
            <p>${bird.description}</p>
            <p>${bird.address}</p>
          </li>
        `;
      }).join('');

  }

  function orderByCreatedAt(item1, item2) {
    return item1.createdAt < item2.createdAt ? 1 : -1
  }

}