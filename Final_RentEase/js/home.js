import { gotUser, gotAllFlats, isLogined, setUserData } from "./common.js";

async function setOnesFlatData() {
    if (isLogined) {
        renderHome(gotAllFlats);
    } else {
        renderHome(false);
    }
}
$(document).ready(runInOrder);
async function runInOrder() {
    await setUserData();
    await setOnesFlatData();
}

const renderHome = (allFlats) => {
    const renderFlats = (flats, hasLike) => {
        let flatContents = "";
        flats.forEach((flat) => {
            flatContents += `
                <li class="home-item">
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
                    <div data-flatId="${flat.id}" class="handle-btn btn-hover ${hasLike ? "fav-clicked" : "rem-btn"}">
                    </div>
                </li>
            `;
        });

        return flatContents;
    };

    // 어차피 내가 작성한 건 flat에서 가져오는 거고
    // 좋아요 누른 건 user에서 가져오는 거임
    let contents = "";
    if (allFlats) {
        // flat 가공
        const [myPosts, myLikes] = allFlats.reduce(
            ([myPosts, myLikes], flat) => {
                if (flat.userId === gotUser.id) {
                    myPosts.push(flat);
                } else if (gotUser.likeFlats.includes(flat.id)) {
                    // !!! includes
                    myLikes.push(flat);
                }
                return [myPosts, myLikes];
            },
            [[], []]
        );

        if (myPosts.length > 0) {
            contents += `
                <div>My Posts</div>
                <ul id="user-flats">
                    ${renderFlats(myPosts, false)}
                </ul>
            `;
        }
        if (myLikes.length > 0) {
            contents += `
                <div>Liked Posts</div>
                <ul id="user-likes">
                    ${renderFlats(myLikes, true)}
                </ul>
            `;
        }
        if (myPosts.length <= 0 && myLikes.length <= 0) {
            contents += `
                <div id="home-not-yet" class="display-flex-set">
                    <p>No content yet</p>
                    <div id="yet-btn-wrap" class="display-flex">
                        <a href="../pages/allFlats.html">Go to explore</a>
                        <a href="../pages/newFlat.html">Create a Post</a>
                    </div>
                </div>
            `;
        }
    } else {
        contents += `
            <div id="home-not-member" class="display-flex-set">
                <p>Please log in first</p>
                <a href="../pages/login.html">Go to login</a>
            </div>
        `;
    }

    $("#home-main").html(contents);
    setHomeBtns();
};

const setHomeBtns = () => {
    function handleFlatAction(selector, className, isRemoved) {
        $(selector).on("click", className, (e) => {
            const flatId = e.currentTarget.getAttribute("data-flatId");

            if (isRemoved) {
                const confirmed = confirm("Do you really want to delete this?");
                if (!confirmed) return;
            }

            const sendObj = { flatId };
            if (!isRemoved) {
                sendObj.isLiked = false;
            }

            const flatService = new FlatService(`http://localhost:5000/api/flat/${isRemoved ? "remove" : "like"}`);
            flatService
                .postData(sendObj)
                .then((result) => {
                    console.log("Success:", result);
                })
                .catch((error) => {
                    console.log("Fail sending data", error);
                    alert("Upload failed");
                });
        });
    }

    handleFlatAction("#user-flats", ".rem-btn", true);
    handleFlatAction("#user-likes", ".fav-clicked", false);
};
