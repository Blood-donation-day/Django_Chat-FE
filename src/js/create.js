//토큰여부 확인
RefreshAccessToken();

const $optionContainer = document.querySelector(".options-container");
const $option1 = document.querySelectorAll(".option1");
const $option2 = document.querySelectorAll(".option2");
const $option3 = document.querySelectorAll(".option3");
const $option4 = document.querySelectorAll(".option4");
const $option5 = document.querySelectorAll(".option5");
const $curoption = document.querySelector(".current_option");
const $prevoption = document.querySelector(".prev_option");
const $createbutton = document.querySelector(".create_button");
const $mypagebutton = document.querySelector(".my_page");
$mypagebutton.href = mypage;

let promptmessage = {
  난이도: "None",
  테마: "None",
  타입: "None",
  재료: "None",
  레시피: "None",
  직접입력: "None",
};

let curoption = 1;
const optionstep = {
  1: "요리 난이도",
  2: "테마",
  3: "음식 분류",
  4: "메인 재료",
  5: "요리 방법",
  6: "기타 요청",
  7: "추천 결과",
};

function selectDifficulty(difficulty) {
  promptmessage.난이도 = difficulty;
  console.log("promptmessage:", promptmessage);
}
function selectTheme(theme) {
  promptmessage.테마 = theme;
  console.log("promptmessage:", promptmessage);
}
function selectType(type) {
  promptmessage.타입 = type;
  console.log("promptmessage:", promptmessage);
}
function selectIngredients(ingredient) {
  promptmessage.재료 = ingredient;
  console.log("promptmessage:", promptmessage);
}
function selectRecipe(recipe) {
  promptmessage.레시피 = recipe;
  console.log("promptmessage:", promptmessage);
}

let slide = 0;

const slidepercent = 100 / 7;
function slideRight() {
  slide += slidepercent;
  $optionContainer.style.transform = `translateX(-${slide}%)`;
  curoption += 1;
  $curoption.innerHTML = optionstep[curoption];
}

function slideLeft() {
  if (curoption === 1) {
    return;
  }
  slide -= slidepercent;
  $optionContainer.style.transform = `translateX(-${slide}%)`;
  curoption -= 1;
  $curoption.innerHTML = optionstep[curoption];
  console.log(slide);
}

function slideRightAll(elements) {
  elements.forEach((e) => {
    e.addEventListener("click", slideRight);
  });
}
slideRightAll($option1);
slideRightAll($option2);
slideRightAll($option3);
slideRightAll($option4);
slideRightAll($option5);

$prevoption.addEventListener("click", slideLeft);
$createbutton.addEventListener("click", () => {
  const $option6 = document.querySelector(".option6_text");

  if ($option6.value != "") {
    promptmessage.직접입력 = $option6.value;
  }
  console.log("promptmessage:", promptmessage);
  slideRight();
  createFood(promptmessage);
});

async function createFood(message) {
  console.log("서버에 요청을 보냈습니다.");
  try {
    const response = await fetch(createurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookie("access"),
      },
      credentials: "include",
      body: JSON.stringify({
        prompt: message,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      loadResult(result);
    } else if (response.status === 401) {
      await RefreshAccessToken();
      createFood();
    } else if (response.status === 403) {
      alert("오늘 무료 횟수를 모두 소진하셨습니다. 내일 다시 시도해주세요.");
      location.reload();
    } else {
      console.log(response.json);
    }
  } catch (error) {
    console.error("요청 에러", error);
  }
}

function loadResult(result) {
  $foodname = document.querySelector(".foodname");
  $introduce = document.querySelector(".introduce");
}
