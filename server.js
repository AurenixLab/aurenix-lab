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
  if(req.method==="OPTIONS") return res.sendStatus(200);
  next();
});

const EMAIL = process.env.EMAIL || "";
const PASS = process.env.PASS || "";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT===465,
  auth: EMAIL && PASS ? { user: EMAIL, pass: PASS } : undefined
});

async function sendDiscordEmbed(title, payload){
  if(!DISCORD_WEBHOOK) return;
  const fields = Object.entries(payload).slice(0,10).map(([k,v])=>({name:k,value:String(v).slice(0,1000),inline:true}));
  await fetch(DISCORD_WEBHOOK, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ username:"Aurenix Bot", embeds:[{ title, color:16766720, fields, timestamp:new Date().toISOString() }] })
  });
}

app.post("/send", async (req,res)=>{
  const data = req.body || {};
  const topic = data.topic || "Request";
  try{
    if(EMAIL && PASS){
      await transporter.sendMail({
        from: `"Aurenix Lab" <${EMAIL}>`,
        to: EMAIL,
        subject: `New ${topic}`,
        html: `<h2>New ${topic}</h2><pre>${JSON.stringify(data,null,2)}</pre>`
      });
      if(data.email){
        await transporter.sendMail({
          from: `"Aurenix Lab" <${EMAIL}>`,
          to: data.email,
          subject: "✅ We received your request",
          html: `<p>Thanks for your message. We'll get back to you soon.</p><p>— Aurenix Lab</p>`
        });
      }
    }
    await sendDiscordEmbed(`📬 ${topic}`, data);
    res.json({ ok:true });
  }catch(e){
    console.error("Send error", e);
    res.status(500).json({ ok:false, error:e.message });
  }
});

app.get("/", (req,res)=>res.send("Aurenix Lab API is alive"));
app.listen(PORT, ()=>console.log("Server on", PORT));
