const $inputContainer = document.querySelector('.input-container');
const $addButton = document.querySelector('.add-button');
const $todoList = document.querySelector('.todos');
const $noTaskMessage = document.querySelector('.message');
const $editButton = document.querySelector('.todo-edit');
const $filters = document.querySelector('.filters');
const $addInput = document.getElementById('todo-input');


const todos = JSON.parse(localStorage.getItem("todos")) || [];

document.addEventListener("DOMContentLoaded", showTodos());




$addButton.addEventListener("click", ()=>{
    if(!$inputContainer.classList.contains('input-container--active')) {
        $inputContainer.classList.add('input-container--active');
        setInterval(()=>$addInput.focus(), 500);
        return;
    }
    todoName = $addInput.value.trim();
    if(todoName != '') {
        addTodo(todoName);
    }
});

$addInput.addEventListener("keydown", e=>{
    if(e.key == "Enter"){
        if($addInput.value.trim() != '') {
            addTodo($addInput.value);
        }
    }
})

$filters.addEventListener("click", e=>{
    if(e.target.classList.contains("filters__complete")) showTodos('complete');
    if(e.target.classList.contains("filters__incomplete")) showTodos('pending');
    if(e.target.classList.contains("filters__delete-all")){
        localStorage.setItem("todos", []);
        showTodos()
    };
})


function addTodo(todo){
    $addInput.value = "";
    todos.unshift({name: todo, status: "pending"})
    localStorage.setItem("todos", JSON.stringify(todos));
    showTodos();
}

function showTodos(filter){
    if(todos.length == 0) {
        $todoList.innerHTML = '';
        $noTaskMessage.style.display = "block";
        return;
    }

    let getTodos; 
    if(filter) getTodos = todos.map(todo=> {
        if(todo.status == filter) return todo;
        })
        .map(getTodoHTML).join('');
    else getTodos = todos.map(getTodoHTML).join('')
    
    $todoList.innerHTML = getTodos;
    $noTaskMessage.style.display = "none";
}

function getTodoHTML(todo, index){
    let checked = todo.status == "complete" ? "checked" : "";
    return `
        <li class="todo">
            <label for="${index}">
                <input type="checkbox" id="${index}" ${checked} onchange="changeStatus(event)">
            </label>
            <span class="todo-${index}">${todo.name}</span>
            <div class="todo__actions">
                <button class="todo__edit"><i class="fa-solid fa-pen-to-square" onclick="editTodo(${index})"></i></button>
                <button class="todo__remove"><i class="fa-solid fa-trash remove" onclick="removeTodo(${index})"></i></button>
            </div>
        </li>
    `;
}

function changeStatus(event){
    const $todoSpan = document.querySelector('.todo span');
    todos[event.target.id].status = event.target.checked? "complete" : "pending";
    localStorage.setItem("todos", JSON.stringify(todos));
    showTodos();
}

function editTodo(index){
    const $todoSpan = document.querySelector('.todo-' + index);
    console.log($todoSpan);
    
    $todoSpan.contentEditable = true;
    $todoSpan.focus();
    
    const end = $todoSpan.textContent.length
    createSelectionRange($todoSpan, end, end);

    $todoSpan.addEventListener("blur", ()=>{
        $todoSpan.contentEditable = false;
        todos[index].name = $todoSpan.innerText;
        localStorage.setItem("todos", JSON.stringify(todos));
    });
}
function removeTodo(index){
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    showTodos();
}
function createSelectionRange(element,start,end){
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(element.firstChild, start);
    range.setEnd(element.firstChild, end); 
    
    selection.removeAllRanges();
    selection.addRange(range);
}