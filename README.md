# TRainer Fischer Landingpage – Version 3

## Umgesetzt
- Original-Logo eingebunden: `assets/trainer-fischer-logo.png`
- hellere Segmente und stärkere Segmenttrennung
- Angebotskarten symmetrisch 2x2
- Video als sauberer Placeholder mit YouTube-Link statt fehleranfälligem lokalen Embed
- quadratisches Bild in der Herausforderung-Sektion
- Referenzen mit längeren, vierzeiligen Texten
- CSP-Meta-Zeile bewusst nicht enthalten, für lokale Tests geeignet

## Ersetzen
- `assets/rainer-fischer-portrait.svg` durch echtes Portrait als `.webp` oder `.png`
- `assets/challenge-placeholder.svg` durch passendes Bild
- `assets/video-placeholder.svg` durch Videothumbnail, falls gewünscht

## Version 4
- Zwei Case-Study-Karten nebeneinander
- Case study 1: No Performer zu Performer
- Case study 2: Highperformer zu Exzellenz
- Angebotskacheln optisch hochwertiger abgesetzt

## Version 5
- Hover-/Focus-Flipcards in der Methodik mit Buch-Insights
- mittlere Referenz-Person in CI-Blau
- Proof-Strip direkt nach Hero für stärkere Conversion
- Premium-Hover/Apple-Level Micro-Interactions
- Kontaktbereich mit Entscheidungsnutzen geschärft

## Version 6
- Hero-Sektion conversionstärker: Diagnose-Badges, stärkere CTA-Logik, Microcopy
- Hero-Visual-Claim geschärft
- Angebotsheadline: "Standardtrainings" gestrichen/rot gekreuzt, zweite Zeile als klare Positionierung

## Version 7
- Footer-Link "AGB" ergänzt
- impressum.html, datenschutz.html und agb.html als Vorlagen ergänzt
- Datenschutz: kein Tracking, Netlify Hosting und Hinweis auf DPA/Auftragsverarbeitung aufgenommen


## Final Setup (A–D)

A) Design prüfen (Hero Alignment, Bilder ersetzen)
B) Conversion testen (CTA klickbar, Formular testen)
C) Domain verbinden (Netlify DNS)
D) Recht prüfen (Impressum/Datenschutz final gegenlesen)


## Version 9
- Hero-Sektion neu austariert: klare Achse, geringere Asymmetrien, besseres Spaltenverhältnis
- Hero-Bild bewusst positioniert statt zufällig tief
- "Standardtrainings" mit dünnerem, handschriftlicherem roten Durchstreich-Effekt

## Version 10 – Formularschutz und DSGVO

Umgesetzt:
- Netlify Forms aktiviert (`data-netlify="true"`, Formularname `kontakt`)
- Honeypot-Feld gegen Bot-Spam
- Time-to-submit-Prüfung bleibt aktiv
- Formularversand über Netlify-kompatibles Format
- Datenschutz ergänzt: Netlify Forms, Honeypot, kein reCAPTCHA, Zieladresse buero@trainer-fischer.online
- `netlify.toml` mit Basis-Security-Headern ergänzt

Wichtig: E-Mail-Weiterleitung in Netlify aktivieren:
1. Site öffnen
2. Site configuration
3. Forms
4. Form notifications
5. Add notification
6. Email notification
7. Zieladresse: buero@trainer-fischer.online

Double-Opt-in:
Für reine Kontaktanfragen ist kein Newsletter-Double-Opt-in erforderlich. Eine ausdrückliche Kontakt-Einwilligung ist im Formular ergänzt. Für Newsletter/Marketing-Mails müsste später ein separates DOI-System wie Brevo, HubSpot, KlickTipp oder Mailchimp angebunden werden.
