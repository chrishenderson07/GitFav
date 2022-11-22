//classe que vai conter a lógica de capturar os usuários no Github

export class GithubUser {
	static search(username) {
		const endpoint = `https://api.github.com/users/${username}`

		return fetch(endpoint)
			.then((data) => data.json())
			.then(({ login, name, public_repos, followers }) => ({
				login,
				name,
				public_repos,
				followers,
			}))
	}
}
