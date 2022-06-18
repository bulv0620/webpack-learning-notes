import './css/index.css';
import './js/print.js';



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