// 进度条的样式
class Progress {
    constructor(instance, stylename, context, startColor, endColor, time) {
        this.owner = instance;
        this.stylename = stylename;
        this.context = context;
        this.startColor = startColor;
        this.endColor = endColor;
        this.time = time;
        this.pos = 0;
        this.eatTimer = true;
        this.init();
        this.bindEvent();
        this.timer();
    }
    init() {
        this.dom = document.createElement('div');
        this.dom.classList.add(this.stylename, 'shade');
        this.dom.innerText = this.context;
    }
    bindEvent() {
        this.serveIcon = document.createElement('img');
        this.serveIcon.src = './images/iconfinder_Food-Dome_379366.png';
        this.serveIcon.className = 'serveIcon';
        this.serveIcon.style.display = 'none';
        this.serveIcon.addEventListener('click', () => {
            serving.call(this);
        }, false);
        this.dom.appendChild(this.serveIcon);
    }
    timer() {
        this.dom.style.backgroundColor = this.startColor;
        this.timer = setInterval(() => {
            this.dom.style.backgroundImage = `linear-gradient(to right,${this.endColor} ${this.pos}%, ${this.startColor} ${this.pos}%)`;
            if (timer && this.eatTimer) {
                this.pos++;
            }
            if (this.pos > 100) {
                // 顾客排队
                if (this.owner.state == 'waiting') {
                    this.owner.leave();
                }
                // 完成做菜
                if (this.owner.cookingTime == this.time && this.owner.chef_state == 'doing') {
                    this.owner.completed();
                }
                // 吃完菜
                if (this.owner.eatingTime == this.time && this.owner.cus_state == 'eating') {
                    this.owner.eatup();
                }
                // 等菜超时
                if (this.owner.waitingTime == this.time && this.owner.cus_state == 'ordered') {
                    this.owner.destroy();
                }
                clearInterval(this.timer);
            }
        }, this.time * 10);
    }
}