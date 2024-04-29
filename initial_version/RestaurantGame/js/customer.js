const customersName = ['zhao', 'qian', 'sun', 'li', 'zhou', 'wu', 'zheng']; // 顾客姓名
const customersImg = ['379339-512.png', '379444-512.png', '379446-512.png', '379448-512.png', 'iconfinder_Boss-3_379348.png', 'iconfinder_Man-16_379485.png', 'iconfinder_Rasta_379441.png']; // 顾客头像
const $waitingQueue = document.querySelector('.waitingQueue'); // 等待队列
const $tableBoxs = document.querySelectorAll('.tableBox'); // 所有餐桌

const $orderDishesMenuBox = document.querySelector('.orderDishesMenuBox'); // 菜单
const $allDishesOnMenu = $orderDishesMenuBox.getElementsByTagName('input');  // 菜单上的所有菜
const $orderMan = $orderDishesMenuBox.querySelector('.orderMan'); // 点菜人
const $orderManName = document.getElementById('orderManName'); // 点餐人姓名
const $orderMantotalPrice = document.getElementById('orderMantotalPrice'); // 点餐人的总价格
const $orderDishesConfirm = $orderDishesMenuBox.querySelector('.yesConfirm'); // 完成点菜
const $noOrderDishes = $orderDishesMenuBox.querySelector('.noConfirm'); // 不点了

const $finishedOrderAlert = document.querySelector('.finishedOrderAlert'); // 完成点餐提示框
const $finishedOrderMan = document.getElementById('finishedOrderMan'); // 完成点餐人姓名

const $disappointedAlert = document.querySelector('.disappointedAlert'); // 失望离开提示框
const $disappointedCus = document.getElementById('disappointedCus'); // 失望离开顾客姓名

const $finishedPayAlert = document.querySelector('.finishedPayAlert'); // 结账提示框
const $finishedPayCus = document.getElementById('finishedPayCus'); // 结账顾客姓名
const $finishedPay = document.getElementById('finishedPay'); // 结账顾客支出

let freeCustomers = []; // 空闲顾客
let nowWaitingCustomers = []; // 等待队列顾客
let customersOnTable = []; // 入座顾客

$waitingQueue.addEventListener('click', orderDishes, false); // 入座
$orderDishesConfirm.addEventListener('click', orderDishesConfirm, false); // 确认菜单
$noOrderDishes.addEventListener('click', noOrderDishes, false); // 不吃了

// 顾客对象
class Customers {
    constructor(name, headImg, time) {
        this.name = name; // 姓名
        this.headImg = headImg; // 头像
        this.waitingTime = time; // 排队时间
        this.orderedDishes = []; // 已点的菜
        this.willEatDishes = []; // 待吃的菜
        this.totalPrice = 0; // 菜的总价
        this.state = 'free';  // 状态
        this.init(); // 初始化
        freeCustomers.push(this);
    }
    init() {
        this.dom = document.createElement('div');
        this.dom.className = 'waitCustomerBox manIcon';
        this.dom.innerHTML = `<img src='./images/${this.headImg}' alt=''>`;
    }
    // 空闲
    free() {
        this.state = 'free';
        this.orderedDishes = [];
        this.totalPrice = 0;
        this.init(); // 初始化
        freeCustomers.push(this);
    }
    // 排队
    waiting() {
        this.state = 'waiting';
        this.dom.classList.add('customer-waiting');
        const waitingProgress = new Progress(this, 'waitingBar', '等位中', '#7591c5', '#2166c0', this.waitingTime);
        this.dom.appendChild(waitingProgress.dom);
        $waitingQueue.insertBefore(this.dom, $waitingQueue.firstElementChild);
        nowWaitingCustomers.push(this);
    }
    // 点餐
    ordering() {
        this.state = 'ordering';
        $orderMan.innerHTML = `<img src='./images/${this.headImg}' alt=''>`;
        $orderManName.innerText = this.name;
        updateOrderDishes.call(this);
    }
    // 等餐
    seating() {
        this.state = 'seating';
        $finishedOrderMan.innerText = this.name;
        $finishedOrderAlert.style.display = 'block';
        setTimeout(() => {
            $finishedOrderAlert.style.display = 'none';
        }, 3000);
        this.dom.classList.replace('customer-waiting', 'customer-seating');
        this.orderDishesQueue = document.createElement('div');
        this.orderDishesQueue.className = 'orderDishesQueue';
        // 将菜品挂在顾客旁
        for (let i = 0; i < this.orderedDishes.length; i++) {
            this.orderedDishes[i].ordered();
            this.orderDishesQueue.appendChild(this.orderedDishes[i].cus_dish.dom);
        }
        this.dom.appendChild(this.orderDishesQueue);
    }
    // 进餐
    eating() {
        this.state = 'eating';
        this.dom.classList.replace('customer-seating', 'customer-eating');
    }
    // 支付
    pay() {
        this.state = 'finished';
        // 可能是这个菜吃完就支付，也可能是超时后支付（不能全是超时）
        if (this.dom.className.includes('customer-eating')) {
            this.dom.classList.replace('customer-eating', 'customer-checkout');
        } else {
            this.dom.classList.replace('customer-seating', 'customer-checkout');
        }
        const payIcon = document.createElement('div');
        payIcon.className = 'payIcon';
        payIcon.innerHTML = `<img src="./images/iconfinder_Euro-Coin_379523.png" alt="">`;
        payIcon.addEventListener('click', () => {
            this.leave();
        }, false);
        this.dom.appendChild(payIcon);
        // 一段时间后自行离开
        setTimeout(() => {
            if (this.state == 'finished') {
                this.leave();
            }
        }, 7000);
    }
    // 生气
    angry() {
        this.state = 'angry';
        this.dom.classList.replace('customer-seating', 'customer-timeout');
        const appeaseIcon = document.createElement('div');
        appeaseIcon.className = 'appeaseIcon';
        appeaseIcon.innerHTML = `<img src='./images/iconfinder_Instagram_UI-07_2315589.png' alt="">`;
        appeaseIcon.addEventListener('click', () => {
            this.leave();
        }, false);
        this.dom.appendChild(appeaseIcon);
    }
    // 离开餐厅
    leave() {
        // 未被接待-离开
        if (this.state == 'waiting') {
            $waitingQueue.removeChild(this.dom);
            nowWaitingCustomers.shift();
        }
        // 点餐时不吃了离开
        if (this.state == 'ordering') {
            this.dom.remove();
            customersOnTable.pop();
            tableNum++;
        }
        // 所有菜超时生气后安抚离开 
        if (this.state == 'angry') {
            for (let i = 0; i < customersOnTable.length; i++) {
                if (customersOnTable[i] == this) {
                    customersOnTable.splice(i, 1);
                    this.dom.remove();
                    tableNum++;
                    break;
                }
            }
            $disappointedCus.innerText = this.name;
            $disappointedAlert.style.display = 'block';
            setTimeout(() => {
                $disappointedAlert.style.display = 'none';
            }, 3000);
        }
        // 吃完结账离开
        if (this.state == 'finished') {
            // 只出吃掉的菜钱
            this.orderedDishes.forEach(dish => {
                if (dish.cus_state == 'destroy') {
                    this.totalPrice -= dish.price;
                }
            });
            money += this.totalPrice;
            for (let i = 0; i < customersOnTable.length; i++) {
                if (customersOnTable[i] == this) {
                    customersOnTable.splice(i, 1);
                    this.dom.remove();
                    tableNum++;
                    break;
                }
            }
            $finishedPayCus.innerText = this.name;
            $finishedPay.innerText = this.totalPrice;
            $finishedPayAlert.style.display = 'block';
            setTimeout(() => {
                $finishedPayAlert.style.display = 'none';
            }, 3000);
        }
        this.free();
    }
}

// 初始化顾客
function initCustomer() {
    for (let i = 0; i < 7; i++) {
        new Customers(customersName[i], customersImg[i], 35);
    }
}

// 进餐馆排队
function enter() {
    // 只有处于空闲状态的顾客才进餐馆
    for (let i = 0, len = freeCustomers.length; i < len; i++) {
        const time = Math.random() * 3;
        // 实现不同时间进入排队序列
        setTimeout(() => {
            const n = parseInt(Math.random() * freeCustomers.length);
            if (nowWaitingCustomers.length < 5) {
                // 只要还有位子排队，那么就去排
                freeCustomers[n].waiting();
                freeCustomers.splice(n, 1);
            }
            // 排队中人数已满，有新顾客来不再进入
        }, time * 1000);
    }
}

// 入座点餐
function orderDishes() {
    // 有座且有排队顾客
    if (tableNum > 0 && nowWaitingCustomers.length != 0) {
        // 找座
        for (let i = 0; i < $tableBoxs.length; i++) {
            // 找到一个空座
            if (!$tableBoxs[i].hasChildNodes()) {
                // 接待入座
                customersOnTable.push(nowWaitingCustomers[0]);
                $tableBoxs[i].appendChild(nowWaitingCustomers[0].dom); // 将排队顾客接待到座位上-移动节点
                nowWaitingCustomers[0].dom.lastElementChild.remove();
                nowWaitingCustomers[0].dom.classList.replace('waitCustomerBox', 'customerOntable');
                nowWaitingCustomers.shift();
                tableNum--;
                break;
            }
        }
        // 点餐
        customersOnTable[customersOnTable.length - 1].ordering(); // 最后上座的顾客开始点餐
        $blackShadow.style.display = 'block';
        $orderDishesMenuBox.style.display = 'block';
        // 餐厅运行时间停止
        timer = false;
    }
}

// 顾客更新菜单
function updateOrderDishes() {
    let liangcai = 0;
    let zhucai = 0;
    let yinpin = 0;
    for (let i = 0; i < $allDishesOnMenu.length; i++) {
        $allDishesOnMenu[i].onchange = () => {
            if (this.state == 'ordering') {
                if ($allDishesOnMenu[i].checked) {
                    this.totalPrice += Number($allDishesOnMenu[i].dataset.price);
                    switch ($allDishesOnMenu[i].name) {
                        case 'liangcai':
                            liangcai++;
                            break;
                        case 'zhucai':
                            zhucai++;
                            break;
                        case 'yinpin':
                            yinpin++;
                            break;
                    }
                } else {
                    this.totalPrice -= Number($allDishesOnMenu[i].dataset.price);
                    switch ($allDishesOnMenu[i].name) {
                        case 'liangcai':
                            liangcai--;
                            break;
                        case 'zhucai':
                            zhucai--;
                            break;
                        case 'yinpin':
                            yinpin--;
                            break;
                    }
                }
            }
            $orderMantotalPrice.innerText = this.totalPrice;
            if (zhucai == 1 && liangcai <= 1 && yinpin <= 1) {
                $orderDishesConfirm.classList.remove('noOrderDishes');
            } else {
                $orderDishesConfirm.classList.add('noOrderDishes');
            }
        };
    }
}

// 点好等菜
function orderDishesConfirm() {
    // 清空菜单状态
    $orderDishesConfirm.classList.add('noOrderDishes');
    $orderMantotalPrice.innerText = 0;
    for (let i = 0; i < $allDishesOnMenu.length; i++) {
        if ($allDishesOnMenu[i].checked) {
            const theDish = getDish.call(customersOnTable[customersOnTable.length - 1], $allDishesOnMenu[i].value);
            allOrderedDishes.push(theDish);
            customersOnTable[customersOnTable.length - 1].orderedDishes.push(theDish);
        }
        $allDishesOnMenu[i].onchange = null;
        $allDishesOnMenu[i].checked = false;
    }
    $blackShadow.style.display = 'none';
    $orderDishesMenuBox.style.display = 'none';
    // 等餐
    customersOnTable[customersOnTable.length - 1].seating();
    // 餐厅时间开始运行
    timer = true;
}

// 不吃了
function noOrderDishes() {
    // 清空菜单状态
    $orderDishesConfirm.classList.add('noOrderDishes');
    $orderMantotalPrice.innerText = 0;
    for (let i = 0; i < $allDishesOnMenu.length; i++) {
        $allDishesOnMenu[i].onchange = null;
        $allDishesOnMenu[i].checked = false;
    }
    // 离开餐厅
    customersOnTable[customersOnTable.length - 1].leave();
    $blackShadow.style.display = 'none';
    $orderDishesMenuBox.style.display = 'none';
    // 餐厅时间开始运行
    timer = true;
}

// 生气没有被安抚，待到当天结束后离开
function angryCusLeave() {
    for (let i = 0; i < customersOnTable.length; i++) {
        if (customersOnTable[i].state == 'angry') {
            customersOnTable[i].leave();
            i--;
        }
    }
}