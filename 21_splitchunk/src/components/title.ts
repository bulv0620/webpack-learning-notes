import '../css/title.css';

function createTitle(title: string): HTMLElement {
    const oH1: HTMLElement = document.createElement('h1');
    oH1.innerText = title;
    oH1.className = 'title';
    return oH1;
}

document.body.appendChild(createTitle('Learning webpack :)'));
