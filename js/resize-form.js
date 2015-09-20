//(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var toLeft = resizeForm['resize-x'];
  var toTop = resizeForm['resize-y'];
  var sizePicture = resizeForm['resize-size'];

  var MAX_SIZE = 582;
  //var MAX_TO_TOP = 281;
  //var MAX_TO_LEFT = 281;

  toLeft.value = 291;
  toTop.value = 291;
  sizePicture.value = 291;

  toLeft.onchange = function(evt) {
    sizePicture.max = parseInt(MAX_SIZE - parseInt(toLeft.value, 10));
  };
  toTop.onchange = function(evt) {
    sizePicture.max = parseInt(MAX_SIZE - parseInt(toTop.value, 10));
  };
  sizePicture.onchange = function(evt) {
    toLeft.max = parseInt(MAX_SIZE - parseInt(sizePicture.value, 10));
    toTop.max = parseInt(MAX_SIZE - parseInt(sizePicture.value, 10));
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
    //filterForm.elements['filter-image-src'] = previewImage.classList;


    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
//})();