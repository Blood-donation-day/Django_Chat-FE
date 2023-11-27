function ClearLocal() {
  localStorage.clear();
  function deleteCookie(cookieName) {
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  deleteCookie("refresh");
  deleteCookie("access");
}
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

function getToken(name) {
  localtoken = localStorage.getItem("token");
  token = JSON.parse(localtoken);
  return token[name];
}

//401 응답받으면 해당 함수 호출
async function RefreshAccessToken() {
  try {
    const response = await fetch(loginurl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    //리프레쉬 토큰이 만료되었다면 로그인 페이지로 이동
    if (response.status === 500) {
      window.location.href = loginpage;
    }

    //리프레쉬 토큰이 만료되지 않고 엑세스 토큰을 재발급하는 경우
    if (response.ok) {
      const refreshData = await response.json();
      console.log("토큰 재발급 완료", refreshData);

      //기타 에러 처리
    } else {
      const errorData = await response.json();
      console.error("재발급 실패", errorData.message);

      // 리프레쉬 토큰이 만료되면 여기로 와서 로그인 페이지로 이동
      window.location.href = loginpage;
    }
  } catch (error) {
    console.error("토큰 갱신 에러", error);
  }
}
