# ADR-002: Motore fiscale parametrico

## Stato
Accettato

## Contesto
Fiscalità SRL (IRES 24%, IRAP 3,9%) varia per tipo venditore, regime IVA/registro, strategia exit. Cedolare secca non applicabile a SRL.

## Decisione
Tutte le aliquote in `tax_profiles` configurabili. Il motore non "indovina" il fisco. Disclaimer obbligatorio: non consulenza professionale.

## Conseguenze
- Preset approvati dal commercialista
- Formule in Python, mai hardcoded nel frontend
- Validazione input con range sensati
