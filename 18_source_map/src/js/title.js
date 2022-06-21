import '../css/title.css'

function createTitle(text){
    const oH1 = document.createElement('h1');
    oH1.innerText = text;
    oH1.className = 'title';

    return oH1
}

document.body.appendChild(createTitle('Learning webpack :)'));