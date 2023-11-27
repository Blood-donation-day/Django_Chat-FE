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
    const response = await fetch(refreshurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        refresh: `Bearer ${getToken("access")}`,
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
      const token = {
        access: refreshData.access,
        refresh: getToken("refresh"),
      };
      localStorage.setItem("token", JSON.stringify(token));

      //기타 에러 처리
    } else {
      const errorData = await response.json();
      console.error("재발급 실패", errorData.message);
    }
  } catch (error) {
    console.error("토큰 갱신 에러", error);
  }
}

async function getfetchUrl(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken("access")}`,
    },
    credentials: "include",
  });

  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  } else if (response.status === 401) {
    // 토큰 만료시 리프레시 토큰을 사용하여 엑세스 토큰 재발급 후 다시 요청
    await RefreshAccessToken().then(() => getfetchUrl(url));
  } else {
    const errorData = await response.json();
    console.error("요청 실패:", errorData.message);
    return;
  }
}

async function postfetchUrl(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken("access"),
    },
    body: {
      body,
    },
    credentials: "include",
  });

  if (response.ok) {
    const response = await response.json();
    return response;
  } else if (response.status === 401) {
    // 토큰 만료시 리프레시 토큰을 사용하여 엑세스 토큰 재발급 후 다시 요청
    await RefreshAccessToken();
  } else {
    const errorData = await response.json();
    console.error("요청 실패:", errorData.message);
    return;
  }
}

async function RefreshAccessToken() {
  try {
    const response = await fetch(refreshurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        refresh: getToken("refresh"),
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
      const token = {
        access: refreshData.access,
        refresh: getToken("refresh"),
      };
      localStorage.setItem("token", JSON.stringify(token));

      //기타 에러 처리
    } else {
      const errorData = await response.json();
      console.error("재발급 실패", errorData.message);
    }
  } catch (error) {
    console.error("토큰 갱신 에러", error);
  }
}
