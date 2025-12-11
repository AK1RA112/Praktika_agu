document.addEventListener('DOMContentLoaded', () => {
    const modalRecord = document.getElementById('modal-record');
    const data = window.appData;

    // Открытие модалки
    document.getElementById('btn-add-record').addEventListener('click', () => {
        modalRecord.style.display = 'block';
    });

    // Установка сегодняшней даты
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('recordDate').value = today;

    // Форма записи
    document.getElementById('form-record').addEventListener('submit', e => {
        e.preventDefault();

        const studentId = parseInt(document.getElementById('studentSelect').value);
        const subjectId = parseInt(document.getElementById('subjectSelect').value);
        const date = document.getElementById('recordDate').value;
        const gradeInput = document.getElementById('gradeValue').value;
        const status = document.getElementById('attendanceStatus').value;

        // Проверка обязательных полей
        if (!studentId || !subjectId) {
            alert('⚠️ Выберите студента и предмет.');
            return;
        }

        if (!status) {
            alert('⚠️ Выберите тип посещаемости.');
            return;
        }

        // Валидация оценки (если указана)
        let grade = null;
        if (gradeInput.trim() !== '') {
            grade = parseInt(gradeInput);
            if (isNaN(grade) || grade < 1 || grade > 5) {
                alert('⚠️ Оценка должна быть целым числом от 1 до 5.');
                return;
            }
        }

        // Сохраняем запись
        data.addRecord(studentId, subjectId, date, grade, status);
        renderTable();

        // Сброс формы
        document.getElementById('studentSelect').value = '';
        document.getElementById('subjectSelect').value = '';
        document.getElementById('gradeValue').value = '';
        document.getElementById('attendanceStatus').value = '';
        document.getElementById('recordDate').value = today;

        modalRecord.style.display = 'none';
    });

    // Глобальная функция рендеринга таблицы
    window.renderTable = function() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        const sorted = [...data.records].sort((a, b) => new Date(b.date) - new Date(a.date));

        sorted.forEach(rec => {
            const student = data.getStudentById(rec.studentId);
            const subject = data.getSubjectById(rec.subjectId);
            if (!student || !subject) return;

            const row = document.createElement('tr');

            // Тип записи
            const typeCell = document.createElement('td');
            typeCell.textContent = 'Запись';
            row.appendChild(typeCell);

            // Студент
            const studentCell = document.createElement('td');
            studentCell.textContent = student.name;
            row.appendChild(studentCell);

            // Группа
            const groupCell = document.createElement('td');
            groupCell.textContent = student.group;
            row.appendChild(groupCell);

            // Предмет
            const subjectCell = document.createElement('td');
            subjectCell.textContent = subject.name;
            row.appendChild(subjectCell);

            // Оценка
            const gradeCell = document.createElement('td');
            if (rec.grade !== null) {
                const span = document.createElement('span');
                span.className = 'grade-cell';
                span.textContent = rec.grade;
                gradeCell.appendChild(span);
            } else {
                gradeCell.textContent = '—';
            }
            row.appendChild(gradeCell);

            // ✅ ПОСЕЩАЕМОСТЬ — ИСПРАВЛЕНО (работает с "Присутствовал", "Н", "НО", "НБ", "НП")
            const attendanceCell = document.createElement('td');
            let displayText = rec.status || 'Присутствовал';
            let className = 'attendance-yes';

            // Определяем стиль
            if (rec.status && rec.status !== 'Присутствовал') {
                className = 'attendance-no';
            } else {
                className = 'attendance-yes';
                displayText = 'Присутствовал'; // унифицируем отображение
            }

            attendanceCell.textContent = displayText;
            attendanceCell.className = className;
            row.appendChild(attendanceCell);

            // Дата
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(rec.date);
            row.appendChild(dateCell);

            tableBody.appendChild(row);
        });
    };

    // Формат даты
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return '—';
        return d.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Инициализация таблицы
    renderTable();
});