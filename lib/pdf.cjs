const PDFDocument=require('pdfkit');const path=require('node:path');
module.exports=function makePDF(d){return new Promise((resolve,reject)=>{
 const doc=new PDFDocument({size:'A4',margin:48,bufferPages:true,info:{Title:'Trainingsziele – Bauwert',Author:'Rainer Fischer'}}),chunks=[];
 doc.on('data',x=>chunks.push(x));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
 doc.registerFont('Body',path.join(process.cwd(),'fonts/body.woff'));doc.font('Body');
 doc.image(path.join(process.cwd(),'assets/trainer-fischer-logo.png'),48,35,{width:190});doc.y=112;
 doc.fillColor('#a74700').fontSize(10).text('BAUWERT · TRAINING & TRANSFER');doc.moveDown(.5);doc.fillColor('#063d5d').fontSize(25).text('Meine Trainingsziele');doc.moveDown(.5);
 doc.fontSize(11).text(d.name+' · '+d.email).text(d.seminar+' · '+d.date);doc.moveDown();
 const rows=[['Mentale Stärke in herausfordernden Zeiten',d.mental],['Erstkontakt (Telefonie / face 2 face) mit Interessenten',d.contact],['Leadverfolgung zum erfolgreichen Abschluss',d.leads],['Das Training war für mich erfolgreich, weil …',d.success],['1. Kontrolltermin',d.check1],['Ergebnisse',d.result1],['2. Kontrolltermin',d.check2],['Ergebnisse',d.result2]];
 for(const [title,text]of rows){if(doc.y>680)doc.addPage();doc.fillColor('#063d5d').fontSize(12).text(title);doc.moveDown(.35);doc.fillColor('#243743').fontSize(10).text(text||'Noch offen',{lineGap:3});doc.moveDown(1);}
 const pages=doc.bufferedPageRange();for(let i=pages.start;i<pages.start+pages.count;i++){doc.switchToPage(i);doc.fillColor('#546370').fontSize(7).text(d.id+'  ·  Seite '+(i+1)+' / '+pages.count,48,800,{lineBreak:false});}doc.end();
});};
