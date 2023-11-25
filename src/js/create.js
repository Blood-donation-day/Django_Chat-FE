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
function createFood() {}
let slide = 0;
// 100 / n 으로하면 부동소수점 문제 발생, 페이지 넘어갈 때 잘못된값으로 나옴
const slidepercent = parseFloat((100 / 7).toFixed(7));
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
}

function slideRightAll(elements) {
  elements.forEach((element) => {
    element.addEventListener("click", slideRight);
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
  //createFood();
  slideRight();
});
