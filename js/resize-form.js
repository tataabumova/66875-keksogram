(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var minSide = function(){
    return(Math.min(previewImage.width, previewImage.height));
  };

  resizeForm['resize-x'].value = 0;
  resizeForm['resize-y'].value = 0;
  resizeForm['resize-size'].value = 100;

  resizeForm['resize-x'].min = 0;
  resizeForm['resize-y'].min = 0;
  resizeForm['resize-size'].min = 0;

  resizeForm['resize-x'].onchange = function(evt) {
    resizeForm['resize-size'].max = minSide() - parseInt(this.value, 10);
    this.max = minSide();

  };
  resizeForm['resize-y'].onchange = function(evt) {
    resizeForm['resize-size'].max = minSide() - parseInt(this.value, 10);
    this.max = minSide();
  };
  resizeForm['resize-size'].onchange = function(evt) {
    resizeForm['resize-x'].max = minSide() - parseInt(this.value, 10);
    resizeForm['resize-y'].max = minSide() - parseInt(this.value, 10);
    this.max = minSide();
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