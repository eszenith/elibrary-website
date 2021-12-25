$(function () {

    function sendData(dataToSend) {
        //send data with ajax and jquery
        console.log("sent data");
        console.log(dataToSend);
        $.post("http://127.0.0.1:3000/login",dataToSend ,function (dataRec) {
            console.log(dataRec);
            document.cookie = `token:${dataRec}`;
        });
    }


    $('.submitBtn > input').on('click', function (e) {

        e.preventDefault();

        var formData = $("#loginform").serialize()
        //since formData is in form 'key1=value1&key2=value2' , split the data into individual 'key=value' strings
        var formData2 = formData.split('&');
        //obj that store form data
        var obj = {}
        for (var data of formData2) {
            // further strips key=value string into key value pair
            var dataSplit = data.split('=');
            obj[dataSplit[0]] = decodeURIComponent(dataSplit[1]);
        }
        sendData(formData);

    })
})