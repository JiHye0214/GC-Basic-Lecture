const today = new Date();
$("#available").val(today.toISOString().split("T")[0]); // "YYYY-MM-DD"

// slide btn
const slideItems = document.querySelectorAll(".slide-item");
// z-index
slideItems.forEach((item, index) => {
    item.style.zIndex = 10 - index;
});

$(".slide-btn").on("click", (e) => {
    let isPassed = true;
    const currentItem = e.currentTarget;
    const nowIndex = parseInt($(currentItem).data("slide"));
    const soonIndex = $(currentItem).hasClass("next") ? nowIndex + 1 : nowIndex - 1;

    const inputs = $(slideItems[nowIndex]).find("input"); // 객체라서 forEach가 안 됨
    const results = $("#slide-final-wrap").find("span.result");

    if ($(currentItem).hasClass("next")) {
        if (inputs.length > 0) {
            if (!isPassed) return false;

            $(inputs).each((index, input) => {
                const val = $(input).val();
                const inputVal = val === "true" ? "Y" : val === "false" ? "N" : val;

                // input valid
                const isHidden = $(input).attr("type") === "hidden";
                const target = isHidden ? $("#new-ac") : $(input);

                if (inputVal.trim() === "") {
                    isPassed = false;
                    target.addClass("warning");
                } else {
                    target.removeClass("warning");
                }

                // input value setting
                const modVal = inputVal
                    .split("")
                    .map((lett, lettIdx) => {
                        // 리턴 안 하면 undifined !
                        if (lettIdx === 0) {
                            return lett.toUpperCase();
                        } else {
                            return lett.toLowerCase();
                        }
                    })
                    .join("");

                // input value send
                const inputIdx = parseInt($(input).data("span"));
                $(results[inputIdx]).text(modVal);
            });
        }
    }

    // movement
    if (slideItems[soonIndex] && (isPassed || nowIndex > soonIndex)) {
        slideItems[nowIndex].classList.remove("show");

        setTimeout(() => {
            slideItems[soonIndex].classList.add("show");

            setTimeout(() => {
                // prev
                if (nowIndex > soonIndex) {
                    $(inputs).each((index, input) => {
                        // reset
                        if (nowIndex === 1) {
                            $(input).val("");
                        }

                        // remove warning
                        $(input).removeClass("warning");
                    });
                }
            });
        }, 500);
    }
});

// AC value setting
const acOptions = document.querySelectorAll("#new-ac > li");
$(acOptions).on("click", (e) => {
    const liIndex = $("#new-ac > li").index(e.currentTarget);
    const acVal = liIndex === 0 ? true : false;

    if (acVal) {
        acOptions[0].style.background = "rgb(240, 240, 240)";
        acOptions[1].style.background = "";
    } else {
        acOptions[0].style.background = "";
        acOptions[1].style.background = "rgb(240, 240, 240)";
    }

    $("#ac").val(acVal);
});

// upload
$("#upload-btn").on("click", () => {
    const inputs = $("#new-slide-frame").find("input").toArray();
    const inputValues = inputs.map((input) => input.value);

    const newFlat = new Flat(...inputValues);
    newFlat.setUserId(jihye.id);

    // send
    const flatService = new FlatService("http://localhost:3000/api/flat");
    flatService
        .sendFlatData(newFlat.toPlainObject())
        .then((result) => {
            console.log("Success sending data", result);
            window.location.href = "http://127.0.0.1:5501/Final_RentEase/pages/allFlats.html";
        })
        .catch((error) => {
            console.log("Fail sending data", error);
            alert("upload fail");
        });
});
