### OOP
- Object-Oriented Programing
- 객체 지향 프로그래밍 

### 클래스 생성
    구식 : function을 사용한 객체 생성 방법
            function Person(first, last, age, gender, interests) {
                this.name = { first : first, last : last };
                this.age = age;
                ...

            ✔️ prototype
            공통함수를 넣고 싶을 때는 생성자 함수 안에 넣기보다 밖에 빼고 Person.prototype.greeting = function() {} 이렇게 넣는 게 좋다. 안에 넣으면 클래스 만들 때마다 계속 함수가 생성됨. 

            ✔️ call()
            어떤 클래스를 상속 받고 싶을 때 사용. function decendent() {
                ancestor.call(this);
            } 이렇게 하면 부모 클래스의 요소 사용 가능 
            ⭐ 만약 부모 클래스가 인자를 받는다면 this 다음에 차례로 해당 값을 넣어줘야 한다. 

    신식(ES6~) : class 키워드 사용 
            class Person {
            constructor(first, last, age, gender, interests) {
                this.name = { first: first, last: last };
                this.age = age;

            ✔️ 
            근데 최신버전에서는 그냥 클래스 안에 greeting() {} 이렇게 넣으면 자동으로 해 준다. ㄱㅇㄷ

            ✔️ extends, super()
            this를 안 써도 되지만 마찬가지로 인자를 받는 부모라면 해당 값을 넣어야 한다. (없으면 빈칸임)
            class Child extends Parent {
                constructor() {
                    super();
                    this.age = 10;
                }
            }

            ✔️ getter / setter 
            캡슐화 : 외부에서 직접 접근 및 수정을 막고, 간접적으로 조작할 수 있도록 함.


### TMI
- 공자 영어이름 Confucius 

- classical : 특정 시대나 전통. 역사적, 문화적 의미 ex) 고전 음악  
- classic : 시간이 지나도 여전히 가치 있는 것 ex) 영화 
- EcmaScript means JavaScript