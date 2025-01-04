const express = require("express");
const users = require("./mydata.json");
const fs = require("fs");

//instanc
const app = express();

const PORT = process.env.PORT || 8000;
//middleware
app.use(express.urlencoded({ extended: false }));

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
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./mydata.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

// app.patch("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

// app.delete("/api/users/:id", (req, res) => {
//   return res.json({ status: "pending" });
// });

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
