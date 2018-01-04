import { $, $$ } from './bling';
import autocomplete from './autocomplete';

/**
 * Get all our Bird Form DOM Elements w/Bling
 */
const addBirdForm = $('form.add-bird');
const clearButton = $('[data-action="clear"]');
const birdList = $('.bird-list ul');
const startCapture = $('.button--start-capture');
const endCapture = $('.button--end-capture');
const takePhotoBtn = $('.button--take-photo');
const video = $('.player');
const photoPreview = $('.photo-preview');
const canvas = $('.photo');
const capture = $('[name="capture"]');

if(canvas) {

  const ctx = canvas.getContext('2d');

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
     * All the Webcam stuff.
     * @param {*} e 
     */
    
    let localMediaStream;

    function paintToCanavas() {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
      }, 16);
    }
    
    function getVideo(e) {
      e.preventDefault();
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          localMediaStream = stream;
          video.src = window.URL.createObjectURL(localMediaStream);
          video.play();
        })
        .catch(err => {
          console.error(`OH NO!!!`, err);
        });
    }

    function stopVideo(e) {
      e.preventDefault();
      video.pause();
      video.src = '';
      localMediaStream.getTracks()[0].stop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function takePhoto(e) {
      e.preventDefault();
      // played the sound
      // snap.currentTime = 0;
      // snap.play();

      // take the data out of the canvas
      const data = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = data;
      link.setAttribute('download', 'handsome');
      link.innerHTML = `<img class="bird-photo" src="${data}" alt="Bird Man" />`;
      photoPreview.insertBefore(link, photoPreview.firsChild);
      stopVideo(e);
    }

    startCapture.addEventListener('click', getVideo);
    endCapture.addEventListener('click', stopVideo);
    video.addEventListener('canplay', paintToCanavas);
    takePhotoBtn.addEventListener('click', takePhoto);

    function getDataUrl(url, callback) {
      var image = new Image();
      image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
        canvas.getContext('2d').drawImage(this, 0, 0);
        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
      };
      image.src = url;
    }

    capture.addEventListener('change', function() {
      getDataUrl(this.value, function(dataUrl) {
        
      })
    })

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
      // const photo  = addBirdForm.querySelector('.bird-photo').src;
      const capture = addBirdForm.querySelector('[name="capture"]').value;

      addBirdForm.reset();

      hoodie.store.add({
        species: species,
        description: description,
        address: address,
        coordinates: [lng, lat],
      });

    });

    /** 
     * Render Birds
     */
    function render(birds) {
      console.log(birds);
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

}