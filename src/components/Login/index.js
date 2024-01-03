import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', error: false, errorMsg: ''}

  changeUsername = e => {
    this.setState({username: e.target.value})
  }

  changePassword = e => {
    this.setState({password: e.target.value})
  }

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({error: true, errorMsg})
  }

  submitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token)
      this.setState({error: false})
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, error, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-img"
          />
          <div className="input-container">
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input"
              value={username}
              placeholder="Username"
              onChange={this.changeUsername}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              placeholder="Password"
              onChange={this.changePassword}
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
          {error && <p className="error-para">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
