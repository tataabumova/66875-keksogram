'use strict';

(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var filtersElement = document.querySelector('.filters');
  filtersElement.classList.add('hidden');
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var picturesContainer = document.querySelector('.pictures');
  var pictures;

  function renderPictures(picturesToRender) {
    picturesContainer.classList.remove('picture-load-failure');
    picturesContainer.innerHTML = '';

    var pictureTemplate = document.querySelector('#picture-template');
    var pictureTemplateElement = pictureTemplate.content.children[0];
    var picturesFragment = document.createDocumentFragment();
    var pictureSize = 182;

    picturesToRender.forEach(function(picture) {
      var newPictureElement = pictureTemplateElement.cloneNode(true);

      newPictureElement.querySelector('.picture-comments').textContent = picture.comments;
      newPictureElement.querySelector('.picture-likes').textContent = picture.likes;

      picturesFragment.appendChild(newPictureElement);

      if (picture.url) {
        var pictureImage = new Image();
        pictureImage.src = picture.url;
        pictureImage.width = pictureImage.height = pictureSize;

        var imageLoadTimeout = setTimeout(function() {
          newPictureElement.classList.add('picture-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        pictureImage.onload = function() {
          var oldPicture = newPictureElement.querySelector('img');
          newPictureElement.replaceChild(pictureImage, oldPicture);
          clearTimeout(imageLoadTimeout);
        };

        pictureImage.onerror = function() {
          newPictureElement.classList.add('picture-load-failure');
        };
      }
      filtersElement.classList.remove('hidden');
    });
    picturesContainer.appendChild(picturesFragment);
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPictures(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('pictures-loading');
            return callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    };
  }

  function filterPictures(filterId) {
    var filteredPictures = pictures.slice(0);
    switch (filterId) {
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.date > b.date) {
            return -1;
          }
          if (a.date < b.date) {
            return 1;
          }
          if (a.date === b.date) {
            return 0;
          }
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.comments > b.comments || (b.comments && a.comments === 0)) {
            return -1;
          }
          if (a.comments < b.comments || (a.comments && b.comments === 0)) {
            return 1;
          }
          if (a.comments === b.comments) {
            return 0;
          }
        });
        break;
      default:
        filteredPictures = pictures.slice(0);
        break;
    }

    return filteredPictures;

  }
  function setActiveFilter(filterID) {
    var filteredPictures = filterPictures(filterID);
    renderPictures(filteredPictures);
  }
  function initFilters() {
    var filtersContainer = document.querySelector('.filters');
    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
    });
  }


  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(loadedPictures);
  });

  initFilters();
})();
