import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if(req.method==="OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json({limit:'1mb'}));

const EMAIL = process.env.EMAIL || "";
const PASS = process.env.PASS || "";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || "";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const PORT = Number(process.env.PORT || 3000);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT===465,
  auth: (EMAIL && PASS) ? { user: EMAIL, pass: PASS } : undefined
});

async function sendDiscord(payload){
  if(!DISCORD_WEBHOOK) return;
  try{
    await fetch(DISCORD_WEBHOOK, { method:'POST', headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ username:"Aurenix Bot", embeds:[{ title: payload.topic || "New Form", fields: Object.entries(payload).slice(0,10).map(([k,v])=>({ name:k, value:String(v).slice(0,900), inline:true })) , timestamp:new Date().toISOString() }] }) });
  }catch(e){ console.error("Discord error", e.message); }
}

app.post("/send", async (req,res)=>{
  const data = req.body || {};
  try{
    if(EMAIL && PASS){
      await transporter.sendMail({ from:`Aurenix Lab <${EMAIL}>`, to: EMAIL, subject: `New ${data.topic||'Request'}`, html:`<pre>${JSON.stringify(data,null,2)}</pre>` });
      if(data.email){
        await transporter.sendMail({ from:`Aurenix Lab <${EMAIL}>`, to: data.email, subject:"We received your request", html:"<p>Danke! Wir melden uns.</p>" });
      }
    }
    await sendDiscord(data);
    res.json({ ok:true });
  }catch(err){
    console.error("Send error", err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

app.get("/", (req,res)=>res.send("Aurenix Lab API alive"));
app.listen(PORT, ()=>console.log("Server listening on", PORT));
