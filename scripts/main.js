// main.js
require([
    "dojo/dom",
    "dojo/on",
    "dojo/window",
    "dojo/domReady!"
], function (dom, on, win) {
    // Api urls
    var apiUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
    var searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // Breadcrumbs
    var mealsHomeLink = document.getElementById('meals-home');
    var mealsByCategoryLink = document.getElementById('meals-by-category');
    var mealDetailsLink = document.getElementById('meal-details');

    // Home page
    mealsHomeLink.addEventListener('click', function () {
        mealsByCategoryLink.textContent = '';
        mealsByCategoryLink.classList.remove('d-block');
        mealsByCategoryLink.classList.add('d-none');
        fetchCategories(apiUrl);
    });

    // Meals category
    mealsByCategoryLink.addEventListener('click', function () {
        var category = localStorage.getItem("category");
        mealDetailsLink.textContent = '';
        mealDetailsLink.classList.remove('d-block');
        mealDetailsLink.classList.add('d-none');
        handleCategoryClick(category);
    });

    // Function to show meal details
    function showMealDetails(mealId) {
        var url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

        // Fetch meal details by the selected meal ID
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var meal = data.meals[0];

                // Clear previous meals
                dom.byId("root").innerHTML = "";

                // Create elements for meal details
                var mealName = meal.strMeal;
                var mealCategory = meal.strCategory;
                var mealArea = meal.strArea;
                var mealInstructions = meal.strInstructions;
                var mealImage = meal.strMealThumb;

                // Breadcrumb                
                mealDetailsLink.textContent = mealName;
                mealDetailsLink.classList.remove('d-none');

                // Create container for meal details
                var mealDetailsContainer = document.createElement("div");
                mealDetailsContainer.classList.add("container");

                // Create card for meal details
                var mealDetailsCard = document.createElement("div");
                mealDetailsCard.classList.add("card", "my-4");

                // Create card body
                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                // Create card title
                var cardTitle = document.createElement("h5");
                cardTitle.classList.add("card-title");
                cardTitle.textContent = mealName;

                // Create card subtitle
                var cardSubtitle = document.createElement("h6");
                cardSubtitle.classList.add("card-subtitle", "mb-2", "text-muted");
                cardSubtitle.textContent = `${mealCategory} - ${mealArea}`;

                // Create card image
                var cardImage = document.createElement("img");
                cardImage.classList.add("card-img-top");
                cardImage.src = mealImage;
                cardImage.alt = mealName;

                // Create card text for instructions
                var cardText = document.createElement("p");
                cardText.classList.add("card-text");
                cardText.textContent = mealInstructions;

                // Create "Go Back" button
                var goBackButton = document.createElement("button");
                goBackButton.classList.add("btn", "btn-primary");
                goBackButton.textContent = "Go Back";
                goBackButton.addEventListener("click", function () {
                    // Handle "Go Back" button click event
                    handleCategoryClick(mealCategory);
                    mealDetailsLink.textContent = '';
                    mealDetailsLink.classList.add('d-none');
                });

                // Append elements to the card body
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardSubtitle);
                cardBody.appendChild(cardImage);
                cardBody.appendChild(cardText);
                cardBody.appendChild(goBackButton);

                // Append card body to the card
                mealDetailsCard.appendChild(cardBody);

                // Append card to the container
                mealDetailsContainer.appendChild(mealDetailsCard);

                // Append container to the root element
                dom.byId("root").appendChild(mealDetailsContainer);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // Function to handle category click event
    function handleCategoryClick(category) {
        // Clear previous meals
        dom.byId("root").innerHTML = "";
        // Store category name to localStorage;
        localStorage.setItem("category", category);

        // Breadcrumb
        mealsByCategoryLink.classList.remove('d-none');
        mealsByCategoryLink.textContent = category;

        // Fetch meals by the selected category
        fetch(searchUrl + encodeURIComponent(category))
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var meals = data.meals;

                if (meals == null) {
                    var messageElement = document.createElement("h6");
                    messageElement.textContent = `No meals found for ${category}!`;
                    dom.byId("root").appendChild(messageElement);
                }

                meals.forEach(function (meal) {
                    var mealName = meal.strMeal;
                    var mealImage = meal.strMealThumb;
                    var mealId = meal.idMeal;

                    var imageElement = document.createElement("img");
                    imageElement.src = mealImage;
                    imageElement.classList.add("img-fluid");

                    var mealElement = document.createElement("div");
                    mealElement.classList.add("col-md-6", "mb-4");
                    mealElement.innerHTML = `
                    <div class="card">
                        <img src="${mealImage}" class="card-img-top" alt="${mealName}">
                        <div class="card-body">
                            <h5 class="card-title">${mealName}</h5>
                        </div>
                    </div>
                `;

                    // Add click event listener to the meal card
                    mealElement.addEventListener("click", function () {
                        showMealDetails(mealId);
                    });

                    dom.byId("root").appendChild(mealElement);
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        return handleCategoryClick;
    }

    // Make a request to fetch categories
    function fetchCategories(apiUrl) {
        // Clear previous meals
        dom.byId("root").innerHTML = "";
        // Clear localStorage
        localStorage.setItem("category", "");
        // Fetch and return
        var fetchResult = fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var categories = data.categories;

                categories.forEach(function (category) {
                    var categoryName = category.strCategory;
                    var categoryImage = category.strCategoryThumb;

                    var imageElement = document.createElement("img");
                    imageElement.src = categoryImage;
                    imageElement.classList.add("img-fluid");

                    var categoryElement = document.createElement("div");
                    categoryElement.classList.add("col-md-3", "mb-4");
                    categoryElement.innerHTML = `
                <div class="card">
                    <img src="${categoryImage}" class="card-img-top" alt="${categoryName}">
                    <div class="card-body">
                        <h5 class="card-title">${categoryName}</h5>
                    </div>
                </div>
            `;

                    // Add click event listener to the category card
                    categoryElement.addEventListener("click", function () {
                        handleCategoryClick(categoryName);
                    });

                    dom.byId("root").appendChild(categoryElement);
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        return fetchResult;
    }
    fetchCategories(apiUrl);
});