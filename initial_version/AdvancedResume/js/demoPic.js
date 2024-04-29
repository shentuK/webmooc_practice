window.onresize = function () {
    (function () {
        var divs = document.getElementsByClassName('demopic');
        for (var i = 1; i < divs.length; i += 2) {
            var div = divs[i];
            var width = window.getComputedStyle(div).width;
            div.style.height = width;
            if (parseFloat(width) < 20)
                div.style.visibility = 'hidden';
            else
                div.style.visibility = 'visible';
        }
    })();
}
