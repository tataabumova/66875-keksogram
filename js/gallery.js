'use strict';

(function() {
  var Gallery = function() {
    this._element = document.body.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');
    this._currentPhoto = 0;
    this._photos = [];

    this._onCloseClick = this._onCloseClick.bind(this);
  };

  Gallery.prototype.show = function() {
    this._element.classList.remove('hidden');
    this._closeButton.addEventListener('click', this._onCloseClick);

    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('hidden');
    this._closeButton.removeEventListener('click', this._onCloseClick);

    this._photos = [];
    this._currentPhoto = 0;
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';
    var imageElement = new Image();
    imageElement.src = this._photos[this._currentPhoto];
    imageElement.onload = function() {
      this._pictureElement.appendChild(imageElement);
    }.bind(this);
  };

  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  window.Gallery = Gallery;
})();
