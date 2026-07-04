const STORAGE_KEY = "portepro-projects";

import type { DoorProject } from "@/lib/types";

export function loadProjects(): DoorProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DoorProject[];
  } catch {
    return [];
  }
}

export function saveProjects(projects: DoorProject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function upsertProject(project: DoorProject): void {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.unshift(project);
  }
  saveProjects(projects);
}

export function deleteProject(id: string): void {
  saveProjects(loadProjects().filter((p) => p.id !== id));
}

export function createProjectId(): string {
  return `porta-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
