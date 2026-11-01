const crypto=require('node:crypto');
const limits={name:100,email:254,seminar:120,date:10,dateEnd:10,mental:3000,contact:3000,leads:3000,success:4000,check1:10,result1:3000,check2:10,result2:3000};
function validate(input){
 const d={}; if(!input||typeof input!=='object')throw Error('Ungültige Angaben.');
 for(const [k,max]of Object.entries(limits)){const v=input[k]??'';if(typeof v!=='string'||v.length>max||/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(v))throw Error('Bitte Eingaben und Textlängen prüfen.');d[k]=v.trim();}
 for(const k of ['name','email','seminar','date','dateEnd','mental','contact','leads','success'])if(!d[k])throw Error('Bitte alle Pflichtfelder ausfüllen.');
 if(/[\r\n]/.test(d.name+d.seminar)||! /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(d.email))throw Error('Bitte Name und E-Mail-Adresse prüfen.');
 for(const k of ['date','dateEnd','check1','check2'])if(d[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(d[k])||Number.isNaN(Date.parse(d[k]))||new Date(d[k]).toISOString().slice(0,10)!==d[k]))throw Error('Bitte ein gültiges Datum eingeben.');
 if(d.dateEnd<d.date)throw Error('Das Enddatum darf nicht vor dem Startdatum liegen.');
 if(input.privacy!==true)throw Error('Bitte den Datenschutzhinweis bestätigen.');
 if(typeof input.id!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id))throw Error('Ungültige Formular-ID.');
 d.id=input.id;return d;
}
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const mac=(secret,x)=>crypto.createHmac('sha256',secret).update(x).digest('hex');
const signature=(secret,id,pdf)=>mac(secret,id+'\n'+hash(pdf));
function receiptFor(secret,d){const b=Buffer.from(JSON.stringify({hash:hash(JSON.stringify(d)),expires:Date.now()+86400000})).toString('base64url');return b+'.'+mac(secret,b);}
function verifyReceipt(secret,d,r){try{if(typeof r!=='string'||r.length>1000)return false;const[b,s]=r.split('.');const want=mac(secret,b);if(s?.length!==want.length||!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(want)))return false;const p=JSON.parse(Buffer.from(b,'base64url'));return p.expires>Date.now()&&p.hash===hash(JSON.stringify(d));}catch{return false;}}
module.exports={validate,signature,receiptFor,verifyReceipt};
