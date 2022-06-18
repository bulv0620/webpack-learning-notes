import './css/index.css';
import { createApp }  from 'vue'
import App from './App.vue'
import createTitle from './js/print.js';
const app = createApp(App).mount('#app')


function createInputBox() {
    const oInput = document.createElement('input');
    oInput.type = 'text';
    oInput.className = 'input';
    document.getElementById('app').appendChild(oInput);
    return oInput;
}

createInputBox();

if(module.hot){
    module.hot.accept('./js/print.js', () => {
        console.log('print.js was updated');
    });
}

createTitle();