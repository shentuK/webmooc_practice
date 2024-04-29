const $allchefBox = document.querySelector('.allchefBox'); //厨师区域
const $addChef = document.getElementById('addChef'); //新增厨师
const $buyChefBox = document.querySelector('.buyChefBox'); //招聘新厨师信息框
const $buyChefConfirm = $buyChefBox.querySelector('.yesConfirm'); //确认招聘
const $noBuyChef = $buyChefBox.querySelector('.noConfirm'); //不招聘
const $chefNumber = document.getElementById('chefNumber'); // 招聘厨师数量
const $finishedBuyChefAlert = document.querySelector('.finishedBuyChefAlert'); // 招聘成功提示

const $fireChefBox = document.querySelector('.fireChefBox'); //解雇厨师信息框
const $fireChefConfirm = $fireChefBox.querySelector('.yesConfirm'); //确认解雇
const $noFireChef = $fireChefBox.querySelector('.noConfirm'); //不解雇
const $finishedFireChefAlert = document.querySelector('.finishedFireChefAlert'); // 解约成功
const $fireChefPay = document.getElementsByClassName('fireChefPay'); // 解约金
const $lackPayFireMoneyAlert = document.querySelector('.lackPayFireMoneyAlert'); // 解约金不足提示

let allChefs = []; // 当前拥有的厨师集
let fireMoney = 0; // 解约金

$addChef.addEventListener('click', addChef, false); // 点击新增厨师
$buyChefConfirm.addEventListener('click', buyChef, false); // 点击确认招聘
$noBuyChef.addEventListener('click', noBuyChef, false); // 不招聘
$fireChefConfirm.addEventListener('click', fireChefConfirm, false); // 点击确认解雇
$noFireChef.addEventListener('click', noFireChef, false); // 不解雇

// 厨师对象
class Chefs {
    constructor() {
        this.wages = 140;  // 周薪
        this.totalWorkDays = 0; // 当周工作天数
        this.state = 'free';
        this.cookDish = []; // 正在做的菜
        this.init();  // 初始化
        this.bindEvent();  // 添加解雇厨师点击事件
        allChefs.push(this);
    }
    init() {
        this.dom = document.createElement('div');
        this.dom.className = 'chefBox manIcon';
        this.dom.classList.add('chef-free');
        this.dom.innerHTML = `<img src="./images/iconfinder_Chef-2_379358.png" alt="">`;
    }
    bindEvent() {
        // 初始时显示解雇按钮
        this.fireChefdom = document.createElement('div');
        this.fireChefdom.className = 'fireChef';
        this.fireChefdom.innerText = '+';
        this.fireChefdom.addEventListener('click', () => { fireChef.call(this); }, false);
        this.dom.appendChild(this.fireChefdom);
    }
    // 空闲态
    free() {
        this.state = 'free';
        this.cookDish = []; // 正在做的菜
        this.dom.classList.replace('chef-finished', 'chef-free');
        this.dom.removeChild(this.dom.lastElementChild);
        this.dom.removeChild(this.dom.lastElementChild);
    }
    // 做菜态
    cooking() {
        // 样式
        this.state = 'cooking';
        this.dom.classList.replace('chef-free', 'chef-cooking');
        // 只要有凉菜和饮品，先做，没有的话就做主菜
        if (allOrderedDishes.some(dish => dish.type == '凉菜' || dish.type == '饮品')) {
            var needCookDishIndex = allOrderedDishes.findIndex(dish => dish.type == '凉菜' || dish.type == '饮品');
            var needCookDish = allOrderedDishes.splice(needCookDishIndex, 1)[0];
        } else {
            var needCookDish = allOrderedDishes.shift();
        }
        this.cookDish.push(needCookDish);
        money -= needCookDish.cost; // 减去菜的成本
        needCookDish.doing();
        this.dom.appendChild(needCookDish.chef_dish.dom);
        // 做的菜一做完，厨师的状态也会发生变化
        const timer = setInterval(() => {
            if (this.cookDish[0].chef_state == 'completed') {
                this.complete();
                clearInterval(timer);
            }
        }, 100);
    }
    // 完成态
    complete() {
        this.state = 'complete';
        this.dom.classList.replace('chef-cooking', 'chef-finished');
        const finishedIcon = document.createElement('div');
        finishedIcon.className = 'finishedIcon';
        finishedIcon.innerHTML = `<img src="./images/iconfinder_Food-Dome_379366.png" alt="">`;
        this.dom.appendChild(finishedIcon);
        // 只要没人要了就扔掉
        chefThrowFinishedDish.call(this);
    }
    // 解雇态
    firing() {
        $fireChefPay[1].innerText = fireMoney;
        $finishedFireChefAlert.style.display = 'block';
        setTimeout(() => {
            $finishedFireChefAlert.style.display = 'none';
        }, 3000);
        $allchefBox.removeChild(this.dom);
    }
}

// 招聘厨师
function addChef() {
    $blackShadow.style.display = 'block';
    $buyChefBox.style.display = 'block';
}

// 确认招聘
function buyChef() {
    $blackShadow.style.display = 'none';
    $buyChefBox.style.display = 'none';
    const chef = new Chefs();
    $allchefBox.insertBefore(chef.dom, $addChef);
    if (allChefs.length == 6) {
        $addChef.style.display = 'none';
    }
    if (allChefs.length != 1) {
        $chefNumber.innerText = allChefs.length;
        $finishedBuyChefAlert.style.display = 'block';
        setTimeout(() => {
            $finishedBuyChefAlert.style.display = 'none';
        }, 3000);
    }
}

// 不招聘
function noBuyChef() {
    $blackShadow.style.display = 'none';
    $buyChefBox.style.display = 'none';
}

// 解雇厨师
function fireChef() {
    fireMoney = Math.ceil(this.totalWorkDays / 7 * this.wages) + this.wages;
    $fireChefPay[0].innerText = fireMoney;
    $blackShadow.style.display = 'block';
    $fireChefBox.style.display = 'block';
    this.state = 'firing';
}

// 确认解雇
function fireChefConfirm() {
    for (let i = 0; i < allChefs.length; i++) {
        if (allChefs[i].state == 'firing') {
            // 解约金不够，则不能解雇
            if (fireMoney > money) {
                $lackPayFireMoneyAlert.style.display = 'block';
                setTimeout(() => {
                    $lackPayFireMoneyAlert.style.display = 'none';
                }, 3000);
                return;
            } else {
                money -= fireMoney;
            }
            // 解约金够则解雇
            allChefs[i].firing();
            allChefs.splice(i, 1);
            $addChef.style.display = 'block';
            $blackShadow.style.display = 'none';
            $fireChefBox.style.display = 'none';
        }
    }
}

// 不解雇
function noFireChef() {
    $blackShadow.style.display = 'none';
    $fireChefBox.style.display = 'none';
    for (let i = 0; i < allChefs.length; i++) {
        if (allChefs[i].state == 'firing') {
            allChefs[i].state = 'free';
            break;
        }
    }
}

// 是否可以解雇
function isFire() {
    for (let i = 0; i < allChefs.length; i++) {
        if (allChefs[i].state == 'free' && allChefs.length != 1) {
            allChefs[i].fireChefdom.style.display = 'block';
        } else {
            allChefs[i].fireChefdom.style.display = 'none';
        }
    }
}

// 安排厨师做菜
function arrangeChefCooking() {
    for (let i = 0; i < allChefs.length; i++) {
        if (allChefs[i].state == 'free' && allOrderedDishes.length != 0) {
            allChefs[i].cooking();
        }
    }
}

// 扔掉不吃的
function chefThrowFinishedDish() {
    let allTheDishes = [];
    for (let i = 0; i < customersOnTable.length; i++) {
        const hasThisDish = customersOnTable[i].orderedDishes.some(dish => dish.name == this.cookDish[0].name);
        if (hasThisDish) {
            allTheDishes.push(customersOnTable[i].orderedDishes.find(dish => dish.name == this.cookDish[0].name));
        }
    }
    const timer = setInterval(() => {
        if (this.state == 'complete') {
            if (allTheDishes.every(dish => dish.cus_state == 'destroy' || dish.cus_state == 'eatup')) {
                this.free();
                clearInterval(timer);
            }
        } else {
            clearInterval(timer);
        }
    }, 100);
}