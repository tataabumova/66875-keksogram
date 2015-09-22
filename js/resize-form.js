(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var toLeft = resizeForm['resize-x'];
  var toTop = resizeForm['resize-y'];
  var sizePicture = resizeForm['resize-size'];

  var img_width = previewImage.width;
  var img_height = previewImage.height;

  var max_side;
  if (img_width > img_height) {
    max_side = img_height;
  } else {
    max_side = img_width;
  }

  toLeft.value = 0;
  toTop.value = 0;
  sizePicture.value = 100;

  toLeft.onchange = function(evt) {
    sizePicture.max = max_side - parseInt(toLeft.value, 10);

  };
  toTop.onchange = function(evt) {
    sizePicture.max = max_side - parseInt(toTop.value, 10);
  };
  sizePicture.onchange = function(evt) {
    toLeft.max = max_side - parseInt(sizePicture.value, 10);
    toTop.max = max_side - parseInt(sizePicture.value, 10);
  };

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();