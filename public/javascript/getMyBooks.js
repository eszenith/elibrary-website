$(function () {

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

    function fillPage(books) {
        var $bookCont = $(".books-cont");
        $(".book").remove();
        $(".srchText").remove();
        for (var book of books) {
            var $bookEl = $(`<div class="book">
            <a href="books/user/${book.bno}"><img class="book-img" src="images/bk1.png"></a>
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
        if(books.length === 0) {
            $bookCont.append("<div class='nobook-cont'><p class='srchText'>No books found</p></div>");
        }
    }

    var xhrUserBook = new XMLHttpRequest();
    xhrUserBook.open('GET', `/books/user/issued`);
    xhrUserBook.setRequestHeader("Authorization", "Bearer "+getCookie('token'));
    xhrUserBook.send(null);

    xhrUserBook.onload = function () {
        //the string recieved from server is escaped with / first json parse only creates a string
        var allbooks = JSON.parse(JSON.parse(xhrUserBook.responseText));
        fillPage(allbooks);
    }

});