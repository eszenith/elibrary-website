const playBtns = document.querySelectorAll(".playBtn");

if (getCookie("token")) {
    for(let i =0;i<playBtns.length;i++) {
        playBtns[i].addEventListener('click', changeImg);
    }
}

else {
    for(let i =0;i<playBtns.length;i++) {
        playBtns[i].addEventListener('click', giveMessageNeg);
    }
}

function giveMessageNeg() {
    console.log("inscript");
    const audCont = document.querySelector(".books-cont");
    var negMes = document.createElement("div");
    negMes.id = "neg-cont";
    negMes.innerHTML = `<p class="neg-mes">You need an account use this feature</p>`;
    if(document.getElementById("neg-cont")) {
        document.getElementById("neg-cont").remove();
    }
    audCont.prepend(negMes);
}


function changeImg(event) {
    var btn = event.target;
    if(btn.tagName === "IMG") {
        btn = btn.parentElement;
    }
    if (btn.classList.contains("play")) {
        btn.querySelector("img").src = 'images/pause2.png';
        btn.classList.remove("play");
        btn.classList.add("pause");
        /*playerEl = getElementById("audplayer");
          playerEl.play(); */
    }
    else {
        btn.querySelector("img").src = 'images/play3.png';
        btn.classList.remove("pause");
        btn.classList.add("play");
        /*playerEl = getElementById("audplayer");
          playerEl.pause(); */
    }

}

function getCookie(ckey) {
    var cookieData = document.cookie.split('; ');
    var obj = {};
    for (var data of cookieData) {
        var dataSplit = data.split('=');
        obj[dataSplit[0]] = decodeURIComponent(dataSplit[1]);
    }
    if (ckey in obj) {
        return obj[ckey];
    }
    else {
        return null;
    }
}

