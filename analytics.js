document.addEventListener('DOMContentLoaded', () => {
    const modalAnalytics = document.getElementById('modal-analytics');
    const data = window.appData;

    // Открытие модалки
    document.getElementById('btn-show-analytics').addEventListener('click', () => {
        modalAnalytics.style.display = 'block';
        updateGroupSelect(); // обновить список групп
    });

    // Закрытие
    document.querySelector('#modal-analytics .close').addEventListener('click', () => {
        modalAnalytics.style.display = 'none';
    });
    window.addEventListener('click', e => {
        if (e.target === modalAnalytics) {
            modalAnalytics.style.display = 'none';
        }
    });

    // Кнопка "Показать аналитику"
    document.getElementById('btn-run-analytics').addEventListener('click', () => {
        const group = document.getElementById('groupSelect').value;
        const stats = calculateAnalytics(group);
        displayAnalytics(stats);
    });

    // Расчёт
    function calculateAnalytics(group = '') {
        const targetStudents = group 
            ? data.students.filter(s => s.group === group) 
            : data.students;
        const studentIds = targetStudents.map(s => s.id);
        const filtered = data.records.filter(r => studentIds.includes(r.studentId));

        const grades = filtered
            .map(r => r.grade)
            .filter(g => g !== null);
        const avg = grades.length 
            ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
            : 'Нет данных';

        const total = filtered.length;
        const absences = filtered.filter(r => r.status).length;
        const att = total 
            ? ((total - absences) / total * 100).toFixed(1) + '%' 
            : 'Нет данных';

        return {
            averageGrade: avg,
            attendanceRate: att,
            studentCount: targetStudents.length,
            subjectCount: data.subjects.length,
            totalRecords: total,
            totalGrades: grades.length
        };
    }

    // Отображение
    function displayAnalytics(stats) {
        document.getElementById('analyticsContainer').classList.remove('hidden');
        document.getElementById('averageGrade').textContent = stats.averageGrade;
        document.getElementById('attendanceRate').textContent = stats.attendanceRate;
        document.getElementById('studentCount').textContent = stats.studentCount;
        document.getElementById('subjectCount').textContent = stats.subjectCount;
        document.getElementById('totalRecords').textContent = stats.totalRecords;
        document.getElementById('totalGrades').textContent = stats.totalGrades;
    }
});