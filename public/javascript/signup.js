$(function () {

    function checkAccount() {
        var cookieData = document.cookie.split('; ');
        var obj = {};
        for (var data of cookieData) {
            // further strips key=value string into key value pair
            var dataSplit = data.split('=');
            obj[dataSplit[0]] = decodeURIComponent(dataSplit[1]);
        }
        if ('register' in obj) {
            var accountCont = document.querySelector(".account-mes-cont");
            accountCont.style.display = "block";
            if (obj['register'] === 'yes') {
                accountCont.classList.add("account-mes-pos");
                $(".account-mes-cont").prepend('<p>Account created successfuly</p>');
            }
            if (obj['register'] === 'no') {
                accountCont.classList.add("account-mes-neg")
                $(".account-mes-cont").prepend('<p>Error occured while creating account</p>');
            }
        }

    }

    function addNegMessage(text) {
        send_flag = false
        $mesCont.prepend(`<p class='form-mes'>${text}</p>`)
    }

    function sendData(dataToSend) {
        //send data with ajax and jquery
        $.post("http://127.0.0.1:3000/signup", dataToSend, function () {
            checkAccount();
        });
    }

    var send_flag = true;
    var $mesCont = $('.form-mes-cont');

    $('.submitBtn > input').on('click', function (e) {
        //it is okay to send data if send_flag true
        send_flag = true;

        e.preventDefault();

        //changes html form message container
        $('.form-mes').remove();
        $mesCont.css('display', 'block');

        var formData = $("#uform").serialize()
        //since formData is in form 'key1=value1&key2=value2' , split the data into individual 'key=value' strings
        var formData2 = formData.split('&');
        //obj that store form data
        var obj = {}
        for (var data of formData2) {
            // further strips key=value string into key value pair
            var dataSplit = data.split('=');
            obj[dataSplit[0]] = decodeURIComponent(dataSplit[1]);
        }
        if (obj['username'] === '') {
            addNegMessage('username cannot be empty')
        }
        if (obj['upass'].length < 8) {
            addNegMessage('password length cannot be less than 8')
        }
        if (obj['upass'] !== obj['userConfpass']) {
            addNegMessage('password and confirm password does not match')
        }
        if (+obj['uage'] < 18 || +obj['uage'] > 120) {
            addNegMessage('age cannot be less than 18 or greater than 120');
        }

        if (send_flag) {
            sendData(formData);
        }
    })
})