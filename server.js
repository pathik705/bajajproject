const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const fullName = "Pathik yadav";
const dob = "05102004";
const email = "pathik.yadav2022@vitstudent.ac.in";
const rollNumber = "22BCE2961";

function createUserId(name, dobStr) {
  const formatted = name.trim().toLowerCase().replace(/\s+/g, "_");
  return `${formatted}_${dobStr}`;
}

function isInteger(str) {
  return /^-?\d+$/.test(str);
}

function isAlphabet(str) {
  return /^[A-Za-z]+$/.test(str);
}

function alternatingCapsReverse(letters) {
  const reversed = [...letters].reverse();
  return reversed
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  const userId = createUserId(fullName, dob);

  try {
    const { data } = req.body || {};
    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id: userId,
        email,
        roll_number: rollNumber,
        message: "Invalid input. Expected format: { data: [...] }"
      });
    }

    const evenNums = [];
    const oddNums = [];
    const alphabets = [];
    const specials = [];
    let totalSum = 0;
    const charsForConcat = [];

    for (const entry of data) {
      const strVal = String(entry);
      for (const ch of strVal) {
        if (/[A-Za-z]/.test(ch)) charsForConcat.push(ch);
      }

      if (isInteger(strVal)) {
        const num = parseInt(strVal, 10);
        totalSum += num;
        if (Math.abs(num) % 2 === 0) {
          evenNums.push(strVal);
        } else {
          oddNums.push(strVal);
        }
      } else if (isAlphabet(strVal)) {
        alphabets.push(strVal.toUpperCase());
      } else {
        specials.push(strVal);
      }
    }

    const concatString = alternatingCapsReverse(charsForConcat);

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email,
      roll_number: rollNumber,
      odd_numbers: oddNums,
      even_numbers: evenNums,
      alphabets,
      special_characters: specials,
      sum: String(totalSum),
      concat_string: concatString
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      user_id: createUserId(fullName, dob),
      email,
      roll_number: rollNumber,
      message: "Internal server error"
    });
  }
});

app.get("/", (_req, res) => {
  res.json({ status: "OK", route: "/bfhl", method: "POST" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API running on port ${PORT}`);
});
