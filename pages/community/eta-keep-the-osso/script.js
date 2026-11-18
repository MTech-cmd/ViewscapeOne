(() => {
'use strict';
const TZ='Europe/Amsterdam';
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
function parts(date){const out={};for(const p of formatter.formatToParts(date)){if(p.type!=='literal')out[p.type]=Number(p.value)}return out;}
function makeTodayTime(hour,minute,second=0){const p=parts(new Date());const date=new Date(Date.UTC(p.year,p.month-1,p.day,hour,minute,second));const utcParts=parts(date);const offset=(Date.UTC(utcParts.year,utcParts.month-1,utcParts.day,utcParts.hour,utcParts.minute,utcParts.second)-date.getTime());return new Date(date.getTime()-offset);}
function buildDial(){const svgNS='http://www.w3.org/2000/svg';const group=$('ticks');for(let i=0;i<60;i++){const angle=i*Math.PI/30;const major=i%5===0;const r1=major?91:96;const r2=103;const line=document.createElementNS(svgNS,'line');line.setAttribute('x1',120+Math.sin(angle)*r1);line.setAttribute('y1',120-Math.cos(angle)*r1);line.setAttribute('x2',120+Math.sin(angle)*r2);line.setAttribute('y2',120-Math.cos(angle)*r2);line.setAttribute('class',major?'major-tick':'tick');group.appendChild(line);if(major){const num=document.createElementNS(svgNS,'text');num.setAttribute('x',120+Math.sin(angle)*77);num.setAttribute('y',120-Math.cos(angle)*77);num.setAttribute('class','hour-number');num.textContent=String(i/5||12);group.appendChild(num);}}}
function rotate(id,degrees){$(id).setAttribute('transform',`rotate(${degrees} 120 120)`)}
function tick(){const now=new Date();const p=parts(now);const h=p.hour,m=p.minute,s=p.second;const time=`${pad(h)}:${pad(m)}:${pad(s)}`;$('digital').textContent=time;$('footer-time').textContent=time;$('date').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now);rotate('hour-hand',(h%12)*30+m*.5+s/120);rotate('minute-hand',m*6+s*.1);rotate('second-hand',s*6);
const start=makeTodayTime(15,0);const end=makeTodayTime(17,0);const nowMs=now.getTime();const startMs=start.getTime();const endMs=end.getTime();const duration=endMs-startMs;const remaining=Math.max(0,endMs-nowMs);const elapsed=Math.min(duration,Math.max(0,nowMs-startMs));const pct=elapsed/duration*100;
const totalSeconds=Math.ceil(remaining/1000);const hh=Math.floor(totalSeconds/3600);const mm=Math.floor((totalSeconds%3600)/60);const ss=totalSeconds%60;$('countdown').textContent=`${pad(hh)}:${pad(mm)}:${pad(ss)}`;$('progress').style.width=pct.toFixed(4)+'%';$('percentage').textContent=pct.toFixed(1)+'%';
if(nowMs<startMs){const wait=Math.ceil((startMs-nowMs)/1000);$('status').textContent='WAITING FOR 15:00';$('elapsed').textContent=`Countdown starts in ${pad(Math.floor(wait/3600))}:${pad(Math.floor(wait%3600/60))}:${pad(wait%60)}. Progress begins at 15:00.`;$('countdown').textContent=`${pad(Math.floor(wait/3600))}:${pad(Math.floor(wait%3600/60))}:${pad(wait%60)}`;}
else if(nowMs<endMs){$('status').textContent='● COUNTDOWN ACTIVE';$('elapsed').textContent=`${(elapsed/60000).toFixed(1)} minutes elapsed · ${((remaining)/60000).toFixed(1)} minutes remaining`;}
else{$('status').textContent='✓ TARGET TIME REACHED';$('countdown').textContent='00:00:00';$('percentage').textContent='100.0%';$('progress').style.width='100%';$('elapsed').textContent='17:00 reached. The countdown is complete.';}
}
buildDial();tick();setInterval(tick,1000);
})();