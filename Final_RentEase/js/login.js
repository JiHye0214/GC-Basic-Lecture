const warnMsg = $("#warning-msg");

$("#login-btn").on("click", () => {
    let isPassed = true;
    let errorMsg = "";

    $("form[name='login-form'] > input").each((index, input) => {
        const value = input.value.trim();
        const label = input.placeholder || "this field";

        if (!isPassed) return; // 이미 실패했다면 다음 필드는 검사하지 않음

    })
})