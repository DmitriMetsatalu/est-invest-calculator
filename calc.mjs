export const defaults={signal:'1',side:'short',count:2,moves:['2.4','5','7.5'],tp:['2.1','4.2'],stop:'15',base:'average',deposit:'1000',leverage:'10',allocation:'5',allocationMode:'notional',weights:['50','50','0']};
export const num=v=>typeof v==='number'?v:Number(String(v).trim().replace(',','.'));
export function calculate(s,filledCount){
 const errors=[];const n=(v,label,min,max)=>{const x=num(v);if(String(v).trim()===''||!Number.isFinite(x)||x<min||x>max)errors.push(label);return x;};
 const signal=n(s.signal,'Цена сигнала: от 0,00000001 до 1 000 000 000 000',1e-8,1e12), deposit=n(s.deposit,'Депозит должен быть больше нуля',.01,1e12),leverage=n(s.leverage,'Плечо: от 1 до 125',1,125),allocation=n(s.allocation,'Доля депозита: больше 0 и не более 100%',.000001,100);
 const count=s.count===3?3:2, sign=s.side==='short'?1:-1;
 const weights=s.weights.slice(0,count).map(v=>n(v,'Доля каждой лимитки должна быть больше 0%',.000001,100));
 if(Math.abs(weights.reduce((a,b)=>a+b,0)-100)>.000001) errors.push('Доли лимиток должны составлять 100%');
 const moves=s.moves.slice(0,count).map(v=>n(v,'Отклонение лимитки: от 0 до 99%',0,99));
 if(moves.some((v,i)=>i&&v<=moves[i-1]))errors.push('Каждая следующая лимитка должна быть дальше от сигнала');
 const tps=s.tp.map(v=>n(v,'Тейк-профит: больше 0 и меньше 100%',.000001,99.999999));
 if(tps.some((v,i)=>i&&v<=tps[i-1]))errors.push('Каждый следующий тейк должен быть дальше предыдущего');
 const stop=n(s.stop,'Стоп: больше 0 и меньше 100%',.000001,99.999999);
 if(errors.length)return {errors:[...new Set(errors)]};
 const plannedNotional=deposit*allocation/100*(s.allocationMode==='margin'?leverage:1);
 const filled=Number.isInteger(filledCount)?Math.max(1,Math.min(count,filledCount)):count;
 const entries=moves.map((v,i)=>{const price=signal*(1+sign*v/100),value=plannedNotional*weights[i]/100;return {price,value,margin:value/leverage,quantity:value/price,weight:weights[i],move:v};});
 const activeEntries=entries.slice(0,filled),notional=activeEntries.reduce((a,e)=>a+e.value,0),margin=notional/leverage;
 const quantity=activeEntries.reduce((a,b)=>a+b.quantity,0),average=notional/quantity,base=s.base==='signal'?signal:average;
 const stopPrice=base*(1+sign*stop/100),targets=tps.map(v=>({percent:v,price:base*(1-sign*v/100)}));
 const loss=activeEntries.reduce((a,e)=>a+(s.side==='short'?stopPrice-e.price:e.price-stopPrice)*e.quantity,0);
 const profits=targets.map(t=>activeEntries.reduce((a,e)=>a+(s.side==='short'?e.price-t.price:t.price-e.price)*e.quantity,0));
 const warnings=[];if(loss<=0||activeEntries.some(e=>s.side==='short'?stopPrice<=e.price:stopPrice>=e.price))warnings.push('Стоп расположен до одной из лимиток. Измените стоп или базу расчёта.');
 if(targets.some(t=>s.side==='short'?t.price>=average:t.price<=average))warnings.push('Один из тейков не даёт прибыль относительно средней цены входа.');
 if(loss>=margin)warnings.push('Расчётный убыток до стопа не меньше маржи. На фьючерсах ликвидация может наступить раньше стопа.');
 return {errors:[],warnings,entries,activeEntries,filled,plannedNotional,average,base,targets,stopPrice,notional,margin,quantity,loss,profits,riskPercent:loss/deposit*100};
}
