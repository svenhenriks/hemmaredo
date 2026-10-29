# HemmaRedo 0.3 – mobilförst-webbapp

HemmaRedo är en fristående prototyp för svenska hushåll. Den är byggd i vanlig HTML, CSS och JavaScript, utan ramverk eller byggsteg. Den kan publiceras direkt med Netlify Drop eller på ett annat statiskt webbhotell.

## Publicera på Netlify

1. Gå till https://app.netlify.com/drop och logga in på ett Netlify-konto.
2. Dra **mappen `HemmaRedo-webbapp`** till Netlify Drop. Du kan också prova att dra ZIP-filen med webbplatsen.
3. Öppna webbadressen som Netlify ger dig.

Alla filer för webbplatsen ligger i samma mapp. `index.html` ska ligga i roten på den uppladdade mappen, inte i en extra undermapp.

## Funktioner

- Mobilförst-startsida med en specialframtagen naturillustration, baserad på godkänd designriktning.
- Fem frågor: hushåll, boende, utrustning, särskilda behov, vatten/mat.
- Personlig handlingsplan med checkbara åtgärder, grupper och prioriterade nästa steg.
- Beräkning av grundnivå för vatten: 3–5 liter/person/dygn i 7 dygn. Extra vatten för husdjur och andra behov tillkommer.
- Framstegsring som visar andel avklarade punkter i planen, inte faktisk säkerhet eller beredskapsnivå.
- Svenskt och engelskt gränssnitt.
- "Hjälp en vän" med separat lokal plan.
- Spara automatiskt i localStorage. Inga konton, ingen databas, ingen datadelning med oss.
- Utskriftsvänlig plan – använd webbläsarens Skriv ut / Spara som PDF.
- Installation till hemskärmen som PWA och offline-cache efter första besök via HTTPS.

## Viktigt om lokal lagring

Planen lagras enbart på samma enhet och i samma webbläsare. Den synkas inte mellan mobil och dator. Om användaren rensar webbläsardata kan planen försvinna. Det lagras inga personnamn eller detaljer om hälsotillstånd i appen.

## Officiella källor

- [Krisinformation.se – Hemberedskap](https://www.krisinformation.se/din-beredskap/hemberedskap/)
- [Krisinformation.se – Viktiga telefonnummer](https://www.krisinformation.se/din-beredskap/skydd-och-hjalp/viktiga-telefonnummer/)
- [Krisinformation.se – Sveriges Radios beredskapsuppdrag](https://www.krisinformation.se/din-beredskap/kommunikation/sveriges-radios-beredskapsuppdrag/)

Detta är en prototyp och ingen myndighetstjänst. Text och rekommendationer ska granskas innan bred lansering.

## Vad som kan läggas till senare

1. Testning med svenska hushåll och tillgänglighetsgranskning enligt WCAG.
2. Granskning och versionshantering av alla myndighetsbaserade råd.
3. Fler språk, särskilt sådana med höger-till-vänster-skrift.
4. Om det finns ett faktiskt behov av att synka familjers plan mellan enheter: autentisering och databas (t.ex. Supabase) med ordentlig behörighetsmodell, backup och GDPR-bedömning.
5. Grannsamverkan: börja med information om frivillig samverkan utan att samla personuppgifter eller visa grannars position.
6. Github + Netlify för automatisk publicering vid varje uppdatering.

## Filstruktur

- `index.html`: struktur, metadata och SVG-ikoner.
- `styles.css`: mobilförst-design med responsiv desktoplayout.
- `app.js`: innehåll, logik och lokal lagring.
- `manifest.webmanifest`, `sw.js`: installationsbar web app och offline-cache.
- `assets/`: illustration och appikoner.

## Utveckla lokalt

Öppna mappen i VS Code och starta valfri lokal webbserver, t.ex.:

```sh
python3 -m http.server 8080
```

Besök `http://localhost:8080`. Service worker fungerar när sidan serveras med HTTPS eller på localhost.
