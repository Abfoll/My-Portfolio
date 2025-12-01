import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="container py-4">
      <div className="col-md-8 mx-auto panel-dark p-4 rounded-3 text-center">
        <img src="/Gemini_Generated_Image_cqgqlpcqgqlpcqgq.png" alt="Profile" className="hero-img mb-3" style={{width:140, height:140}} />
        <h4>{user?.email}</h4>
        <div className="mt-2 text-body-secondary">Fullstack Developer (MERN)</div>
        <div className="mt-3">
          <Link to="/admin/dashboard/settings" className="btn btn-ghost me-2">Edit Settings</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile;
