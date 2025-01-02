const fs = require("fs");

//console.log("it is a built in module", fs);

//* syncronous way which means blocking req operation
//fs.writeFileSync("./test.txt", "My custom file content1");
//isme jo bhi content likha jayega wo bar bar override hoga means purana delete ho jayega aur nyaa add ho jayega

//* Asycnronous way which means Non-blocking req operation
// fs.writeFile(
//   "./test2.text",
//   "async content to see the changes in file",
//   (err) => {}
// );
//isme ek callback aata hai

//* read file in sync way
const result = fs.readFileSync("./contact.txt", "UTF-8");
console.log(result);
//sync task result ko return karta h

//kch return nhi krega void type ayega aise karne se
// const res = fs.readFile(", ",(err, res){})
//* read file in async way
fs.readFile("./contact.txt", "UTF-8", (err, result) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log(result);
  }
});
//async kch return nhi krta h always expect a callback which has two parameters err, and result

//* append file
// fs.appendFileSync("./test.txt", new Date().getDate().toLocaleString());
fs.appendFileSync("./test.txt", `${Date.now().toLocaleString()}Hye vro!\n`);

//copy a file
//fs.cpSync("./test.txt", "./copy2.txt");

//delete a file
//fs.unlinkSync("./copy2.txt");
//=> ./copy.txt jo bhi file delete krni ho

//it will show all the  details like size, uid etc
console.log(fs.statSync("./test.txt"));
// console.log(fs.statSync("./test.txt").isFile());

fs.mkdirSync("myDocs");
