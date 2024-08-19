const $inputContainer = document.querySelector('.input-container');
const $addButton = document.querySelector('.add-button');


$addButton.addEventListener("click", ()=>{
    if($inputContainer.classList.contains('input-container--active')) return;
    $inputContainer.classList.add('input-container--active');
})