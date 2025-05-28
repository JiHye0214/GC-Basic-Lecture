import { gotUser, gotAllFlats, isLogined, setUserData } from "./common.js";

$(document).ready(runInOrder);
async function runInOrder() {
    await setUserData();
    await renderAllFlats(gotAllFlats);
}

async function renderAllFlats(allFlats) {
    let contents = "";

    if (allFlats.length > 0) {
        allFlats.forEach((flat) => {
            contents += `
                 <li class="all-item">
                    <img class="flat-img" src="../img/houseExample.png" alt="" />
                    <div class="flat-item-detail">
                        <ul class="flat-address">
                            <li>Address</li>
                            <li class="display-flex">
                                ${flat.stName} ${flat.stNum}, ${flat.city}
                            </li>
                        </ul>
                        <ul class="flat-year">
                            <li>Size</li>
                            <li>${flat.size}㎡</li>
                        </ul>
                        <ul class="flat-ac">
                            <li>AC</li>
                            <li>${flat.ac ? "Y" : "N"}</li>
                        </ul>
                        <ul class="flat-year">
                            <li>Year built</li>
                            <li>${flat.year}</li>
                        </ul>
                        <ul class="flat-avaDate">
                            <li>Date available</li>
                            <li>${flat.date}</li>
                        </ul>
                        <ul class="flat-price">
                            <li>Rent price</li>
                            <li>${flat.price}</li>
                        </ul>
                    </div>
                    <div data-flatId="${flat.id}" class="handle-btn btn-hover ${
                isLogined && flat.userId !== gotUser.id ? "fav-btn" : "none"
            } ${isLogined && gotUser.likeFlats.some((fId) => fId === flat.id) ? "fav-clicked" : ""}"></div>
                </li>
            `;
        });
    } else {
        contents += `
            <div id="all-not-flat" class="display-flex-set">
                <p>There is no flat</p>
                <a href="../pages/newFlat.html">Go make a flat</a>
            </div>
        `;
    }

    $("#all-table").html(contents);
    setFavBtn();
    setFilterBtn();
}

const setFavBtn = () => {
    $("#all-table").on("click", ".fav-btn", (e) => {
        const isLiked = e.currentTarget.classList.contains("fav-clicked");
        const flatId = e.currentTarget.getAttribute("data-flatId");

        const likeObj = {
            flatId: flatId,
            isLiked: !isLiked,
        };

        // send
        const flatService = new FlatService("http://localhost:5000/api/flat/like");
        flatService
            .postData(likeObj)
            .then((result) => {})
            .catch((error) => {
                console.log("Fail sending data", error);
                alert("upload fail");
            });
    });
};
const setFilterBtn = () => {
    const filterNav = document.querySelector("#filter-nav");

    $(".page-filter").on("click", () => {
        $(filterNav).addClass("open");
    });

    $("#filter-close").on("click", () => {
        $(filterNav).removeClass("open");
    });

    $("#reset-btn").on("click", () => {
        $("#filter-filtering input").each((index, input) => {
            input.value = "";
        });
        $("#filter-sort input").each((index, input) => {
            input.checked = false;
        });
    });

    $("#apply-btn").on("click", () => {
        const findCity = document
            .querySelector("input[name='city']")
            .value.split("")
            .map((lett, lettIdx) => {
                if (lettIdx === 0) {
                    return lett.toUpperCase();
                } else {
                    return lett.toLowerCase();
                }
            })
            .join("");
        const findPrice = [...document.querySelectorAll("input[name='price']")].map((input) => {
            if (input.value === "") {
                return undefined;
            }
            return input.value;
        });
        const findSize = [...document.querySelectorAll("input[name='size']")].map((input) => {
            if (input.value === "") {
                return undefined;
            }
            return input.value;
        });
        const sortWay = document.querySelector("#filter-sort input:checked")?.id; // 물음표 사이에 낌 : 없으면 undifined 할 거라는 뜻

        // encode URI
        const flatService = new FlatService(
            `http://localhost:5000/api/flat/search?city=${encodeURIComponent(
                findCity.length > 0 ? findCity : undefined
            )}&price=${encodeURIComponent(findPrice[0] + "+" + findPrice[1])}&size=${encodeURIComponent(
                findSize[0] + "+" + findSize[1]
            )}&sort=${encodeURIComponent(sortWay)}`
        );

        async function findFlatResult() {
            const gotResults = await flatService.getData();
            renderAllFlats(gotResults);
        }
        findFlatResult();
    });
};
