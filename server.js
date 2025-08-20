// استدعاء المكتبات
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات Supabase
const supabaseUrl = "https://ikpijsdqmavklpgunumm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcGlqc...";
const supabase = createClient(supabaseUrl, supabaseKey);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// راوت لإرجاع الفيديوهات
app.get("/videos", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("videosa")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const videos = data.map(video => ({
      ...video,
      liked_by: video.liked_by ? JSON.parse(video.liked_by) : []
    }));

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// راوت لتحديث الإعجاب
app.post("/like/:id", async (req, res) => {
  const videoId = req.params.id;
  const userId = req.body.userId;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const { data: videoData, error: fetchError } = await supabase
      .from("videosa")
      .select("*")
      .eq("id", videoId)
      .single();

    if (fetchError) return res.status(400).json({ error: fetchError.message });

    let likedBy = videoData.liked_by ? JSON.parse(videoData.liked_by) : [];
    let likesCount = videoData.likes_count || 0;

    if (likedBy.includes(userId)) {
      likedBy = likedBy.filter(id => id !== userId);
      likesCount--;
    } else {
      likedBy.push(userId);
      likesCount++;
    }

    const { error: updateError } = await supabase
      .from("videosa")
      .update({ liked_by: JSON.stringify(likedBy), likes_count: likesCount })
      .eq("id", videoId);

    if (updateError) return res.status(500).json({ error: updateError.message });

    res.json({ likes_count: likesCount, liked_by: likedBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// راوت لإضافة رابط فيديو خارجي
app.post("/add-video", async (req, res) => {
  const { title, url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const { error: insertError } = await supabase.from("videosa").insert([{
      title: title || "بدون عنوان",
      url,
      likes_count: 0,
      liked_by: JSON.stringify([])
    }]);

    if (insertError) return res.status(500).json({ error: insertError.message });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
