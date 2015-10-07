'use strict';

(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var filtersContainer = document.querySelector('.filters');
  filtersContainer.classList.add('hidden');
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var GAP = 100;
  var picturesContainer = document.querySelector('.pictures');
  var pictures;
  var currentPictures;
  var pictureTemplate = document.querySelector('#picture-template');
  var pictureTemplateElement = pictureTemplate.content.children[0];
  var pictureSize = 182;
  var loadingFailPictureClass = 'picture-load-failure';
  var picturesLoadingClass = 'pictures-loading';

  var PAGE_SIZE = 12;
  var currentPage = 0;

  function renderPictures(picturesToRender, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      picturesContainer.classList.remove(loadingFailPictureClass);
      picturesContainer.innerHTML = '';
    }

    var picturesFragment = document.createDocumentFragment();

    var picturesFrom = pageNumber * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    picturesToRender = picturesToRender.slice(picturesFrom, picturesTo);

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
          newPictureElement.classList.add(loadingFailPictureClass);
        }, REQUEST_FAILURE_TIMEOUT);

        pictureImage.onload = function() {
          var oldPicture = newPictureElement.querySelector('img');
          newPictureElement.replaceChild(pictureImage, oldPicture);
          clearTimeout(imageLoadTimeout);
        };

        pictureImage.onerror = function() {
          newPictureElement.classList.add(loadingFailPictureClass);
        };
      }
      filtersContainer.classList.remove('hidden');
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
          picturesContainer.classList.add(picturesLoadingClass);
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove(picturesLoadingClass);
            return callback(JSON.parse(data));
          }
          showLoadFailure();
      }
    };

    xhr.ontimeout = showLoadFailure;
  }

  var filterElemID = 'filterID';

  function filterPictures(picturesToFilter, filterId) {
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
        break;
    }

    localStorage.setItem(filterElemID, filterId);
    return filteredPictures;

  }
  function setActiveFilter(filterID) {
    currentPictures = filterPictures(currentPictures, filterID);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
  }
  function initFilters() {
    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
    });
  }

  function isNextPageAvailable() {
    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }
  function initScroll() {
    var nextPageTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(nextPageTimeout);
      nextPageTimeout = setTimeout(checkNextPage, 100);
    });
    window.addEventListener('loadneeded', function() {
      renderPictures(currentPictures, currentPage++, false);
    });
  }


  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    currentPictures = loadedPictures;
    renderPictures(loadedPictures);
    var storageFilterID = localStorage.getItem(filterElemID);
    setActiveFilter(storageFilterID);
    var a = '#' + storageFilterID;
    document.querySelector(a).setAttribute('checked', 'checked');
  });
  initFilters();
  initScroll();
})();
