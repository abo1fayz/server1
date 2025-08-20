// استدعاء المكتبات
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل CORS لجميع الطلبات
app.use(cors());

// راوت خاص لإرجاع الإعدادات (مثلاً supabaseUrl و supabaseKey)
app.get("/config", (req, res) => {
  res.json({
    supabaseUrl: "https://ikpijsdqmavklpgunumm.supabase.co",
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGlqc..."
  });
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
