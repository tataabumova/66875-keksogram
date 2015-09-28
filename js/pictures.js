(function() {
  document.querySelector('.filters').classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture-template');
  var picturesFragment = document.createDocumentFragment();

  var REQUEST_FAILURE_TIMEOUT = 10000;

  pictures.forEach(function(picture, i) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

    //newPictureElement.querySelector('.picture img').setAttribute('src', picture['url']);
    newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

    picturesFragment.appendChild(newPictureElement);
    picturesContainer.appendChild(picturesFragment);

    if (picture['url']) {
      var pictureImage = new Image();
      pictureImage.src = picture['url'];

      var imageLoadTimeout = setTimeout(function () {
        console.log('timeout');
        newPictureElement.classList.add('picture-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      pictureImage.onload = function() {
        console.log('onload');
        newPictureElement.style.backgroundImage = 'url(\'' + pictureImage.src + '\')';
        newPictureElement.style.backgroundSize = '182px 182px';
        clearTimeout(imageLoadTimeout);
      };

      pictureImage.onerror = function() {
        console.log('onerror');
        newPictureElement.classList.add('picture-load-failure');
      };
    }
    document.querySelector('.filters').classList.remove('hidden');
  });

})();