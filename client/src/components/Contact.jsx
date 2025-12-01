import { useState } from 'react';
import ProgressiveTitle from './ProgressiveTitle'
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post('http://localhost:5000/api/contact', formData);

    if (response.status === 201) {
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('Failed to send message.');
    }
  } catch (error) {
    setStatus('An error occurred.');
    console.log(error);
  } finally {
    setLoading(false);
    setTimeout(() => setStatus(''), 3000); 
  }
};


  return (
    <section id="contact" className="px-4 py-5 reveal-on-scroll reveal-from-left">
        <div className="row align-items-center g-lg-5 py-5">
        <div className="col-lg-7 text-center">
          <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">
            <ProgressiveTitle base={"Contact"} suffix={"Me"} />
          </h1>
          <p className="col-lg-10 fs-4">
            Feel free to reach out with any questions, feedback, or opportunities.
          </p>
        </div>
        <div className="col-md-10 mx-auto col-lg-5">
          <form onSubmit={handleSubmit} className="p-4 p-md-5 rounded-3 panel-dark panel-reveal wiggle-subtle">
            {status && <p className="text-success">{status}</p>}
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-label="Your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                aria-label="Your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="messageInput" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="messageInput"
                name="message"
                placeholder="Your message"
                style={{ height: '150px' }}
                value={formData.message}
                onChange={handleChange}
                required
                aria-label="Your message"
              />
            </div>
            <button disabled={loading} className="w-100 btn btn-lg btn-ghost" type="submit">
              {
                loading && <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              }
              Send Message
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
