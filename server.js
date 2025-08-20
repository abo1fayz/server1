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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGlqc2RxbWF2a2xwZ3VudW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNzUzODgsImV4cCI6MjA3MDk1MTM4OH0.uC6t3PgZYOMQuWxFQrFy9aXIR4um0X1Lsf8SkplhZlc"
  });
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
