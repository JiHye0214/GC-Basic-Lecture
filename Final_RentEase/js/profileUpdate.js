import { gotUser, isLogined, setUserData } from "./common.js";

async function renderProfile() {
    const updateInput = document.querySelectorAll("form[name='update-form'] > input");

    updateInput[0].value = gotUser.email;
    updateInput[3].value = gotUser.firstName;
    updateInput[4].value = gotUser.lastName;
    updateInput[5].value = gotUser.bDay;

    const today = new Date();
    const warnMsg = $("#warning-msg");

    $("#update-btn").on("click", () => {
        let isPassed = true;
        let pwValid = false;
        let errorMsg = "";

        $("form[name='update-form'] > input").each((index, input) => {
            const value = input.value.trim();
            const label = input.placeholder || "this field";

            if (!isPassed) return;

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
                if (value !== "") {
                    pwValid = true;
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

            // 비번 새로울 떄만
            if (pwValid) {
                if (index === 1) {
                    if (value.length < 6) {
                        isPassed = false;
                        errorMsg = `* Enter a password with at least 6 characters.`;
                    } else {
                        const pwValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).{6,}$/.test(value);
                        if (!pwValid) {
                            isPassed = false;
                            errorMsg = `* Must include at least one number and one special character.`;
                        }
                    }
                } else if (index === 2) {
                    if (value === "") {
                        isPassed = false;
                        errorMsg = `* Enter your ${label}`;
                    } else if (value !== $("#pw").val()) {
                        isPassed = false;
                        errorMsg = `* Passwords do not match.`;
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

            // inform set
            const inputs = $("form[name='update-form']").find("input").toArray();
            const inputValues = inputs
                .filter((input, index) => index !== 2)
                .map((input, index) => {
                    if (index === 2 || index === 3) {
                        return input.value.toUpperCase();
                    }
                    return input.value;
                });

            const updatedUser = new User(...inputValues);

            // send
            const flatService = new FlatService("http://localhost:5000/api/user/update");
            flatService
                .postData(updatedUser.toPlainObject())
                .then((result) => {
                    window.location.href = "http://127.0.0.1:5500/pages/home.html";
                    alert(result.message);
                })
                .catch((error) => {
                    // console.log("Fail sending data", error);
                    warnMsg.html(error.message || "").show();
                });
        }
    });
}

$(document).ready(runInOrder);
async function runInOrder() {
    await setUserData();
    await renderProfile();
}
