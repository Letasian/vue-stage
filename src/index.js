import "./index.less"
let fn = () => {
    console.log('箭头函数');
}
fn();
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(123);
    }, 1000)
})
promise.then(res => {
    console.log(res);
})