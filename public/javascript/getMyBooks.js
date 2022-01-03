$(function () {

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

    function fillPage(books) {
        console.log(books);
        var $bookCont = $(".books-cont");
        $(".book").remove();
        $(".srchText").remove();
        console.log(books);
        for (var book of books) {
            var $bookEl = $(`<div class="book">
            <a href="userbookpage/${book.bno}"><img class="book-img" src="images/bk1.png"></a>
            <p class="author">${book.bname}</p></div>`);
            $bookCont.append($bookEl);

            $('.book-img').on('mouseover', function () {
                $(this).animate({
                    opacity: 0.6
                }, 150)
            });
            $('.book-img').on('mouseout', function () {
                $(this).animate({
                    opacity: 1
                }, 80)
            });

        }
        console.log(books.length);
        if(books.length === 0) {
            $bookCont.append("<div class='nobook-cont'><p class='srchText'>No books found</p></div>");
        }
    }

    var xhrUserBook = new XMLHttpRequest();
    xhrUserBook.open('GET', `/getUserBooks`);
    xhrUserBook.setRequestHeader("Authorization", "Bearer "+getCookie('token'));
    xhrUserBook.send(null);

    xhrUserBook.onload = function () {
        //the string recieved from server is escaped with / first json parse only creates a string
        console.log(xhrUserBook.responseText);
        var allbooks = JSON.parse(JSON.parse(xhrUserBook.responseText));
        fillPage(allbooks);
    }

});