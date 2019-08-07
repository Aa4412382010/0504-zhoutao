function addTodo() {
    let todo = document.getElementById('new-item').value;
    let important = document.querySelector('input[type="radio"]:checked').value;
    var in_date = document.getElementsByClassName('time')[0].lastElementChild.value;
    if (in_date == false) {
        let date = new Date();
        in_date = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
    }
    addItem(todo, status = 'todo', important, in_date);
    init_todos();
}

function checkItem(item) {
    // console.log(item);
    let li = item.parentElement;
    if (item.checked) {
        li.style.textDecoration = 'line-through';
        changeStatus(item.id, 'done');
    } else {
        changeStatus(item.id, 'todo');
        li.style.textDecoration = '';
    }
    updateTodoList();
    updateDoneList();
}

function updateTodoList() {
    let box = document.getElementById('todo-list');
    box.innerHTML = '';
    let done_list = getTodoList().filter(x => x.status == 'todo');
    for (let todo of done_list) {
        let li = document.createElement('li');
        li.innerHTML = todo.time + '--' + todo.text;
        box.appendChild(li);
    }
}

function updateDoneList() {
    let box = document.getElementById('done-list');
    box.innerHTML = '';
    let done_list = getTodoList().filter(x => x.status == 'done');
    for (let todo of done_list) {
        let li = document.createElement('li');
        li.innerHTML = todo.time + '--' + todo.text;
        box.appendChild(li);
    }
}

function changeStatus(id, status) {
    let todo_list = getTodoList();
    for (let todo of todo_list) {
        if (todo.id == id) {
            todo.status = status;
        }
    }
    localStorage.setItem('what-todo', JSON.stringify(todo_list));
}

function inserTodo(todo, new_class,box_type = 'important', html_text = '非常重要') {
    let box = document.getElementById(box_type);
    if (box.firstElementChild.className !== 'todo-title') {
        box.innerHTML = '<div class="todo-title">' + html_text + '</div>';
    }
    let in_date = todo.time;
    if (!document.getElementById(todo.id)) {
        let li = document.createElement('li');
        li.className = new_class
        li.id = todo.id;
        li.innerHTML = '<input type="checkbox" onclick="checkItem(this);" name="item">' + in_date + '---' + todo.text + '<input type="reset" value="删除" onclick="deleteItem(this);">';
        box.appendChild(li);
        updateDoneStyle(todo, li);
    }

}


function getTodoList() {
    return JSON.parse(localStorage.getItem('what-todo'));
}

function addItem(memo, status = 'todo', important = 1, date) {
    let todo_list = [];
    let old_list = localStorage.getItem('what-todo');
    if (old_list) {
        todo_list = JSON.parse(old_list);
    }
    let todo = {}
    todo.id = 1;
    if (old_list) {
        todo.id += parseInt(todo_list[todo_list.length - 1].id);
    }
    todo.text = memo;
    todo.status = status; // todo, done
    todo.important = important; // 1 important, 2 not
    todo.time = date
    todo_list.push(todo);

    localStorage.setItem('what-todo', JSON.stringify(todo_list))
}

function init_todos() {
    // 1. get list
    let todo_list = getTodoList();
    let today = new Date();
    if (todo_list.length) {
        // 2.区分重要性
        // console.log(todo_list);
        for (let todos of todo_list) {
            let todos_year = todos.time.split('-')[0];
            let todos_mouth = todos.time.split('-')[1];
            let todos_date = todos.time.split('-')[2];
            if (parseInt(todos_year) == today.getFullYear() && parseInt(todos_mouth) <= (today.getMonth() + 1) && parseInt(todos_date.substr(0, 2)) <= today.getDate()) {
                new_class = 'today'
                if (todos.important == 1) {
                    inserTodo(todos,new_class);
                } else if (todos.important == 2) {
                    inserTodo(todos,new_class, box_type = 'ordinary', hrml_text = '重要')
                } else if (todos.important == 3) {
                    inserTodo(todos,new_class, box_type = 'soso', html_text = '简单');
                } else {
                    inserTodo(todos,new_class, box_type = 'easy', html_text = '轻松');
                }
                let info = document.getElementsByClassName('todo-info')[0];
                info.className = 'todo-info hidden';
            }
            if (parseInt(todos_year) == today.getFullYear() && parseInt(todos_mouth) >= (today.getMonth() + 1) && parseInt(todos_date.substr(0, 2)) > today.getDate()) {
                new_class = 'follow-up'
                if (todos.important == 1) {
                    inserTodo(todos,new_class, box_type = 'todo-important');
                } else if (todos.important == 2) {
                    inserTodo(todos,new_class, box_type = 'todo-ordinary'.html_text = '重要');
                } else if (todos.important == 3) {
                    inserTodo(todos,new_class, box_type = 'todo-soso', html_text = '简单');
                } else {
                    inserTodo(todos,new_class, box_type = 'todo-easy', html_text = '轻松');
                }
                let info = document.getElementsByClassName('todo-info')[1];
                info.className = 'todo-info hidden';
            }
        }
    }
    updateDoneList();
    updateTodoList()
}

function deleteReset() {
    localStorage.clear();
    location.reload();
}

function deleteItem(item) {
    if(item.parentNode.className == 'today'){
        var info = document.getElementsByClassName('todo-info')[0];
    }else{
        var info = document.getElementsByClassName('todo-info')[1];
    }
    let todo_list = getTodoList();
    let id = parseInt(item.parentNode.id)
    for (let i = todo_list.length;i>0;i--){
        if(todo_list[i-1].id == id){
            todo_list.splice(i-1,1)
        }
    }
    if(todo_list.length==false){
        localStorage.clear();
        item.parentNode.parentNode.firstElementChild.className += ' hidden'
        info.className = 'todo-info';
    }else{
        localStorage.setItem('what-todo', JSON.stringify(todo_list));
    }
    item.parentNode.remove(); 
    updateDoneList();
    updateTodoList()
}

function updateDoneStyle(todo, li) {
    if (todo.status == 'done') {
        li.style.textDecoration = 'line-through';
        // 由于空格的问题，最好用firstElementChild
        console.log(li.firstElementChild, li.firstElementChild.checked);
        li.firstElementChild.checked = true;
    } else {
        li.style.textDecoration = '';
        li.firstElementChild.checked = false;
    }
}
function returnIndex(){
    location.reload();
}
function findIn(){
    let value = document.getElementsByClassName('find')[0].firstElementChild.value;
    todo_list = getTodoList();
    let find_list = document.getElementsByClassName('main')[0];
    find_list.innerHTML = '<h2>搜索结果</h2>' 
    for(let todo of todo_list){
        if(todo.text.indexOf(value)>-1){
            let li = document.createElement('li');
            li.innerHTML = todo.time + '--' + todo.text;
            find_list.appendChild(li);
        }
    }
    let input = document.createElement('button');
    input.setAttribute('onclick','returnIndex()')
    input.innerHTML='返回'
    find_list.appendChild(input);

}
// 刷新页面初始化
init_todos();
