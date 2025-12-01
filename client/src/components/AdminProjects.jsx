import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/dashboard/project/edit/${id}`);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Projects</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-6 col-lg-4 mb-4" key={project._id}>
              <div className="card h-100">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    className="card-img-top"
                    alt={project.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text">{project.description}</p>
                  <p><strong>Tech:</strong> {project.technologies?.join(", ")}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <div>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success me-2">
                        Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark">
                        GitHub
                      </a>
                    )}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(project._id)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(project._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
