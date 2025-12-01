import { useAuth } from "../context/AuthContext"
import  {Link} from "react-router-dom"
const AdminNavbar = () => {
  const { logout } = useAuth()
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow sticky-top ">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="#">
          Portfolio
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="#">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard/messages">
                Messages
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard/projects">
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard/projects/add">
                Add Project
              </Link>
            </li>

             <li className="nav-item">
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </li>
          


          </ul>

        </div>
      </div>
    </nav>

  )
}

export default AdminNavbar