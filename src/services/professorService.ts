import type { Professor } from "../types/models";

export function addProfessor(professors: Professor[], professor: Professor): void {
  if (professors.some(p => p.id === professor.id)) {
    console.warn("Professor with this ID already exists:", professor.id);
    return;
  }
  professors.push(professor);
}
