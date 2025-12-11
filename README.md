[input-student-subject.js](https://github.com/user-attachments/files/24103371/input-student-subject.js)
document.addEventListener('DOMContentLoaded', () => {
    const modalStudent = document.getElementById('modal-student');
    const modalSubject = document.getElementById('modal-subject');
    const data = window.appData;

    // Открытие модалок
    document.getElementById('btn-add-student').addEventListener('click', () => {
        modalStudent.style.display = 'block';
    });
    document.getElementById('btn-add-subject').addEventListener('click', () => {
        modalSubject.style.display = 'block';
    });

    // Закрытие
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Форма: студент
    document.getElementById('form-student').addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const group = document.getElementById('studentGroup').value;
        if (name && group) {
            data.addStudent(name, group);
            updateStudentSelect();
            updateGroupSelect();
            renderTable();
            e.target.reset();
            modalStudent.style.display = 'none';
        } else {
            alert('Заполните все поля.');
        }
    });

    // Форма: предмет
    document.getElementById('form-subject').addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('subjectName').value;
        if (name) {
            data.addSubject(name);
            updateSubjectSelect();
            renderTable();
            e.target.reset();
            modalSubject.style.display = 'none';
        } else {
            alert('Введите название предмета.');
        }
    });

    // Вспомогательные функции (глобальные для других модулей)
    window.updateStudentSelect = function() {
        const sel = document.getElementById('studentSelect');
        sel.innerHTML = '<option value="">Выберите студента</option>';
        data.students.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = `${s.name} (${s.group})`;
            sel.appendChild(opt);
        });
    };

    window.updateSubjectSelect = function() {
        const sel = document.getElementById('subjectSelect');
        sel.innerHTML = '<option value="">Выберите предмет</option>';
        data.subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            sel.appendChild(opt);
        });
    };

    window.updateGroupSelect = function() {
        const sel = document.getElementById('groupSelect');
        sel.innerHTML = '<option value="">Все группы</option>';
        data.getGroups().forEach(g => {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = g;
            sel.appendChild(opt);
        });
    };

    // Инициализация селектов
    updateStudentSelect();
    updateSubjectSelect();
    updateGroupSelect();
});
