//variables
var playerName;
var playerAvatar;

const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.containers')

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')        
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e =>{
        e.preventDefault()
        const draggable = document.querySelector('.dragging')
        container.appendChild(draggable)     
    })
})

function startMusic(){
    musictheme.play()
    musictheme.loop = true
}

function passValues() {
    var username = document.getElementById('playerName').value;
    localStorage.setItem("username", username);
    return false;
}
