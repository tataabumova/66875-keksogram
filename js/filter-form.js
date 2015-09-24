(function() {
    var uploadForm = document.forms['upload-select-image'];
    var resizeForm = document.forms['upload-resize'];
    var filterForm = document.forms['upload-filter'];

    var previewImage = filterForm.querySelector('.filter-image-preview');
    var prevButton = filterForm['filter-prev'];
    var selectedFilter = filterForm['upload-filter'];

    var imageField = document.querySelector('.pictures');

    var filterMap;

    var restoreFormValueFromCookies = function () {

        if (docCookies.hasItem('upload-filter')) {
            selectedFilter.value = docCookies.getItem('upload-filter');
            setFilter();
        }
    };

    function setFilter() {
        if (!filterMap) {
            filterMap = {
                'none': 'filter-none',
                'chrome': 'filter-chrome',
                'sepia': 'filter-sepia'
            };
        }
        previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
    };

    for (var i = 0, l = selectedFilter.length; i < l; i++) {
        selectedFilter[i].onchange = function(evt) {
            setFilter();

        }
    }

    prevButton.onclick = function(evt) {
        evt.preventDefault();

        filterForm.classList.add('invisible');
        resizeForm.classList.remove('invisible');
    };

    filterForm.onsubmit = function(evt) {
        evt.preventDefault();

        uploadForm.classList.remove('invisible');
        filterForm.classList.add('invisible');

        docCookies.setItem('upload-filter', selectedFilter.value);

        var newImage = document.createElement('A');
        newImage.classList.add('picture');
        newImage.setAttribute('href', '#');
        newImage.innerHTML = '<img src=' + '"' + previewImage.src + '"' + ' width="182" height="182">';
        imageField.appendChild(newImage);

        filterForm.submit();
    };

    setFilter();
    restoreFormValueFromCookies();
})();