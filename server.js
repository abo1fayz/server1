require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// تهيئة Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// راوت لإرجاع الفيديوهات
app.get("/videos", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("videosa")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(500).json({ error: err.message });
  }
});

// راوت للتحقق من كلمة مرور المدير
app.post("/admin-login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "كلمة المرور خاطئة" });
  }
});

// راوت لإضافة فيديو خارجي (آمن فقط عبر السيرفر)
app.post("/add-video", async (req, res) => {
  const { password, title, url } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "غير مخول" });
  }
  try {
    const { error } = await supabase.from("videosa").insert([{
      title: title || 'بدون عنوان',
      url,
      created_at: new Date().toISOString(),
      likes_count: 0,
      liked_by: []
    }]);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
