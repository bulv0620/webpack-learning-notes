console.log("hello, I'm learning webpack HMRR!");

function createTitle() {
    const oH1 = document.createElement('h1');
    oH1.innerHTML = 'Learning webpack :))';
    oH1.className = 'title';
    document.getElementById('app').appendChild(oH1);
    return oH1;
}

createTitle();