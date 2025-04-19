document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM cần thiết
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // --- Tải công việc từ Local Storage khi trang được tải ---
    loadTasks();

    // --- Hàm thêm công việc ---
    function addTask() {
        const taskText = taskInput.value.trim(); // Lấy text và xóa khoảng trắng thừa

        if (taskText === "") {
            alert("Vui lòng nhập nội dung công việc!");
            return; // Không làm gì nếu input rỗng
        }

        // Tạo phần tử li mới cho công việc
        const li = createTaskElement(taskText);

        // Thêm li vào danh sách ul
        taskList.appendChild(li);

        // Lưu vào Local Storage
        saveTaskToLocalStorage(taskText);

        // Xóa nội dung trong input
        taskInput.value = "";
        taskInput.focus(); // Focus lại vào input
    }

    // --- Hàm tạo phần tử li cho công việc ---
    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');

        // Nội dung công việc
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        li.appendChild(taskSpan);

        // Nút xóa
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'delete-btn'; // Gán class CSS
        li.appendChild(deleteBtn);

        // Thêm class 'completed' nếu công việc đã hoàn thành (khi tải từ storage)
        if (isCompleted) {
            li.classList.add('completed');
        }

        return li;
    }


    // --- Hàm xử lý sự kiện click trên danh sách công việc (đánh dấu/xóa) ---
    function handleTaskListClick(event) {
        const target = event.target; // Phần tử được click

        // Kiểm tra xem có click vào nút XÓA không
        if (target.classList.contains('delete-btn')) {
            const li = target.parentElement; // Lấy phần tử li cha
            const taskText = li.querySelector('span').textContent; // Lấy nội dung công việc để xóa khỏi storage
            taskList.removeChild(li); // Xóa khỏi giao diện
            removeTaskFromLocalStorage(taskText); // Xóa khỏi Local Storage
        }
        // Kiểm tra xem có click vào chính công việc (li hoặc span) để đánh dấu hoàn thành không
        else if (target.tagName === 'LI' || target.tagName === 'SPAN') {
             const li = target.closest('li'); // Lấy phần tử li gần nhất
             if (li) {
                  li.classList.toggle('completed'); // Thêm/xóa class 'completed'
                  updateTaskInLocalStorage(li.querySelector('span').textContent, li.classList.contains('completed'));
             }
        }
    }

    // --- Lưu trữ bằng Local Storage ---

    // Lấy danh sách công việc từ Local Storage
    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        // Nếu chưa có thì trả về mảng rỗng, nếu có thì parse JSON
        return tasks ? JSON.parse(tasks) : [];
    }

    // Lưu một công việc mới vào Local Storage
    function saveTaskToLocalStorage(taskText) {
        const tasks = getTasksFromLocalStorage();
        // Thêm công việc mới dưới dạng object { text: "...", completed: false }
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Xóa một công việc khỏi Local Storage
    function removeTaskFromLocalStorage(taskText) {
        let tasks = getTasksFromLocalStorage();
        // Lọc ra những công việc không trùng với công việc cần xóa
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Cập nhật trạng thái hoàn thành của công việc trong Local Storage
    function updateTaskInLocalStorage(taskText, isCompleted) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task => {
            if (task.text === taskText) {
                return { ...task, completed: isCompleted }; // Cập nhật trạng thái
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Tải và hiển thị công việc từ Local Storage
    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            const li = createTaskElement(task.text, task.completed);
            taskList.appendChild(li);
        });
    }

    // --- Gán sự kiện ---
    addTaskBtn.addEventListener('click', addTask);

    // Thêm công việc khi nhấn Enter trong input
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Sử dụng Event Delegation cho việc xóa và đánh dấu hoàn thành
    taskList.addEventListener('click', handleTaskListClick);

});