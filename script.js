const searchField = document.querySelector("#search")
const cardAll = document.querySelector('#card')
const field = document.querySelector('.field-bottom')
const list = document.querySelector('#list')

const debounce = (fn, debounceTime) => {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
};

const addCard = (item) => {
  const card = cardAll.content.cloneNode(true)
  card.querySelector('.card-name').textContent = `Name: ${item.name}`
  card.querySelector('.card-owner').textContent = `Owner: ${item.owner.login}`
  card.querySelector('.card-stars').textContent = `Stars: ${item.stargazers_count}`
  card.querySelector('.card-button').addEventListener('click', (e) => {
    e.target.parentNode.remove()
  })
  field.append(card)
  searchField.value = ''
  list.innerHTML = ''
}

const getRepos = async (request) => {
    return await fetch(`https://api.github.com/search/repositories?q=${request}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })
      .then(response => {
        if (response.ok) {
          response.json().then(repos => {
            list.innerHTML = ''
            const items = repos.items.slice(0, 5)
            if (items.length === 0) {
              list.innerHTML = '<p class="no-results">No results...</p>'
            } else {
              items.forEach(item => {
                const select = document.createElement('p')
                select.className = 'select'
                select.textContent = `${item.name}`
                select.addEventListener('click', () => addCard(item))
                list.append(select)
              })
            }
          })
        } else {
          list.innerHTML = ''
        }
      })
}

const debounceGetRepos = debounce(getRepos, 3000)

searchField.addEventListener('input', () => {
  if (searchField.value[0] === ' ') {
    return
  }
  debounceGetRepos(searchField.value.trim())
})