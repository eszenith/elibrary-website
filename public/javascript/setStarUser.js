const stars = [];
for (var i = 1; i < 6; i++) {
    stars.push(document.querySelector(`.star${i}`));
}

var xhrUserStars = new XMLHttpRequest();
xhrUserStars.open('GET', `/star/user/${getCookie('bno')}`);
xhrUserStars.setRequestHeader("Authorization","Bearer "+getCookie('token'));
xhrUserStars.send(null);

xhrUserStars.onload = function () {
    var starsObj =JSON.parse(JSON.parse(xhrUserStars.responseText));
    markStarsUser(starsObj.starsno, false);
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

function markStarsUser(lim, sendFlag) {
    let i = 1;
    if(lim > 5) {
        lim = 5;
    }

    for (i = 1; i <= lim; i++) {
        stars[i-1].querySelector(".star-img").src = "images/cstar.png"
    }
    for (; i <= 5; i++) {
        stars[i-1].querySelector(".star-img").src = "images/star.png"
    }
    if (sendFlag) {
        dataToSend = { starsno: lim, bno: getCookie('bno'), uno: getCookie('uno') };
        $.ajax({
            type:"POST",
            url: "http://127.0.0.1:3000/star/userRating",
            beforeSend:function setHeaderAuth(xhr) {
                xhr.setRequestHeader("Authorization","Bearer "+getCookie('token'));
            },
            data: dataToSend,
        });
    }
}

function onStar1() {
    markStarsUser(1, true);
}

function onStar2() {
    markStarsUser(2, true);
}

function onStar3() {
    markStarsUser(3, true);
}

function onStar4() {
    markStarsUser(4, true);
}

function onStar5() {
    markStarsUser(5, true);
}