// class - User
class User {
    constructor(email, password, firstName, lastName, bDay) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bDay = bDay;
    }

    toPlainObject() {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            firstname: this.firstName,
            lastName: this.lastName,
            bDay: this.bDay,
        };
    }
}

// 역할 : 서버 URL을 받아서 인스턴스화
class FlatService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    // fetch로 POST 요청을 보냄
    // 에러 발생 시 조건문 실행되며 그 아래는 실맹되지 않음 --> Error를 던지기 때문에 catch에서 다룸 
    // 성공 시 성공 루트를 밟음 
    async sendFlatData(flatData) {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(flatData),
        });

        if (!response.ok) { // HTTP 상태 200-299면 true
            // 에러일 때 서버가 보내준 메시지 가져오기 시도
            let errorMsg = `Server Error: ${response.status}`; // 기본 에러 msg
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg; // 기본 msg보다 자세한 게 있으면 덮어씌우기 
            } catch {}
            throw new Error(errorMsg); // 함수 호출자에게 알림 
        }

        const data = await response.json();
        console.log("Server response:", data); // 단순 쳌
        return data;
    }
}

// class - Flat
class Flat {
    constructor(city, stName, stNum, size, ac, year, price, date) {
        // this.id = id;
        this.city = city;
        this.stName = stName;
        this.stNum = stNum;
        this.size = size;
        this.ac = ac;
        this.year = year;
        this.price = price;
        this.date = date;

        this._userId;
    }

    setUserId(userId) {
        this._userId = userId;
    }

    toPlainObject() {
        return {
            city: this.city,
            stName: this.stName,
            stNum: this.stNum,
            size: this.size,
            ac: this.ac,
            year: this.year,
            price: this.price,
            date: this.date,
            userId: this._userId,
        };
    }
}

const jihye = new User(1, "qkrwlgp1526@gmail.com", "123456*dd", "JIHYE", "PARK", "2004-02-14");
