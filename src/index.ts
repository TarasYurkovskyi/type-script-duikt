import { Professor, Classroom, Course, Lesson } from "./types/models";
import { addProfessor } from "./services/professorService";
import { addLesson } from "./services/lessonService";
import { findAvailableClassrooms, getProfessorSchedule } from "./services/searchService";
import { validateLesson } from "./services/validateService";
import { getClassroomUtilization, getMostPopularCourseType } from "./services/analyticsService";
import { reassignClassroom, cancelLesson } from "./services/lessonModificationService";

const professors: Professor[] = [];
const classrooms: Classroom[] = [
  { number: "101", capacity: 30, hasProjector: true },
  { number: "102", capacity: 25, hasProjector: false },
  { number: "103", capacity: 40, hasProjector: true }
];
const courses: Course[] = [
  { id: 10, name: "Math", type: "Lecture" },
  { id: 11, name: "Physics", type: "Lab" }
];
const schedule: Lesson[] = [];

addProfessor(professors, { id: 1, name: "John Smith", department: "CS" });
addProfessor(professors, { id: 2, name: "Alice Brown", department: "Math" });

const newLesson1: Lesson = {
  courseId: 10,
  professorId: 1,
  classroomNumber: "101",
  dayOfWeek: "Monday",
  timeSlot: "8:30-10:00"
};

const newLesson2: Lesson = {
  courseId: 11,
  professorId: 1,
  classroomNumber: "102",
  dayOfWeek: "Monday",
  timeSlot: "10:15-11:45"
};

// Валідація перед додаванням
if (!validateLesson(newLesson1, schedule)) addLesson(schedule, newLesson1);
if (!validateLesson(newLesson2, schedule)) addLesson(schedule, newLesson2);

// ==== Пошук та фільтрація ====
console.log("Вільні аудиторії о 8:30-10:00:", findAvailableClassrooms(classrooms, schedule, "8:30-10:00", "Monday"));
console.log("Розклад професора 1:", getProfessorSchedule(1, schedule));

// ==== Аналітика ====
console.log("Використання аудиторії 101:", getClassroomUtilization("101", schedule).toFixed(2), "%");
console.log("Найпопулярніший тип занять:", getMostPopularCourseType(courses));

// ==== Модифікація та скасування занять ====

// Змінюємо аудиторію заняття 0 на "103"
if (reassignClassroom(0, "103", schedule)) {
  console.log("Аудиторія заняття 0 успішно змінена на 103");
} else {
  console.log("Не вдалося змінити аудиторію заняття 0 через конфлікт");
}

// Скасовуємо заняття 1
cancelLesson(1, schedule);
console.log("Розклад після скасування заняття 1:", schedule);
