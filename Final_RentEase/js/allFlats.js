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
};

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
    $(".page-filter").on("click", () => {
        console.log("click");
    })
}
