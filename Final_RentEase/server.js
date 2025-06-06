// 간단한 API 서버
// Node.js + Express

const express = require("express"); // Express 웹 프레임워크 : 웹서버 간단히 만들기
const cors = require("cors"); // 다른 도메인 허용해 주는 미들웨어
const fs = require("fs"); // fs : Node.js 기본 모듈 (파일 읽/쓰)
const path = require("path"); // path : Node.js 기본 모듈 (경로 조작)
const { log } = require("console");

const app = express(); // app : 서버 인스턴스
app.use(cors()); // CORS 에러 방지 목적
app.use(
    express.json({
        // strict: true - 반드시 객체여야 파싱 시도함 (배열 또는 null은 에러)
        strict: false, // 배열 파싱을 허용하게 해 주는 옵션
    })
); // JSON 형식 요청 바디를 req.body로 해석 가능

// 서버 시작 시 데이터 불러오기
// 관리해야 하는 json이 여러개일 때는 함수로 만들어도 됨 (보통 2개 이상일 테니 걍 만들자)
function readJsonFile(filePath, needStored) {
    try {
        if (fs.existsSync(filePath)) {
            // 파일 존재 파악
            const fileContent = fs.readFileSync(filePath, "utf-8"); // 파일 내용 읽고 저장
            if (fileContent.trim()) {
                // 내용 있으면
                const data = JSON.parse(fileContent); // 문자열로 된 JSON 데이터를 JS 객체(배열)로 변환

                if (needStored) {
                    return Array.isArray(data) ? data : []; // 배열 체크
                }
                return data;
            }
        }
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
    }
    return [];
}

function writeJsonFile(filePath, data) {
    return new Promise((resolve, reject) => {
        // json 파일 경로, 넣을 값, 응답할 곳
        // JSON.stringify(값, 포함할 속성(모두면 null), 들여쓰기 수)
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

// fetch (flat) ------------------------------------------------
// flat.json 파일 경로 설정
const FLAT_DATA_FILE = path.join(__dirname, "data", "flat.json"); // __dirname : server.js 파일 경로

app.post("/api/flat", (req, res) => {
    let flatData = readJsonFile(FLAT_DATA_FILE, true);
    let uniqueIdx = flatData.length;
    const newFlat = req.body;

    newFlat.id = uniqueIdx;
    flatData.push(newFlat);

    writeJsonFile(FLAT_DATA_FILE, flatData)
        .then(() => res.json({ message: "Data saved", data: newFlat }))
        .catch(() => res.status(500).json({ message: "File store fail" }));
});
app.post("/api/flat/remove", (req, res) => {
    let flatData = readJsonFile(FLAT_DATA_FILE, true);
    const { flatId } = req.body;
    const updatedFlats = flatData.filter((flat) => flat.id !== Number(flatId));

    writeJsonFile(FLAT_DATA_FILE, updatedFlats)
        .then(() => res.json({ message: "Success : Remove Flat", data: updatedFlats }))
        .catch(() => res.status(500).json({ message: "Remove fail" }));
});

app.get("/api/flat", (req, res) => {
    let flatData = readJsonFile(FLAT_DATA_FILE, true);
    if (!flatData) {
        return res.status(404).json({ message: "There's no stored flat data." });
    }
    return res.json(flatData);
});
app.get("/api/flat/search", (req, res) => {
    let flatData = readJsonFile(FLAT_DATA_FILE, true);

    const city = req.query.city === "undefined" ? undefined : req.query.city;
    const sort = req.query.sort;

    // parseRange() : 쿼리 문자열로 전달된 범위를 해석해서 숫자 범위 배열로 변환
    // "100+200" ==> [100, 200]
    const parseRange = (rangeStr) => {
        if (!rangeStr) return [undefined, undefined];

        const [min, max] = rangeStr.split("+");

        const minVal = min !== "" ? Number(min) : undefined;
        const maxVal = max !== "" ? Number(max) : undefined;

        return [isNaN(minVal) ? undefined : minVal, isNaN(maxVal) ? undefined : maxVal];
    };
    const [minPrice, maxPrice] = parseRange(req.query.price);
    const [minSize, maxSize] = parseRange(req.query.size);

    const resultData = flatData
        // city
        .filter((flat) => {
            if (city) {
                return flat.city?.toLowerCase().includes(city.toLowerCase());
            } else {
                return true;
            }
        }) // price
        .filter((flat) => {
            const price = Number(flat.price);
            if (minPrice !== undefined && price < minPrice) return false;
            if (maxPrice !== undefined && price > maxPrice) return false;
            return true;
        })
        .filter((flat) => {
            const size = Number(flat.size);
            if (minSize !== undefined && size < minSize) return false;
            if (maxSize !== undefined && size > maxSize) return false;
            return true;
        });

    // sort way
    if (sort) {
        switch (sort) {
            case "aToZ":
                resultData.sort((a, b) => a.city.localeCompare(b.city));
                break;
            case "zToA":
                resultData.sort((a, b) => b.city.localeCompare(a.city));
                break;
            case "priceLH":
                resultData.sort((a, b) => a.price - b.price);
                break;
            case "priceHL":
                resultData.sort((a, b) => b.price - a.price);
                break;
            case "sizeLH":
                resultData.sort((a, b) => a.size - b.size);
                break;
            case "sizeHL":
                resultData.sort((a, b) => b.size - a.size);
                break;
        }
    }

    res.json(resultData);
});

// fetch (user) ------------------------------------------------
// user.json 파일 경로 설정
const USER_DATA_FILE = path.join(__dirname, "data", "user.json");
const USER_CURRENT_FILE = path.join(__dirname, "data", "userCurrent.json");

app.post("/api/user/register", (req, res) => {
    let userData = readJsonFile(USER_DATA_FILE, true);

    let uniqueIdx = userData.length;
    const newUser = req.body;

    const emailExists = userData.some((user) => user.email === newUser.email);
    if (emailExists) {
        console.log("⚠️ This email is already in use: ", newUser.email);
        return res.status(400).json({ message: "⚠️ This email is already in use" });
    }

    // 이메일 중복 조건문에서 return을 때려서
    // 참일 시 아래 코드는 실행하지 않음
    newUser.id = uniqueIdx;
    newUser.likeFlats = [];
    userData.push(newUser);

    writeJsonFile(USER_DATA_FILE, userData)
        .then(() => res.json({ message: "Success : Register", data: newUser }))
        .catch(() => res.status(500).json({ message: "File store fail" }));
});

app.post("/api/user/login", (req, res) => {
    let userData = readJsonFile(USER_DATA_FILE, true);

    const loginInputs = req.body; // email, password Array
    const findUser = userData.find((user) => user.email === loginInputs[0] && user.password === loginInputs[1]);
    if (!findUser) {
        console.log("⚠️ Please check your email and password again.");
        return res.status(400).json({ message: "⚠️ Please check your email and password again." });
    }

    // for mypage, home(fav)
    writeJsonFile(USER_CURRENT_FILE, findUser)
        .then(() => res.json({ message: "Success : Login", data: findUser }))
        .catch(() => res.status(500).json({ message: "Login fail" }));
});

app.post("/api/user/logout", (req, res) => {
    writeJsonFile(USER_CURRENT_FILE, {})
        .then(() => res.json({ message: "Success : Logout" }))
        .catch(() => res.status(500).json({ message: "Logout fail" }));
});
app.post("/api/user/update", (req, res) => {
    const reqUser = req.body;

    let userData = readJsonFile(USER_DATA_FILE, true);
    const currentUser = readJsonFile(USER_CURRENT_FILE, false);

    if (reqUser.password === "") reqUser.password = currentUser.password;
    reqUser.id = currentUser.id;
    reqUser.likeFlats = currentUser.likeFlats;

    const findUserIdx = userData.findIndex((user) => user.email === currentUser.email);

    const isEmailChanged = reqUser.email !== currentUser.email;
    if (isEmailChanged) {
        const isEmailDuplicated = userData.some((user) => user.email === reqUser.email);
        if (isEmailDuplicated) {
            console.log("⚠️ This email is already in use: ", reqUser.email);
            return res.status(400).json({ message: "⚠️ This email is already in use" });
        }
    }

    userData[findUserIdx] = reqUser;
    Promise.all([writeJsonFile(USER_DATA_FILE, userData), writeJsonFile(USER_CURRENT_FILE, reqUser)])
        .then(() => {
            res.json({ message: "Success : Update Profile", data: reqUser });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "File update" });
        });
});
app.post("/api/flat/like", (req, res) => {
    let userData = readJsonFile(USER_DATA_FILE, true);

    const flatId = req.body.flatId;
    const isLiked = req.body.isLiked;

    const currentUser = readJsonFile(USER_CURRENT_FILE, false);
    if (!currentUser || !currentUser.likeFlats) {
        return res.status(404).json({ message: "Current user data is invalid" });
    }

    const flatIdStr = Number(flatId);
    const existsId = currentUser.likeFlats.some((fId) => fId === flatIdStr);
    const findIdx = userData.findIndex((user) => user.id === currentUser.id);
    if (findIdx === -1) {
        return res.status(404).json({ message: "User not found " });
    }

    let updatedUser;
    if (isLiked) {
        if (!existsId) {
            updatedUser = {
                ...currentUser,
                likeFlats: [...currentUser.likeFlats, flatIdStr],
            };
        } else {
            updatedUser = currentUser;
        }
    } else {
        updatedUser = {
            ...currentUser,
            likeFlats: currentUser.likeFlats.filter((fId) => fId !== flatIdStr),
        };
    }

    userData[findIdx] = updatedUser;

    // 두 파일 저장 --> Promise.all
    // 응답 두 번 보내면 무조건 에러남
    // writeJsonFile(USER_DATA_FILE, userData)
    // writeJsonFile(USER_CURRENT_FILE, currentUser)
    Promise.all([writeJsonFile(USER_DATA_FILE, userData), writeJsonFile(USER_CURRENT_FILE, updatedUser)])
        .then(() => {
            res.json({ message: "Success : Updated like flats", data: updatedUser });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "File store fail" });
        });
});

app.get("/api/user", (req, res) => {
    const currentUser = readJsonFile(USER_CURRENT_FILE, false);

    return res.json(currentUser);
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
    // app.listen() : Express 서버를 켜는 함수
    console.log(`server running : http://localhost:${PORT}`); // 잘 켜졌는지 확인
});
