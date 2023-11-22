const mypage = "http://127.0.0.1:5500/src/HTML/mypage.html";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const respose = await fetch("http://127.0.0.1:8000/accounts/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (respose.ok) {
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
