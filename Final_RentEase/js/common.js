$(document).ready(setUserData);

export let gotUser = null;
export let isLogined = false;
export async function setUserData() {
    try {
        const userService = new FlatService("http://localhost:5000/api/user");
        gotUser = await userService.getData();
        isLogined = Object.keys(gotUser).length > 0;

        renderHeader();
    } catch (error) {
        console.error("오류 발생:", error);
    }
}

const renderHeader = () => {
    // 로그인 유무 스타일
    if (isLogined) {
        $("#header-user > p").show();
        $("#header-logout").text("Log out");
        $("#header-hello").text(gotUser.firstName);
    } else {
        $("#header-user > p").hide();
        $("#header-logout").text("Log in");
    }

    $("#header-logout").on("click", () => {
        // 로그아웃
        if (isLogined) {
            const userLogoutService = new FlatService("http://localhost:5000/api/user/logout");
            userLogoutService
                .postData("logout")
                .then((result) => {
                    window.location.href = "http://127.0.0.1:5500/pages/home.html";
                    alert(result.message);
                })
                .catch((error) => {
                    console.log(error.message || "");
                });
        } else {
            // 로그인
            window.location.href = "http://127.0.0.1:5500/pages/login.html";
        }
    });
};
