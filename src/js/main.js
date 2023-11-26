//프로필 정보
MainSet();
getMyFood();

function MainSet() {
  const username = document.querySelector(".username");
  const introduce = document.querySelector('textarea[name="introduce"]');
  const navprofileimage = document.querySelector(".nav-profile-image");
  const profileimage = document.querySelector(".profile_image");
  const today_limit = document.querySelector(".today_limit");
  const createbutton = document.querySelector("#create");

  createbutton.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = createpage;
  });

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

          localStorage.setItem(
            "Localprofiledata",
            JSON.stringify(serverProfile)
          );
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
        await RefreshData();
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

  async function RefreshData() {
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
    }
  }

  function Updateprofile(profiledata) {
    if (
      profiledata.profile_img !== null &&
      profiledata.profile_img.trim() !== ""
    ) {
      navprofileimage.src = url + profiledata.profile_img;
      profileimage.src = url + profiledata.profile_img;
    }
    if (profiledata.username && profiledata.username.trim() !== "") {
      username.innerHTML = profiledata.username;
    }
    if (profiledata.introduce && profiledata.introduce.trim() !== "") {
      introduce.value = profiledata.introduce;
    }
    today_limit.innerHTML =
      "남은 횟수: " + JSON.parse(localStorage.getItem("user")).today_limit;
  }

  GetProfile();
}

function getMyFood() {
  let currentpage = 1;
  getFood(currentpage);

  async function getFood(page) {
    try {
      const response = await fetch(createurl + `?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getCookie("access"),
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();

        displayFood(data);
      } else if (response.status === 401) {
        RefreshAccessToken();
        getFood();
      } else if (response.status === 404) {
        // 마지막 페이지인 경우
        currentpage -= 1;
        alert("마지막 페이지입니다.");
        $currentpage.innerHTML = `${currentpage}페이지`;
      }
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  }

  //화면에 받은 데이터를 표시
  function displayFood(data) {
    const foodListElement = document.querySelector(".food_list");
    foodListElement.innerHTML = "";
    data.forEach((food) => {
      const foodItem = document.createElement("div");
      foodItem.classList.add(
        "bg-white/20",
        "p-6",
        "rounded-md",
        "shadow-sm",
        "cursor-pointer",
        "border-2",
        "border-gray-50",
        "hover:border-black",
        "hover:border-2",
        "transition-colors",
        "duration-300"
      );

      const title = document.createElement("h2");
      title.classList.add("text-xl", "font-semibold", "mb-4");
      title.textContent = food.foodname;

      const ingredients = document.createElement("p");
      ingredients.classList.add("text-gray-700");
      const ingredientsArray = food.ingredients
        .replace(/['{}]/g, "")
        .split(",");

      ingredientsArray.forEach((ingredient) => {
        // 각 항목을 개별적으로 표시
        ingredients.innerHTML += ingredient.trim() + "<br>";
      });

      foodItem.appendChild(title);
      foodItem.appendChild(ingredients);
      foodListElement.appendChild(foodItem);
    });
  }

  const $prevbutton = document.querySelector(".prev_page");
  const $currentpage = document.querySelector(".current_page");
  const $nextbutton = document.querySelector(".next_page");

  $prevbutton.addEventListener("click", prevPage);
  $nextbutton.addEventListener("click", nextPage);

  function prevPage() {
    if (currentpage === 1) {
      return;
    }
    currentpage -= 1;
    getFood(currentpage);
    $currentpage.innerHTML = `${currentpage}페이지`;
  }

  function nextPage() {
    currentpage += 1;
    getFood(currentpage);
    $currentpage.innerHTML = `${currentpage}페이지`;
  }
}
