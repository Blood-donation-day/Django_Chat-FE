const usermunubutton = document.getElementById("user-menu-button");
const usermenu = document.querySelector(".picture");

usermunubutton.addEventListener("click", toggleusermenu);

function toggleusermenu() {
  usermenu.classList.toggle("hidden");
}
