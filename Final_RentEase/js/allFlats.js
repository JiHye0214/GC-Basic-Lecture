$(document).ready(async () => {
    try {
        const flatService = new FlatService("http://localhost:5000/api/flat");
        const gotAllFlats = await flatService.getData();

        renderAllFlats(gotAllFlats);
    } catch (error) {
        console.error("error: ", error);
    }
});

const renderAllFlats = (allFlats) => {
    let contents = "";
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
                <!-- <img class="all-fav-btn" src="../img/fav.png" alt="" /> -->
            </li>
        `;
    });

    $("#all-table").html(contents);
};

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
