var xhrBook = new XMLHttpRequest();
xhrBook.open('GET', `/getBookData/${getCookie('bno')}`)
xhrBook.send(null);

var isBtn = document.getElementById("issueBtn");
if(getCookie("login") === 'yes') {
    checkIssue();
}

xhrBook.onload = function () {
    console.log("in onload");
    console.log(xhrBook.responseText);
    var bookdata = JSON.parse(JSON.parse(xhrBook.responseText));
    document.getElementById("bookTitle").innerHTML = bookdata.bname;
    document.getElementById("bookAuthor").innerHTML = `By ${bookdata.author}`;
    document.getElementById("bookDesc").innerHTML = bookdata.bdesc;
}

function setHeaderAuth(xhr) {
    xhr.setRequestHeader("Authorization","Bearer "+getCookie('token'));
}

function checkIssue() {
    /*$.post(`http://127.0.0.1:3000/checkIssue/${getCookie('uno')}/${getCookie('bno')}`, function (issueData) {
        var isData = JSON.parse(issueData);
        console.log(isData);
        if (isData.check === 'yes') {
            isBtn.innerHTML = "RETURN";
            isBtn.onclick = onReturn;
            isBtn.id= "returnBtn";
        }
        else {
            isBtn.innerHTML = "ISSUE";
            isBtn.onclick = onIssue;
            isBtn.id= "issueBtn";
        }
    }, "json");*/

    $.ajax({
        type:'POST',
        url:`http://127.0.0.1:3000/bookUserAct/checkIssue/${getCookie('bno')}`,
        beforeSend: setHeaderAuth,
        success: function (issueData) {
            var isData = JSON.parse(issueData);
            console.log(isData);
            if (isData.check === 'yes') {
                isBtn.innerHTML = "RETURN";
                isBtn.onclick = onReturn;
                isBtn.id= "returnBtn";
            }
            else {
                isBtn.innerHTML = "ISSUE";
                isBtn.onclick = onIssue;
                isBtn.id= "issueBtn";
            }
        }
    });
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

function onIssue() {
    /*console.log(`http://127.0.0.1:3000/issueBook/${getCookie('uno')}/${getCookie('bno')}`);
    $.post(`http://127.0.0.1:3000/issueBook/${getCookie('uno')}/${getCookie('bno')}`, function () {
        console.log("post returned"+checkIssue());
        //checkissue returning undefined
        checkIssue();
    });*/

    $.ajax({
        type:'POST',
        url:`http://127.0.0.1:3000/bookUserAct/issueBook/${getCookie('bno')}`,
        beforeSend: setHeaderAuth,
        success: function () {
            //console.log("post returned"+checkIssue());
            checkIssue();
        }
    });

}

function onReturn() {
    /*$.post(`http://127.0.0.1:3000/returnBook/${getCookie('uno')}/${getCookie('bno')}`, function () {
        checkIssue();
    });*/

    $.ajax({
        type:'POST',
        url:`http://127.0.0.1:3000/bookUserAct/returnBook/${getCookie('bno')}`,
        beforeSend: setHeaderAuth,
        success: function () {
            //console.log("post returned"+checkIssue());
            checkIssue();
        }
    });
}

function userAndBookData() {
    console.log(JSON.stringify({ 'uno': getCookie('uno'), 'bno': getCookie('bno') }));
    return JSON.stringify({ 'uno': getCookie('uno'), 'bno': getCookie('bno') });
}

