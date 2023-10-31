const darkModeToggle = document.querySelector('#theme-toggle')

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme')
    if (document.body.classList.contains('dark-theme')){
        darkModeToggle.src = 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Sun_icon.svg'
    }
    else {
        darkModeToggle.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/OOjs_UI_icon_moon.svg'
    }
})
