import img from '../img/logo.png';
import '../css/loadImg.css'

function createImgElement(){
    const oElm = document.createElement('div');
    oElm.className = 'img-div';
    
    const oImg = document.createElement('img');
    oImg.className = 'img-div-img';
    oImg.src = img;
    oImg.width = 200

    oElm.appendChild(oImg);
    return oElm
}

function createBgDiv() {
    const oElm = document.createElement('div');
    oElm.className = 'bg-div';
    
    return oElm;
}

document.body.appendChild(createImgElement());
document.body.appendChild(createBgDiv())