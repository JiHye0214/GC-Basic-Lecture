const warnMsg = $("#warning-msg");

$("#login-btn").on("click", () => {
    let isPassed = true;
    let errorMsg = "";

    $("form[name='login-form'] > input").each((index, input) => {
        const value = input.value.trim();
        const label = input.placeholder || "this field";

        if (!isPassed) return; // 이미 실패했다면 다음 필드는 검사하지 않음

        if (value === "") {
            isPassed = false;
            errorMsg = `* Enter your ${label}`;
        } else {
            errorMsg = "";
        }
        warnMsg.html(errorMsg);
    });

    if (isPassed) {
        // inform set
        const inputs = $("form[name='login-form']").find("input").toArray();
        const inputValues = inputs.map((input) => input.value);
        
        // send
        const flatService = new FlatService("http://localhost:3000/api/user/login");
        flatService
            .sendFlatData(inputValues) // 배열 보내도 됨 --> 서버에서 가공 가능 
            .then((result) => {
                window.location.href = "http://127.0.0.1:5500/pages/home.html";
                alert(result.message);
            })
            .catch((error) => {
                warnMsg.html(error.message || "").show();
            });
    }
});
