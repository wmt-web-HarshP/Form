const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./connection");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Home route to serve the HTML form
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// POST route to handle form submission and insert data into the database
app.post("/", (req, res) => {
    try {
        let { ID, name, email, PhoneNum } = req.body; // Destructure request body
        let sql = `INSERT INTO new_table(ID, name, email, mno) VALUES (?, ?, ?, ?)`;
        connection.query(sql, [ID, name, email, PhoneNum], (error, results) => {
            if (error) {
                console.log(error); // Log the error for debugging
                return res.status(500).send("An error occurred while processing your request.");
            }
            res.redirect("/students");
        });
    } catch (error) {
        console.log(error); // Log any caught errors for debugging
        res.status(500).send("An error occurred while processing your request.");
    }
});

// Route to display the list of students
app.get("/students", (req, res) => {
    let sql = "SELECT * FROM new_table";
    connection.query(sql, (error, result) => {
        if (error) console.log(error);
        res.render(__dirname + "/student.ejs", { new_table: result });
    });
});

// Route to delete a student record
app.get("/delete-Student", (req, res) => {
    let id = req.query.id;
    let sql = "DELETE FROM new_table WHERE id=?";
    connection.query(sql, [id], (error, result) => {
        if (error) throw error;
        res.redirect("/students");
    });
});

// Route to display the form to update a student record
app.get("/update-Student", (req, res) => {
    let id = req.query.id;
    let sql = `SELECT * FROM new_table WHERE id=?`;
    connection.query(sql, [id], (error, result) => {
        if (error) throw error;
        res.render(__dirname + "/updatestudent.ejs", { new_table: result });
    });
});

// Route to handle updating a student record
app.post("/update-Student", (req, res) => {
    let id = req.body.ID;
    let name = req.body.name;
    let email = req.body.email;
    let phoneNum = req.body.PhoneNum;
    let sql = `UPDATE new_table SET name=?, email=?, mno=? WHERE id=?`;
    connection.query(sql, [name, email, phoneNum, id], (error, result) => {
        if (error) throw error;
        res.redirect("/students");
    });
});

// Server listening on PORT 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
