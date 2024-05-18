import { GithubUser } from "./GithubUser.js"

export class Favorite {
  constructor(root){
    this.root = document.querySelector('#app')
    this.load()
    
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(value){
    try {
      const userExists = this.entries.find(entry => entry.login === value)

      if(userExists) {
        throw new Error('Usuario ja existe!')
      }

      const githubUser = await GithubUser.search(value)

      if(githubUser.login == undefined){
        throw new Error('Usuario nao encontrado!')
      }

      console.log(githubUser)
      this.entries = [githubUser, ...this.entries]
      this.update()
      this.save()
    } catch(error){
      alert(error.message)
    }
  }

  delete(username){
    const filterEntries = this
                .entries.filter(entry => entry.login !== username.login)

    this.entries = filterEntries
    this.update()
    this.save()
  }

  null(){
    if(this.entries[0] === undefined){
      console.log('vazio')
      const tr = document.createElement('tr')
    
      tr.innerHTML = `
      <td colspan="4" class="vazio">
        <div>
          <img src="./assets/Estrela.svg" alt="">
          <p>Nenhum favorito ainda</p>
        </div>
      </td>
      `

      this.tbody.append(tr)
    }

    
  }
}

export class FavoriteView extends Favorite {
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onAdd()
    
  }

  update(){
    this.removeAllTr()
    this.null()

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem do ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = '/' + user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        if(isOk){
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

  }

  onAdd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `

    <td class="user">
      <img src="https://github.com/caiosantosxp.png" alt="">
      <a href="https://github.com/caiosantosxp">
        <p>Caio Santos</p>
        <span>/caiosantosxp</span>
      </a>
    </td>
    <td class="repositories">
      123
    </td>
    <td class="followers">
      1234
    </td>
    <td>
      <button class="remove">
        Remover
      </button>
    </td>
    `

    return tr
  }

  removeAllTr(){
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }

  
}