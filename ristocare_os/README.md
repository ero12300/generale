# RistoCare OS - Programma MVP

Questa cartella contiene un primo programma eseguibile derivato dal documento strategico allegato.

## Cosa implementa

- gestione organizzazione con piano (`start`, `pro`, `premium`, `enterprise`);
- gestione attrezzature con limite per piano;
- apertura ticket;
- gestione stati ticket secondo workflow operativo RistoCare OS;
- dashboard KPI base (`equipment_count`, `open_tickets`, `tickets_by_status`).

## Esecuzione rapida

Inizializza un'organizzazione:

`python3 ristocare_os/ristocare_os.py --db ristocare_os/demo.json init --name "Locale Demo" --plan start`

Aggiungi un'attrezzatura:

`python3 ristocare_os/ristocare_os.py --db ristocare_os/demo.json add-equipment --name "Forno Rational" --category forno --serial-number FRN-001 --location cucina`

Apri un ticket:

`python3 ristocare_os/ristocare_os.py --db ristocare_os/demo.json open-ticket --equipment-id <equipment_id> --title "Errore E4" --description "La macchina si blocca" --urgency alta`

Vedi dashboard:

`python3 ristocare_os/ristocare_os.py --db ristocare_os/demo.json dashboard`

## Test

`python3 -m unittest ristocare_os/test_ristocare_os.py`
