# webmooc_practice
WebMooc《高级简历》和《餐厅游戏》项目的前端开发实战练习

需求文档详见[高级简历](https://github.com/jay007wong/webmooc-practice/blob/master/practice_chs/advancedresume.md) [餐厅游戏](https://github.com/jay007wong/webmooc-practice/blob/master/practice_chs/restaurant.md)

## 初版（initial_version）

### 要求

不使用任何框架和类库，以现有能力进行前端实践，使用HTML/CSS/原生JS完成项目开发。

### 反馈的问题

**《高级简历》作业：**

1.	频繁使用浮动布局，使得需要时刻注意是否造成高度塌陷而要清除浮动，没有结合其他布局方案来简化和优化布局；
    - 结合使用flex布局、网格布局等

2.	CSS选择器的层级过深，嵌套太多复杂的选择器；
    - 尽量减少嵌套层级，尽量提取公共部分

3.	sendMessage.js中DOM元素数量过多，一个一个DOM创建没有必要，并且函数体过长；
    - 减少DOM操作次数，使用模板字符串

4.	获取dom元素时使用querySelector/querySelectorAll（选择器嵌套过多）获取，性能不如通过id来获取单个元素,不如直接通过元素本身的className获取；

5.	js代码风格没有保持一致；
   
**《餐厅游戏》作业：**

1.	整体代码复杂度过高，不够简洁和优雅，技术设计上比较冗余；

2.	面向对象，但直接对DOM的读取和修改太多，希望的是尽量减少；

