// modal
const drawAndOpenModal = (content) => {
    $("#game-modal").css("display", "flex");
    $("#modal-bg").html(content);
};

$("#before-btn-wrap").on("click", "button", (event) => {
    const index = $("#before-btn-wrap > button").index(event.currentTarget);
    if (index === 0) {
        // rules
        drawAndOpenModal(`
            <h3>MAKE YOUR CHIPOTLE</h3>
            <p>
                Complete Jihye’s favorite combo! Use the arrow keys to move the bowl and catch the right ingredients!
            </p>
            <div id="modal-key-wrap">
                <img src="./img/left-arrow.png" alt="" />
                <img src="./img/right-arrow.png" alt="" />
            </div>
            <button id="modal-back-btn" class="btn-hover">Got it</button>
        `);
    } else if (index === 1) {
        // start
        drawAndOpenModal(`
            <h3>Enter Your Nickname</h3>
            <input id="modal-start-input" type="text" focus/>
            <div id="modal-btn-wrap" class="display-flex-set">
                <button id="modal-back-btn" class="btn-hover">Back</button>
                <button id="modal-start-btn" class="btn-hover">Begin</button>
            </div>
        `);
        $("#modal-start-input").focus();
    }

    // gotit / back
    $("#modal-back-btn").on("click", () => {
        $("#game-modal").hide();
        $("#modal-bg").html();
    });

    // begin
    $("#modal-start-btn").on("click", () => {
        const nickname = $("#modal-start-input").val();

        if ($.trim(nickname) === "") {
            alert("Try again");
            $("#modal-start-input").focus();
        } else if ($.trim(nickname).length > 5) {
            alert("5 characters or less");
            $("#modal-start-input").focus();
        } else {
            gameStart(nickname);
            $("#before-start").hide();
            $("#game-modal").hide();
            $("#modal-bg").html();
        }
    });
});

// game start
const gameStart = (nickname) => {
    // reset
    const username = nickname;
    $("#header-nick > span").html(`${username}`);
    let gameScore = 0;
    $("#header-score").text(`${gameScore}`);
    let bowlCnt = 0;
    $("#bowl-count").text(`${bowlCnt}`);

    // return home
    $("#home-btn").on("click", () => {
        $("#before-start").css("display", "flex");
    });

    const roadDiv = document.querySelectorAll("#game-body > div");
    let bowlIndex = 4;
    function bowlSet() {
        document.addEventListener("keydown", (e) => {
            const maxIndex = roadDiv.length - 1;
            if (e.key === "ArrowRight" && bowlIndex < maxIndex) {
                bowlIndex++;
            } else if (e.key === "ArrowLeft" && bowlIndex > 0) {
                bowlIndex--;
            } else {
                return;
            }

            const newParent = roadDiv[bowlIndex];
            const bowl = document.querySelector("#bowl");
            newParent.appendChild(bowl);
        });
    }

    let checkIndex = 0;
    let spawnTimeoutId;
    let collisionTimeoutId; 
    let randomDivIndex = Math.floor(Math.random() * 8);
    let contactIndex = randomDivIndex;
    const myRecipe = ["rice", "chicken", "beans", "bell-pepper", "romaine", "cheese", "salsa", "sour-cream"];
    const recipeList = document.querySelectorAll("#game-recipe-wrap > li:not(:last-child)");

    function ingredSnow() {
        const randomIngredIndex = Math.floor(Math.random() * myRecipe.length);
        const imgId = `food-${randomDivIndex}-${roadDiv[randomDivIndex].children.length}`;

        roadDiv[
            randomDivIndex
        ].innerHTML += `<img id="${imgId}" class="downImg" src="./img/${myRecipe[randomIngredIndex]}.png"/>`;
        const downFood = $(`#${imgId}`);

        collisionTimeoutId = setTimeout(function () {
            if (roadDiv[contactIndex].children.length === 2) {
                if (checkIndex === randomIngredIndex) {
                    checkIndex++;
                    gameScore += 50;
                    $(recipeList[randomIngredIndex]).css("background", "var(--chipotle-red)");
                    $("#header-score").text(`${gameScore}`);

                    if (checkIndex === myRecipe.length) {
                        bowlCnt++;
                        $("#bowl-count").text(`${bowlCnt}`);
                        checkIndex = 0;
                        recipeList.forEach((li) => $(li).css("background", ""));
                    }
                } else {
                    clearTimeout(spawnTimeoutId);
                    clearTimeout(collisionTimeoutId);
                    $(".downImg").remove();

                    drawAndOpenModal(`
                            <h2>GAME OVER</h2>
                            <div id="game-result-wrap">
                                <div class="game-result">
                                    <div>Your Chipotle</div>
                                    <div>${bowlCnt}</div>
                                </div>
                                <div class="game-result">
                                    <div>Your Score</div>
                                    <div>${gameScore}</div>
                                </div>
                            </div>
                            <button id="modal-back-btn" class="btn-hover">Back</button>
                            `);

                    $("#modal-back-btn").on("click", () => {
                        $("#before-start").css("display", "flex");
                        $("#game-modal").hide();
                    });
                }
            }

            $(downFood).remove();
            contactIndex = randomDivIndex;
        }, 3000);

        spawnTimeoutId = setTimeout(function () {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * 8);
            } while (nextIndex === randomDivIndex);
            randomDivIndex = nextIndex;

            requestAnimationFrame(ingredSnow);
        }, 1500);
    }

    bowlSet();
    ingredSnow();
};
