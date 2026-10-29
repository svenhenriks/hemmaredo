/* HemmaRedo 0.3 – a privacy-first, static, installable web app. No backend required. */
(() => {
  'use strict';

  const OFFICIAL = 'https://www.krisinformation.se/din-beredskap/hemberedskap/';
  const NUMBERS = 'https://www.krisinformation.se/din-beredskap/skydd-och-hjalp/viktiga-telefonnummer/';
  const RADIO = 'https://www.krisinformation.se/din-beredskap/kommunikation/sveriges-radios-beredskapsuppdrag/';
  const STORAGE = {own: 'hemmaredo_own_v3', friend: 'hemmaredo_friend_v3', active: 'hemmaredo_active_v3', lang: 'hemmaredo_lang_v3'};
  const $ = (s) => document.querySelector(s);
  const root = document.querySelector('#app');
  const icon = (id, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${id}"></use></svg>`;
  const escapeHTML = (v) => String(v).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const phrases = {
    sv: {
      start: 'Start', yourPlan: 'Min plan', how: 'Så fungerar det', help: 'Hjälp en vän', guides: 'Tips & länkar', menu: 'Öppna menyn',
      headline: 'Ett tryggare hem börjar här.', intro: 'Ta reda på hur förberett ditt hushåll är och få en enkel plan.', getStarted: 'Kom igång',
      noLogin: 'Det tar cirka 3 minuter. Gratis.<br>Ingen inloggning.', simple: 'Enkelt och tydligt', authorities: 'Bygger på svenska myndigheters råd',
      tailored: 'Anpassat för ditt hushåll', neighbors: 'Hjälp en vän eller granne',
      little: 'Små steg gör stor skillnad.', littleDesc: 'Du behöver inte göra allt på en gång. Ta ett steg i taget och bygg vidare när det passar dig.',
      stronger: 'Starkare tillsammans.', strongerDesc: 'Beredskap handlar inte bara om att ta hand om sig själv, utan också om att hjälpa andra.', discover: 'Upptäck mer',
      personal: 'Din personliga plan', step: 'Steg', of: 'av', back: 'Tillbaka', next: 'Nästa steg', seePlan: 'Se min plan',
      stepNames: ['Hushållet', 'Bostad', 'Utrustning', 'Särskilda behov', 'Vardagen', 'Din plan'],
      stepDescriptions: ['Vilka bor hos er?', 'Vilken typ av boende?', 'Vad har ni redan?', 'Något att ta hänsyn till?', 'Vatten och mat', 'Era nästa steg'],
      stepQuestions: ['Hur många bor i hushållet?', 'Vilken typ av bostad bor ni i?', 'Vad har ni redan hemma?', 'Finns det särskilda behov?', 'Hur ser det ut med vatten och mat?'],
      stepSubtitles: ['Inkludera alla som regelbundet bor här.', 'Det hjälper oss att ge mer relevanta rekommendationer.', 'Välj det som finns. Det är helt okej att hoppa över.', 'Välj det som stämmer för er. Du kan hoppa över frågan.', 'Ungefär räcker. Det går bra att svara noll eller hoppa över.'],
      adults: 'Vuxna', adultInfo: '18 år och äldre', children: 'Barn', childInfo: '0–17 år', pets: 'Husdjur', petInfo: 'Som bor hos er',
      apartment: 'Lägenhet', house: 'Villa', townhouse: 'Radhus / parhus', otherHome: 'Annat',
      equipmentNames: {torch:'Ficklampor',radio:'Batteriradio',stove:'Stormkök',powerbank:'Powerbank',fireplace:'Vedkamin',containers:'Vattendunkar',cans:'Reservmat',firstaid:'Första hjälpen',hygiene:'Hygienartiklar',blankets:'Varma filtar'},
      needNames: {smallKids:'Små barn',pets:'Husdjur',medical:'Medicinska behov',mobility:'Nedsatt rörlighet',electric:'Elberoende utrustning',other:'Annat'},
      needFoot: 'Ange inga medicinska detaljer här. Det räcker att markera om extra planering behövs.',
      waterStored: 'Vatten i lager', waterStoredHint: 'Ungefär hur många liter dricksvatten har ni hemma?', liters: 'liter',
      foodDays: 'Mat i lager', foodDaysHint: 'Ungefär hur många dagar skulle maten räcka?', days: 'dagar',
      waterHint: 'Utgå från 3–5 liter per person och dygn. Husdjur och särskilda behov tillkommer.',
      resultsLabel: 'Ditt resultat', resultsHeading: 'Ni är på god väg!', allDoneHeading: 'Många bra steg är redan gjorda!',
      resultText: 'Ni har en bra början. Här ser ni vad som redan är ordnat och vad som kan stärkas inför en vecka då vardagen inte fungerar som vanligt.',
      completed: 'avklarade', progressDisclaimer: 'Procenten visar avklarade punkter i just den här planen – inte hur säker du är i en kris.',
      tailoredFor: 'Anpassad för ert hushåll', adultsCount: 'vuxna', childrenCount: 'barn', petsCount: 'husdjur',
      prioritized: 'Bra nästa steg för er', allSet: 'Alla föreslagna steg är markerade. Gå gärna igenom dem regelbundet.',
      waterVolume: 'Grundnivå för sju dagar', waterExtra: 'Plus vatten för husdjur och särskilda behov.', viewPersonal: 'Visa din personliga plan',
      planDesc: 'Här är rekommendationer anpassade efter era svar. Markera det ni har ordnat – ändra gärna när något förändras.',
      editAnswers: 'Ändra mina svar', outOf: 'av', stepsDone: 'steg avklarade',
      source: 'Läs myndigheternas råd', fromSources: 'Baserat på allmänna råd från svenska myndigheter',
      print: 'Skriv ut / spara PDF', share: 'Dela HemmaRedo', newPlan: 'Ny plan',
      printHint: 'Skriv ut din plan och förvara den där du lätt hittar den även om internet inte fungerar.',
      noAccount: 'Din plan sparas bara i den här webbläsaren. Inget konto behövs och inga hushållsuppgifter skickas till oss.',
      important: 'Viktigt att veta', importantDesc: 'Det här är ett förenklat planeringsstöd, inte en fullständig riskbedömning. Råden behöver anpassas efter hälsa, boende och lokala förhållanden. Följ alltid officiell information vid en kris.',
      useful: 'Viktiga länkar och nummer', usefulDesc: 'Officiella källor att ha nära till hands.',
      officialTitle: 'Krisinformation.se', officialDesc: 'Svenska myndigheters information och råd vid kriser.',
      numberTitle: '112 · 113 13 · 1177', numberDesc: '112 vid akut fara. 113 13 för krisinformation. 1177 för sjukvårdsråd.',
      radioTitle: 'Sveriges Radio P4', radioDesc: 'Sveriges beredskapskanal. Ha en radio som fungerar utan elnät.',
      openLink: 'Öppna källan',
      helpEyebrow:'Hjälp en vän', helpTitle:'Starkare tillsammans.', helpLead:'Det är lättare att förbereda sig när man gör det ihop. Hjälp någon annan att skapa en enkel plan – i deras egen takt.',
      helpStart:'Gör en plan tillsammans', helpSeparate:'Din egen plan finns kvar. Vännens svar sparas separat på just den här enheten.',
      helpCard1:'Börja med ett samtal', helpText1:'Fråga vad personen redan har och vad som skulle underlätta mest.',
      helpCard2:'Gör små saker ihop', helpText2:'En vattendunk, en ficklampa eller en telefonlista kan vara en bra början.',
      helpCard3:'Håll kontakten', helpText3:'Kom överens om hur ni kan hjälpa varandra om det blir strömavbrott.',
      friendMode:'Du hjälper en vän', backToMine:'Till min plan', friendName:'Vännens plan',
      chooseLang:'Välj språk', noProfile:'Börja med några frågor för att få din personliga plan.',
      saveToHome:'Tips: lägg gärna HemmaRedo på hemskärmen. Då känns den mer som en app.',
      offline:'Appen kan användas offline efter att den har öppnats och sparats på enheten. Externa länkar kräver internet.',
      privacy:'Integritet', privacyText:'Uppgifterna ligger i din webbläsares lokala lagring. Rensas webbläsardata kan planen försvinna. Ingen synk mellan enheter finns ännu.',
      resetConfirm:'Vill du verkligen börja om? Den här planens sparade svar och markeringar försvinner.',
      copied:'Länken har kopierats!', shared:'Dela länken för att bjuda in någon att skapa sin egen plan.',
      validation:'Ange minst en person i hushållet för att fortsätta.',
      helpBtn:'Hjälp en vän', resume:'Fortsätt med min plan', madeFor:'För svenska hushåll',
      resetNote:'En ny plan ersätter den här planens tidigare svar.',
      footer:'En oberoende prototyp som använder svenska myndigheters offentliga råd. Inte en officiell myndighetstjänst.',
      medicalNote:'Ange aldrig känsliga medicinska uppgifter i prototypen.', printDate:'Utskriven',
      useAgain:'Fortsätt när du vill – dina val sparas automatiskt i den här webbläsaren.'
    },
    en: {
      start:'Home',yourPlan:'My plan',how:'How it works',help:'Help a friend',guides:'Advice & links',menu:'Open menu',
      headline:'A safer home starts here.',intro:'See how prepared your household is and get a simple plan.',getStarted:'Get started',
      noLogin:'About 3 minutes. Free.<br>No account needed.',simple:'Simple and clear',authorities:'Based on Swedish public guidance',
      tailored:'Tailored to your household',neighbors:'Help a friend or neighbour',little:'Small steps make a difference.',littleDesc:'You don’t need to do everything at once. Take it one step at a time.',
      stronger:'Stronger together.',strongerDesc:'Preparedness is about caring for ourselves and each other.',discover:'Discover more',
      personal:'Your personal plan',step:'Step',of:'of',back:'Back',next:'Next step',seePlan:'See my plan',
      stepNames:['Household','Home','Equipment','Special needs','Everyday life','Your plan'],
      stepDescriptions:['Who lives here?','What kind of home?','What do you have?','Anything to consider?','Water and food','Your next steps'],
      stepQuestions:['Who lives in your household?','What type of home do you live in?','What do you already have?','Are there any special needs?','How much water and food do you have?'],
      stepSubtitles:['Include everyone who regularly lives here.','This helps us tailor your advice.','Select what you have. It is fine to skip this step.','Choose what applies. You can skip this question.','An estimate is fine. Zero is also a valid answer.'],
      adults:'Adults',adultInfo:'18 years and older',children:'Children',childInfo:'0–17 years',pets:'Pets',petInfo:'Living with you',
      apartment:'Apartment',house:'Detached house',townhouse:'Townhouse / semi-detached',otherHome:'Other',
      equipmentNames:{torch:'Flashlights',radio:'Battery radio',stove:'Camping stove',powerbank:'Power bank',fireplace:'Wood stove',containers:'Water containers',cans:'Emergency food',firstaid:'First-aid kit',hygiene:'Hygiene supplies',blankets:'Warm blankets'},
      needNames:{smallKids:'Young children',pets:'Pets',medical:'Medical needs',mobility:'Reduced mobility',electric:'Electrical equipment',other:'Other'},
      needFoot:'Do not enter medical details. Just indicate whether extra planning is required.',
      waterStored:'Water in storage',waterStoredHint:'How many litres of drinking water do you have?',liters:'litres',foodDays:'Food in storage',foodDaysHint:'For roughly how many days would your food last?',days:'days',
      waterHint:'Allow 3–5 litres per person per day. Pets and special needs require additional water.',
      resultsLabel:'Your result',resultsHeading:'You’re on your way!',allDoneHeading:'You have made a great start!',
      resultText:'This is a good start. Here is what you have in place and what you can improve for a week when daily life is disrupted.',
      completed:'complete',progressDisclaimer:'The percentage counts steps completed in your plan – it is not a measure of safety in an actual emergency.',
      tailoredFor:'Tailored to your household',adultsCount:'adults',childrenCount:'children',petsCount:'pets',prioritized:'Your next good steps',allSet:'All suggested steps are marked done. Review them regularly.',
      waterVolume:'Basic amount for seven days',waterExtra:'Plus additional water for pets and special needs.',viewPersonal:'See your personal plan',
      planDesc:'Recommendations based on your answers. Check off what you have prepared and update your plan whenever things change.',editAnswers:'Change my answers',outOf:'of',stepsDone:'steps completed',
      source:'Read official guidance',fromSources:'Based on public guidance from Swedish authorities',print:'Print / save as PDF',share:'Share HemmaRedo',newPlan:'New plan',
      printHint:'Print your plan and keep it somewhere accessible even without the internet.',noAccount:'Your plan is stored only in this browser. No account is needed and we do not receive your household details.',
      important:'Important to know',importantDesc:'This is a simplified planning tool, not a complete risk assessment. Adapt the advice to your health, home and local conditions. Always follow official information during an emergency.',
      useful:'Useful links and numbers',usefulDesc:'Official sources worth keeping close.',officialTitle:'Krisinformation.se',officialDesc:'Official Swedish emergency guidance.',
      numberTitle:'112 · 113 13 · 1177',numberDesc:'112 for emergencies. 113 13 for crisis information. 1177 for healthcare advice.',radioTitle:'Swedish Radio P4',radioDesc:'Sweden’s preparedness channel. Keep a radio that works without mains power.',openLink:'Open source',
      helpEyebrow:'Help a friend',helpTitle:'Stronger together.',helpLead:'Preparedness is easier when you do it together. Help someone make a simple plan at their own pace.',
      helpStart:'Make a plan together',helpSeparate:'Your own plan is kept. Your friend’s answers are stored separately on this device.',
      helpCard1:'Start with a conversation',helpText1:'Ask what they already have and what would help the most.',helpCard2:'Do small things together',helpText2:'A water container, flashlight or phone list is a good start.',
      helpCard3:'Keep in touch',helpText3:'Agree on ways to support each other during a power outage.',friendMode:'You are helping a friend',backToMine:'Back to my plan',friendName:'Friend’s plan',
      chooseLang:'Choose language',noProfile:'Answer a few questions to get a personal plan.',saveToHome:'Tip: add HemmaRedo to your home screen to use it like an app.',
      offline:'The app can work offline after it has been opened and saved on the device. External links need internet.',privacy:'Privacy',privacyText:'Your answers are kept in this browser’s local storage. Clearing browser data may erase the plan. There is no syncing between devices yet.',
      resetConfirm:'Start over? Your saved answers and checked steps for this plan will be deleted.',copied:'Link copied!',shared:'Share the link so someone can make their own plan.',validation:'Add at least one person to continue.',
      helpBtn:'Help a friend',resume:'Continue my plan',madeFor:'For households in Sweden',resetNote:'A new plan replaces earlier answers for this profile.',footer:'An independent prototype based on public Swedish guidance. Not an official government service.',
      medicalNote:'Never enter sensitive medical information in this prototype.',printDate:'Printed',useAgain:'Continue whenever you like – your choices save automatically in this browser.'
    }
  };

  const groupMeta = [
    {id:'water',icon:'droplet',color:'',name:{sv:'Vatten',en:'Water'}},
    {id:'food',icon:'utensils',color:'green',name:{sv:'Mat & tillagning',en:'Food & cooking'}},
    {id:'heat',icon:'flame',color:'orange',name:{sv:'Värme',en:'Warmth'}},
    {id:'comms',icon:'radio',color:'yellow',name:{sv:'Kommunikation',en:'Communication'}},
    {id:'health',icon:'heart',color:'pink',name:{sv:'Hygien & hälsa',en:'Hygiene & health'}},
    {id:'home',icon:'home',color:'slate',name:{sv:'För hemmet',en:'For the home'}}
  ];
  const equipment = [
    ['torch','sun'],['radio','radio'],['stove','utensils'],['powerbank','battery'],['fireplace','flame'],['containers','droplet'],['cans','clipboard'],['firstaid','cross'],['hygiene','heart'],['blankets','sun']
  ];
  const needsOptions = [['smallKids','users'],['pets','dog'],['medical','cross'],['mobility','heart'],['electric','battery'],['other','info']];
  const housing = [['apartment','home'],['house','home'],['townhouse','home'],['other','home']];

  function fresh() { return {version:3,adults:2,children:0,pets:0,home:'house',equipment:[],needs:[],waterLiters:0,foodDays:0,overrides:{},finished:false}; }
  function storageGet(key) {try{return localStorage.getItem(key);}catch{return null;}}
  function storagePut(key, val) {try{localStorage.setItem(key,val);}catch{}}
  function loadProfile(type) {
    try {
      const parsed=JSON.parse(storageGet(STORAGE[type]));
      if(!parsed || parsed.version!==3) return fresh();
      const blank=fresh();
      for(const k of ['adults','children','pets','waterLiters','foodDays']) blank[k]=Number.isFinite(Number(parsed[k]))?Math.max(0,Math.min(k==='waterLiters'?5000:30,Math.round(Number(parsed[k])))):blank[k];
      blank.home=housing.some(x=>x[0]===parsed.home)?parsed.home:'house';
      blank.equipment=Array.isArray(parsed.equipment)?parsed.equipment.filter(x=>equipment.some(y=>y[0]===x)):[];
      blank.needs=Array.isArray(parsed.needs)?parsed.needs.filter(x=>needsOptions.some(y=>y[0]===x)):[];
      blank.overrides=typeof parsed.overrides==='object'&&parsed.overrides?Object.fromEntries(Object.entries(parsed.overrides).filter(([k,v])=>/^[-a-z]+$/.test(k)&&typeof v==='boolean')):{};
      blank.finished=!!parsed.finished;
      return blank;
    }catch{return fresh();}
  }
  let own=loadProfile('own'), friend=loadProfile('friend');
  let active=storageGet(STORAGE.active)==='friend'?'friend':'own';
  let lang=storageGet(STORAGE.lang)==='en'?'en':'sv';
  let menuOpen=false, toastText='', toastTimer=0;
  const expanded=new Set(['water','food']);
  let route='home',step=0;
  const L=()=>phrases[lang];
  const p=()=>active==='own'?own:friend;
  const save=()=>storagePut(STORAGE[active],JSON.stringify(p()));
  const set= (field,val)=>{p()[field]=val;save();render();};
  const mark=(taskId,checked)=>{p().overrides[taskId]=checked;save();render();};
  const name=(o)=>o[lang];
  const n=(x)=>new Intl.NumberFormat(lang==='sv'?'sv-SE':'en-GB').format(x);
  const word=(num,sv,en)=>lang==='sv'?sv:en;

  function taskDefinitions() {
    const pr=p(), people=pr.adults+pr.children, low=21*people, high=35*people;
    const any=(id)=>pr.equipment.includes(id);
    const e=(id,group,ic,titleSv,titleEn,descSv,descEn,done,href=OFFICIAL)=>({id,group,ic,title:lang==='sv'?titleSv:titleEn,desc:lang==='sv'?descSv:descEn,auto:!!done,href});
    const all=[
      e('water-store','water','droplet','Säkra dricksvatten','Store enough drinking water',`Planera för minst ${n(low)}–${n(high)} liter för ${people} personer under sju dygn. Djur och särskilda behov tillkommer.`,`Plan for at least ${n(low)}–${n(high)} litres for ${people} people over seven days. Add more for pets and special needs.`,pr.waterLiters>=low&&people>0),
      e('food-week','food','utensils','Mat som räcker i en vecka','Food for one week','Satsa på hållbar mat som går att äta direkt eller tillaga med lite vatten.','Keep shelf-stable food that can be eaten as it is or cooked with little water.',pr.foodDays>=7),
      e('cook-power','food','flame','Laga mat utan el','Cook without electricity','Planera för säker matlagning om spis och ugn inte fungerar. Använd endast utrustning enligt säkerhetsanvisningarna.','Plan a safe way to cook if the stove and oven stop working. Follow all equipment safety instructions.',any('stove')),
      e('warmth','heat','flame','Håll värmen vid strömavbrott','Stay warm during a power outage','Ha varma plagg och filtar samt en säker plan om uppvärmningen stannar. En kamin kräver bränsle och säker hantering.','Keep warm clothing and blankets, and plan for a heating outage. Wood stoves require fuel and safe use.',any('fireplace')&&any('blankets')),
      e('torch','comms','sun','Ficklampor som fungerar','Working flashlights','Ha ficklampor och kontrollera batterier eller laddning.','Keep flashlights and check their batteries or charge.',any('torch')),
      e('radio','comms','radio','Ta emot information via P4','Receive information via P4','Sveriges Radio P4 är beredskapskanal. Ha gärna en radio som fungerar utan elnät.','Swedish Radio P4 is the preparedness channel. Keep a radio that works without mains power.',any('radio'),RADIO),
      e('power','comms','battery','Ladda telefon och småprylar','Charge your phone and essentials','Ha laddad powerbank och eventuella extra batterier.','Keep a charged power bank and any extra batteries.',any('powerbank')),
      e('aid','health','cross','Första hjälpen och läkemedel','First aid and medicines','Se över förbandsmaterial och nödvändiga läkemedel enligt dina egna behov.','Check first-aid supplies and necessary medicines based on your needs.',any('firstaid')),
      e('hygiene','health','heart','Hygien när vattnet saknas','Hygiene without running water','Planera för toalett, handhygien, våtservetter och avfall om vatten eller avlopp slutar fungera.','Plan for toilets, hand hygiene, wipes and waste if water or sanitation stops working.',any('hygiene')),
      e('contacts','home','phone','Viktiga telefonnummer på papper','Important phone numbers on paper','Skriv ner kontakter samt 112 (akut), 113 13 (krisinformation) och 1177 (sjukvårdsråd).','Write down contacts and 112 (emergency), 113 13 (crisis information), and 1177 (health advice).',false,NUMBERS),
      e('meetup','home','map','Bestäm var ni möts','Agree where to meet','Prata om hur ni får kontakt med varandra om mobiler eller internet ligger nere.','Discuss how you will find each other if mobile networks or internet are down.',false)
    ];
    if(pr.pets>0||pr.needs.includes('pets')) all.push(e('pet-supplies','health','dog','Mat och vatten till husdjuren','Food and water for pets','Se över mat, vatten, eventuella mediciner och möjlighet att ta med djuren.','Plan food, water, any medicine and transport for pets.',false));
    if(pr.needs.includes('medical')) all.push(e('medical-extra','health','cross','Reservplan för medicinska behov','Backup plan for medical needs','Gör en personlig plan för kritiska läkemedel och hjälpmedel. Kontakta vården vid behov.','Make a personal plan for critical medicines and aids. Contact healthcare professionals when needed.',false));
    if(pr.needs.includes('electric')) all.push(e('electric-extra','home','battery','Planera för elberoende hjälpmedel','Plan for essential powered equipment','Identifiera sådant som måste fungera och rådgör om en lämplig reservlösning.','Identify what must keep working and seek guidance on a suitable backup.',false));
    if(pr.needs.includes('mobility')) all.push(e('mobility-extra','home','users','Planera för tillgänglighet','Plan for accessibility','Fundera på hur du kan få hjälp att förflytta dig eller ta dig till en trygg plats.','Plan for help with mobility or reaching a safe place.',false));
    if(pr.needs.includes('smallKids')||pr.children>0) all.push(e('kids-extra','health','users','Barnens behov','Children’s needs','Tänk på barnmat, blöjor om det behövs, värme, trygghet och rutiner.','Consider baby food, diapers if needed, warmth, comfort and routines.',false));
    return all;
  }
  function done(task){return Object.prototype.hasOwnProperty.call(p().overrides,task.id)?p().overrides[task.id]:task.auto;}
  function calc(){const all=taskDefinitions();const count=all.filter(done).length;return {all,count,pct:all.length?Math.round(100*count/all.length):0};}
  function progressRing(pct){return `<div class="meter" style="--pct:${pct}%"><div class="meter-text"><strong>${pct}%</strong><small>${L().completed}</small></div></div>`;}
  function action(label,type='primary',id='',ic='arrow',more=''){
    return `<button type="button" class="btn-${type} ${more}" ${id?`data-action="${id}"`:''}>${label}${ic?icon(ic,'ic-sm'):''}</button>`;
  }
  function navMarkup(home=false){
    const tr=L();return `<header class="site-header">
      <a href="#home" class="brand" aria-label="HemmaRedo – ${tr.start}">${icon('home')}<span>HemmaRedo.</span></a>
      <nav class="desktop-links" aria-label="${tr.menu}"><a href="#quiz/0">${tr.how}</a><a href="#plan">${tr.yourPlan}</a><a href="#guides">${tr.guides}</a><a href="#help">${tr.help}</a></nav>
      <div class="top-actions"><label class="visually-hidden" for="lang-select">${tr.chooseLang}</label><select id="lang-select" class="lang-select" aria-label="${tr.chooseLang}"><option value="sv" ${lang==='sv'?'selected':''}>SV</option><option value="en" ${lang==='en'?'selected':''}>EN</option></select><button type="button" class="menu-button" data-action="menu" aria-label="${tr.menu}" aria-expanded="${menuOpen?'true':'false'}">${icon(menuOpen?'x':'menu')}</button></div>
      ${menuOpen?`<nav class="menu-panel" aria-label="${tr.menu}"><button data-route="home">${icon('home')}${tr.start}</button><button data-route="quiz/0">${icon('clipboard')}${tr.how}</button><button data-route="plan">${icon('check')}${tr.yourPlan}</button><button data-route="guides">${icon('info')}${tr.guides}</button><button data-route="help">${icon('heart')}${tr.help}</button></nav>`:''}
    </header>`;
  }
  function banner(){return active==='friend'?`<div class="friend-banner">${icon('users','ic-sm')} ${L().friendMode} <button type="button" data-action="own">${L().backToMine}</button></div>`:'';}
  function footer(){return `<footer class="footer"><div class="footer-inner"><a class="brand" href="#home">${icon('home')}<span>HemmaRedo.</span></a><div class="footer-links"><a href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">Krisinformation.se</a><a href="#guides">${L().guides}</a><a href="#help">${L().help}</a></div><p>${L().footer} ${L().offline}</p></div></footer>`;}
  function home(){
    const tr=L(),has=p().finished;return `<div class="home-surface">${navMarkup(true)}${banner()}<main class="home-main"><h1>${tr.headline}</h1><p class="hero-intro">${tr.intro}</p><div class="hero-btn-wrap">${action(has?tr.resume:tr.getStarted,'primary',has?'resume':'begin','arrow','hero-button')}<p class="hero-note">${tr.noLogin}</p></div></main></div>
    <section class="home-after"><div class="trust-strip"><div class="trust-item">${icon('leaf')}<span>${tr.simple}</span></div><div class="trust-item">${icon('shield')}<span>${tr.authorities}</span></div><div class="trust-item">${icon('home')}<span>${tr.tailored}</span></div><div class="trust-item">${icon('users')}<span>${tr.neighbors}</span></div></div>
    <div class="home-secondary"><article class="feature-card"><div class="eyebrow">${icon('check','ic-sm')}${tr.madeFor}</div><h2>${tr.little}</h2><p>${tr.littleDesc}</p>${action(tr.getStarted,'quiet','begin','arrow')}</article><article class="feature-card feature-card-olive"><div class="eyebrow">${icon('heart','ic-sm')}${tr.help}</div><h2>${tr.stronger}</h2><p>${tr.strongerDesc}</p>${action(tr.discover,'quiet','help','arrow')}</article></div></section>${footer()}`;
  }
  function stepHeader(){const tr=L();return `<div class="flow-top"><span class="step-top-label">${tr.step} ${step+1} ${tr.of} 5</span><div class="top-progress" aria-label="${tr.step} ${step+1} ${tr.of} 5"><span style="width:${(step+1)*20}%"></span></div><span class="step-top-label">${(step+1)*20}%</span></div>`;}
  function stepSidebar(){const tr=L();return `<aside class="step-sidebar" aria-label="${tr.personal}">${tr.stepNames.map((title,i)=>`<button type="button" class="side-step ${i===step?'current':''} ${i<step?'complete':''}" ${i<=step?`data-step="${i}"`:'disabled'}><span class="side-step-number">${i<step?icon('check','ic-sm'):i+1}</span><span><strong>${title}</strong><small>${tr.stepDescriptions[i]}</small></span></button>`).join('')}</aside>`;}
  function counter(id,label,hint,ic,min,max=20){return `<div class="count-row"><div class="count-illustration">${icon(ic)}</div><div class="count-label">${label}<small>${hint}</small></div><div class="counter-control"><button type="button" data-count="${id}" data-delta="-1" aria-label="${label}: −" ${p()[id]<=min?'disabled':''}>−</button><strong aria-live="polite">${p()[id]}</strong><button type="button" data-count="${id}" data-delta="1" aria-label="${label}: +" ${p()[id]>=max?'disabled':''}>+</button></div></div>`;}
  function choices(items,field,labels,three=false){const selected=p()[field];return `<div class="option-grid ${three?'three':''}">${items.map(([id,ic])=>`<button type="button" class="option-tile ${three?'compact':''}" aria-pressed="${Array.isArray(selected)?selected.includes(id):selected===id}" data-field="${field}" data-choice="${id}">${icon(ic)}<span>${escapeHTML(labels[id])}</span></button>`).join('')}</div>`;}
  function stepBody(){const tr=L(), pr=p();switch(step){
    case 0:return `${counter('adults',tr.adults,tr.adultInfo,'users',0)}${counter('children',tr.children,tr.childInfo,'heart',0)}${counter('pets',tr.pets,tr.petInfo,'dog',0)}`;
    case 1:return choices(housing,'home',{'apartment':tr.apartment,'house':tr.house,'townhouse':tr.townhouse,'other':tr.otherHome});
    case 2:return choices(equipment,'equipment',tr.equipmentNames,true);
    case 3:return `${choices(needsOptions,'needs',tr.needNames,true)}<div class="inline-note">${icon('info')}${tr.needFoot}</div>`;
    case 4:return `<div class="number-field"><div><label for="water-field">${tr.waterStored}</label><small>${tr.waterStoredHint}</small></div><input id="water-field" data-numeric="waterLiters" type="number" min="0" max="5000" step="1" inputmode="numeric" value="${pr.waterLiters}" aria-label="${tr.waterStored}"></div><div class="number-field"><div><label>${tr.foodDays}</label><small>${tr.foodDaysHint}</small></div><strong>${pr.foodDays} ${tr.days}</strong></div><div class="choice-days">${[0,3,5,7].map(day=>`<button type="button" data-days="${day}" aria-pressed="${pr.foodDays===day}">${day===7?'7+':day} ${tr.days}</button>`).join('')}</div><div class="inline-note">${icon('info')}${tr.waterHint}</div>`;
    default:return '';
  }}
  function quiz(){const tr=L();return `${navMarkup()}${banner()}<main class="flow-shell">${stepHeader()}<div class="step-layout">${stepSidebar()}<section class="flow-content" aria-live="polite"><div class="step-intro-icon">${icon(['users','home','clipboard','heart','droplet'][step])}</div><div class="eyebrow">${tr.personal}</div><h1>${tr.stepQuestions[step]}</h1><p class="subtitle">${tr.stepSubtitles[step]}</p>${stepBody()}<div class="flow-footer">${action(tr.back,'quiet','back','back')}${action(step===4?tr.seePlan:tr.next,'primary','next','arrow')}</div></section></div><p class="center-small">${tr.useAgain}</p></main>${footer()}`;}
  function summaryArt(){const tr=L(), pr=p();return `<div class="summary-art"><div class="summary-art-content"><strong>${tr.tailoredFor}</strong><p>${pr.adults} ${tr.adultsCount} · ${pr.children} ${tr.childrenCount} · ${pr.pets} ${tr.petsCount}</p></div></div>`;}
  function badge(task){const group=groupMeta.find(g=>g.id===task.group);return `<span class="icon-badge ${group?.color||''}">${icon(task.ic)}</span>`;}
  function result(){const tr=L(),c=calc(),pr=p();const priority=c.all.filter(x=>!done(x)).slice(0,3);return `${navMarkup()}${banner()}<main class="content-shell"><span class="eyebrow">${icon('leaf','ic-sm')}${tr.resultsLabel}</span><h1>${c.pct===100?tr.allDoneHeading:tr.resultsHeading}</h1><p class="lede">${tr.resultText}</p><div class="summary-grid"><article class="card summary-card"><div class="meter-flex">${progressRing(c.pct)}<p class="meter-desc"><strong>${c.count} ${tr.outOf} ${c.all.length} ${tr.stepsDone}</strong><br>${tr.progressDisclaimer}</p></div>${action(tr.viewPersonal,'primary','view-plan','arrow')}</article><article class="card">${summaryArt()}<div class="water-note" style="margin-top:13px"><span class="icon-badge">${icon('droplet')}</span><div><strong>${tr.waterVolume}: ${n((pr.adults+pr.children)*21)}–${n((pr.adults+pr.children)*35)} ${tr.liters}</strong><small>${tr.waterExtra}</small></div></div></article></div><div style="margin-top:29px" class="tiny-head">${icon('clipboard','ic-sm')}${tr.prioritized}</div><div class="priority-grid">${priority.length?priority.map(task=>`<button type="button" class="priority-card" data-priority="${task.group}">${badge(task)}<span><strong>${task.title}</strong><p>${task.desc}</p></span>${icon('arrow','priority-arrow ic-sm')}</button>`).join(''):`<div class="empty-state"><p>${tr.allSet}</p></div>`}</div><div class="community-cta"><div class="eyebrow">${icon('heart','ic-sm')}${tr.help}</div><h2>${tr.stronger}</h2><p>${tr.strongerDesc}</p>${action(tr.helpBtn,'outline','help','arrow')}</div><p class="source-note">${tr.fromSources}: <a href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">Krisinformation.se</a>.</p></main>${footer()}`;}
  function taskRow(task){return `<div class="task-row ${done(task)?'done':''}"><input type="checkbox" id="task-${task.id}" data-task="${task.id}" ${done(task)?'checked':''}><label for="task-${task.id}" class="task-copy"><strong>${task.title}</strong><p>${task.desc}</p><a href="${task.href}" target="_blank" rel="noopener noreferrer">${L().source} ↗</a></label></div>`;}
  function plan(){const tr=L(),c=calc(),pr=p();return `${navMarkup()}${banner()}<main class="content-shell"><div class="eyebrow">${icon('check','ic-sm')}${tr.personal}</div><h1>${tr.personal}</h1><p class="lede">${tr.planDesc}</p><div class="card" style="margin-top:23px"><div class="plan-overview"><div><h3>${tr.little}</h3><p>${c.count} ${tr.outOf} ${c.all.length} ${tr.stepsDone}</p><button type="button" class="btn-quiet" style="padding-left:0;font-size:12px" data-action="edit">${tr.editAnswers}${icon('arrow','ic-sm')}</button></div>${progressRing(c.pct)}</div><div class="full-progress"><span style="width:${c.pct}%"></span></div><p class="source-note" style="margin-bottom:0">${tr.progressDisclaimer}</p></div><div class="plan-list">${groupMeta.map(g=>{const ts=c.all.filter(task=>task.group===g.id);const finished=ts.filter(done).length;const isOpen=expanded.has(g.id);return `<section class="plan-group" id="group-${g.id}"><button type="button" class="group-head" data-group="${g.id}" aria-expanded="${isOpen}"><span class="icon-badge ${g.color}">${icon(g.icon)}</span><span class="group-label"><strong>${name(g.name)}</strong><small>${finished} ${tr.outOf} ${ts.length} ${tr.stepsDone}</small></span>${icon('chevron','ic-sm')}</button><div class="group-content" ${isOpen?'':'hidden'}>${ts.map(taskRow).join('')}</div></section>`}).join('')}</div><div class="plan-actions">${action(tr.print,'primary','print','printer')}${action(tr.share,'outline','share','share')}${action(tr.newPlan,'outline','reset','back')}</div><div class="safe-note">${icon('info')}<span><strong>${tr.important}.</strong> ${tr.importantDesc}</span></div><div class="safe-note">${icon('printer')}<span>${tr.printHint}</span></div><div class="community-cta"><div class="eyebrow">${icon('heart','ic-sm')}${tr.help}</div><h2>${tr.stronger}</h2><p>${tr.helpLead}</p>${action(tr.helpStart,'outline','friend','arrow')}</div><p class="source-note">${tr.fromSources}: <a href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">Krisinformation.se</a>.</p><div class="print-note">${tr.printDate}: ${new Date().toLocaleDateString(lang==='sv'?'sv-SE':'en-GB')} · HemmaRedo · ${pr.adults} ${tr.adultsCount}, ${pr.children} ${tr.childrenCount}, ${pr.pets} ${tr.petsCount}</div></main>${footer()}`;}
  function help(){const tr=L();return `${navMarkup()}${banner()}<main class="content-shell"><div class="eyebrow">${icon('users','ic-sm')}${tr.helpEyebrow}</div><h1>${tr.helpTitle}</h1><p class="lede">${tr.helpLead}</p><div class="help-hero"><div class="help-visual"></div><div class="help-body"><h2>${tr.help}</h2><p>${tr.helpSeparate}</p>${action(tr.helpStart,'primary','friend','arrow')}</div></div><div class="guide-grid"><article class="guide-card">${icon('heart')}<h3>${tr.helpCard1}</h3><p>${tr.helpText1}</p></article><article class="guide-card">${icon('droplet')}<h3>${tr.helpCard2}</h3><p>${tr.helpText2}</p></article><article class="guide-card">${icon('users')}<h3>${tr.helpCard3}</h3><p>${tr.helpText3}</p></article></div></main>${footer()}`;}
  function guides(){const tr=L();return `${navMarkup()}${banner()}<main class="content-shell"><div class="eyebrow">${icon('shield','ic-sm')}${tr.madeFor}</div><h1>${tr.useful}</h1><p class="lede">${tr.usefulDesc}</p><div class="guide-grid"><article class="guide-card">${icon('shield')}<h3>${tr.officialTitle}</h3><p>${tr.officialDesc}</p><a href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">${tr.openLink} ↗</a></article><article class="guide-card">${icon('phone')}<h3>${tr.numberTitle}</h3><p>${tr.numberDesc}</p><a href="${NUMBERS}" target="_blank" rel="noopener noreferrer">${tr.openLink} ↗</a></article><article class="guide-card">${icon('radio')}<h3>${tr.radioTitle}</h3><p>${tr.radioDesc}</p><a href="${RADIO}" target="_blank" rel="noopener noreferrer">${tr.openLink} ↗</a></article></div><div class="privacy-box">${icon('lock')}<div><h3>${tr.privacy}</h3><p>${tr.privacyText}</p><p style="margin-top:8px">${tr.noAccount}</p></div></div><div class="safe-note">${icon('info')}<span>${tr.importantDesc}</span></div><div class="safe-note">${icon('download')}<span>${tr.saveToHome} ${tr.offline}</span></div></main>${footer()}`;}
  function render(){document.documentElement.lang=lang;document.title='HemmaRedo – '+(lang==='sv'?'Ett tryggare hem börjar här':'A safer home starts here');
    root.innerHTML=route==='home'?home():route==='quiz'?quiz():route==='result'?result():route==='plan'?plan():route==='help'?help():guides();
    if(toastText)root.insertAdjacentHTML('beforeend',`<div role="status" class="toast">${escapeHTML(toastText)}</div>`);
  }
  function showHash(){menuOpen=false;const hash=decodeURIComponent(location.hash.replace(/^#\/?/,''));const match=/^quiz(?:\/(\d))?$/.exec(hash);
    if(match){route='quiz';step=Math.max(0,Math.min(4,Number(match[1]||0)));}
    else route=['home','result','plan','help','guides'].includes(hash)?hash:'home';render();window.scrollTo({top:0,behavior:'instant'});
  }
  function navigate(to){const hash='#'+to;if(location.hash===hash)showHash();else location.hash=hash;}
  function toast(msg){toastText=msg;clearTimeout(toastTimer);render();toastTimer=setTimeout(()=>{toastText='';render();},2700);}
  function next(){if(step===0 && p().adults+p().children<1){toast(L().validation);return;}
    if(step===4){p().finished=true;save();navigate('result');}
    else navigate('quiz/'+(step+1));
  }
  function reset(){if(!confirm(L().resetConfirm))return;if(active==='own')own=fresh();else friend=fresh();save();navigate('quiz/0');}
  function friendStart(){active='friend';storagePut(STORAGE.active,active);friend=fresh();save();navigate('quiz/0');}
  function ownMode(){active='own';storagePut(STORAGE.active,active);navigate(own.finished?'plan':'home');}
  function share(){const data={title:'HemmaRedo',text:L().shared,url:location.origin+location.pathname+'#home'};
    if(navigator.share){navigator.share(data).catch(()=>{});return;}
    if(navigator.clipboard?.writeText)navigator.clipboard.writeText(data.url).then(()=>toast(L().copied)).catch(()=>toast(data.url));
    else toast(data.url);
  }
  root.addEventListener('click',ev=>{
    const target=ev.target.closest('button');if(!target)return;
    if(target.dataset.route){navigate(target.dataset.route);return;}
    if(target.dataset.step!==undefined){navigate('quiz/'+target.dataset.step);return;}
    if(target.dataset.count){const key=target.dataset.count;const min=0;const val=Math.min(20,Math.max(min,p()[key]+Number(target.dataset.delta)));set(key,val);return;}
    if(target.dataset.field){const field=target.dataset.field,choice=target.dataset.choice;
      if(Array.isArray(p()[field]))set(field,p()[field].includes(choice)?p()[field].filter(x=>x!==choice):[...p()[field],choice]);
      else set(field,choice);return;
    }
    if(target.dataset.days!==undefined){set('foodDays',Number(target.dataset.days));return;}
    if(target.dataset.group){const id=target.dataset.group;if(expanded.has(id))expanded.delete(id);else expanded.add(id);render();return;}
    if(target.dataset.priority){expanded.add(target.dataset.priority);navigate('plan');return;}
    switch(target.dataset.action){
      case 'menu':menuOpen=!menuOpen;render();break;
      case 'begin':navigate('quiz/0');break;
      case 'resume':navigate(p().finished?'plan':'quiz/0');break;
      case 'next':next();break;
      case 'back':navigate(step>0?'quiz/'+(step-1):'home');break;
      case 'view-plan':navigate('plan');break;
      case 'edit':navigate('quiz/0');break;
      case 'help':navigate('help');break;
      case 'friend':friendStart();break;
      case 'own':ownMode();break;
      case 'reset':reset();break;
      case 'print':for(const g of groupMeta)expanded.add(g.id);render();requestAnimationFrame(()=>window.print());break;
      case 'share':share();break;
    }
  });
  root.addEventListener('change',ev=>{
    const el=ev.target;
    if(el.id==='lang-select'){lang=el.value==='en'?'en':'sv';storagePut(STORAGE.lang,lang);render();return;}
    if(el.dataset.numeric){let val=parseInt(el.value,10);if(!Number.isFinite(val))val=0;set(el.dataset.numeric,Math.min(5000,Math.max(0,val)));return;}
    if(el.dataset.task){mark(el.dataset.task,el.checked);return;}
  });
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&menuOpen){menuOpen=false;render();}});
  document.addEventListener('click',ev=>{if(menuOpen&&!ev.target.closest('.menu-panel')&&!ev.target.closest('.menu-button')){menuOpen=false;render();}});
  window.addEventListener('hashchange',showHash);
  showHash();
  if('serviceWorker' in navigator&&location.protocol==='https:'){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
