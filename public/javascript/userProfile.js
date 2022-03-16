var xhrUser = new XMLHttpRequest();
xhrUser.open('GET', `/userData/`)
xhrUser.setRequestHeader("Authorization", "Bearer "+getCookie('token'));
xhrUser.send(null);

xhrUser.onload = function () {
    var userData = JSON.parse(JSON.parse(xhrUser.responseText));
    fillUserData(userData);
}

function fillUserData(userdata) {
    document.getElementById("uname").textContent = `${userdata.uname}`;
    document.getElementById("uage").textContent = `${userdata.uage}`;
    document.getElementById("uemail").textContent = `${userdata.umail}`;
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
