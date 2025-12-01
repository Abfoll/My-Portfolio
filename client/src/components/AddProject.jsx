import { useState } from "react";
import axios from "axios";

const AddProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // client-side validation
    const newErrors = {};
    if (!formData.title || formData.title.trim().length < 3) newErrors.title = 'Please enter a title (min 3 characters).';
    if (!formData.description || formData.description.trim().length < 10) newErrors.description = 'Please provide a clearer description (min 10 characters).';
    const checkUrl = (u) => {
      if (!u || !u.trim()) return true; // optional
      try { new URL(u); return true; } catch (err) { return false; }
    }
    if (!checkUrl(formData.imageUrl)) newErrors.imageUrl = 'Image URL must be a valid URL.';
    if (!checkUrl(formData.liveUrl)) newErrors.liveUrl = 'Live URL must be a valid URL.';
    if (!checkUrl(formData.githubUrl)) newErrors.githubUrl = 'GitHub URL must be a valid URL.';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      ...formData,
      technologies: formData.technologies.split(",").map(tech => tech.trim())
    };

    try {
      await axios.post("http://localhost:5000/api/projects", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStatus("Project added successfully!");
      setFormData({
        title: "",
        description: "",
        technologies: "",
        imageUrl: "",
        liveUrl: "",
        githubUrl: ""
      });
    } catch (error) {
      console.error(error);
      setStatus("Failed to add project.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <section className="px-4 py-5 reveal-on-scroll">
      <div className="container">
        <div className="col-md-8 mx-auto">
          <h2 className="mb-4 text-light">Add New Project</h2>
          <form onSubmit={handleSubmit} className="panel-dark p-4 rounded-3 panel-reveal">
        <div className="mb-3">
          <label className="form-label">Project Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Technologies (comma separated)</label>
          <input
            type="text"
            className="form-control"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Live URL</label>
            <input
              type="text"
              className={`form-control ${errors.liveUrl ? 'is-invalid' : ''}`}
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
            />
            {errors.liveUrl && <div className="invalid-feedback">{errors.liveUrl}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">GitHub URL</label>
            <input
              type="text"
              className={`form-control ${errors.githubUrl ? 'is-invalid' : ''}`}
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
            />
            {errors.githubUrl && <div className="invalid-feedback">{errors.githubUrl}</div>}
          </div>
        </div>
        {/* image preview */}
        {formData.imageUrl && (() => {
          try {
            new URL(formData.imageUrl);
            return (
              <div className="mb-3 text-center">
                <img src={formData.imageUrl} alt="Preview" style={{maxHeight: 220, maxWidth: '100%', borderRadius: 8}} />
              </div>
            )
          } catch (e) {
            return null
          }
        })()}

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Add Project"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setFormData({ title: "", description: "", technologies: "", imageUrl: "", liveUrl: "", githubUrl: "" }); setErrors({}); setStatus(''); }}>
                Reset
              </button>
            </div>

        {status && (
          <div className="mt-3 text-success">{status}</div>
        )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddProject;
