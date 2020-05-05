import React, {useState} from 'react'

export const SignIn = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = () => {
    fetch(process.env.REACT_APP_AUTH_API_URL + '/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({login, password}),
    })
      .then((response) => {
        if (response.ok) return response.json()

        throw new Error(response.statusText)
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error.message))
  }

  return (
    <div>
      <h1>Sign In</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <label htmlFor="login">Login</label>
        <input
          id="login"
          onChange={(e) => setLogin(e.currentTarget.value)}
          defaultValue={login}
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          defaultValue={password}
          type="password"
          required
        />
        <br />
        <button>Submit</button>
      </form>
    </div>
  )
}
