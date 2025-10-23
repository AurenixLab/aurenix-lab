import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS"){ return res.sendStatus(200); }
  next();
});

const EMAIL = process.env.EMAIL || "";
const PASS = process.env.PASS || "";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: EMAIL, pass: PASS }
});

async function sendDiscordEmbed(title, fields = []) {
  if(!DISCORD_WEBHOOK) return;
  const embed = { title, color: 16766720, fields, timestamp: new Date().toISOString() };
  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "Aurenix Bot", embeds: [embed] })
  });
}

app.post("/send", async (req, res) => {
  const data = req.body || {};
  const topic = data.topic || "Anfrage";
  try {
    if(EMAIL){
      await transporter.sendMail({
        from: `"Aurenix Lab" <${EMAIL}>`,
        to: EMAIL,
        subject: `Neue Anfrage: ${topic}`,
        html: `<h2>Neue Anfrage: ${topic}</h2><pre>${JSON.stringify(data,null,2)}</pre>`
      });
    }
    if(data.email && EMAIL){
      await transporter.sendMail({
        from: `"Aurenix Lab" <${EMAIL}>`,
        to: data.email,
        subject: "✅ Deine Anfrage bei Aurenix Lab",
        html: `<p>Hallo ${data.name || "User"},</p><p>vielen Dank für deine Anfrage. Wir melden uns in Kürze.</p><p>— Aurenix Lab</p>`
      });
    }
    const fields = Object.entries(data).slice(0,10).map(([k,v])=>({name:k, value:String(v).slice(0,1000), inline:true}));
    await sendDiscordEmbed(`📬 ${topic}`, fields);
    res.json({ success: true });
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ success:false, error: err.message });
  }
});

app.get("/", (req,res)=>res.send("Aurenix Lab API is alive"));
app.listen(PORT, ()=>console.log(`Server on ${PORT}`));
