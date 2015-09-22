(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  //var toLeft = resizeForm['resize-x'];
  //var toTop = resizeForm['resize-y'];
  //var sizePicture = resizeForm['resize-size'];

  //var img_width = previewImage.width;
  //var img_height = previewImage.height;

  //if (img_width > img_height) {
  //  max_side = img_height;
  //} else {
  //  max_side = img_width;
  //}
  
  var minSide = Math.min(previewImage.width, previewImage.height);

  resizeForm['resize-x'].value = 0;
  resizeForm['resize-y'].value = 0;
  resizeForm['resize-size'].value = 100;

  resizeForm['resize-x'].onchange = function(evt) {
    resizeForm['resize-size'].max = minSide - parseInt(this.value, 10);
  };
  resizeForm['resize-y'].onchange = function(evt) {
    resizeForm['resize-size'].max = minSide - parseInt(this.value, 10);
  };
  resizeForm['resize-size'].onchange = function(evt) {
    resizeForm['resize-x'].max = minSide - parseInt(this.value, 10);
    resizeForm['resize-y'].max = minSide - parseInt(this.value, 10);
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