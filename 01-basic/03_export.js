//basic method
function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

//fat Arrow function which is annonymous
// exports.add = (a, b) => {
//   return a + b;
// };
// exports.sub = (a, b) => {
//   return a - b;
// };

//module.exports = add;❎ alag export nhi kar sakte
//module.exports = sub;❎ kyuki ye override ho jayega

//basic export
// module.exports = {
//   ✅
//   add,
//   sub,
// };

//custom export
module.exports = {
  addition: add,
  subtraction: sub,
};
