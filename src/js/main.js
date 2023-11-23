//url 정리
const url = "http://127.0.0.1:8000";
const profileurl = url + "/accounts/profile/";
const loginurl = url + "/accounts/login/";
const signupurl = url + "/accounts/signup/";
const loginpage = "http://127.0.0.1:5500/src/HTML/login.html";
const mypage = "http://127.0.0.1:5500/src/HTML/mypage.html";

//프로필 정보
const username = document.querySelector(".username");
const introduce = document.querySelector('textarea[name="introduce"]');
const navprofileimage = document.querySelector(".nav-profile-image");
const profileimage = document.querySelector(".profile_image");
const today_limit = document.querySelector(".today_limit");

async function GetProfile() {
  try {
    // 로컬스토리지에 데이터가 있다면 먼저 화면에 불러옴
    const localProfileData = localStorage.getItem("Localprofiledata");

    if (localProfileData) {
      const localProfile = JSON.parse(localProfileData);
      Updateprofile(localProfile);
    } else {
      const response = await fetch(profileurl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getCookie("access"),
        },
        credentials: "include",
      });

      if (response.ok) {
        const serverProfile = await response.json();
        console.log("프로필: ", serverProfile);
        Updateprofile(serverProfile);

        localStorage.setItem("Localprofiledata", JSON.stringify(serverProfile));
      } else if (response.status === 401) {
        // 토큰 만료시 리프레시 토큰을 사용하여 엑세스 토큰 재발급 후 다시 요청
        await RefreshAccessToken();
      } else {
        const errorData = await response.json();
        console.error("요청 실패:", errorData.message);
      }
    }
  } catch (error) {
    console.error("요청 에러:", error);
  }
}

// 리프레쉬 토큰으로 엑세스 토큰을 재발급 받기
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

      await GetProfile();

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

function Updateprofile(profiledata) {
  if (profiledata.username && profiledata.username.trim() !== "") {
    username.innerHTML = profiledata.username;
    username.value = profiledata.username;
  }
  if (profiledata.introduce && profiledata.introduce.trim() !== "") {
    introduce.value = profiledata.introduce;
  }
  if (
    profiledata.profile_img !== null &&
    profiledata.profile_img.trim() !== ""
  ) {
    navprofileimage.src = url + profiledata.profile_img;
    profileimage.src = url + profiledata.profile_img;
  }
  today_limit.innerHTML =
    "남은 횟수: " + JSON.parse(localStorage.getItem("user")).today_limit;
}

// 로그인이 필요한 모든 요청에서 프로필 정보를 가져오면서 토큰여부 확인.

GetProfile();
