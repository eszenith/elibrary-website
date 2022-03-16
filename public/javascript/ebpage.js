$(function () {
    function fillPage(books) {
        var $bookCont = $(".books-cont");
        $(".book").remove();
        $(".nobook-cont").remove();
        for (var book of books) {
            var $bookEl = $(`<div class="book">
            <a href="ebookpage/${book.bno}"><img class="book-img" src="images/bk1.png"></a>
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
    
    $('.searchBtn').on('click', function () {
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', `/books/search/${$(".search > input").val()}`)
        xhr2.send(null);

        xhr2.onload = function () {
            var searchedbooks = JSON.parse(JSON.parse(xhr2.responseText));
            fillPage(searchedbooks);
        }

    });

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/books/all');
    xhr.send(null);

    xhr.onload = function () {
        //the string recieved from server is escaped ( with / ), first json parse only creates a string
        var allbooks = JSON.parse(JSON.parse(xhr.responseText));
        fillPage(allbooks);
    }
});