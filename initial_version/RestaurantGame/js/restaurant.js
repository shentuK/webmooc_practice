const $blackShadow = document.querySelector('.blackShadow'); // 遮罩
const $gameBeginBox = document.getElementById('gameBeginBox'); // 开始游戏框
const $gamePlay = document.getElementById('gamePlay');  // 开始游戏按钮
const $dateWeek = document.getElementById('dateWeek');  // 周
const $dateDay = document.getElementById('dateDay');  // 天
const $money = document.getElementById('money');  // 金钱 

const $allInfoAlert = document.querySelector('.allInfoAlert'); // 提示信息框
const $freeTableAlert = document.querySelector('.freeTableAlert'); // 空位信息提示框

let timer = false; // 时间器
let week = 1;
let day = 1;
let seconds = 0;
let money = 500; // 金钱数
let tableNum = 4; // 餐桌数

$gamePlay.addEventListener('click', init, false); // 点击开始游戏
$allInfoAlert.addEventListener('click', allInfoAlert, false); // 点击提示框消失

// 游戏开始
function init() {
    timer = true;
    $blackShadow.style.display = 'none';
    $gameBeginBox.style.display = 'none';
    $freeTableAlert.style.display = 'block';
    setTimeout(() => {
        $freeTableAlert.style.display = 'none';
    }, 3000);

    buyChef();  // 初始化一个厨师
    initCustomer(); // 初始化所有顾客
    enter(); //顾客进餐馆排队
    setInterval(chronograph, 100);  // 计时开始: 48s为一天
}

// 每天一次
function everyDay() {
    // 厨师当周工作天数加一
    for (let i = 0; i < allChefs.length; i++) {
        allChefs[i].totalWorkDays++;
    }
    // 生气顾客没有被安抚，待到一天结束后离开
    angryCusLeave();
    // 每天空闲的顾客随机进餐馆排队
    enter();
}

// 每周一次
function everyWeek() {
    // 支付厨师的这一周的工资
    for (let i = 0; i < allChefs.length; i++) {
        const sallery = Math.ceil(allChefs[i].totalWorkDays / 7 * allChefs[i].wages);
        money -= sallery;
        allChefs[i].totalWorkDays = 0; // 当周工作时间清0
    }
}

// 计时
function chronograph() {
    if (timer) {
        seconds++;
        $dateWeek.innerText = week;
        $dateDay.innerText = day;
        $money.innerText = money;
        isFire(); // 厨师是否可解雇
        arrangeChefCooking(); // 安排厨师做菜
        dishesFinished(); // 上菜
    }

    if (seconds >= 480) {
        day++;
        seconds = 0;
        everyDay();
    }
    if (day > 7) {
        week++;
        day = 1;
        everyWeek();
    }
}

// 点击提示框消失
function allInfoAlert(e) {
    if (e.target.tagName.toLowerCase() == 'div') {
        e.target.style.display = 'none';
    }
}