import { people } from "@/data";
import type { Person } from "@/types";

export function getPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

export function listPeople(): readonly Person[] {
  return people;
}

export function listInternal(): readonly Person[] {
  return people.filter((p) => p.relationshipType === "internal");
}

export function listExternal(): readonly Person[] {
  return people.filter((p) => p.relationshipType === "external");
}
