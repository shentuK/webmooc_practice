const $hearts = document.querySelectorAll('.programpics span');

let pos = 0;  // 0表示红心隐藏

// 点赞红心出现效果
function changeHeartToRed() {
    const $redheart = this.querySelector('.redheart');
    if (pos == 0) {
        $redheart.style.visibility = 'visible';
        pos = 1;
    } else {
        $redheart.style.visibility = 'hidden';
        pos = 0;
    }
}

for (let i = 0; i < $hearts.length; i++) {
    $hearts[i].addEventListener('click', changeHeartToRed, false);
}
