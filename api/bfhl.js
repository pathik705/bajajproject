export default function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ is_success: false, msg: "Only POST allowed" });
    }
  
    const isNum = (x) => typeof x === "string" && /^-?\d+$/.test(x);
    const isAlpha = (x) => typeof x === "string" && /^[A-Za-z]+$/.test(x);
    const altCaps = (s) =>
      s.split("").map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase())).join("");
  
    const nm = (process.env.FULL_NAME || "bajaj").toLowerCase();
    const dt = process.env.DATE_DDMMYYYY || "29082025";
    const em = process.env.EMAIL || "bajaj@example.com";
    const rn = process.env.ROLL_NUMBER || "VITXXXXXX";
  
    try {
      const { data } = req.body || {};
      if (!Array.isArray(data)) {
        return res.status(200).json({
          is_success: false,
          user_id: `${nm}_${dt}`,
          email: em,
          roll_number: rn,
          msg: "Invalid input"
        });
      }
  
      let ev = [], od = [], al = [], sp = [], sm = 0, all = "";
      for (const x of data) {
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
  
      const concat = altCaps(all.split("").reverse().join(""));
  
      return res.status(200).json({
        is_success: true,
        user_id: `${nm}_${dt}`,
        email: em,
        roll_number: rn,
        odd_numbers: od,
        even_numbers: ev,
        alphabets: al,
        special_characters: sp,
        sum: String(sm),
        concat_string: concat
      });
    } catch (e) {
      return res.status(200).json({
        is_success: false,
        user_id: `${nm}_${dt}`,
        email: em,
        roll_number: rn,
        msg: "Error occurred"
      });
    }
  }
  