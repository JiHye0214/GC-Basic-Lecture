const today = new Date();
$("#birth").val(today.toISOString().split("T")[0]); // "YYYY-MM-DD"

const warnMsg = $("#warning-msg");

$("#signin-btn").on("click", () => {
    let isPassed = true;
    let errorMsg = "";

    $("form[name='signin-form'] > input").each((index, input) => {
        const value = input.value.trim();
        const label = input.placeholder || "this field";

        if (!isPassed) return; // 이미 실패했다면 다음 필드는 검사하지 않음

        // 이메일
        if (index === 0) {
            if (value === "") {
                isPassed = false;
                errorMsg = `* Enter your ${label}`;
            } else {
                const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
                if (!emailValid) {
                    isPassed = false;
                    errorMsg = `* Invalid email format.`;
                }
            }
        }

        // 비밀번호
        else if (index === 1) {
            if (value === "") {
                isPassed = false;
                errorMsg = `* Enter your ${label}`;
            } else if (value.length < 6) {
                isPassed = false;
                errorMsg = `* Enter a password with at least 6 characters.`;
            } else {
                const pwValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).{6,}$/.test(value);
                if (!pwValid) {
                    isPassed = false;
                    errorMsg = `* Must include at least one number and one special character.`;
                }
            }
        }

        // 비밀번호 확인
        else if (index === 2) {
            if (value === "") {
                isPassed = false;
                errorMsg = `* Enter your ${label}`;
            } else if (value !== $("#pw").val()) {
                isPassed = false;
                errorMsg = `* Passwords do not match.`;
            }
        }

        // 이름 (first name, last name)
        else if (index === 3 || index === 4) {
            if (value === "") {
                isPassed = false;
                errorMsg = `* Enter your ${label}`;
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                isPassed = false;
                errorMsg = `* The name can only contain letters (A-Z, a-z).`;
            } else if (value.length < 2) {
                isPassed = false;
                errorMsg = `* Enter your ${label} with at least 2 characters.`;
            }
        }

        // 생년월일
        else if (index === 5) {
            if (value === "") {
                isPassed = false;
                errorMsg = `* Enter your birth date.`;
            } else {
                const bDay = new Date(value);
                const diffTime = Math.abs(today - bDay);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const age = Math.floor(diffDays / 365);

                if (age < 18) {
                    isPassed = false;
                    errorMsg = `* You must be 18 years or older to register.`;
                } else if (age > 120) {
                    isPassed = false;
                    errorMsg = `* You must be 120 years or younger to register.`;
                }
            }
        }

        // 에러 메시지 출력
        if (!isPassed) {
            warnMsg.html(errorMsg).show();
        }
    });

    if (isPassed) {
        warnMsg.hide();
        // $("form[name='signin-form']").submit();

        const inputs = $("form[name='signin-form']").find("input").toArray();
        const inputValues = inputs
            .filter((input, index) => index !== 2)
            .map((input, index) => {
                if (index === 2 || index === 3) {
                    return input.value.toUpperCase();
                }
                return input.value;
            });

        const newUser = new User(...inputValues);
        // send
        const flatService = new FlatService("http://localhost:3000/api/user");
        flatService
            .sendFlatData(newUser.toPlainObject())
            .then((result) => {
                // console.log("Success sending data", result);
                window.location.href = "http://127.0.0.1:5501/Final_RentEase/pages/home.html";
            })
            .catch((error) => {
                // console.log("Fail sending data", error);
                warnMsg.html(error.message || "").show();
            });
    }
});
