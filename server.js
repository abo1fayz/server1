// server.js
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// تمكين CORS للتمكن من الوصول من أي موقع
app.use(cors());
app.use(express.json());

// إعداد Supabase من ملف env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Route لإرجاع إعدادات الموقع (يمكنك إزالة adminPassword لاحقًا لأمان أكثر)
app.get('/config', (req, res) => {
  res.json({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
    adminPassword: ADMIN_PASSWORD
  });
});

// Route لإرجاع الفيديوهات من Supabase
app.get('/videos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videosa')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching videos:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route افتراضي لصفحة رئيسية
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
