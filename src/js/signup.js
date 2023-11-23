const signup = async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password1 = document.getElementById("password_1").value;
  const password2 = document.getElementById("password_2").value;

  if (password1 !== password2) {
    alert("비밀번호가 일치하지 않습니다.");
    return false;
  }

  if (password1.length < 8) {
    alert("비밀번호가 너무 짧습니다. 최소 8자 이상으로 해주세요");
    return false;
  }

  try {
    const response = await fetch(signupurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password1,
      }),
      credentials: "include",
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("회원가입 성공:", responseData);

      const user = {
        email: responseData.user,
        lastupdate: responseData.lastupdate,
        today_limit: responseData.today_limit,
      };
      localStorage.setItem("user", JSON.stringify(user));

      alert("회원가입이 성공적으로 완료되었습니다.");
      window.location.href = mypage;
    } else {
      const errorData = await response.json();
      console.error("회원가입 실패:", errorData);

      alert(errorData.password[0]);
    }
  } catch (error) {
    console.error("에러 발생:", error);
  }
};

const $submitbutton = document.querySelector(".submit");
$submitbutton.addEventListener("click", signup);
