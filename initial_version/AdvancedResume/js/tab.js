(function () {
    const $tab = document.getElementById('tab');
    const $tablis = $tab.getElementsByTagName('li');
    const $tabcons = document.getElementsByClassName('tabcon');

    // 切换tab
    function setExpStyle(e) {
        if (e.target.tagName.toLowerCase() == 'li') {
            const n = e.target.getAttribute('data-n');
            const $tabcon = document.querySelector('.tabcon[data-n=' + n + ']');
            for (let i = 0; i < 2; i++) {
                $tablis[i].className = '';
                $tabcons[i].className = 'tabcon';
            }
            e.target.className = 'current';
            $tabcon.className = 'tabcon show';
        }
    }

    $tab.addEventListener('click', setExpStyle, false);
})();