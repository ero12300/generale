import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDb } from "../firebase";
import type {
  Booking,
  Campaign,
  Customer,
  Service,
  ShopSettings,
  Transaction,
} from "../types";
import type { DataStore } from "./datastore";

const DEFAULT_SETTINGS: ShopSettings = {
  id: "settings",
  plan: "base",
  shopName: "Il mio Barbershop",
  openingHour: 9,
  closingHour: 19,
  slotMinutes: 30,
};

async function listCollection<T>(name: string): Promise<T[]> {
  const snap = await getDocs(collection(getDb(), name));
  return snap.docs.map((d) => d.data() as T);
}

async function saveItem<T extends { id: string }>(
  name: string,
  item: T
): Promise<void> {
  await setDoc(doc(getDb(), name, item.id), item);
}

async function deleteItem(name: string, id: string): Promise<void> {
  await deleteDoc(doc(getDb(), name, id));
}

export class FirestoreStore implements DataStore {
  listServices = () => listCollection<Service>("services");
  saveService = (s: Service) => saveItem("services", s);
  deleteService = (id: string) => deleteItem("services", id);

  listCustomers = () => listCollection<Customer>("customers");
  saveCustomer = (c: Customer) => saveItem("customers", c);
  deleteCustomer = (id: string) => deleteItem("customers", id);

  listBookings = () => listCollection<Booking>("bookings");
  saveBooking = (b: Booking) => saveItem("bookings", b);
  deleteBooking = (id: string) => deleteItem("bookings", id);

  listTransactions = () => listCollection<Transaction>("transactions");
  saveTransaction = (t: Transaction) => saveItem("transactions", t);
  deleteTransaction = (id: string) => deleteItem("transactions", id);

  listCampaigns = () => listCollection<Campaign>("campaigns");
  saveCampaign = (c: Campaign) => saveItem("campaigns", c);
  deleteCampaign = (id: string) => deleteItem("campaigns", id);

  async getSettings(): Promise<ShopSettings> {
    const snap = await getDoc(doc(getDb(), "settings", "settings"));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return snap.data() as ShopSettings;
  }
  async saveSettings(settings: ShopSettings): Promise<void> {
    await setDoc(doc(getDb(), "settings", "settings"), settings);
  }
}
