import express from "express";
import dotenv from "dotenv";

dotenv.config(); // يقرأ ملف .env

const app = express();
const PORT = process.env.PORT || 3000;

// مثال على الوصول لمتغيرات البيئة
app.get("/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
    adminPassword: process.env.ADMIN_PASSWORD
  });
});

app.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
