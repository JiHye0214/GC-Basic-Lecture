### Math.
    built-in object

### toFixed 
    숫자의 소수점을 지정한 자릿수로 반올림

    console.log((2.7).toFixed(0));
    console.log((2.7).toFixed(3)); // 2.700
    console.log((1.768).toFixed(2)); // 1.77
    console.log((2.876).toFixed(2)); // 2.88

### Date()
    Date 객체는 날짜를 자동으로 밀리초(ms) 단위로 처리함
    계산 후 하루 밀리초로 나누면 일수로 결과 측정 가능 
    1일 밀리초 = (1000 * 60 * 60 * 24)
    1sec = 1000 millisec

### setTimeout
    한번만 작용
### setInterval
    반복 
    clearTimeout 필요 
    setInterval(콜백함수, 시간 간격, 인자1, 인자2,...)
    ✔️ 콜백함수에 인자를 바로 넣으면 안 됨. 즉시 실행되기 때문. 인자로 넘겨 줘야 함 
    ✔️ 인자들은 콜백함수에 한번에 넣어지며 한번에 실행됨 

### TMI
    Standard Library <-> 3rd party Library