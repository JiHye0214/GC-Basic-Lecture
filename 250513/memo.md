Asynchronous : like ASAP
synchronous : like sequentially

AJAX : Asynchronous Javascript And Aml

API 
- Application Programming Interface
- 결과를 받기 위한 요청
  특정 작업을 요청하고, 결과를 응답받아 사용 가능
- Math.random() 

Web API
- 인터넷으로 외부와 정보를 주고 받음
- 날씨, 기사,...
- 방법 : 	fetch('경로', {  }).then(response => ).then(data => {});

new XMLHttpRequest()
	ㄴ> constructor

get/post : HTTP verb(method)

Promise : 비동기 작업의 완료 또는 실패 상태를 나타내는 객체
		fetch 함수는 내부적으로 Promise 객체를 반환
		.then() / .catch() 메서드 사용 
function getCountry(name) {
	fetch(`https://restcountries.com/v2/name/${name}`)
	  .then(response => response.json())
	  .then(data => renderCountry(data[0]));
}
