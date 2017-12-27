/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_app_scss__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_app_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sass_app_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_bling__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_autocomplete__ = __webpack_require__(3);




/**
 * Base options for map view
 */
const mapOptions = {
  center: { lat: 40.5, lng: -73.9 },
  zoom: 8

  /**
   * Get all our Bird Form DOM Elements
   */
};const addBirdForm = document.querySelector('form.add-bird');
const clearButton = document.querySelector('[data-action="clear"]');

/**
 * Load and render our Birds on the map
 */
function loadBirdsOnMap(map, lat = 40.5, lng = -73.9) {
  hoodie.store.findAll().then(res => {

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
  }).catch(err => {
    console.error(err);
  });
}

function makeMap(mapDiv) {
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

makeMap(Object(__WEBPACK_IMPORTED_MODULE_1__modules_bling__["a" /* $ */])('#map'));

/**
 * load and render birds in list
 */
function loadAndRenderBirds() {
  hoodie.store.findAll().then(render).catch(err => {
    console.error(err);
  });
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
});

/**
 * Autocomplete address fields
 */
Object(__WEBPACK_IMPORTED_MODULE_2__modules_autocomplete__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_1__modules_bling__["a" /* $ */])('#address'), Object(__WEBPACK_IMPORTED_MODULE_1__modules_bling__["a" /* $ */])('#lat'), Object(__WEBPACK_IMPORTED_MODULE_1__modules_bling__["a" /* $ */])('#lng'));

/**
 * Add Bird from our form
 */
addBirdForm.addEventListener('submit', e => {

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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $; });
/* unused harmony export $$ */
// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(elem => {
    elem.on(name, fn);
  });
};



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

function autocomplete(input, latInput, lngInput) {
  if (!input) return;

  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  // if someone hits enter on the address field, don't submit the form
  input.on('keydown', e => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

/* harmony default export */ __webpack_exports__["a"] = (autocomplete);

/***/ })
/******/ ]);
//# sourceMappingURL=App.bundle.js.map