import React, {Component} from 'react'

class Auth extends Component {
  constructor() {
    super()
  }

  componentDidMount() {}

  render() {
    return (
      <div className="auth-form">
        <input type="username" id="username" placeholder="username" />
        <input type="email" id="email" placeholder="email" />
        <input type="password" id="password" placeholder="password" />
      </div>
    )
  }
}

export default Auth
