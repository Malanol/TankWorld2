document.addEventListener("DOMContentLoaded", () => {
    window.onscroll = function () {
        if (document.documentElement.scrollTop > 250) {
            console.log(document.getElementById("button-up").visibility);
            document.getElementById("button-up").style.visibility = 'visible';
            document.getElementById("button-up").style.opacity = '1';
        } else {
            document.getElementById("button-up").style.visibility = 'hidden';
            document.getElementById("button-up").style.opacity = '0';
        }
    }

    document.getElementById("button-up").addEventListener("click", (event) => {
        window.scrollTo(0, 0);
    });
});