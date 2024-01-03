import {Link, withRouter} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-img"
        />
      </Link>
      <div className="header-contents-lg">
        <ul className="home-jobs-link-list">
          <li>
            <Link to="/" className="link-item">
              <p className="link-item-para">Home</p>
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="link-item">
              <p className="link-item-para">Jobs</p>
            </Link>
          </li>
        </ul>
        <li>
          <button className="logout-button" type="button" onClick={logout}>
            Logout
          </button>
        </li>
      </div>
      <div className="header-contents-sm">
        <Link to="/" className="link-item">
          <AiFillHome className="icon" />
        </Link>
        <Link to="/jobs" className="link-item">
          <BsBriefcaseFill className="icon" />
        </Link>
        <button type="button" className="logout-icon-button" onClick={logout}>
          .<FiLogOut className="icon" />
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
