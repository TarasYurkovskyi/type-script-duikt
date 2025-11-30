// === Enum ===

// Статус студента
enum StudentStatus {
  Active = "Active",
  Academic_Leave = "Academic_Leave",
  Graduated = "Graduated",
  Expelled = "Expelled"
}

// Тип курсу
enum CourseType {
  Mandatory = "Mandatory",
  Optional = "Optional",
  Special = "Special"
}

// Семестр
enum Semester {
  First = "First",
  Second = "Second"
}

// Оцінки
enum GradeValue {
  Excellent = 5,
  Good = 4,
  Satisfactory = 3,
  Unsatisfactory = 2
}

// Факультети
enum Faculty {
  Computer_Science = "Computer_Science",
  Economics = "Economics",
  Law = "Law",
  Engineering = "Engineering"
}

// === Інтерфейси ===

interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number;
  status: StudentStatus;
  enrollmentDate: Date;
  groupNumber: string;
}

interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number;
  semester: Semester;
  faculty: Faculty;
  maxStudents: number;
}

interface Grade {
  studentId: number;
  courseId: number;
  grade: GradeValue;
  date: Date;
  semester: Semester;
}

// === UniversityManagementSystem ===

class UniversityManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];
  private registrations: Map<number, number[]> = new Map(); // studentId -> courseIds
  private grades: Grade[] = [];
  private nextStudentId: number = 1;

  // === Студенти ===

  /**
   * Записує нового студента
   */
  enrollStudent(student: Omit<Student, "id">): Student {
    const newStudent: Student = { ...student, id: this.nextStudentId++ };
    this.students.push(newStudent);
    return newStudent;
  }

  /**
   * Оновлює статус студента
   */
  updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error("Student not found");

    // Валідація: не можна змінити статус на Graduated, якщо ще не Active
    if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
      throw new Error("Student must be Active to graduate");
    }

    student.status = newStatus;
  }

  /**
   * Отримати студентів по факультету
   */
  getStudentsByFaculty(faculty: Faculty): Student[] {
    return this.students.filter(s => s.faculty === faculty);
  }

  // === Курси ===

  /**
   * Додає курс до системи
   */
  addCourse(course: Course): void {
    this.courses.push(course);
  }

  /**
   * Повертає доступні курси для факультету і семестру
   */
  getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
    return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
  }

  /**
   * Реєстрація студента на курс
   */
  registerForCourse(studentId: number, courseId: number): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) throw new Error("Student not found");

    const course = this.courses.find(c => c.id === courseId);
    if (!course) throw new Error("Course not found");

    // Перевірка факультету
    if (course.faculty !== student.faculty) throw new Error("Student faculty mismatch");

    // Перевірка ліміту студентів
    const registeredStudents = Array.from(this.registrations.entries())
      .filter(([_, courses]) => courses.indexOf(courseId) !== -1)
      .map(([id, _]) => id);

    if (registeredStudents.length >= course.maxStudents) {
      throw new Error("Course is full");
    }

    const studentCourses = this.registrations.get(studentId) || [];
    if (studentCourses.indexOf(courseId) === -1) {
      studentCourses.push(courseId);
      this.registrations.set(studentId, studentCourses);
    }
  }

  // === Оцінки ===

  /**
   * Встановлює оцінку студенту
   */
  setGrade(studentId: number, courseId: number, gradeValue: GradeValue): void {
    const studentCourses = this.registrations.get(studentId);
    if (!studentCourses || studentCourses.indexOf(courseId) === -1) {
      throw new Error("Student not registered for this course");
    }

    const semester = this.courses.find(c => c.id === courseId)?.semester;
    if (!semester) throw new Error("Course not found");

    this.grades.push({
      studentId,
      courseId,
      grade: gradeValue,
      date: new Date(),
      semester
    });
  }

  /**
   * Повертає всі оцінки студента
   */
  getStudentGrades(studentId: number): Grade[] {
    return this.grades.filter(g => g.studentId === studentId);
  }

  /**
   * Обчислює середню оцінку студента
   */
  calculateAverageGrade(studentId: number): number {
    const studentGrades = this.getStudentGrades(studentId);
    if (studentGrades.length === 0) return 0;

    const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
    return total / studentGrades.length;
  }

  /**
   * Повертає список відмінників по факультету
   */
  getTopStudents(faculty: Faculty): Student[] {
    const facultyStudents = this.getStudentsByFaculty(faculty);
    return facultyStudents.filter(s => this.calculateAverageGrade(s.id) >= GradeValue.Excellent);
  }
}

// === Приклад використання ===

const ums = new UniversityManagementSystem();

// Додаємо студентів
const student1 = ums.enrollStudent({
  fullName: "John Doe",
  faculty: Faculty.Computer_Science,
  year: 1,
  status: StudentStatus.Active,
  enrollmentDate: new Date("2025-09-01"),
  groupNumber: "CS101"
});

const student2 = ums.enrollStudent({
  fullName: "Alice Smith",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date("2024-09-01"),
  groupNumber: "CS201"
});

// Додаємо курси
ums.addCourse({
  id: 1,
  name: "Programming 101",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 30
});

ums.addCourse({
  id: 2,
  name: "Algorithms",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 30
});

// Реєстрація та оцінки
ums.registerForCourse(student1.id, 1);
ums.registerForCourse(student1.id, 2);

ums.setGrade(student1.id, 1, GradeValue.Excellent);
ums.setGrade(student1.id, 2, GradeValue.Good);

// Перевірка
console.log("Студенти факультету CS:", ums.getStudentsByFaculty(Faculty.Computer_Science));
console.log("Оцінки студента1:", ums.getStudentGrades(student1.id));
console.log("Середня оцінка студента1:", ums.calculateAverageGrade(student1.id));
console.log("Відмінники факультету CS:", ums.getTopStudents(Faculty.Computer_Science));
