//* basic import
//const { add } = require("./03_export"); //✅
//const { sub } = require("./03_export"); //✅

//const  add  = require("./03_export");//❎
//const  sub  = require("./03_export");//❎

//console.log("Math value is", add(5, 2));
//console.log("Math value is", sub(7, 2));

//* multiple imports
const { addition, subtraction } = require("./03_export");

console.log("Math value is", addition(5, 2));
console.log("Math value is", subtraction(7, 2));

//* we change the name means custome import
const {
  addition: custom_Add,
  subtraction: custom_Sub,
} = require("./03_export");

console.log("Math value is", custom_Add(5, 2));
console.log("Math value is", custom_Sub(7, 2));
