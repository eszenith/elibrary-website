const stars = [];
for (var i = 1; i < 6; i++) {
    stars.push(document.querySelector(`.star${i}`));
}

var xhrStars = new XMLHttpRequest();
xhrStars.open('GET', `star/book/${getCookie('bno')}`)
xhrStars.send(null);

function markStars(lim) {
    let i = 1;
    
    if (lim > 5) {
        lim = 5;
    }

    for (i = 1; i <= lim; i++) {
        stars[i-1].querySelector(".star-img").src = "images/cstar.png"
    }
    for (; i <= 5; i++) {
        stars[i-1].querySelector(".star-img").src = "images/star.png"
    }
}

xhrStars.onload = function () {
    var bookdata = JSON.parse(JSON.parse(xhrStars.responseText));
    document.getElementById("ratings").innerHTML = `${bookdata.noOfUser} Ratings`;
    markStars(bookdata.stars);
}
