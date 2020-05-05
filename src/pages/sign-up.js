import React, {useState} from 'react'

export const SignUp = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const onSubmit = () => {
    fetch(process.env.REACT_APP_AUTH_API_URL + '/signup', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({login, password}),
    })
      .then((response) => {
        if (response.status !== 201) throw new Error(response.statusText)

        console.log('Created!')
      })
      .catch((error) => console.error(error.message))
  }

  const showErrorMessage = password !== '' && password !== passwordConfirm

  return (
    <div>
      <h1>Sign Up</h1>
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
        <label htmlFor="password-confirm">Confirm password</label>
        <input
          id="password-confirm"
          onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          defaultValue={passwordConfirm}
          type="password"
          required
        />
        <br />
        {showErrorMessage && (
          <p className="error">password and confirm password should match</p>
        )}
        <button>Submit</button>
      </form>
    </div>
  )
}
