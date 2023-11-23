const $usermunubutton = document.getElementById("user-menu-button");
const $usermenu = document.querySelector(".picture");
const $pagelogo = document.querySelector(".pagelogo");
const $loginbutton = document.querySelector(".login");
const $logoutbutton = document.querySelector(".logout");

$usermunubutton.addEventListener("click", toggleusermenu);

function toggleusermenu() {
  $usermenu.classList.toggle("hidden");
}

$loginbutton.href = loginpage;
$pagelogo.href = mainpage;

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
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }

    return null;
  }

  const access = getCookie("access");

  if (access) {
    $loginbutton.style.display = "none";
    $logoutbutton.style.display = "inline-block";
  }
});
