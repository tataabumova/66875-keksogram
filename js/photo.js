'use strict';

(function() {
  var Photo = function(data, index) {
    this._data = data;
    this._index = index;

    this._onClick = this._onClick.bind(this);
  };

  var pictureSize = 182;
  var loadingFailPictureClass = 'picture-load-failure';

  Photo.prototype.render = function(container, REQUEST_FAILURE_TIMEOUT) {
    var pictureTemplate = document.querySelector('#picture-template');
    var pictureTemplateElement = pictureTemplate.content.children[0];
    var newPictureElement = pictureTemplateElement.cloneNode(true);


    newPictureElement.querySelector('.picture-comments').textContent = this._data.comments;
    newPictureElement.querySelector('.picture-likes').textContent = this._data.likes;

    container.appendChild(newPictureElement);

    if (this._data.url) {
      var pictureImage = new Image();
      pictureImage.src = this._data.url;
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

    this._element = newPictureElement;
    this._element.addEventListener('click', this._onClick);
  };

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  Photo.prototype._onClick = function(evt) {
    evt.preventDefault();
    if (!this._element.classList.contains(loadingFailPictureClass)) {
      var galleryEvent = new CustomEvent('galleryclick', {detail: { pictureElement: this}});
      window.dispatchEvent(galleryEvent);
    }
  };
  window.Photo = Photo;
})();
