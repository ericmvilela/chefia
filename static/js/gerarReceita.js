const loadingDiv = document.querySelector('.loading')
const imagem = document.querySelector('.qrcode')

shareButton.style.display = 'none'

document.addEventListener('DOMContentLoaded', function(){
    let ingredientes = []
    document.querySelectorAll('[name="ingrediente"]').forEach((element) => {
        ingredientes.push(element.value)
    })
    receitaAPI(ingredientes);
});

function receitaAPI(valores) {
    if (valores.length === 0) {
        console.error('Valores Inválidos')
        return
    }

    const formData = new FormData()
    formData.append('ingrediente', valores)

    fetch('/gerar-receita', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            mostrarReceita(data)
        })
        .catch(error => {
            console.error(error)
        })
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Check if the cookie name matches the csrf token name (csrftoken)
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function mostrarReceita(valores) {
    loadingDiv.style.display = 'none';
    const titulo = document.querySelector('h2');
    const divIngredientes = document.querySelector('.ingredientes');
    const divPreparo = document.querySelector('.preparo');

    titulo.innerText = valores.titulo;

    valores.ingredientes.forEach((item) => {
        const element = document.createElement('p')
        element.innerText = item

        divIngredientes.appendChild(element);
    })

    valores.preparo.forEach((item) => {
        const element = document.createElement('p')
        element.innerText = item

        divPreparo.appendChild(element);
    })
    shareButton.style.display = 'block'
    imagem.src = 'data:image/png;base64, ' + valores.qrcode;
    copyButton.setAttribute('data-value', valores.link)
}
