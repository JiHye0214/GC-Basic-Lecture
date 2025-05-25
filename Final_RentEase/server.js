// 간단한 API 서버
// Node.js + Express

const express = require("express"); // Express 웹 프레임워크 : 웹서버 간단히 만들기
const cors = require("cors"); // 다른 도메인 허용해 주는 미들웨어
const fs = require("fs"); // fs : Node.js 기본 모듈 (파일 읽/쓰)
const path = require("path"); // path : Node.js 기본 모듈 (경로 조작)

const app = express(); // app : 서버 인스턴스
app.use(cors()); // CORS 에러 방지 목적
app.use(express.json()); // JSON 형식 요청 바디를 req.body로 해석 가능

// 서버 시작 시 데이터 불러오기
// 관리해야 하는 json이 여러개일 때는 함수로 만들어도 됨 (보통 2개 이상일 테니 걍 만들자)
function readJsonFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            // 파일 존재 파악
            const fileContent = fs.readFileSync(filePath, "utf-8"); // 파일 내용 읽고 저장
            if (fileContent.trim()) {
                // 내용 있으면
                const data = JSON.parse(fileContent); // 문자열로 된 JSON 데이터를 JS 객체(배열)로 변환
                return Array.isArray(data) ? data : []; // 배열 체크
            }
        }
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
    }
    return [];
}

function writeJsonFile(filePath, data, res) {
    // json 파일 경로, 넣을 값, 응답할 곳
    // JSON.stringify(값, 포함할 속성(모두면 null), 들여쓰기 수)
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error(`Error writing ${filePath}:`, err);
            if (res) res.status(500).json({ message: "File store fail" });
            return false;
        }

        // 서버는 요청을 받으면 반드시 응답을 보내야 한다.
        // 안 보내면 무한 대기 상태거나 요청 처리 에러 가능성 o
        if (res) res.json({ message: "Data saved", data });
        return true;
    });
}

// fetch (flat) ------------------------------------------------
// flat.json 파일 경로 설정
const FLAT_DATA_FILE = path.join(__dirname, "data", "flat.json"); // __dirname : server.js 파일 경로
let flatData = readJsonFile(FLAT_DATA_FILE);

app.post("/api/flat", (req, res) => {
    const newData = req.body;
    flatData.push(newData);
    writeJsonFile(FLAT_DATA_FILE, flatData, res);
});

app.get("/api/flat", (req, res) => {
    if (flatData.length > 0) {
        res.json(flatData); // 항상 응답은 res.json
    } else {
        // 배열이 비어 있으면 404 + msg
        res.status(404).json({ message: "there's no stored data" });
    }
});

// fetch (user) ------------------------------------------------
// user.json 파일 경로 설정
const USER_DATA_FILE = path.join(__dirname, "data", "user.json");
let userData = readJsonFile(USER_DATA_FILE);

app.post("/api/user", (req, res) => {
    let uniqueIdx = userData.length;
    const newData = req.body;

    const emailExists = userData.some((user) => user.email === newData.email);
    if (emailExists) {
        console.log("⚠️ This email is already in use: ", newData.email);
        return res.status(400).json({ message: "⚠️ This email is already in use" });
    }

    // 이메일 중복 조건문에서 return을 때려서
    // 참일 시 아래 코드는 실행하지 않음
    newData.id = uniqueIdx;
    userData.push(newData);

    writeJsonFile(USER_DATA_FILE, userData, res);
});

app.get("/api/user", (req, res) => {
    if (userData.length > 0) {
        res.json(userData);
    } else {
        res.status(404).json({ message: "there's no stored data" });
    }
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
    // app.listen() : Express 서버를 켜는 함수
    console.log(`server running : http://localhost:${PORT}`); // 잘 켜졌는지 확인
});
