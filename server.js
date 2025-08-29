import express from "express";

const app = express();
app.use(express.json());

const isNum = (x) => typeof x === "string" && /^-?\d+$/.test(x);
const isAlpha = (x) => typeof x === "string" && /^[A-Za-z]+$/.test(x);

const altCaps = (s) =>
  s
    .split("")
    .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
    .join("");

const proc = (arr) => {
  let ev = [], od = [], al = [], sp = [], sm = 0, all = "";

  for (const x of arr) {
    const v = String(x);
    if (isNum(v)) {
      const n = parseInt(v, 10);
      sm += n;
      (Math.abs(n) % 2 === 0 ? ev : od).push(v);
    } else if (isAlpha(v)) {
      const u = v.toUpperCase();
      al.push(u);
      all += u;
    } else {
      sp.push(v);
    }
  }

  return {
    ev, od, al, sp,
    sm: String(sm),
    cat: altCaps(all.split("").reverse().join(""))
  };
};

const nm = (process.env.FULL_NAME || "pathik_yadav").toLowerCase().replace(/\s+/g, "_");
const dt = process.env.DATE_DDMMYYYY || "29082025";
const em = process.env.EMAIL || "pathik@example.com";
const rn = process.env.ROLL_NUMBER || "VITXXXXXX";

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Use POST /bfhl" });
});

app.post("/bfhl", (req, res) => {
  const d = req.body?.data;
  if (!Array.isArray(d)) {
    return res.json({
      is_success: false,
      user_id: `${nm}_${dt}`,
      email: em,
      roll_number: rn,
      msg: "Invalid input"
    });
  }

  const r = proc(d);
  res.json({
    is_success: true,
    user_id: `${nm}_${dt}`,
    email: em,
    roll_number: rn,
    odd_numbers: r.od,
    even_numbers: r.ev,
    alphabets: r.al,
    special_characters: r.sp,
    sum: r.sm,
    concat_string: r.cat
  });
});

app.use((req, res) => {
  res.status(404).json({ is_success: false, msg: "Not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on ${port}`));
