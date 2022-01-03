var xhrUser = new XMLHttpRequest();
xhrUser.open('GET', `/getUserData/`)
xhrUser.setRequestHeader("Authorization", "Bearer "+getCookie('token'));
xhrUser.send(null);

xhrUser.onload = function () {
    console.log(xhrUser.responseText);
    var userData = JSON.parse(JSON.parse(xhrUser.responseText));
    console.log(userData);
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
    console.log(JSON.stringify(obj));
    if (ckey in obj) {
        return obj[ckey];
    }
    else {
        return null;
    }
}
