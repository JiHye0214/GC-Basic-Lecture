instantiate instance of an object
constructor : a method that initializes an object when it's created.

Promise
	resolve, reject 콜백함수를 인자로 갖는다 
	* 콜백함수 : 다른 함수의 인자로 전달되어 실행되는 함수, 즉 어떤 작업이 끝난 뒤 실행되는 함수 
	response 여부에 따라 보통 resolve는 then / reject는 catch 함수의 인자로 리턴함
	response 없으면 걍 resolve 실행 

-------------------- 방법1
const p = new Promise((resolve, reject) => {
  reject("💥 에러 발생!");
});

p.then(result => {
  console.log("Then:", result); // 호출되지 않음
})
.catch(error => {
  console.log("Catch:", error); // 👉 "💥 에러 발생!"
});

-------------------- 방법2
const p = new Promise((resolve, reject) => {
  reject("🚨 실패!");
});

p.then(
  result => console.log("성공:", result),
  error => console.log("실패:", error) // 👉 여기서도 처리 가능
);


URL
Uniform Resource Locator
		ㄴ> file (data structure), some grouping information

Await
function resolveAfter2Seconds(x) {
	return new Promise(resolve => {
		setTimeout(() => resolve(x), 2000);
	});
}

async function f1() {
	const x = await resolveAfter2Seconds(10);
	console.log(x); // 10
}

f1();

* async/await 없으면 x는 빈 Promise 객체 --> 리턴값이 new Promise이니까 


-------------------------------------------- 예시2
function get(url) {
	// Return a new promise.
	return new  Promise(function(resolve, reject) {
		// Do the usual XHR stuff
		const req = new XMLHttpRequest();
	
		req.open('GET', url, true);

		req.onload = () => {
			// This is called even on 404 etc
			// so check the status
			if (req.DONE && req.status == 200) {  // 여기서 req.Done은 숫자 4를 리턴하며, 모든 숫자는 truety 하기 때문에 true로 간주된다. 
				// Resolve the promise with the response text
				resolve(req.response);
			}
			else {
				// Otherwise reject with the status text/
					// which will hopefully be a meaningful error
			reject(Error(req.statusText));
		}
		};

		// Handle network errors
		req.onerror = () => reject(Error("Network Error"));
		
		// Make the request
		req.send();
	});
}

const url = 'http://ilemon.mobi/site1/b.php';
get(url).then(res => console.log(res));