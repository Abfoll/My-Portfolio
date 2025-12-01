import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

const Navbar = () => {
  const { user } = useAuth()
  const [blueOn, setBlueOn] = useState(() => {
    try { return localStorage.getItem('blueAccent') === '1' } catch { return false }
  })

  useEffect(() => {
    try {
      if (blueOn) document.body.classList.add('blue-accent')
      else document.body.classList.remove('blue-accent')
      localStorage.setItem('blueAccent', blueOn ? '1' : '0')
    } catch (e) {}
  }, [blueOn])

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container d-flex align-items-center">
        <Link className="navbar-brand fw-bold me-3" to="/">
          Abenezer
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="#navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#projects">Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
            <li className="nav-item d-lg-none">
              <Link className="nav-link" to="/resume">Resume</Link>
            </li>
          </ul>
        </div>

        <div className="d-none d-lg-flex ms-auto align-items-center gap-2">
          <Link to="/resume" className="btn btn-sm btn-ghost">Resume</Link>
          {/* Replace admin link with a client-side decorative "blue light" toggle */}
          <button
            aria-label="Toggle blue accent"
            title={blueOn ? 'Disable blue accent' : 'Enable blue accent'}
            onClick={() => setBlueOn(v => !v)}
            className={`blue-light-btn ${blueOn ? 'active' : ''}`}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar