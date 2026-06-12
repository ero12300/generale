import tempfile
import unittest
from pathlib import Path

from ristocare_os import RistoCareOS


class RistoCareOsTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "ristocare_data.json"

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_start_plan_blocks_more_than_ten_equipments(self) -> None:
        app = RistoCareOS(self.db_path)
        app.init_organization(name="Locale Demo", plan="start")

        for index in range(10):
            app.add_equipment(
                name=f"Macchina {index}",
                category="frigo",
                serial_number=f"SN-{index}",
                location="cucina",
            )

        with self.assertRaises(ValueError):
            app.add_equipment(
                name="Macchina extra",
                category="frigo",
                serial_number="SN-EXTRA",
                location="cucina",
            )

    def test_ticket_transition_must_follow_workflow(self) -> None:
        app = RistoCareOS(self.db_path)
        app.init_organization(name="Locale Demo", plan="pro")
        equipment = app.add_equipment(
            name="Lavastoviglie",
            category="lavastoviglie",
            serial_number="LVS-001",
            location="cucina",
        )

        ticket = app.open_ticket(
            equipment_id=equipment["id"],
            title="Errore E4",
            description="La macchina si ferma.",
            urgency="alta",
        )

        with self.assertRaises(ValueError):
            app.move_ticket(ticket_id=ticket["id"], new_status="Risolto")

    def test_dashboard_reports_open_and_closed_tickets(self) -> None:
        app = RistoCareOS(self.db_path)
        app.init_organization(name="Locale Demo", plan="pro")
        equipment = app.add_equipment(
            name="Forno",
            category="forno",
            serial_number="FRN-001",
            location="cucina",
        )

        open_ticket = app.open_ticket(
            equipment_id=equipment["id"],
            title="Ventola rumorosa",
            description="Serve verifica.",
            urgency="media",
        )
        closed_ticket = app.open_ticket(
            equipment_id=equipment["id"],
            title="Termostato bloccato",
            description="Problema risolto dopo intervento.",
            urgency="alta",
        )

        app.move_ticket(closed_ticket["id"], "In verifica")
        app.move_ticket(closed_ticket["id"], "Richiesta informazioni")
        app.move_ticket(closed_ticket["id"], "In attesa tecnico")
        app.move_ticket(closed_ticket["id"], "Preventivo ricevuto")
        app.move_ticket(closed_ticket["id"], "Preventivo inviato al cliente")
        app.move_ticket(closed_ticket["id"], "Accettato")
        app.move_ticket(closed_ticket["id"], "Programmato")
        app.move_ticket(closed_ticket["id"], "In intervento")
        app.move_ticket(closed_ticket["id"], "Risolto")
        app.move_ticket(closed_ticket["id"], "Chiuso")

        dashboard = app.dashboard()

        self.assertEqual(dashboard["equipment_count"], 1)
        self.assertEqual(dashboard["open_tickets"], 1)
        self.assertEqual(dashboard["tickets_by_status"]["Nuovo"], 1)
        self.assertEqual(dashboard["tickets_by_status"]["Chiuso"], 1)
        self.assertEqual(open_ticket["status"], "Nuovo")


if __name__ == "__main__":
    unittest.main()
