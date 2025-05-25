const renderFavFlats = () => {
    // mouseover : remove btn
    // 집중 ㅈㄴ안되네
    // mouseover : remove btn
    $("#fav-table").on("mouseover", ".fav-item", function (event) {
        const favIndex = $(".fav-item").index(event.currentTarget);
        const removeBtn = $(".fav-remove-btn")[favIndex];
        $(removeBtn).show();
    });
    $("#fav-table").on("mouseout", ".fav-item", function (event) {
        const favIndex = $(".fav-item").index(event.currentTarget);
        const removeBtn = $(".fav-remove-btn")[favIndex];
        $(removeBtn).hide();
    });
};

renderFavFlats();
