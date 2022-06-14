import '../css/login.css';
import '../css/login.less';

function loginDom() {
    const oH2 = document.createElement('h2');
    oH2.innerHTML = '登录';
    oH2.className = 'login-title';
    document.body.appendChild(oH2);
}

loginDom();