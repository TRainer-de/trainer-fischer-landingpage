import nodemailer from 'nodemailer';
import formTools from '../../lib/form.cjs';
import makePDF from '../../lib/pdf.cjs';
const {validate,signature,receiptFor,verifyReceipt}=formTools;
const json=(status,value)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export async function handle(request,env=process.env,transportFactory=nodemailer.createTransport){
 if(request.method!=='POST')return json(405,{error:'Bitte das Formular verwenden.'});
 const allowed=[env.URL,env.DEPLOY_PRIME_URL,env.ALLOWED_ORIGIN,'https://trainer-fischer.online','https://www.trainer-fischer.online'].filter(Boolean);
 if(!allowed.includes(request.headers.get('origin')))return json(403,{error:'Diese Herkunft ist nicht zugelassen.'});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json(415,{error:'Ungültiges Datenformat.'});
 const raw=await request.text();if(Buffer.byteLength(raw)>40000)return json(413,{error:'Die Eingaben sind zu lang.'});
 let input,d;try{input=JSON.parse(raw);d=validate(input);if(input.website)throw Error('Ungültige Eingabe.');}catch(e){return json(400,{error:e.message});}
 if(!['pdf','send'].includes(input.action))return json(400,{error:'Ungültige Aktion.'});
 if(input.action==='pdf'){const pdf=await makePDF(d);return new Response(pdf,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Trainingsziele_Bauwert.pdf"','Cache-Control':'no-store'}});}
 if(!env.SMTP_USER||!env.SMTP_PASSWORD||!env.FORM_ACCESS_CODE||!env.MAIL_ARCHIVE_SECRET||env.MAIL_ARCHIVE_SECRET.length<32)return json(503,{error:'Der Versand ist noch nicht eingerichtet. Bitte die PDF herunterladen.'});
 if(input.code!==env.FORM_ACCESS_CODE)return json(403,{error:'Der Einladungscode fehlt oder ist ungültig.'});
 if(input.receipt&&!verifyReceipt(env.MAIL_ARCHIVE_SECRET,d,input.receipt))return json(400,{error:'Der Versandbeleg ist abgelaufen oder ungültig. Bitte die PDF herunterladen und Rainer Fischer kontaktieren.'});
 const port=Number(env.SMTP_PORT||465);if(![465,587].includes(port))return json(503,{error:'Der Versand ist noch nicht eingerichtet.'});
 const transport=transportFactory({host:env.SMTP_HOST||'smtps.udag.de',port,secure:port===465,requireTLS:true,auth:{user:env.SMTP_USER,pass:env.SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,disableFileAccess:true,disableUrlAccess:true});
 const pdf=await makePDF(d),target='buero@trainer-fischer.online',subject='[TF-BAUWERT] Trainingsziele | '+d.seminar+' | '+d.name;
 const common={from:{name:'Rainer Fischer · Trainingsziele',address:target},subject,attachments:[{filename:'Trainingsziele_Bauwert_'+d.date+'_'+d.id+'.pdf',content:pdf,contentType:'application/pdf'}]};
 let receipt=input.receipt;
 if(!receipt){try{const result=await transport.sendMail({...common,to:target,replyTo:d.email,text:'Die ausgefüllten Trainingsziele befinden sich im PDF-Anhang.\nTeilnehmer: '+d.name,headers:{'X-TF-Form':'bauwert-v1','X-TF-ID':d.id,'X-TF-Signature':signature(env.MAIL_ARCHIVE_SECRET,d.id,pdf)}});if(!result.accepted?.length)throw Error();receipt=receiptFor(env.MAIL_ARCHIVE_SECRET,d);}catch{return json(502,{error:'Der Versand konnte nicht bestätigt werden. Bei einem Verbindungsabbruch kann die E-Mail trotzdem angekommen sein. Bitte die PDF herunterladen und vor erneutem Versand Rücksprache halten.'});}}
 let copySent=false;try{const result=await transport.sendMail({...common,to:d.email,replyTo:target,text:'Hallo '+d.name+',\n\nanbei Ihre ausgefüllten Trainingsziele als PDF. Bitte bewahren Sie diese Kopie auf.\n\nRainer Fischer'});copySent=!!result.accepted?.length;}catch{}
 return json(200,{coachSent:true,copySent,receipt});
}
export default async request=>{try{return await handle(request);}catch{return json(500,{error:'Die Verarbeitung ist gerade nicht möglich. Bitte später erneut versuchen.'});}};
export const config={path:'/api/trainingsziele',rateLimit:{windowLimit:40,windowSize:60,aggregateBy:['ip','domain']}};
