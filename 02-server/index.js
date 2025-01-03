//it's a good practice always your file name as index.js which a main file also it is an entry point

const http = require("http");
const fs = require("fs");
const url = require("url");

// Function to get the formatted date and time
function getFormattedDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} ${time}`;
}

const myServer = http.createServer((req, res) => {
  //console.log(req.headers);
  //console.log(req);
  if (req.url === "/favicon.ico") return res.end();

  //const log = `${Date.now()}: ${req.url} New Req Received\n`;
  //assign it to a variable for reusability and code easier to understand
  const formattedDateTime = getFormattedDateTime();
  const log = `${formattedDateTime}: ${req.url} ${req.method} New Req Received\n`;

  //we can call it directly both are valid
  //const log = `${getFormattedDateTime()}: ${req.url} New Req Received\n`;

  //true krne par query parameter bhi pass kar skte hain
  const myUrl = url.parse(req.url, true);

  console.log(myUrl);

  fs.appendFile("log.txt", log, (err, data) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
    // switch (req.url) {
    switch (myUrl.pathname) {
      case "/":
        if (req.method === "GET") {
          res.end(
            `<h1 style="color:green; text-align:center;">This is my Home Page</h1>`
          );
        }

        break;
      case "/about":
        const username = myUrl.query.myname;
        if (!username) {
          res.end("Please provide a username");
        } else {
          res.end(`Hi ${username}`);
        }

        break;
      case "/contact":
        res.end("This is my  Contact page ");
        break;
      case "/login":
        res.end("This is my  Login page ");
        break;
      case "/signup":
        if (req.method === "GET") res.end("This is a signup form");
        else if (req.method === "POST") {
          //DB query
          res.end("Successfully submited the form Data");
        }
        break;

      default:
        res.end(
          `<h1 style="color:red; text-align:center;">404 Page Not Found</h1>`
        );
    }
  });
});

myServer.listen(8000, () => console.log("Server started"));
