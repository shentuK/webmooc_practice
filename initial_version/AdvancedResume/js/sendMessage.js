const $messageContent = document.getElementById('messageContent');
const $messageCon = document.getElementById('messagecon');
const $userName = document.getElementById('username');
const $sendBtn = document.getElementById('sendbtn');

let html = ``;
let order = -1;

// 发送留言
function sendMessage() {
    const messagecon = $messageCon.value;
    const username = $userName.value;
    if (messagecon == '' || username == '' || username.length > 5) {
        alert('留言内容和姓名不能为空，且姓名长度不能超过5');
        return;
    }
    $messageCon.value = '';
    $userName.value = '';
    // 生成每条消息
    const msgitem = `<div class="msgitem"><div class="profile"><div class="profilePhoto">${username[0]}</div><span class="nickname">${username}</span></div><textarea class="content" style='order:${(() => order = order == 1 ? -1 : 1)()}' disabled>${messagecon}</textarea></div>`;

    html += msgitem;

    $messageContent.innerHTML = html;
}

$sendBtn.addEventListener('click', sendMessage, false);