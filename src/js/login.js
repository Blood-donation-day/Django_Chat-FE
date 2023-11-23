const $loginlogo = document.querySelector(".login_logo");
$loginlogo.href = mainpage;

async function login() {
  ClearLocal();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(loginurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const logindata = await response.json();

      const user = {
        email: logindata.user,
        lastupdate: logindata.lastupdate,
        today_limit: logindata.today_limit,
      };
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = mypage;
    } else {
      //실패 시
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    console.error("로그인 에러:", error);
  }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  login();
});

function ClearLocal() {
  localStorage.clear();
  function deleteCookie(cookieName) {
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  deleteCookie("refresh");
  deleteCookie("access");
}
