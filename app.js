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


  const howCopy = {
    sv: {
      kicker:'ENKELT ATT KOMMA IGÅNG',heading:'Lite förberedelse. Mer trygghet.',lead:'Du behöver inte vara expert på krisberedskap. HemmaRedo hjälper dig att komma igång med det viktigaste, ett litet steg i taget.',
      topButton:'Skapa min plan',small:'Gratis · Cirka 3 minuter · Inget konto',
      howTitle:'Så enkelt fungerar det',howLead:'Tre steg från första frågan till en plan som passar just ditt hem.',
      s1:'Berätta lite om ditt hem',d1:'Hur många bor hos er? Bor ni i lägenhet eller hus? Har ni husdjur? Du svarar bara på det som är relevant.',
      s2:'Se vad ni redan har',d2:'Ficklampor, vatten, radio, värme och mat. Kryssa i det som finns hemma. Du behöver inte köpa allt på en gång.',
      s3:'Få er egen plan',d3:'Vi sammanställer en personlig checklista. Bocka av, skriv ut och kom tillbaka när du vill.',
      previewLabel:'ETT EXEMPEL',previewTitle:'Din plan tar form.',previewLead:'Här ser du ungefär hur en färdig plan kan se ut. Det riktiga resultatet anpassas efter dina svar.',
      previewItem1:'Vatten för hushållet',previewItem2:'Mat utan el',previewItem3:'Viktig information via P4',previewNote:'Framstegsmätaren visar hur många punkter du markerat som klara. Den är ingen garanti för säkerhet.',
      faqTitle:'Bra att veta',q1:'Kostar det något?',a1:'Nej. HemmaRedo är gratis att använda, utan konto.',q2:'Vad händer med mina svar?',a2:'De sparas lokalt i din webbläsare på den enhet du använder. De synkroniseras inte mellan enheter och kan försvinna om du rensar webbläsardata.',
      q3:'Är HemmaRedo en myndighetstjänst?',a3:'Nej. Det är ett oberoende planeringsstöd. För officiella rekommendationer och information vid en kris hänvisar vi till Krisinformation.se.',
      q4:'Måste jag göra allt direkt?',a4:'Nej. Börja med det viktigaste för ditt hushåll. Du kan återkomma till checklistan när som helst på samma enhet.',
      closingTitle:'Redo att ta första steget?',closingLead:'Det behöver inte vara svårt att vara lite mer förberedd.',closingButton:'Kom igång',
      official:'Läs officiella råd på Krisinformation.se'
    },
    en: {
      kicker:'AN EASY PLACE TO START',heading:'A little preparation. More peace of mind.',lead:'You do not need to be an emergency preparedness expert. HemmaRedo helps you start with what matters, one small step at a time.',
      topButton:'Create my plan',small:'Free · About 3 minutes · No account',
      howTitle:'How it works',howLead:'Three simple steps from the first question to a plan that fits your home.',
      s1:'Tell us about your home',d1:'How many people live there? A flat or a house? Any pets? Answer only what is relevant to you.',
      s2:'See what you already have',d2:'Flashlights, water, a radio, heating and food. Tick what you have. You do not need to buy everything at once.',
      s3:'Get your own plan',d3:'We put together a personal checklist. Tick items off, print it and return whenever you want.',
      previewLabel:'AN EXAMPLE',previewTitle:'Your plan comes together.',previewLead:'Here is an example of a finished plan. Your real plan will be based on your answers.',
      previewItem1:'Water for the household',previewItem2:'Food without electricity',previewItem3:'Important information via P4',previewNote:'The progress meter shows how many items you have marked complete. It is not a measure of safety.',
      faqTitle:'Good to know',q1:'Does it cost anything?',a1:'No. HemmaRedo is free to use, without an account.',q2:'What happens to my answers?',a2:'They are stored locally in your browser on this device. They do not sync between devices and may disappear if you clear your browser data.',
      q3:'Is HemmaRedo a government service?',a3:'No. It is an independent planning tool. For official guidance and emergency updates, refer to Krisinformation.se.',
      q4:'Do I need to do everything right away?',a4:'No. Start with what matters most for your household. You can return to your checklist on the same device.',
      closingTitle:'Ready to take the first step?',closingLead:'Being a little more prepared does not have to be difficult.',closingButton:'Get started',
      official:'Read official advice at Krisinformation.se'
    }
  };


  const resourceCopy={
    sv:{eyebrow:'UTVALDA RESURSER',title:'Tips, kunskap & inspiration.',intro:'Nyfiken på hur du kan bli bättre förberedd? Här hittar du officiella råd, poddar och filmer som gör det enklare att börja. Ta det i din egen takt.',official:'Börja med säkra källor',officialLead:'När något händer är det myndigheternas aktuella information du ska följa.',listen:'För dig som gillar att lyssna',listenLead:'Olika perspektiv på hemberedskap, vardagslösningar och att ta hand om varandra.',watch:'Se & lär',watchLead:'En utvald föreläsning att börja med. Vi fyller på med fler granskade filmer framöver.',featured:'BRA STÄLLE ATT BÖRJA',featuredTitle:'Ett avsnitt om grunderna',featuredText:'Avsnitt 126, Hemberedskap 1a, går igenom bland annat värme, vatten, mat och hur man kommer igång.',sourceTitle:'Krisinformation.se',sourceDesc:'Officiell krisinformation och råd om hemberedskap.',numbersTitle:'Viktiga telefonnummer',numbersDesc:'När ska du ringa 112, 113 13 eller 1177?',radioTitle:'Sveriges Radio P4',radioDesc:'Beredskapskanal för viktig information.',pod1:'I väntan på katastrofen',pod1Desc:'Kalle Zackari Wahlström och Patrick Sellman samtalar om praktisk beredskap, småbruk och vardagsliv – med humor och nyfikenhet.',pod2:'Vardagsprepping',pod2Desc:'Intervjuer och vardagsnära råd för att bygga upp sin hemberedskap stegvis.',pod3:'Hemberedskap',pod3Desc:'Anette Staaf och Niklas Larsson diskuterar beredskap, säkerhet och erfarenheter från verkliga händelser.',videoTitle:'MSB Live: Hemberedskap',videoDesc:'En frågestund där myndighetens kriskommunikatörer svarar på vanliga frågor om hemberedskap.',read:'Besök webbplatsen',listenAction:'Lyssna på podden',episode:'Lyssna på avsnittet',watchAction:'Se filmen',independent:'Om innehållet',disclaimer:'Poddar och videor är tips för vidare lärande, inte officiella råd från HemmaRedo. Uppgifter och rekommendationer från externa skapare kan skilja sig från myndigheternas. Vid en pågående kris: följ officiell information.',ctaTitle:'Från inspiration till handling.',ctaText:'När du känner dig redo kan du skapa din egen lilla plan – helt gratis.',ctaButton:'Skapa min plan',typePodcast:'PODD',typeVideo:'VIDEO',typeOfficial:'OFFICIELL KÄLLA'},
    en:{eyebrow:'SELECTED RESOURCES',title:'Advice, knowledge & inspiration.',intro:'Want to feel better prepared? Here are official sources, podcasts and videos to help you get started, at your own pace.',official:'Start with trusted sources',officialLead:'During an emergency, follow the authorities’ current guidance.',listen:'For those who like listening',listenLead:'Different perspectives on household preparedness, practical solutions and supporting others.',watch:'Watch & learn',watchLead:'A selected talk to start with. More reviewed videos may be added later.',featured:'A GOOD STARTING POINT',featuredTitle:'An episode about the basics',featuredText:'Episode 126, Hemberedskap 1a, covers warmth, water, food and getting started.',sourceTitle:'Krisinformation.se',sourceDesc:'Official Swedish crisis information and preparedness advice.',numbersTitle:'Important phone numbers',numbersDesc:'When should you call 112, 113 13 or 1177?',radioTitle:'Swedish Radio P4',radioDesc:'Preparedness broadcaster for important public information.',pod1:'I väntan på katastrofen',pod1Desc:'Kalle Zackari Wahlström and Patrick Sellman discuss practical preparedness, small-scale living and everyday life, with humour.',pod2:'Vardagsprepping',pod2Desc:'Interviews and practical advice for building household preparedness step by step.',pod3:'Hemberedskap',pod3Desc:'Anette Staaf and Niklas Larsson discuss preparedness, safety and lessons from real events.',videoTitle:'MSB Live: Hemberedskap',videoDesc:'A Q&A where emergency communicators answer common questions about household preparedness. In Swedish.',read:'Open website',listenAction:'Listen to podcast',episode:'Listen to episode',watchAction:'Watch video',independent:'About these recommendations',disclaimer:'Podcasts and videos are suggestions for further learning, not official HemmaRedo advice. Independent creators may give guidance that differs from public authorities. During an emergency, follow official information.',ctaTitle:'Turn inspiration into action.',ctaText:'When you are ready, create a simple plan for your household – for free.',ctaButton:'Create my plan',typePodcast:'PODCAST',typeVideo:'VIDEO',typeOfficial:'OFFICIAL SOURCE'}
  };


  // Curated examples are suggestions, not an automatic shopping list.
  // Task IDs remain unchanged to preserve existing saved progress.
  const checklistDetails = {
    sv:{
      open:'Läs mer och se exempel',close:'Dölj detaljer',examples:'Exempel på lösningar',check:'Bra att kontrollera',caution:'Tänk på',read:'Fördjupa dig hos Krisinformation.se',
      intro:'Öppna en punkt för konkreta exempel och tips. Bocka av när du har en fungerande lösning – du behöver inte köpa allt som nämns.',
      details:{
        'water-store':{
          intro:'Vatten behövs för att dricka, laga mat och sköta viss hygien. Börja med dricksvattnet och planera för hela hushållet.',
          examples:['Rena, livsmedelsgodkända dunkar med lock och gärna tappkran','Förvara mörkt och så svalt som möjligt. En ogenomskinlig dunk hjälper till att stänga ute ljus, men materialet och renligheten är viktigast.','Flaskvatten och extra kärl för att hämta nödvatten'],
          check:'Ett enkelt HemmaRedo-tips: byt vattnet vid midsommar och jul. Använd gärna det gamla vattnet till växterna, rengör dunkarna vid behov och fyll på med nytt dricksvatten. Märk dunken med påfyllningsdatum. Två byten per år är vår minnesregel, inte ett myndighetskrav.',
          caution:'Vatten från naturen kan innehålla mikroorganismer eller kemiska föroreningar. Vanlig filtrering eller kokning löser inte alla risker.'
        },
        'food-week':{
          intro:'Utgå från sådant ni faktiskt äter. Välj mat som håller länge och som går att äta direkt eller tillaga med lite vatten.',
          examples:['Konserver: bönor, linser, tomater, fisk eller färdiga maträtter','Knäckebröd, havregryn, nötter och jordnötssmör','Ris, pasta, couscous och andra torrvaror','Mat för små barn, allergier och särskilda kostbehov','Manuell konservöppnare'],
          check:'Kontrollera hållbarhet och rotera förrådet: använd det äldsta först och fyll på.',
          caution:'Planera också för mat utan kyl och frys. Följ livsmedelssäkerhetsråd vid strömavbrott.'
        },
        'cook-power':{
          intro:'Det går att äta mycket utan uppvärmning, men ett säkert alternativ för matlagning ger flexibilitet.',
          examples:['Stormkök eller campingkök med lämpligt bränsle','Grill utomhus där det är tillåtet','Termos för att behålla varmt vatten','Enkla rätter som kräver kort tillagning'],
          check:'Prova utrustningen i lugn och ro och se över bränsle och tillbehör.',
          caution:'Använd aldrig grill eller bränsledrivna friluftskök inomhus. Brand- och kolmonoxidfara. Följ alltid utrustningens instruktioner.'
        },
        warmth:{
          intro:'Vid strömavbrott kan inomhustemperaturen sjunka. Förbered ett säkert sätt att hålla värmen.',
          examples:['Varma underställ, mössor, sockor och sovsäckar','Fleecefiltar och extra täcken','Ett rum där familjen kan samlas','Vedkamin med torr ved, om bostaden har en godkänd sådan'],
          check:'Undersök hur just din bostad värms och vad som fungerar utan el.',
          caution:'Försök inte värma bostaden med grill eller olämpliga brännare. Tänk på ventilation, brandvarnare och kolmonoxidrisk.'
        },
        torch:{
          intro:'När det blir mörkt behöver du kunna orientera dig, laga mat och hjälpa andra utan takbelysning.',
          examples:['Ficklampa för allmän användning','Pannlampa som lämnar händerna fria','Batteridriven lykta för ett rum','Reservbatterier eller en plan för laddning'],
          check:'Testa lamporna, placera dem lättåtkomligt och se att alla vet var de finns.',
          caution:'Levande ljus ökar brandrisken. Batteridriven belysning är ofta ett tryggare förstahandsval.'
        },
        radio:{
          intro:'P4 är Sveriges beredskapskanal. En radio som fungerar utan elnät och internet är ett viktigt komplement till mobilen.',
          examples:['Batteridriven FM-radio','Vev- eller solcellsradio med FM-mottagning','Reservbatterier till radion','En anteckning om vilken P4-frekvens som gäller lokalt'],
          check:'Prova att du faktiskt får in P4 där du bor.',
          caution:'En mobilapp som strömmar radio kräver fungerande uppkoppling och är inte samma reservlösning.'
        },
        power:{
          intro:'En laddad telefon kan underlätta kontakten med andra, även om mobilnätet inte alltid fungerar.',
          examples:['Powerbank med tillhörande kabel','Extra laddkablar som passar familjens enheter','Billaddare om du har bil och kan använda den säkert','Laddningsbara lampor med passande anslutning'],
          check:'Ladda och funktionstesta powerbanks regelbundet. Förvara kablarna tillsammans.',
          caution:'Följ batteriernas säkerhetsanvisningar och låt dem inte ligga i extrem värme.'
        },
        aid:{
          intro:'Första hjälpen kan behövas även när vård och transporter är ansträngda.',
          examples:['Plåster, kompresser, elastisk binda och sårtvätt','Engångshandskar och enklare förbandsmaterial','Nödvändiga receptfria produkter som passar hushållet','Personliga läkemedel enligt ordination'],
          check:'Kontrollera utgångsdatum och lär dig använda förbandsmaterialet.',
          caution:'Ändra inte medicinering eller lagerhållning av receptläkemedel utan att följa vårdens och apotekets råd.'
        },
        hygiene:{
          intro:'Om vatten eller avlopp inte fungerar behöver ni en enkel plan för toalett, händer och avfall.',
          examples:['Handsprit, tvål och våtservetter','Toalettpapper, mensskydd och blöjor vid behov','Kraftiga avfallspåsar och förslutningsbara kärl','Engångshandskar och rengöringsmedel'],
          check:'Tänk igenom var sakerna förvaras och hur avfall ska hanteras hygieniskt.',
          caution:'Följ kommunens anvisningar vid avloppsstörningar. Använd inte toaletten om det kan orsaka översvämning.'
        },
        contacts:{
          intro:'När telefonen är urladdad eller internet ligger nere är en papperslista användbar.',
          examples:['Familj och nära anhöriga','Grannar och personer som behöver extra stöd','Försäkringsbolag och viktiga servicekontakter','112 för nödsituationer, 113 13 för krisinformation och 1177 för sjukvårdsrådgivning'],
          check:'Lägg en kopia i krislådan och uppdatera när nummer ändras.',
          caution:'Förvara personliga kontaktuppgifter så att obehöriga inte kommer åt dem.'
        },
        meetup:{
          intro:'Bestäm i förväg hur hushållet hittar varandra när vanliga kontaktvägar inte fungerar.',
          examples:['En överenskommen mötesplats nära hemmet','En alternativ mötesplats längre bort','En kontaktperson utanför närområdet','En enkel papperskarta och nödvändiga adresser'],
          check:'Prata igenom planen med barn och andra i hushållet.',
          caution:'Följ alltid myndigheternas instruktioner vid utrymning eller annan akut händelse.'
        },
        'pet-supplies':{
          intro:'Djur behöver också mat, vatten, trygghet och ibland särskilda temperaturförhållanden.',
          examples:['Foder som djuret redan är vant vid','Extra dricksvatten och matskålar','Koppel, sele, transportbur eller annan säker transportlösning','Eventuella mediciner och kontaktuppgifter till veterinär'],
          check:'Fundera på hur djuren får mat, värme och tillsyn vid strömavbrott eller utrymning.',
          caution:'Behoven skiljer sig mellan arter. Exempelvis kan akvarier vara beroende av el och smådjur vara temperaturkänsliga.'
        },
        'medical-extra':{
          intro:'Kartlägg i förväg vilka hjälpmedel eller läkemedel som är viktiga för vardagen.',
          examples:['En enkel, privat lista över viktiga behov','Reservrutiner för utrustning','Kontaktvägar till vård och apotek'],
          check:'Prata med vården om personligt lämplig beredskap.',
          caution:'HemmaRedo ger inte individuella medicinska råd. Skriv inte känsliga medicinska uppgifter i tjänsten.'
        },
        'electric-extra':{
          intro:'Vissa hjälpmedel måste fungera även om strömmen går. En reservplan behöver utgå från utrustningens krav.',
          examples:['Dokumenterade el- och batteribehov','Kontakt med leverantör och vård om reservlösningar','Plan för säker plats att vistas på om reservkraft saknas'],
          check:'Ta reda på hur länge utrustningen fungerar utan el.',
          caution:'Anslut aldrig livsviktig utrustning till en oprövad eller olämplig strömkälla.'
        },
        'mobility-extra':{
          intro:'En krisplan bör fungera även om hiss, transport eller andra hjälpmedel inte finns tillgängliga.',
          examples:['En överenskommelse med personer som kan hjälpa','Tillgängliga vägar och alternativa mötesplatser','Lättåtkomliga viktiga hjälpmedel'],
          check:'Gå igenom planen i din egen miljö och med dem som ska hjälpa till.',
          caution:'Anpassa alltid planen till individuella förutsättningar.'
        },
        'kids-extra':{
          intro:'Barn kan behöva både praktiska saker och extra tydlighet för att känna sig trygga.',
          examples:['Barnmat, blöjor och hygienartiklar där det behövs','Varma kläder och extra filtar','Favoritbok, gosedjur eller enkel aktivitet utan el','En tydlig och lugn plan för hur familjen håller ihop'],
          check:'Låt barnen vara delaktiga på ett sätt som passar deras ålder.',
          caution:'Välj information som lugnar och förklarar utan att skrämma.'
        }
      }
    },
    en:{
      open:'Read more and see examples',close:'Hide details',examples:'Examples of solutions',check:'Worth checking',caution:'Keep in mind',read:'Read official guidance',
      intro:'Open an item for practical examples and guidance. Mark it complete when you have a working solution – you do not need to buy every example.',
      details:{
        'water-store':{intro:'Plan for drinking water and other essential uses for everyone in the household.',examples:['Clean, sealed food-grade water containers','Store water in a cool, dark place. Opaque containers can reduce light exposure, but cleanliness and food-safe materials matter most.','Bottled water and extra containers for collecting emergency water'],check:'A simple HemmaRedo tip: refresh the water at Midsummer and Christmas. Use the old water for plants, clean containers if needed and refill with fresh drinking water. Label each container with the filling date. Twice a year is our simple reminder, not an official requirement.',caution:'Boiling and filtering do not remove every type of contamination.'},
        'food-week':{intro:'Start with foods your household actually eats, including options that need little water or cooking.',examples:['Canned beans, fish, vegetables and ready meals','Crispbread, oats, nuts and nut butter','Rice, pasta and other dry foods','Foods for children, allergies or special diets','Manual can opener'],check:'Check dates and rotate supplies regularly.',caution:'Plan for food safety when refrigeration stops.'},
        'cook-power':{intro:'Plan an alternative way to prepare food when electricity is unavailable.',examples:['Camping stove and suitable fuel','Outdoor grill where permitted','Thermos for hot water','Meals needing minimal cooking'],check:'Test equipment and inspect fuel before an emergency.',caution:'Never use grills or fuel-burning camping stoves indoors. Carbon monoxide and fire risk.'},
        warmth:{intro:'Have a safe plan for staying warm during a power outage.',examples:['Warm layers, hats, socks and sleeping bags','Blankets and extra duvets','One room to gather in','Approved wood-burning stove and dry wood if available'],check:'Identify which heating systems work without electricity.',caution:'Never use grills or unsuitable burners for indoor heating.'},
        torch:{intro:'Reliable lighting helps you move safely when the power is out.',examples:['Flashlight','Headlamp for hands-free work','Battery-powered lantern','Spare batteries or charging plan'],check:'Test lights and keep them where everyone can find them.',caution:'Candles are a fire hazard; battery-powered lighting is often safer.'},
        radio:{intro:'Swedish Radio P4 is a preparedness broadcaster. Keep a radio independent of mains power and internet.',examples:['Battery-powered FM radio','Crank or solar FM radio','Spare batteries','Note your local P4 frequency'],check:'Test P4 reception at home.',caution:'Streaming radio on a phone relies on connectivity.'},
        power:{intro:'A charged phone can help you stay in touch when networks are available.',examples:['Charged power bank','Compatible charging cables','Suitable vehicle charger','Rechargeable lights'],check:'Charge and test batteries regularly.',caution:'Follow battery safety guidance.'},
        aid:{intro:'Basic first-aid supplies and medicines need planning.',examples:['Dressings, plasters, bandages and gloves','Basic first-aid supplies','Necessary medicines according to medical advice'],check:'Check expiry dates and learn how to use the supplies.',caution:'Follow medical and pharmacy guidance for prescription medicines.'},
        hygiene:{intro:'Plan for hygiene and sanitation if running water or sewage stops working.',examples:['Soap, hand sanitiser and wipes','Toilet paper, menstrual supplies and nappies','Waste bags and sealable containers'],check:'Plan safe waste handling.',caution:'Follow local municipal instructions during sewage disruptions.'},
        contacts:{intro:'A paper contact list works even when your phone is unavailable.',examples:['Family and neighbours','Essential service contacts','112 emergency, 113 13 crisis information and 1177 healthcare advice'],check:'Keep a current paper copy.',caution:'Store private contact details securely.'},
        meetup:{intro:'Agree how everyone will reconnect if mobile or internet networks fail.',examples:['Primary meeting point','Alternative meeting point','Contact outside your local area','Paper map and addresses'],check:'Discuss the plan with everyone in the household.',caution:'Follow official evacuation instructions.'},
        'pet-supplies':{intro:'Pets need their own food, water, shelter and transport plan.',examples:['Familiar pet food and extra water','Leads, carriers and bowls','Any veterinary medicines and contacts'],check:'Plan for power cuts and evacuation.',caution:'Species have different needs, including temperature and electricity.'},
        'medical-extra':{intro:'Plan for critical medical aids and medicines.',examples:['Private list of essential needs','Backup procedures','Medical and pharmacy contacts'],check:'Discuss appropriate preparations with healthcare professionals.',caution:'Do not enter sensitive medical details in HemmaRedo.'},
        'electric-extra':{intro:'Some essential equipment depends on electricity.',examples:['Document power requirements','Ask suppliers about backup options','Plan a safe alternative location'],check:'Find out how long equipment can run without power.',caution:'Never connect critical equipment to untested power supplies.'},
        'mobility-extra':{intro:'Plan for situations where lifts or transport are unavailable.',examples:['People who can help','Accessible routes and meeting places','Essential mobility aids'],check:'Review the plan in your actual environment.',caution:'Adapt to individual needs.'},
        'kids-extra':{intro:'Children may need extra practical supplies and reassurance.',examples:['Age-appropriate food and hygiene supplies','Warm clothes and blankets','Comfort objects and offline activities','A simple family plan'],check:'Involve children in an age-appropriate way.',caution:'Use calm, clear explanations.'}
      }
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

  function fresh() { return {version:3,adults:0,children:0,pets:0,home:'house',equipment:[],needs:[],waterLiters:0,foodDays:0,overrides:{},finished:false,maxStep:0}; }
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
      blank.maxStep=blank.finished?4:(Number.isInteger(parsed.maxStep)?Math.max(0,Math.min(4,parsed.maxStep)):0);
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
      <nav class="desktop-links" aria-label="${tr.menu}"><a href="#how">${tr.how}</a><a href="#plan">${tr.yourPlan}</a><a href="#guides">${tr.guides}</a><a href="contacts.html">${lang==='sv'?'Telefonlista':'Phone list'}</a><a href="#help">${tr.help}</a></nav>
      <div class="top-actions"><label class="visually-hidden" for="lang-select">${tr.chooseLang}</label><select id="lang-select" class="lang-select" aria-label="${tr.chooseLang}"><option value="sv" ${lang==='sv'?'selected':''}>SV</option><option value="en" ${lang==='en'?'selected':''}>EN</option></select><button type="button" class="menu-button" data-action="menu" aria-label="${tr.menu}" aria-expanded="${menuOpen?'true':'false'}">${icon(menuOpen?'x':'menu')}</button></div>
      ${menuOpen?`<nav class="menu-panel" aria-label="${tr.menu}"><button data-route="home">${icon('home')}${tr.start}</button><button data-route="how">${icon('clipboard')}${tr.how}</button><button data-route="plan">${icon('check')}${tr.yourPlan}</button><button data-route="guides">${icon('info')}${tr.guides}</button><a href="contacts.html" class="menu-page-link">${icon('phone')}${lang==='sv'?'Telefonlista':'Phone list'}</a><button data-route="help">${icon('heart')}${tr.help}</button></nav>`:''}
    </header>`;
  }
  function banner(){return active==='friend'?`<div class="friend-banner">${icon('users','ic-sm')} ${L().friendMode} <button type="button" data-action="own">${L().backToMine}</button></div>`:'';}
  function footer(){return `<footer class="footer"><div class="footer-inner"><a class="brand" href="#home">${icon('home')}<span>HemmaRedo.</span></a><div class="footer-links"><a href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">Krisinformation.se</a><a href="#guides">${L().guides}</a><a href="#help">${L().help}</a><a href="contacts.html">${lang==='sv'?'Telefonlista':'Phone list'}</a><a href="#privacy">${lang==='sv'?'Integritet & lagring':'Privacy & storage'}</a></div><p>${L().footer} ${L().offline}</p></div></footer>`;}
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

  function taskRow(task){
    const info=checklistDetails[lang],detail=info.details[task.id];
    const expl=detail?`<details class="task-detail"><summary>${icon('info','ic-sm')}<span>${info.open}</span>${icon('chevron','ic-sm')}</summary>
      <div class="task-detail-body"><p>${detail.intro}</p><h4>${info.examples}</h4><ul>${detail.examples.map(item=>`<li>${item}</li>`).join('')}</ul>
      <div class="task-tip">${icon('check','ic-sm')}<p><strong>${info.check}:</strong> ${detail.check}</p></div>
      <div class="task-warning">${icon('info','ic-sm')}<p><strong>${info.caution}:</strong> ${detail.caution}</p></div>
      <a href="${task.href}" target="_blank" rel="noopener noreferrer">${info.read} ${icon('external','ic-sm')}</a>${task.id==='contacts'?'<a href="contacts.html" class="task-phone-link">'+(lang==='sv'?'Skapa utskrivbar telefonlista':'Create printable contact list')+' ↗</a>':''}</div></details>`:`<a href="${task.href}" target="_blank" rel="noopener noreferrer">${L().source} ↗</a>`;
    return `<div class="task-row ${done(task)?'done':''}"><input type="checkbox" aria-label="${escapeHTML(task.title)}" id="task-${task.id}" data-task="${task.id}" ${done(task)?'checked':''}><div class="task-copy"><label for="task-${task.id}"><strong>${task.title}</strong></label><p>${task.desc}</p>${expl}</div></div>`;
  }
  function plan(){const tr=L(),c=calc(),pr=p();return `${navMarkup()}${banner()}<main class="content-shell"><div class="eyebrow">${icon('check','ic-sm')}${tr.personal}</div><h1>${tr.personal}</h1><p class="lede">${tr.planDesc}</p><p class="checklist-intro">${icon('lightbulb','ic-sm')}${checklistDetails[lang].intro}</p><div class="card" style="margin-top:23px"><div class="plan-overview"><div><h3>${tr.little}</h3><p>${c.count} ${tr.outOf} ${c.all.length} ${tr.stepsDone}</p><button type="button" class="btn-quiet" style="padding-left:0;font-size:12px" data-action="edit">${tr.editAnswers}${icon('arrow','ic-sm')}</button></div>${progressRing(c.pct)}</div><div class="full-progress"><span style="width:${c.pct}%"></span></div><p class="source-note" style="margin-bottom:0">${tr.progressDisclaimer}</p></div><div class="plan-list">${groupMeta.map(g=>{const ts=c.all.filter(task=>task.group===g.id);const finished=ts.filter(done).length;const isOpen=expanded.has(g.id);return `<section class="plan-group" id="group-${g.id}"><button type="button" class="group-head" data-group="${g.id}" aria-expanded="${isOpen}"><span class="icon-badge ${g.color}">${icon(g.icon)}</span><span class="group-label"><strong>${name(g.name)}</strong><small>${finished} ${tr.outOf} ${ts.length} ${tr.stepsDone}</small></span>${icon('chevron','ic-sm')}</button><div class="group-content" ${isOpen?'':'hidden'}>${ts.map(taskRow).join('')}</div></section>`}).join('')}</div><div class="plan-actions">${action(tr.print,'primary','print','printer')}${action(tr.share,'outline','share','share')}${action(tr.newPlan,'outline','reset','back')}</div><div class="safe-note">${icon('info')}<span><strong>${tr.important}.</strong> ${tr.importantDesc}</span></div><div class="safe-note">${icon('printer')}<span>${tr.printHint}</span></div><div class="community-cta"><div class="eyebrow">${icon('heart','ic-sm')}${tr.help}</div><h2>${tr.stronger}</h2><p>${tr.helpLead}</p>${action(tr.helpStart,'outline','friend','arrow')}</div><p class="source-note">${tr.fromSources}: <a href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">Krisinformation.se</a>.</p><div class="print-note">${tr.printDate}: ${new Date().toLocaleDateString(lang==='sv'?'sv-SE':'en-GB')} · HemmaRedo · ${pr.adults} ${tr.adultsCount}, ${pr.children} ${tr.childrenCount}, ${pr.pets} ${tr.petsCount}</div></main>${footer()}`;}
  function help(){const tr=L();return `${navMarkup()}${banner()}<main class="content-shell"><div class="eyebrow">${icon('users','ic-sm')}${tr.helpEyebrow}</div><h1>${tr.helpTitle}</h1><p class="lede">${tr.helpLead}</p><div class="help-hero"><div class="help-visual"></div><div class="help-body"><h2>${tr.help}</h2><p>${tr.helpSeparate}</p>${action(tr.helpStart,'primary','friend','arrow')}</div></div><div class="guide-grid"><article class="guide-card">${icon('heart')}<h3>${tr.helpCard1}</h3><p>${tr.helpText1}</p></article><article class="guide-card">${icon('droplet')}<h3>${tr.helpCard2}</h3><p>${tr.helpText2}</p></article><article class="guide-card">${icon('users')}<h3>${tr.helpCard3}</h3><p>${tr.helpText3}</p></article></div></main>${footer()}`;}

  function howItWorks(){
    const tr=howCopy[lang];
    const cards=[
      {number:'01',iconName:'home',title:tr.s1,desc:tr.d1},
      {number:'02',iconName:'clipboard',title:tr.s2,desc:tr.d2},
      {number:'03',iconName:'check',title:tr.s3,desc:tr.d3}
    ];
    return `${navMarkup()}${banner()}<main class="how-page">
      <section class="how-hero">
        <div class="how-hero-copy"><div class="eyebrow">${icon('leaf','ic-sm')}${tr.kicker}</div>
          <h1>${tr.heading}</h1><p>${tr.lead}</p>
          ${action(tr.topButton,'primary','begin','arrow','how-main-action')}
          <span class="how-footnote">${tr.small}</span>
        </div>
        <div class="how-hero-art" role="img" aria-label="${lang==='sv'?'Illustrerad stuga vid en stilla sjö':'Illustrated cottage beside a peaceful lake'}"></div>
      </section>
      <section class="how-section how-steps">
        <div class="how-section-heading"><div class="eyebrow">${icon('sun','ic-sm')}01 — 03</div><h2>${tr.howTitle}</h2><p>${tr.howLead}</p></div>
        <div class="how-steps-grid">${cards.map(card=>`<article class="how-step"><div class="how-step-top"><span class="how-number">${card.number}</span><span class="how-step-icon">${icon(card.iconName)}</span></div><h3>${card.title}</h3><p>${card.desc}</p></article>`).join('')}</div>
      </section>
      <section class="how-section how-preview">
        <div class="how-preview-copy"><div class="eyebrow">${icon('leaf','ic-sm')}${tr.previewLabel}</div><h2>${tr.previewTitle}</h2><p>${tr.previewLead}</p><p class="how-preview-note">${icon('info','ic-sm')}${tr.previewNote}</p></div>
        <div class="how-mock-plan" aria-label="${tr.previewLabel}">
          <div class="how-mock-header"><span>HemmaRedo.</span><span class="how-mock-dots">● ● ●</span></div>
          <div class="how-mock-content"><div class="how-mock-ring"><span>2/3<small>${lang==='sv'?'exempel':'example'}</small></span></div><div class="how-mock-tasks">
            <div><span class="how-check-done">${icon('check','ic-sm')}</span>${tr.previewItem1}</div>
            <div><span class="how-check-done">${icon('check','ic-sm')}</span>${tr.previewItem2}</div>
            <div><span class="how-check-empty"></span>${tr.previewItem3}</div>
          </div></div>
        </div>
      </section>
      <section class="how-section how-faq"><div class="how-section-heading"><div class="eyebrow">${icon('heart','ic-sm')}FAQ</div><h2>${tr.faqTitle}</h2></div>
      ${[1,2,3,4].map(i=>`<details class="how-faq-item"><summary>${tr['q'+i]}${icon('chevron','ic-sm')}</summary><p>${tr['a'+i]}</p></details>`).join('')}
      <a class="how-source-link" href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">${tr.official}${icon('external','ic-sm')}</a></section>
      <section class="how-closing"><div class="how-closing-content"><div class="eyebrow">${icon('heart','ic-sm')}HemmaRedo</div><h2>${tr.closingTitle}</h2><p>${tr.closingLead}</p>${action(tr.closingButton,'primary','begin','arrow')}</div></section>
    </main>${footer()}`;
  }


  function guides(){
    const tr=resourceCopy[lang];
    const link=(url,label)=>`<a class="resources-link" href="${url}" target="_blank" rel="noopener noreferrer">${label} ${icon('external','ic-sm')}</a>`;
    const officialCards=[
      {iconName:'shield',title:tr.sourceTitle,desc:tr.sourceDesc,url:OFFICIAL},
      {iconName:'radio',title:tr.radioTitle,desc:tr.radioDesc,url:RADIO}
    ];
    const podcasts=[
      {num:'01',name:tr.pod1,desc:tr.pod1Desc,url:'https://shows.acast.com/katastrofen',cover:'https://i.scdn.co/image/ab6765630000ba8af8fe4e13ef3d42f5036e5016'},
      {num:'02',name:tr.pod2,desc:tr.pod2Desc,url:'https://podcasts.apple.com/se/podcast/vardagsprepping/id1511607040',cover:'https://i.scdn.co/image/ab6765630000ba8a7def9e9af809133e4318352a'},
      {num:'03',name:tr.pod3,desc:tr.pod3Desc,url:'https://www.hemberedskap.se/',cover:'https://images.podfollow.com/1292484355.jpg'}
    ];
    return `${navMarkup()}${banner()}<main class="resources-page">
      <section class="resources-hero"><div class="resources-hero-copy"><div class="eyebrow">${icon('leaf','ic-sm')}${tr.eyebrow}</div><h1>${tr.title}</h1><p>${tr.intro}</p></div><div class="resources-hero-art" aria-hidden="true"></div></section>
      <section class="resources-section"><div class="resources-section-head"><div class="eyebrow">${icon('shield','ic-sm')}${tr.typeOfficial}</div><h2>${tr.official}</h2><p>${tr.officialLead}</p></div><div class="resources-official-grid">
        ${officialCards.map(card=>`<article class="resource-card resource-official"><span class="resource-icon">${icon(card.iconName)}</span><h3>${card.title}</h3><p>${card.desc}</p>${link(card.url,tr.read)}</article>`).join('')}
      </div><div class="resources-quick-numbers"><div class="resources-quick-heading"><h3>${lang==='sv'?'Viktiga nummer':'Important numbers'}</h3><p>${lang==='sv'?'Tryck på ett nummer för att ringa direkt från mobilen.':'Tap a number to call directly from your phone.'}</p></div><div class="resources-phone-grid">
      ${[
        {num:'112',tel:'112',sv:'Akut hjälp – polis, ambulans och räddningstjänst',en:'Emergency – police, ambulance and fire services'},
        {num:'113 13',tel:'11313',sv:'Information vid allvarliga olyckor och kriser',en:'Information during major accidents and crises'},
        {num:'114 14',tel:'11414',sv:'Polisen – när det inte är akut',en:'Police – non-emergency matters'},
        {num:'1177',tel:'1177',sv:'Råd om vård och hälsa – när det inte är akut',en:'Medical and healthcare advice – non-emergency'}
      ].map(item=>`<a class="resources-phone-dial" href="tel:${item.tel}" aria-label="${lang==='sv'?'Ring':'Call'} ${item.num}: ${lang==='sv'?item.sv:item.en}"><span class="resources-phone-dial-num">${item.num}</span><span class="resources-phone-dial-desc">${lang==='sv'?item.sv:item.en}</span>${icon('phone','ic-sm')}</a>`).join('')}</div><p class="resources-phone-emergency">${lang==='sv'?'112 är endast för akuta nödsituationer. Samtal kräver fungerande telefonförbindelse.':'Call 112 only for emergencies. Calls require a working phone connection.'}</p><a class="resources-phone-source" href="${NUMBERS}" target="_blank" rel="noopener noreferrer">${lang==='sv'?'Läs mer om viktiga telefonnummer på Krisinformation.se':'More about important phone numbers at Krisinformation.se'} ${icon('external','ic-sm')}</a></div><div class="resources-contact-feature"><div><strong>${lang==='sv'?'Skriv ut viktiga telefonnummer':'Print important phone numbers'}</strong><p>${lang==='sv'?'Färdig A4-lista med myndighetsnummer. Fyll på med mormor, grannen och familjens viktiga kontakter.':'A ready-to-print A4 sheet with official numbers and your own contacts.'}</p></div><a href="contacts.html" class="btn-outline">${icon('printer','ic-sm')}${lang==='sv'?'Skapa telefonlista':'Create phone list'}</a></div></section>
      <section class="resources-section resources-podcast-section"><div class="resources-section-head"><div class="eyebrow">${icon('radio','ic-sm')}${tr.typePodcast}</div><h2>${tr.listen}</h2><p>${tr.listenLead}</p></div>
       <div class="resources-podcasts">
        ${podcasts.map(card=>`<article class="resources-podcast"><div class="resources-podcast-cover"><img src="${card.cover}" alt="${lang==='sv'?'Omslag för':'Cover for'} ${escapeHTML(card.name)}" loading="lazy" decoding="async" onerror="this.hidden=true"><span class="resources-cover-fallback">${escapeHTML(card.name)}</span></div><div class="resources-podcast-copy"><div class="resources-podcast-label"><span>${card.num}</span><span>${tr.typePodcast}</span></div><h3>${card.name}</h3><p>${card.desc}</p>${link(card.url,tr.listenAction)}</div></article>`).join('')}
       </div>
       <aside class="resource-featured"><span class="eyebrow">${icon('sun','ic-sm')}${tr.featured}</span><h3>${tr.featuredTitle}</h3><p>${tr.featuredText}</p>${link('https://shows.acast.com/katastrofen/episodes/126-hemberedskap-1a',tr.episode)}</aside>
      </section>
      <section class="resources-section"><div class="resources-section-head"><div class="eyebrow">${icon('sun','ic-sm')}${tr.typeVideo}</div><h2>${tr.watch}</h2><p>${tr.watchLead}</p></div>
      <article class="resource-video"><a class="resource-video-art" href="https://www.youtube.com/watch?v=6DfsNGTqJlw" target="_blank" rel="noopener noreferrer" aria-label="${tr.watchAction}: ${tr.videoTitle}"><img src="https://i.ytimg.com/vi/6DfsNGTqJlw/hqdefault.jpg" alt="${tr.videoTitle}" loading="lazy" decoding="async"><span class="resource-play" aria-hidden="true">▶</span></a><div class="resource-video-copy"><span class="eyebrow">${tr.typeVideo}</span><h3>${tr.videoTitle}</h3><p>${tr.videoDesc}</p>${link('https://www.youtube.com/watch?v=6DfsNGTqJlw',tr.watchAction)}</div></article>
      <div class="resources-caveat"><div class="resource-icon">${icon('info')}</div><div><strong>${tr.independent}</strong><p>${tr.disclaimer}</p></div></div>
      </section>
      <section class="resources-bottom"><h2>${tr.ctaTitle}</h2><p>${tr.ctaText}</p>${action(tr.ctaButton,'primary','begin','arrow')}</section>
    </main>${footer()}`;
  }

  const privacyCopy = {
    sv:{
      title:'Integritet & lagring',lead:'HemmaRedo ska vara enkelt att använda utan konto – och utan onödig spårning.',sub:'Så fungerar informationen i den här prototypen.',
      section1:'Vad sparas i din webbläsare?',body1:'Vi använder webbläsarens lokala lagring (localStorage) för dina svar om hushållet, checklistans markeringar, språkval och en separat plan om du hjälper en vän. Uppgifterna stannar normalt i den här webbläsaren och skickas inte till vår egen server för att lagra en profil. Om du använder en annan enhet finns inte dina sparade svar där.',
      section2:'Behöver du godkänna cookies?',body2:'Vi använder inte egna analys- eller annonscookies i prototypen. Lagringen används för att de funktioner du valt ska fungera, till exempel för att din plan ska finnas kvar när du återkommer. Därför visar vi ingen samtyckesbanner för icke-nödvändiga cookies. Om vi lägger till statistik eller annan icke-nödvändig lagring behöver vi ompröva detta och vid behov be om samtycke innan den aktiveras.',
      section3:'Externa tjänster',body3:'Webbplatsen laddar typsnitt från Google Fonts. Sidan Tips & länkar kan ladda omslagsbilder från externa bildservrar och en videominiatyr från YouTube. När sådana resurser laddas kan din webbläsare kontakta dessa leverantörer och dela tekniska anslutningsuppgifter, till exempel IP-adress. När du väljer en extern länk gäller den webbplatsens egen integritetspolicy.',
      section4:'Radera dina sparade uppgifter',body4:'Du kan radera HemmaRedos lokalt sparade hushållsplan, vänplan och språkval här. Detta kan inte ångras. Om du rensar webbläsarens webbplatsdata kan uppgifterna också försvinna.',
      clear:'Radera mina sparade uppgifter',confirm:'Vill du radera din plan, vänplan och språkval från den här webbläsaren? Det går inte att ångra.',section5:'Vem ansvarar?',body5:'HemmaRedo är en oberoende prototyp och inte en myndighetstjänst. Den här texten beskriver den nuvarande tekniska lösningen, men är inte en komplett juridisk integritetspolicy inför offentlig lansering.',
      close:'Till startsidan'
    },
    en:{
      title:'Privacy & local storage',lead:'HemmaRedo should work without an account or unnecessary tracking.',sub:'How this prototype handles information.',
      section1:'What is stored in your browser?',body1:'We use localStorage to remember household answers, checked tasks, language preference and a separate plan if you help a friend. These details normally remain in this browser and are not sent to our server to create a profile. They do not automatically appear on other devices.',
      section2:'Do you need to accept cookies?',body2:'The prototype does not use its own advertising or analytics cookies. Local storage supports features you request, such as keeping your plan between visits. Therefore we do not show a non-essential cookie consent banner. If we add analytics or other non-essential storage, we must reassess this and ask for consent when required before activation.',
      section3:'Third-party services',body3:'The site loads fonts from Google Fonts. The Advice & links page can load podcast artwork from external image servers and a video thumbnail from YouTube. Loading these resources can send technical connection information such as your IP address to their providers. External websites have their own privacy policies.',
      section4:'Delete locally saved details',body4:'You can remove your saved household plan, friend plan and language preference from this browser. This cannot be undone. Clearing browser site data can also remove them.',
      clear:'Delete my saved details',confirm:'Delete your household plan, friend plan and language preference from this browser? This cannot be undone.',section5:'Who is responsible?',body5:'HemmaRedo is an independent prototype, not a government service. This page describes the current technical implementation but is not a complete legal privacy policy for a public launch.',
      close:'Back to home'
    }
  };
  function privacyPage(){
    const t=privacyCopy[lang];
    const blocks=[[t.section1,t.body1],[t.section2,t.body2],[t.section3,t.body3],[t.section4,t.body4],[t.section5,t.body5]];
    return `${navMarkup()}${banner()}<main class="content-shell privacy-page"><div class="eyebrow">${icon('lock','ic-sm')}HemmaRedo</div><h1>${t.title}</h1><p class="lede">${t.lead}</p><p class="privacy-sub">${t.sub}</p>
      <div class="privacy-sections">${blocks.map((b,i)=>`<section class="privacy-section"><h2>${b[0]}</h2><p>${b[1]}</p>${i===3?'<button type="button" class="btn-outline privacy-delete" data-action="clear-storage">'+t.clear+'</button>':''}</section>`).join('')}</div>
      ${action(t.close,'quiet','home','back')}</main>${footer()}`;
  }

  function render(){document.documentElement.lang=lang;document.title='HemmaRedo – '+(lang==='sv'?'Ett tryggare hem börjar här':'A safer home starts here');
    root.innerHTML=route==='home'?home():route==='quiz'?quiz():route==='result'?result():route==='plan'?plan():route==='help'?help():route==='how'?howItWorks():route==='privacy'?privacyPage():guides();
    if(toastText)root.insertAdjacentHTML('beforeend',`<div role="status" class="toast">${escapeHTML(toastText)}</div>`);
  }
  function showHash(){menuOpen=false;const hash=decodeURIComponent(location.hash.replace(/^#\/?/,''));const match=/^quiz(?:\/(\d))?$/.exec(hash);
    if(match){route='quiz';step=Math.max(0,Math.min(p().finished?4:p().maxStep,Number(match[1]||0)));}
    else route=['home','result','plan','help','how','guides','privacy'].includes(hash)?hash:'home';if(!p().finished&&(route==='plan'||route==='result')){route='quiz';step=0;if(location.hash!=='#quiz/0')history.replaceState(null,'','#quiz/0');}
    render();window.scrollTo({top:0,behavior:'instant'});
  }
  function navigate(to){const hash='#'+to;if(location.hash===hash)showHash();else location.hash=hash;}
  function toast(msg){toastText=msg;clearTimeout(toastTimer);render();toastTimer=setTimeout(()=>{toastText='';render();},2700);}
  function next(){if(step===0 && p().adults+p().children<1){toast(L().validation);return;}
    if(step===4){if(p().maxStep<4){navigate('quiz/0');return;}p().finished=true;save();navigate('result');}
    else {p().maxStep=Math.max(p().maxStep,step+1);save();navigate('quiz/'+(step+1));}
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
      case 'clear-storage':
        if(confirm(privacyCopy[lang].confirm)){
          Object.values(STORAGE).forEach(key=>{try{localStorage.removeItem(key);}catch{}});
          own=fresh();friend=fresh();active='own';lang='sv';menuOpen=false;expanded.clear();expanded.add('water');expanded.add('food');navigate('home');render();
        }
        break;
      case 'home':navigate('home');break;
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
