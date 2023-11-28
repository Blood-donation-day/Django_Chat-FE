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
        const profile = await getfetchUrl(profileurl);
        console.log("프로필: ", profile);

        Updateprofile(profile);
        localStorage.setItem("Localprofiledata", JSON.stringify(profile));
      }
    } catch (error) {
      console.error("요청 에러:", error);
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

  async function getFood(page, q = null) {
    try {
      let url = createurl + `?page=${page}`;
      if (q) {
        url += `&q=${q}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken("access")}`,
        },

        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();

        displayFood(data);
      } else if (response.status === 401) {
        const refreshTokeb = await RefreshAccessToken();
        return getFood(currentpage);
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

  const $search = document.querySelector(".search");
  $search.addEventListener("keydown", function (e) {
    // 엔터 키의 keyCode는 13입니다.
    if (e.keyCode === 13) {
      q = $search.value;
      getFood(currentpage, q);
      e.preventDefault();
    }
  });
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
      foodItem.dataset.pk = food.pk;
      foodItem.addEventListener("click", openModal);
      const title = document.createElement("h2");

      const thumbnail = document.createElement("img");
      thumbnail.classList.add("my-4");
      thumbnail.src = url + food.thumbnail;
      thumbnail.alt = "Food Thumbnail";
      thumbnail.style.width = "100%";

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

      foodItem.appendChild(thumbnail);
      foodItem.appendChild(title);
      foodItem.appendChild(ingredients);
      foodListElement.appendChild(foodItem);
    });
  }

  const $modal = document.querySelector(".modal_title");
  const $prevbutton = document.querySelector(".prev_page");
  const $currentpage = document.querySelector(".current_page");
  const $nextbutton = document.querySelector(".next_page");

  $prevbutton.addEventListener("click", prevPage);
  $nextbutton.addEventListener("click", nextPage);

  async function getFoodDetail(pk) {
    try {
      const response = await fetch(createurl + `${pk}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken("access")}`,
        },

        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        loadDetail(data);
      } else if (response.status === 401) {
        const refreshToken = await RefreshAccessToken();
        return getFoodDetail(pk);
      }
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  }
  function loadDetail(data) {
    const $modalfoodname = document.querySelector(".modal_foodname");
    const $modalthumbnail = document.querySelector(".modal_thumbnail");
    const $modaldescription = document.querySelector(".modal_description");
    const $modalingredients = document.querySelector(".modal_ingredients");
    const $modalrecipe = document.querySelector(".modal_recipe");
    const $modalcreated = document.querySelector(".modal_created_at");

    $modalfoodname.innerHTML = data.foodname;
    $modalthumbnail.src = data.thumbnail;
    $modaldescription.innerHTML = data.intro;

    $modalingredients.innerHTML = "";
    const ingredientsArray = data.ingredients.replace(/['{}]/g, "").split(",");
    ingredientsArray.forEach((ingredient) => {
      $modalingredients.innerHTML += ingredient.trim() + "<br>";
    });

    $modalrecipe.innerHTML = data.recipe.replace(/\n/g, "<br>");

    const date = new Date(data.created_at);
    const datetime = `${date.getFullYear()}-${padZero(
      date.getMonth() + 1
    )}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(
      date.getMinutes()
    )}`;

    function padZero(num) {
      return num.toString().padStart(2, "0");
    }

    $modalcreated.innerHTML = "생성일자: " + datetime;
  }
  const $modalback = document.querySelector(".modal_back");
  $modalback.addEventListener("click", (e) => {
    if (e.target === $modalback) {
      $modal.classList.toggle("hidden");
    }
  });

  function openModal(e) {
    const pk = e.currentTarget.dataset.pk;
    $modal.classList.toggle("hidden");
    getFoodDetail(pk);
  }
  function nextPage() {
    currentpage += 1;
    const q = $search.value;
    getFood(currentpage, q);
    $currentpage.innerHTML = `${currentpage}페이지`;
  }

  function prevPage() {
    if (currentpage === 1) {
      return;
    }
    currentpage -= 1;
    const q = $search.value;
    getFood(currentpage, q);
    $currentpage.innerHTML = `${currentpage}페이지`;
  }
}
