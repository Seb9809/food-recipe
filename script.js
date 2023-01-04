const d = document,
  $searchBtn = document.getElementById("search-btn"),
  $mealList = document.getElementById("meal"),
  $mealDetailsContent = document.querySelector(".meal-details-content"),
  $recipeCloseBtn = document.getElementById("recipe-close-btn"),
  $searchInp = document.getElementById("search-input");

// get meal list that matches with the ingredients
function getMealList() {
  let searchInputTxt = $searchInp.value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";

      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <article class = "meal-item" data-id = "${meal.idMeal}">
                        <section class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </section>
                        <section class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </section>
                    </article>
                `;
        });
        $mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we couldn't find any meal!";
        $mealList.classList.add("notFound");
      }

      $mealList.innerHTML = html;
    });
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();

  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// create a modal
function mealRecipeModal(meal) {
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <section class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </section>
        <section class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </section>
        <section class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </section>
    `;
  $mealDetailsContent.innerHTML = html;
  $mealDetailsContent.parentElement.classList.add("showRecipe");
}

// event listeners
$searchBtn.addEventListener("click", getMealList);
$mealList.addEventListener("click", getMealRecipe);
$recipeCloseBtn.addEventListener("click", () => {
  $mealDetailsContent.parentElement.classList.remove("showRecipe");
});
