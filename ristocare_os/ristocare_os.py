import argparse
import json
from pathlib import Path
from typing import Any
from uuid import uuid4

PLAN_LIMITS: dict[str, int | None] = {
    "start": 10,
    "pro": 30,
    "premium": 70,
    "enterprise": None,
}

TICKET_STATUSES = [
    "Nuovo",
    "In verifica",
    "Richiesta informazioni",
    "In attesa tecnico",
    "Preventivo ricevuto",
    "Preventivo inviato al cliente",
    "Accettato",
    "Programmato",
    "In intervento",
    "In attesa ricambio",
    "Risolto",
    "Chiuso",
    "Non coperto da garanzia",
    "Contestato",
    "Annullato",
]

LINEAR_FLOW = [
    "Nuovo",
    "In verifica",
    "Richiesta informazioni",
    "In attesa tecnico",
    "Preventivo ricevuto",
    "Preventivo inviato al cliente",
    "Accettato",
    "Programmato",
    "In intervento",
    "In attesa ricambio",
    "Risolto",
    "Chiuso",
]


def _build_transitions() -> dict[str, set[str]]:
    transitions: dict[str, set[str]] = {}
    for index, status in enumerate(LINEAR_FLOW):
        allowed: set[str] = set()
        if index + 1 < len(LINEAR_FLOW):
            allowed.add(LINEAR_FLOW[index + 1])
        if status == "In intervento":
            allowed.add("Risolto")
        if status not in {"Chiuso", "Annullato"}:
            allowed.update({"Non coperto da garanzia", "Contestato", "Annullato"})
        transitions[status] = allowed

    transitions["Non coperto da garanzia"] = {
        "Preventivo ricevuto",
        "Contestato",
        "Annullato",
    }
    transitions["Contestato"] = {"In verifica", "Risolto", "Chiuso", "Annullato"}
    transitions["Annullato"] = set()
    transitions["Chiuso"] = set()
    return transitions


ALLOWED_TRANSITIONS = _build_transitions()


class RistoCareOS:
    def __init__(self, db_path: str | Path):
        self.db_path = Path(db_path)
        self._data = self._load_data()

    def _load_data(self) -> dict[str, Any]:
        if not self.db_path.exists():
            return {"organization": None, "equipments": [], "tickets": []}
        return json.loads(self.db_path.read_text(encoding="utf-8"))

    def _save_data(self) -> None:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.db_path.write_text(
            json.dumps(self._data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def init_organization(self, name: str, plan: str) -> dict[str, Any]:
        plan_normalized = plan.lower()
        if plan_normalized not in PLAN_LIMITS:
            raise ValueError(f"Piano non valido: {plan}.")

        organization = {
            "id": f"org_{uuid4().hex[:10]}",
            "name": name,
            "plan": plan_normalized,
        }
        self._data["organization"] = organization
        self._data["equipments"] = []
        self._data["tickets"] = []
        self._save_data()
        return organization

    def _require_organization(self) -> dict[str, Any]:
        organization = self._data.get("organization")
        if not organization:
            raise ValueError("Organizzazione non inizializzata. Usa init_organization.")
        return organization

    def add_equipment(
        self,
        name: str,
        category: str,
        serial_number: str,
        location: str,
    ) -> dict[str, Any]:
        organization = self._require_organization()
        limit = PLAN_LIMITS[organization["plan"]]
        current_equipments = self._data["equipments"]
        if limit is not None and len(current_equipments) >= limit:
            raise ValueError(
                f"Limite attrezzature raggiunto per piano {organization['plan']} ({limit})."
            )

        equipment = {
            "id": f"eq_{uuid4().hex[:10]}",
            "organization_id": organization["id"],
            "name": name,
            "category": category,
            "serial_number": serial_number,
            "location": location,
            "status": "attiva",
        }
        current_equipments.append(equipment)
        self._save_data()
        return equipment

    def open_ticket(
        self,
        equipment_id: str,
        title: str,
        description: str,
        urgency: str,
    ) -> dict[str, Any]:
        organization = self._require_organization()
        equipment = self._find_equipment(equipment_id)
        if equipment is None:
            raise ValueError(f"Attrezzatura non trovata: {equipment_id}.")

        ticket = {
            "id": f"tkt_{uuid4().hex[:10]}",
            "organization_id": organization["id"],
            "equipment_id": equipment_id,
            "title": title,
            "description": description,
            "urgency": urgency,
            "status": "Nuovo",
        }
        self._data["tickets"].append(ticket)
        self._save_data()
        return ticket

    def move_ticket(self, ticket_id: str, new_status: str) -> dict[str, Any]:
        if new_status not in TICKET_STATUSES:
            raise ValueError(f"Stato ticket non valido: {new_status}.")

        ticket = self._find_ticket(ticket_id)
        if ticket is None:
            raise ValueError(f"Ticket non trovato: {ticket_id}.")

        current_status = ticket["status"]
        allowed_next_status = ALLOWED_TRANSITIONS.get(current_status, set())
        if new_status not in allowed_next_status:
            raise ValueError(
                f"Transizione non consentita: {current_status} -> {new_status}."
            )

        ticket["status"] = new_status
        self._save_data()
        return ticket

    def dashboard(self) -> dict[str, Any]:
        self._require_organization()
        tickets = self._data["tickets"]
        open_statuses = {"Chiuso", "Annullato"}

        by_status = {status: 0 for status in TICKET_STATUSES}
        for ticket in tickets:
            by_status[ticket["status"]] = by_status.get(ticket["status"], 0) + 1

        return {
            "equipment_count": len(self._data["equipments"]),
            "open_tickets": sum(
                1 for ticket in tickets if ticket["status"] not in open_statuses
            ),
            "tickets_by_status": by_status,
        }

    def _find_equipment(self, equipment_id: str) -> dict[str, Any] | None:
        for equipment in self._data["equipments"]:
            if equipment["id"] == equipment_id:
                return equipment
        return None

    def _find_ticket(self, ticket_id: str) -> dict[str, Any] | None:
        for ticket in self._data["tickets"]:
            if ticket["id"] == ticket_id:
                return ticket
        return None


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="RistoCare OS MVP CLI - gestione base attrezzature e ticket"
    )
    parser.add_argument("--db", default="ristocare_data.json", help="Percorso DB JSON")
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init", help="Inizializza organizzazione")
    init_parser.add_argument("--name", required=True)
    init_parser.add_argument("--plan", required=True, choices=list(PLAN_LIMITS.keys()))

    equipment_parser = subparsers.add_parser(
        "add-equipment", help="Aggiunge una attrezzatura"
    )
    equipment_parser.add_argument("--name", required=True)
    equipment_parser.add_argument("--category", required=True)
    equipment_parser.add_argument("--serial-number", required=True)
    equipment_parser.add_argument("--location", required=True)

    ticket_parser = subparsers.add_parser("open-ticket", help="Apre un ticket")
    ticket_parser.add_argument("--equipment-id", required=True)
    ticket_parser.add_argument("--title", required=True)
    ticket_parser.add_argument("--description", required=True)
    ticket_parser.add_argument("--urgency", required=True)

    move_ticket_parser = subparsers.add_parser(
        "move-ticket", help="Cambia stato ticket"
    )
    move_ticket_parser.add_argument("--ticket-id", required=True)
    move_ticket_parser.add_argument("--new-status", required=True)

    subparsers.add_parser("dashboard", help="Mostra dashboard KPI base")
    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()
    app = RistoCareOS(args.db)

    if args.command == "init":
        result = app.init_organization(name=args.name, plan=args.plan)
    elif args.command == "add-equipment":
        result = app.add_equipment(
            name=args.name,
            category=args.category,
            serial_number=args.serial_number,
            location=args.location,
        )
    elif args.command == "open-ticket":
        result = app.open_ticket(
            equipment_id=args.equipment_id,
            title=args.title,
            description=args.description,
            urgency=args.urgency,
        )
    elif args.command == "move-ticket":
        result = app.move_ticket(ticket_id=args.ticket_id, new_status=args.new_status)
    else:
        result = app.dashboard()

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
