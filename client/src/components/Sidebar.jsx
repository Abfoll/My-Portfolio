import { Folder, FolderPlus, Home, LaptopMinimalCheck, Mail, MessageCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 d-lg-flex d-none text-bg-dark"
      style={{ width: 280 }}
    >

      <Link to="/admin/dashboard" className='nav-link'>


        <span className="fs-4">Dashboard</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column gap-2 mb-auto">

        <li className="nav-item">

          <Link to="/admin/dashboard" className="nav-link active d-flex align-items-center gap-2" aria-current="page">

            <Home />
            Home
          </Link>
        </li>
        <li className="nav-item">

          <Link to="/admin/dashboard/messages" className="nav-link text-white d-flex align-items-center gap-2">

            <Mail />
            Messages
          </Link>
        </li>
        <li className="nav-item">

          <Link to="/admin/dashboard/projects" className="nav-link text-white d-flex align-items-center gap-2">
            <Folder />

            Projects
          </Link>
        </li>
         <li className="nav-item">

          <Link to="/admin/dashboard/projects/add" className="nav-link text-white d-flex align-items-center gap-2">
           <FolderPlus />

            Add Project
          </Link>
        </li>

      </ul>
      <hr />
      <div className="dropdown">

        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >

          <img
            src="/Gemini_Generated_Image_cqgqlpcqgqlpcqgq.png"
            alt="Profile"
            width={32}
            height={32}
            className="rounded-circle me-2"
          />
          <strong>{user.email}</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">

          <li>
            <Link to={"/"} className="dropdown-item" >
              View Portfolio
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/settings" className="dropdown-item">
              Settings
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/profile" className="dropdown-item">
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li onClick={logout}>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>

  )
}

export default Sidebar