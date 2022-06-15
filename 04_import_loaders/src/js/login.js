import '../css/login.less';

function initLogin() {
    const oH2 = document.createElement('h2');
    oH2.innerHTML = 'Login title';
    oH2.className = 'login-title';
    document.body.appendChild(oH2);
}

initLogin();