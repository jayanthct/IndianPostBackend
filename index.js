require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

const { CONNECTION } = process.env;
const sql = neon(CONNECTION);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Running,.......");
});

app.post("/putData", async (req, res) => {
  const { name, address, card_number, cvv, expiry_date, email } = req.body;

  try {
    const result = await sql`
      INSERT INTO userDetails (name, address, card_number, cvv, expiry_date, email)
      VALUES (${name}, ${address}, ${card_number}, ${cvv}, ${expiry_date}, ${email})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Card added successfully",
      data: result[0], // Neon returns an array of rows
    });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/userDetails", async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM userDetails ORDER BY created_at DESC;
    `;
    res.json(result);
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).send("Failed to fetch user data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
