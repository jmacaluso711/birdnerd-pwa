import { $, $$ } from './bling';
import autocomplete from './autocomplete';

/**
 * Get all our Bird Form DOM Elements w/Bling
 */
const addBirdForm = $('form.add-bird');
const clearButton = $('[data-action="clear"]');
const birdList = $('.bird-list ul');

/**
 * load and render birds in list
 */
if (birdList) {

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
  clearButton.addEventListener('click', () => {
    hoodie.store.removeAll();
  })

  /**
   * Autocomplete address fields
   */
  autocomplete($('#address'), $('#lat'), $('#lng'));

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
            <h2>${bird.species}</h2>
            <p>${bird.description}</p>
          </li>
        `;
      }).join('');

  }

  function orderByCreatedAt(item1, item2) {
    return item1.createdAt < item2.createdAt ? 1 : -1
  }

}