// Глобальные данные (единое хранилище)
window.appData = {
    students: [],
    subjects: [],
    records: [], // { id, studentId, subjectId, date, grade?, status }

    // Счётчики ID
    currentStudentId: 1,
    currentSubjectId: 1,
    currentRecordId: 1,

    // Загрузка из localStorage
    load() {
        const s = localStorage.getItem('students');
        const sb = localStorage.getItem('subjects');
        const r = localStorage.getItem('records');
        const sid = localStorage.getItem('currentStudentId');
        const sbid = localStorage.getItem('currentSubjectId');
        const rid = localStorage.getItem('currentRecordId');

        this.students = s ? JSON.parse(s) : [];
        this.subjects = sb ? JSON.parse(sb) : [];
        this.records = r ? JSON.parse(r) : [];

        this.currentStudentId = sid ? parseInt(sid) : 1;
        this.currentSubjectId = sbid ? parseInt(sbid) : 1;
        this.currentRecordId = rid ? parseInt(rid) : 1;
    },

    // Сохранение в localStorage
    save() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('subjects', JSON.stringify(this.subjects));
        localStorage.setItem('records', JSON.stringify(this.records));
        localStorage.setItem('currentStudentId', this.currentStudentId.toString());
        localStorage.setItem('currentSubjectId', this.currentSubjectId.toString());
        localStorage.setItem('currentRecordId', this.currentRecordId.toString());
    },

    // Вспомогательные методы
    getStudentById(id) {
        return this.students.find(s => s.id === id);
    },
    getSubjectById(id) {
        return this.subjects.find(s => s.id === id);
    },
    addStudent(name, group) {
        this.students.push({
            id: this.currentStudentId++,
            name: name.trim(),
            group: group.trim()
        });
        this.save();
    },
    addSubject(name) {
        this.subjects.push({
            id: this.currentSubjectId++,
            name: name.trim()
        });
        this.save();
    },
    addRecord(studentId, subjectId, date, grade, status) {
    this.records.push({
        id: this.currentRecordId++,
        studentId,
        subjectId,
        date,
        grade: grade !== null ? parseInt(grade) : null,
        status: status || 'Присутствовал'  // ← если status пустой — ставим "Присутствовал"
    });
    this.save();
    },
    getGroups() {
        return [...new Set(this.students.map(s => s.group))];
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.appData.load();
});