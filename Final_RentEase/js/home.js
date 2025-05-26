import { gotUser, isLogined, setUserData } from "./common.js";

async function setOnesFlatData() {
    if (isLogined) {
        try {
            const flatService = new FlatService(`http://localhost:5000/api/flat?userId=${gotUser.id}`);
            const gotOnesFlats = await flatService.getData();
            renderHome(gotOnesFlats);
        } catch (error) {
            console.error("error: ", error);
        }
    } else {
        $("#fav-table").html("로그인 먼저 하기");
    }
}
$(document).ready(runInOrder);
async function runInOrder() {
    await setUserData();
    await setOnesFlatData();
}

const renderHome = (flats) => {
    let contents = "";

    if(flats.length > 0) {
        flats.forEach((flat) => {
            contents += `
                 <li class="fav-item">
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
                    <!-- <img class="all-fav-btn" src="../img/fav.png" alt="" /> -->
                </li>
            `;
        });
    } else {
        contents += `
            <div>좋아요 누른 글이나 작성한 글이 없습니다.</div>
        `
    }

    $("#fav-table").html(contents);

    // mouseover : remove btn
    // $("#fav-table").on("mouseover", ".fav-item", function (event) {
    //     const favIndex = $(".fav-item").index(event.currentTarget);
    //     const removeBtn = $(".fav-remove-btn")[favIndex];
    //     $(removeBtn).show();
    // });
    // $("#fav-table").on("mouseout", ".fav-item", function (event) {
    //     const favIndex = $(".fav-item").index(event.currentTarget);
    //     const removeBtn = $(".fav-remove-btn")[favIndex];
    //     $(removeBtn).hide();
    // });
};
