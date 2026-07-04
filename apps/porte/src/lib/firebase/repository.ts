import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { DoorProject } from "@/lib/types";

function db() {
  const firestore = getFirebaseDb();
  if (!firestore) throw new Error("Firebase non configurato");
  return firestore;
}

function projectsCollection(userId: string) {
  return collection(db(), "users", userId, "projects");
}

export const firebaseRepository = {
  async listProjects(userId: string): Promise<DoorProject[]> {
    const q = query(projectsCollection(userId), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as DoorProject);
  },

  async upsertProject(userId: string, project: DoorProject): Promise<DoorProject> {
    const ref = doc(db(), "users", userId, "projects", project.id);
    await setDoc(ref, project, { merge: true });
    return project;
  },

  async deleteProject(userId: string, projectId: string): Promise<void> {
    await deleteDoc(doc(db(), "users", userId, "projects", projectId));
  },
};
