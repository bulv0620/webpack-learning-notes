import './css/index.css';

function createTitle() {
    const oH1 = document.createElement('h1');
    oH1.innerHTML = 'Learning webpack :)';
    oH1.className = 'title';
    document.getElementById('app').appendChild(oH1);
    return oH1;
}

createTitle()

const foo = () => {
    console.log('foo');
}

foo()

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
})

console.log(promise)