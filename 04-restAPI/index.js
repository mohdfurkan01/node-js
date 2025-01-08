const express = require("express");
const users = require("./mydata.json");
const fs = require("fs");

//instanc
const app = express();

const PORT = process.env.PORT || 8000;
//middleware
app.use(express.urlencoded({ extended: false }));
//app.use(express.json({ extended: false }));

//custom middleware
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`,
    (err, data) => {
      next(); //next middleware must be called
    }
  );
});

//middleware1 ki req body m change kiya ab har kahi access hoga
app.use((req, res, next) => {
  console.log("I am middleware1");
  req.myUser = "ahsan";
  next();
});

//yaha bhi access hoga myUser ka so we can modify the req
app.use((req, res, next) => {
  console.log("I am middleware2", req.myUser);
  req.myUser = "ahsan";
  next();
});

//routes => http://localhost:8000/users
app.get("/users", (req, res) => {
  const html = `<ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
      </ul>
      `;
  res.send(html);
});

//http://localhost:8000/api/users

//REST API
app.get("/api/users", (req, res) => {
  // Content-Type ye ek built in header h
  //! custom header
  //and always add X to a custom header bcoz it is the convention method and a good practice and others will also get it ki ye custom header h
  res.setHeader("X-myName", "furkan"); //ye postman k header m dikhtah
  console.log(req.headers); //iske liye postman s req bhejna h then console m dikhega
  return res.json(users);
});

// :id => means it's a varivale
// app.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
//   return res.json(user);
// });

//or we can merge all the three routes with same route having id
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  })
  .patch((req, res) => {
    //TODO: Update(Edit) the user with id
    const id = Number(req.params.id);
    const updates = req.body; // Get the fields to update
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's fields
    users[userIndex] = { ...users[userIndex], ...updates };

    // Write updated data to the file
    fs.writeFile(
      "./mydata.json",
      JSON.stringify(users, null, 2),
      (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to update file", error: err });
        }

        // Respond with success and the updated user
        return res.status(200).json({
          status: "User updated successfully",
          user: users[userIndex],
        });
      }
    );
  })
  .delete((req, res) => {
    //TODO: Delete the user with id
    const id = Number(req.params.id);
    // Find the index of the user to delete
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the array
    const deletedUser = users.splice(userIndex, 1)[0];

    // Update the JSON file
    fs.writeFile("./mydata.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to update file", error: err });
      }

      // Respond with the deleted user's details
      return res
        .status(200)
        .json({ status: "User Deleted successfully", user: deletedUser });
    });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  //console.log(body);
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./mydata.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length });
  });
});

// app.patch("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

// app.delete("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
