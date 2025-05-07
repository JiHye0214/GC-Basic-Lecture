// const function1 = () => {
//     const arr = [];
//     for(let i=0; i<3; i++) {
//         const num = prompt("enter number : ");
//         arr.push(num);
//     }

//     arr.sort(function(a,b) {
//         return a-b;
//     });

//     const maxBtn = document.querySelector("button");
//     const maxResult = document.querySelector("#max");
//     maxBtn.addEventListener("click", () => {
//         maxResult.innerHTML = arr[2];
//     })
// }

// function1();

// 파라미터를 받는 거였으면 말을 해야지얼넏랴ㅓㅐㄷ너랴덜

function maxBetween3Numbers(n1, n2, n3) {
    let max = Math.max(n1, n2, n3);

    const maxResult = document.querySelector("#max");
    maxResult.innerHTML = max;
}
const maxBtn = document.querySelector("button");
maxBtn.addEventListener("click", () => maxBetween3Numbers(10, 10, 55));