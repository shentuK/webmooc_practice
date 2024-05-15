let dishList = [
    {
        type: '凉菜',
        name: '凉菜SAN',
        cost: 3,
        price: 6,
        cookingTime: 4,
        waitingTime: 10,
        eatingTime: 6
    },
    {
        type: '凉菜',
        name: '冷切DOM',
        cost: 2,
        price: 4,
        cookingTime: 4,
        waitingTime: 10,
        eatingTime: 6
    },
    {
        type: '主菜',
        name: 'UL炖LI',
        cost: 5,
        price: 12,
        cookingTime: 6,
        waitingTime: 18,
        eatingTime: 8
    },
    {
        type: '主菜',
        name: '红烧HEAD',
        cost: 6,
        price: 15,
        cookingTime: 6,
        waitingTime: 18,
        eatingTime: 8
    },
    {
        type: '主菜',
        name: '酥炸ECharts',
        cost: 7,
        price: 18,
        cookingTime: 6,
        waitingTime: 18,
        eatingTime: 8
    },
    {
        type: '主菜',
        name: '炙烤CSS',
        cost: 6,
        price: 16,
        cookingTime: 6,
        waitingTime: 18,
        eatingTime: 8
    },
    {
        type: '主菜',
        name: '清蒸DIV',
        cost: 4,
        price: 12,
        cookingTime: 6,
        waitingTime: 18,
        eatingTime: 8
    },
    {
        type: '饮品',
        name: '鲜榨flex',
        cost: 2,
        price: 5,
        cookingTime: 4,
        waitingTime: 10,
        eatingTime: 4
    },
    {
        type: '饮品',
        name: '小程序奶茶',
        cost: 2,
        price: 6,
        cookingTime: 4,
        waitingTime: 10,
        eatingTime: 4
    },
];

let allDishes = []; // 所有菜集
let allOrderedDishes = []; // 所有待做的菜

// 菜对象
class Dishes {
    constructor(instance, type, name, cost, price, cookingTime, waitingTime, eatingTime) {
        this.owner = instance;
        this.type = type; // 类型
        this.name = name; // 菜名
        this.cost = cost; // 成本
        this.price = price; // 价格
        this.cookingTime = cookingTime; // 烹饪时间
        this.waitingTime = waitingTime; // 等餐时间
        this.eatingTime = eatingTime; // 用餐时间
        allDishes.push(this);
    }
    // 顾客已下单，等待厨师接单
    ordered() {
        this.cus_state = 'ordered';
        this.cus_dish = new Progress(this, 'dishesBar', this.name, '#e22f29', '#8f0707', this.waitingTime);
    }
    // 厨师已接单，正在做菜
    doing() {
        this.chef_state = 'doing';
        this.chef_dish = new Progress(this, 'cookingBar', this.name, '#e67d54', '#b44d08', this.cookingTime);
    }
    // 厨师已做完，等待顾客接单---
    completed() {
        this.chef_state = 'completed';
        this.chef_dish.dom.style.backgroundImage = ``;
        this.chef_dish.dom.style.backgroundColor = '#947de6';
    }
    // 顾客已接单，等待被顾客食用
    waitingEat() {
        this.cus_state = 'waitingEat';
        this.cus_dish.startColor = '#e67d54';
        this.cus_dish.endColor = '#cc5405';
        this.cus_dish.time = this.eatingTime;
        this.cus_dish.pos = 0;
    }
    // 正在被顾客食用
    eating() {
        this.cus_state = 'eating';
    }
    // 已被顾客吃完
    eatup() {
        this.cus_state = 'eatup';
        this.cus_dish.dom.style.backgroundImage = ``;
        this.cus_dish.dom.style.backgroundColor = '#0d9c0d';
        // 顾客样式自检
        setCusStyle.call(this);
    }
    // 等待时间已超时
    destroy() {
        this.cus_state = 'destroy';
        this.cus_dish.dom.style.backgroundImage = ``;
        this.cus_dish.dom.style.backgroundColor = '#250707';
        this.cus_dish.dom.style.textDecoration = 'line-through';
        this.cus_dish.serveIcon.style.display = 'none';
        // 当厨师还没做这个菜，就不做了，从待做菜里移除
        for (let i = 0; i < allOrderedDishes.length; i++) {
            if (allOrderedDishes[i] == this) {
                allOrderedDishes.splice(i, 1);
            }
        }
        // 所有菜超时顾客生气
        const isAllDestroy = this.owner.orderedDishes.every(dish => dish.cus_state == 'destroy');
        if (isAllDestroy) {
            this.owner.angry();
        } else if (this.owner.orderedDishes.every(dish => dish.cus_state == 'destroy' || dish.cus_state == 'eatup')) {
            this.owner.pay();  // 是从等餐态变为支付态
        }
    }
}

// 得到菜实例
function getDish(name) {
    for (let i = 0; i < dishList.length; i++) {
        if (dishList[i].name == name) {
            const data = Object.values(dishList[i]);
            return new Dishes(this, data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
        }
    }
}

// 能否上菜
function dishesFinished() {
    allChefs.forEach(chef => {
        if (chef.state == 'complete') {
            // 厨师做完后，希望只要有这个菜的，就能够上菜，不需要对应的那个顾客
            for (let i = 0; i < customersOnTable.length; i++) {
                customersOnTable[i].orderedDishes.forEach(dish => {
                    if (dish.name == chef.cookDish[0].name && dish.cus_state == 'ordered') {
                        dish.cus_dish.serveIcon.style.display = 'block';
                    }
                });
            }
        }
    })
}

// 上菜
function serving() {
    // 实现串行吃菜
    this.owner.owner.willEatDishes.push(this.owner);
    this.serveIcon.style.display = 'none';
    this.owner.waitingEat();
    // 有这个菜的厨师直接上
    allChefs.find(chef => chef.state == 'complete' && chef.cookDish[0].name == this.owner.name).free();
    // 需要将已点击上菜按钮的也就是待吃的菜放进一个队列，先进先吃
    // 点击上菜按钮，只需要检测是否有其他菜正在吃，如果再吃，就等待
    if (this.owner.owner.orderedDishes.some(dish => dish.cus_state == 'eating')) {
        this.eatTimer = false;
    } else {
        this.owner.eating();
        this.owner.owner.willEatDishes.shift();
        this.owner.owner.eating();
    }
    // 其他没有得到这个菜的隐藏按钮
    for (let i = 0; i < customersOnTable.length; i++) {
        customersOnTable[i].orderedDishes.forEach(dish => {
            if (dish.name == this.owner.name && dish.cus_state == 'ordered') {
                dish.cus_dish.serveIcon.style.display = 'none';
            }
        });
    }
}

// 每个菜吃完，检测 有吃的就让它吃，没吃的有等餐的就等，都没有就支付态
function setCusStyle() {
    if (this.owner.willEatDishes.length) {
        const eatingDish = this.owner.willEatDishes.shift();
        eatingDish.cus_dish.eatTimer = true;
    } else if (this.owner.orderedDishes.some(dish => dish.cus_state == 'ordered')) {
        this.owner.dom.classList.replace('customer-eating', 'customer-seating');
    } else {
        // 要么是超时要么是吃完
        this.owner.pay();
        // 是从吃完菜变为支付态
    }
}
