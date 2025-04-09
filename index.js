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

app.post("/putData", async (req, res) => {
  const { name, address, card_number, cvv, expiry_date, email } = req.body;

  try {
    const query = `
      INSERT INTO cards (name, address, card_number, cvv, expiry_date, email)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [name, address, card_number, cvv, expiry_date, email];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Card added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/userDetails", async (req, res) => {
  try {
    const result =
      await sql`SELECT * FROM userDetails ORDER BY created_at DESC`;
    res.json(result);
    console.log(result);
  } catch (error) {
    console.error("Error retrieving cards:", error);
    res.status(500).send("Failed to fetch card data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
