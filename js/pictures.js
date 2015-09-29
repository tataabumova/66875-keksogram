'use strict';
(function() {
  var filtersElement = document.querySelector('.filters');
  filtersElement.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture-template');
  var pictureTemplateElement = pictureTemplate.content.children[0];
  var picturesFragment = document.createDocumentFragment();
  var pictureSize = 182;

  var REQUEST_FAILURE_TIMEOUT = 10000;

  pictures.forEach(function(picture) {
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

})();
