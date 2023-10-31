const modalDiv = document.querySelector('.modal')
const shareButton = document.querySelector('#share-button')
const modalContainer = document.querySelector('.modal-container')
const copyButton = document.querySelector('#copy-button')
const input = document.createElement('input');

shareButton.addEventListener('click', ()=> {
  modalDiv.style.display = 'block'
})

document.addEventListener('keydown', (event) =>{
        if (event.key === 'Escape') {
            modalDiv.style.display = 'none'
            if(modalContainer.contains(input))
                modalContainer.removeChild(input)
        }
});

modalDiv.addEventListener('click', ()=> {
    modalDiv.style.display = 'none'
    if(modalContainer.contains(input))
        modalContainer.removeChild(input)
})

modalContainer.addEventListener('click', (event) => {
    event.stopPropagation();
    // Aqui você pode adicionar qualquer ação específica para o clique no modal-container, se necessário.
});

copyButton.addEventListener('click', ()=> {
    input.value = copyButton.getAttribute('data-value');
    modalContainer.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999); // Para dispositivos móveis
    navigator.clipboard.writeText(copyButton.getAttribute('data-value'))

    // modalContainer.removeChild(input);
})