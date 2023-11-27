// 이메일 마지막 로그인 데이터
ProfileChangeSet();

function ProfileChangeSet() {
  const user = JSON.parse(localStorage.getItem("user"));
  const date = new Date(user.lastupdate);
  const datetime = `${date.getFullYear()}-${padZero(
    date.getMonth() + 1
  )}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(
    date.getMinutes()
  )}`;

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  const localProfileData = JSON.parse(localStorage.getItem("Localprofiledata"));
  Updateprofile(localProfileData);
  const $profile_image = document.querySelector(".profile_image");
  const $profile_image_button = document.querySelector(".profile_image_select");
  const $email = document.querySelector(".email");
  const $lastupdate = document.querySelector(".lastupdate");
  const $submitbutton = document.querySelector(".submit");
  $email.innerHTML = "이메일: " + user.email;
  $lastupdate.innerHTML = "최근 업데이트: " + datetime;
  // 프로필 데이터를 받고 해당 데이터로 변경

  $submitbutton.addEventListener("click", async function () {
    const new_username = document.querySelector(".username").value;
    const new_introduce = document.querySelector(
      'textarea[name="introduce"]'
    ).value;
    const userdata = {
      username: new_username,
      introduce: new_introduce,
    };

    const updatedProfileData = await postfetchUrl(profileurl, userdata);
    console.log("프로필이 업데이트되었습니다.", updatedProfileData);

    await updateLastupdate(updatedProfileData);

    localStorage.setItem(
      "Localprofiledata",
      JSON.stringify(updatedProfileData.Profile)
    );

    window.alert("프로필이 업데이트되었습니다.");
    window.location.href = mypage;
    //에러
  });

  $profile_image.addEventListener("click", () => {
    $profile_image_button.click();
  });

  $profile_image_button.addEventListener("change", () => {
    const file = $profile_image_button.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      $profile_image.src = reader.result;
      const formData = new FormData();
      formData.append("profile_img", file);
      // 서버로 이미지 업로드
      console.log(formData);
      const uploadResponse = await postfetchProfile(profileurl, formData);
      const imageUrl = await uploadResponse;
      console.log("프로필 이미지가 업로드되었습니다.", imageUrl);
    };

    reader.readAsDataURL(file);
  });
  function Updateprofile(profiledata) {
    if (
      profiledata.profile_img !== null &&
      profiledata.profile_img.trim() !== ""
    ) {
      const profileimage = document.querySelector(".profile_image");
      profileimage.src = url + profiledata.profile_img;
    }
    if (profiledata.username && profiledata.username.trim() !== "") {
      const username = document.querySelector(".username");
      username.value = profiledata.username;
    }
    if (profiledata.introduce && profiledata.introduce.trim() !== "") {
      const introduce = document.querySelector('textarea[name="introduce"]');
      introduce.value = profiledata.introduce;
    }
  }
}

function updateLastupdate(updatedProfileData) {
  const curuser = JSON.parse(localStorage.getItem("user"));
  curuser.lastupdate = updatedProfileData.lastupdate;
  localStorage.setItem("user", JSON.stringify(curuser));
}

async function postfetchProfile(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken("access")}`,
    },
    body: body,
    credentials: "include",
  });

  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  } else if (response.status === 401) {
    // 토큰 만료시 리프레시 토큰을 사용하여 엑세스 토큰 재발급 후 다시 요청
    await RefreshAccessToken().then(() => postfetchProfile(url, body));
  } else {
    const errorData = await response.json();
    console.error("요청 실패:", errorData.message);
    return;
  }
}
