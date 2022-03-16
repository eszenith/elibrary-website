var wrapper = document.querySelector("body > .wrapper");
checkLogin();

function generalNavbar() {
    var nav = document.createElement('navbar');
    nav.classList.add("navbar");
    nav.innerHTML = `<ul class="nav-left">
    <li><a href="index.html">Home</a></li>
    <li><a href="ebpage.html">Ebooks</a></li>
    <li><a href="videoPage.html">Video</a></li>
    <li><a href="audioPage.html">Audio</a></li>
    <li><a href="about.html">About</a></li>
    </ul>
    <ul class = "nav-right">
    <li><a href="signup.html">Sign in</a></li>
    <li><a href="login.html">Log in</a></li>
    </ul>`;

    wrapper.prepend(nav);
}

function loggedInNavbar() {
    var nav = document.createElement('navbar');
    nav.classList.add("navbar");
    nav.innerHTML = `<ul class="nav-left">
    <li><a href="index.html">Home</a></li>
    <li><a href="ebpage.html">Ebooks</a></li>
    <li><a href="videoPage.html">Video</a></li>
    <li><a href="audioPage.html">Audio</a></li>
    <li><a href="about.html">About</a></li>
    </ul>
    <ul class = "nav-right">
    <li><a href="/myprofile.html">My Profile</a></li>
    <li><a href="/myBooks.html">My Books</a></li>
    <li><a href="/logout">Log out</a></li>
    </ul>`;

    wrapper.prepend(nav);
}

function checkLogin() {
    var cookieData = document.cookie.split('; ');
    var obj = {};
    for (var data of cookieData) {
        var dataSplit = data.split('=');
        obj[dataSplit[0]] = decodeURIComponent(dataSplit[1]);
    }
    
    if ('token' in obj) {
        loggedInNavbar();
    }
    else {
        generalNavbar();
    }

}


