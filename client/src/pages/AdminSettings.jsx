import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const { user, logout, loading } = useAuth();
  const [form, setForm] = useState({ email: user?.email || '', password: '', confirm: '' });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus('');

    if (form.password && form.password !== form.confirm) {
      setErrors({ confirm: 'Passwords do not match' });
      return;
    }

    try {
      const payload = {};
      if (form.email && form.email !== user?.email) payload.email = form.email;
      if (form.password) payload.password = form.password;

      if (!Object.keys(payload).length) {
        setStatus('No changes to save');
        return;
      }

      const res = await axios.put('http://localhost:5000/api/auth/me', payload);
      setStatus('Saved');
      // if email changed, force logout to refresh token/email
      if (payload.email) {
        alert('Email changed — please login again');
        logout();
        navigate('/admin/login');
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to save');
    }
  }

  if (loading) return null;

  return (
    <div className="container py-4">
      <div className="col-md-8 mx-auto panel-dark p-4 rounded-3">
        <h3 className="mb-3">Settings</h3>
        {status && <div className="mb-3 text-success">{status}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={form.email} onChange={handleChange} />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">New password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm password</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} className={`form-control ${errors.confirm ? 'is-invalid' : ''}`} />
            {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary">Save changes</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setForm({ email: user?.email || '', password: '', confirm: '' }); setErrors({}); setStatus(''); }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings;
