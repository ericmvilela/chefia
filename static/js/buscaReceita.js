const addInput = document.querySelector('.button-add')

addInput.addEventListener('click', () => {
    divParent = document.querySelector('.container-inputs')

    newInput = document.createElement('input')
    newInput.type = 'text'
    newInput.placeholder = "Digite um Ingrediente"
    newInput.classList.add('input-ingrediente')
    newInput.name = 'ingrediente'

    divParent.appendChild(newInput)
})