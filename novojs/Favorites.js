import { GithubUser } from './GithubUser.js'

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
	constructor(root) {
		this.root = document.querySelector(root)

		this.load()
	}

	load() {
		this.entries =
			JSON.parse(localStorage.getItem('@newgithub-favorites:')) || []
	}

	save() {
		localStorage.setItem('@newgithub-favorites:', JSON.stringify(this.entries))
	}

	async add(username) {
		try {
			const userExists = this.entries.find((entry) => entry.login === username)
			if (userExists) {
				throw new Error('Usuário ja Cadastrado')
			}

			const user = await GithubUser.search(username)
			if (user.login === undefined) {
				throw new Error('Usuário não encontrado')
			}

			this.entries = [user, ...this.entries]
			this.update()
			this.save()
		} catch (error) {
			alert(error.message)
		}
	}

	delete(user) {
		const filteredEntries = this.entries.filter(
			(entry) => entry.login !== user.login,
		)

		this.entries = filteredEntries
		this.update()
		this.save()
	}
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
	constructor(root) {
		super(root)
		this.update()
		this.onnadd()
	}

	//Função que irá capturar o valor do Input para adicionar o usuario
	onnadd() {
		const addButton = this.root.querySelector('#search')
		addButton.onclick = () => {
			const { value } = this.root.querySelector('#input-search')
			this.add(value)
		}
	}

	update() {
		this.removeAllTr()

		if (this.entries.length == 0) {
			this.emptyRow()
		} else {
			this.removeEmptyRow()
		}

		this.entries.forEach((user) => {
			const row = this.createRow()

			row.querySelector(
				'.user img',
			).src = `https://github.com/${user.login}.png`
			row.querySelector('.user img').alt = `Imagem de ${user.name}`
			row.querySelector('.user a').href = `https://github.com/${user.login}`
			row.querySelector('.user p').textContent = user.name
			row.querySelector('.user span').textContent = user.login
			row.querySelector('.repositories').textContent = user.public_repos
			row.querySelector('.followers').textContent = user.followers
			row.querySelector('#delete-row').onclick = () => {
				const isOk = confirm('Tem certeza que deseja excluir essa linha?')

				if (isOk) {
					this.delete(user)
				}
			}

			this.tbody.append(row)
		})
	}

	//Função que ira criar a estrutura da linha dinamicamente
	createRow() {
		const tr = document.createElement('tr')
		tr.innerHTML = `
    <td class="user">
								<img src="https://github.com/maykbrito.png" alt="Imagem do Mayk" />
								<a href=https://github.com/maykbrito/">
								<p>MaykBrito</p>
								<span>/maykbrito</span>
							</td>

							<td class="repositories">123</td>

							<td class="followers">12000</td>

							<td>
								<button id="delete-row">Remover</button>
							</td>
    `
		return tr
	}

	//Função que removerá as linhas da tabela
	removeAllTr() {
		/* 		const validation = localStorage.getItem('@newgithub-favorites:').length
		 */
		this.tbody = this.root.querySelector('table tbody')
		this.tbody.querySelectorAll('tr').forEach((tr) => {
			tr.remove()
		})
	}

	emptyRow() {
		const createImg = document.createElement('div')
		const CreateTable = this.root.querySelector('table')

		createImg.innerHTML = `
    <div class="emptyTable">

      <img src="./assets/Estrela.svg" alt="">
      <p>Nenhum favorito ainda</p>

    </div>
    `

		CreateTable.append(createImg)
	}

	removeEmptyRow() {
		const removeEmptyRow = this.root.querySelector('table div')
		if (removeEmptyRow == undefined) {
			return
		} else {
			removeEmptyRow.remove()
		}
	}
}
