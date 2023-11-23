const $usermunubutton = document.getElementById("user-menu-button");
const $usermenu = document.querySelector(".picture");

$usermunubutton.addEventListener("click", toggleusermenu);

function toggleusermenu() {
  $usermenu.classList.toggle("hidden");
}

const $logoutbutton = document.querySelector(".logout");
$logoutbutton.addEventListener("click", logout);

function logout() {
  localStorage.clear();
  function deleteCookie(cookieName) {
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  deleteCookie("refresh");
  deleteCookie("access");
  alert("로그아웃 되었습니다.");
  window.location.href = mypage;
}
