// استدعاء المكتبات
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // إذا كنت تستخدم .env لتخزين المفاتيح

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // لدعم JSON في POST requests

// تهيئة Supabase على السيرفر فقط
const supabase = createClient(
  process.env.SUPABASE_URL || "https://ikpijsdqmavklpgunumm.supabase.co",
  process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGlqc..."
);

// راوت لإرجاع الفيديوهات فقط (بدون إرسال أي مفاتيح)
app.get("/videos", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("videosa")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// راوت لإضافة فيديو جديد (يتطلب كلمة مرور)
app.post("/videos", async (req, res) => {
  const { password, title, url } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
  }

  try {
    const { data, error } = await supabase.from("videosa").insert([
      {
        title,
        url,
        created_at: new Date().toISOString(),
        likes_count: 0,
        liked_by: [],
      },
    ]);

    if (error) throw error;
    res.json({ success: true, video: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// راوت لحذف فيديو (يتطلب كلمة مرور)
app.delete("/videos/:id", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
  }

  try {
    const { error } = await supabase.from("videosa").delete().eq("id", id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
