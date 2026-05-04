const researchData = [
  {name:'MIT Evolution Gym', org:'Massachusetts Institute of Technology', type:'Soft robot', method:'Design + control co-optimization', goal:'Дене құрылымы мен басқаруды бірге оңтайландыру', population:80, generation:1000, fitness:92},
  {name:'Szabo 2023 Biped Robot', org:'Szabo, 2023', type:'Biped robot', method:'Genetic Algorithm', goal:'Екі аяқты роботтың жүруін және қайта тұруын дамыту', population:150, generation:50, fitness:86},
  {name:'M-TRAN Modular Robot', org:'Tokyo Institute of Technology / AIST', type:'Modular robot', method:'Genetic Algorithm', goal:'Модульдік робот қозғалысын синтездеу', population:30, generation:100, fitness:78, source:"https://cdfg.mit.edu/publications/evogym", sourceLabel: "MIT Evolution Gym"}
];
const fitnessHistory = { labels:[1,5,10,20,30,40,50], mit:[18,31,45,60,73,84,92], szabo:[12,25,38,55,68,79,86], mtran:[10,21,33,48,59,70,78] };
const steps = [
  ['1. Initialization','Бастапқы роботтар немесе қозғалыс нұсқалары жасалады. Әр индивид роботтың параметрлер жиынын білдіреді.'],
  ['2. Fitness Evaluation','Әр роботтың тиімділігі арнайы fitness function арқылы бағаланады.'],
  ['3. Selection','Ең жақсы нәтиже көрсеткен роботтар келесі кезеңге таңдалады.'],
  ['4. Crossover','Таңдалған роботтардың жақсы қасиеттері біріктіріліп, жаңа шешім пайда болады.'],
  ['5. Mutation','Кездейсоқ өзгеріс енгізіліп, алгоритм бір ғана бағытта тұрып қалмайды.'],
  ['6. New Generation','Жаңа ұрпақ алынып, процесс қайта жалғасады.'],
  ['7. Termination','Белгілі generation санына жеткенде немесе fitness жеткілікті болғанда процесс тоқтайды.']
];
const glossary = [
  ['Fitness','Робот сапасын көрсететін сандық баға.'],
  ['Population','Бір ұрпақтағы робот нұсқаларының саны.'],
  ['Generation','Эволюциялық циклдің бір қайталануы.'],
  ['Selection','Үздік индивидтерді таңдау кезеңі.'],
  ['Crossover','Екі шешімнің қасиеттерін біріктіру.'],
  ['Mutation','Кездейсоқ өзгеріс енгізу.'],
  ['Genotype','Роботтың ішкі параметрлік сипаттамасы.'],
  ['Phenotype','Роботтың сыртқы көрінісі немесе нақты қозғалысы.'],
  ['Locomotion','Роботтың қозғалу тәсілі.']
];
const select = document.getElementById('researchSelect');
researchData.forEach((r,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=r.name; select.appendChild(o); });
function renderResearch(){
  const r = researchData[select.value];
  document.getElementById('selectedResearch').innerHTML = `<span class="chip">${r.type}</span><h3>${r.name}</h3><p><b>Ұйым / Автор:</b> ${r.org}</p><p><b>Әдіс:</b> ${r.method}</p><p><b>Мақсат:</b> ${r.goal}</p><div class="formula">${r.fitness}% Fitness</div>`;
}
select.addEventListener('change', renderResearch); renderResearch();
const tbody=document.querySelector('#researchTable tbody');
tbody.innerHTML = researchData.map(r=>`<tr><td>${r.name}</td><td>${r.org}</td><td>${r.type}</td><td>${r.method}</td><td>${r.population}</td><td>${r.generation}</td><td>${r.fitness}%</td></tr>`).join('');
document.getElementById('algorithmTimeline').innerHTML = steps.map(s=>`<article class="timelineItem"><span>${s[0]}</span><p>${s[1]}</p></article>`).join('');
document.getElementById('glossaryList').innerHTML = glossary.map(g=>`<article><b>${g[0]}</b><p>${g[1]}</p></article>`).join('');
let chart;
function makeChart(type='fitness'){
  const ctx=document.getElementById('mainChart'); if(chart) chart.destroy();
  const textColor=getComputedStyle(document.body).getPropertyValue('--muted') || '#9fb0c7';
  const common={responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:textColor}}},scales:{x:{ticks:{color:textColor},grid:{color:'rgba(159,176,199,.15)'}},y:{ticks:{color:textColor},grid:{color:'rgba(159,176,199,.15)'}}}};
  if(type==='fitness') chart=new Chart(ctx,{type:'line',data:{labels:fitnessHistory.labels,datasets:[{label:'MIT Evolution Gym',data:fitnessHistory.mit,tension:.35},{label:'Szabo Biped Robot',data:fitnessHistory.szabo,tension:.35},{label:'M-TRAN Modular Robot',data:fitnessHistory.mtran,tension:.35}]},options:common});
  if(type==='population') chart=new Chart(ctx,{type:'bar',data:{labels:researchData.map(r=>r.name),datasets:[{label:'Population',data:researchData.map(r=>r.population)}]},options:common});
  if(type==='generation') chart=new Chart(ctx,{type:'bar',data:{labels:researchData.map(r=>r.name),datasets:[{label:'Generation',data:researchData.map(r=>r.generation)}]},options:common});
  if(type==='robots') chart=new Chart(ctx,{type:'doughnut',data:{labels:researchData.map(r=>r.type),datasets:[{label:'Robot түрлері',data:[1,1,1]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:textColor}}}}});
}
makeChart();
document.querySelectorAll('#chartTabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#chartTabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');makeChart(btn.dataset.chart)}));
function calcFitness(){
  const distance=+document.getElementById('distance').value;
  const stability=+document.getElementById('stability').value;
  const collision=+document.getElementById('collision').value;
  document.getElementById('distanceVal').textContent=distance;
  document.getElementById('stabilityVal').textContent=stability;
  document.getElementById('collisionVal').textContent=collision;
  const fitness=Math.max(0, Math.round(0.45*distance + 0.45*stability - 0.25*collision));
  document.getElementById('fitnessResult').textContent=fitness + '%';
  document.getElementById('fitnessComment').textContent = fitness>=80 ? 'Өте жақсы нәтиже: робот тұрақты және тиімді қозғалады.' : fitness>=50 ? 'Орташа нәтиже: алгоритмді әрі қарай жақсарту керек.' : 'Төмен нәтиже: collision көп немесе қозғалыс әлсіз.';
}
['distance','stability','collision'].forEach(id=>document.getElementById(id).addEventListener('input',calcFitness)); calcFitness();
document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('light'); setTimeout(()=>makeChart(document.querySelector('#chartTabs .active').dataset.chart),50)};
document.getElementById('menuBtn').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
document.getElementById('searchInput').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll('.searchable').forEach(sec=>{sec.classList.toggle('hiddenBySearch', q && !(sec.innerText.toLowerCase()+sec.dataset.keywords).includes(q));});});
