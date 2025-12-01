import React, {useEffect, useState} from 'react';
import ResumeView from '../components/ResumeView';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Resume = () => {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // try to fetch structured resume JSON placed at public/assets/resume.json
    fetch('/assets/resume.json')
      .then(res => {
        if (!res.ok) throw new Error('No structured resume');
        return res.json();
      })
      .then(json => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="container py-4">
      {!loaded && <div className="py-5 text-light">Loading…</div>}

      {loaded && (
        <div className="resume-page">
          <div className="d-flex align-items-center justify-content-between mb-3 resume-header">
            <button
              className="btn btn-ghost d-flex align-items-center"
              onClick={() => {
                try {
                  // prefer history back if available, otherwise navigate home
                  if (window.history && window.history.length > 1) {
                    navigate(-1)
                  } else {
                    navigate('/')
                  }
                } catch (e) {
                  navigate('/')
                }
              }}
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
              <span className="ms-2">Back</span>
            </button>
            <div>
              <a href="/assets/cv.pdf" className="btn btn-download me-2" download target="_blank" rel="noreferrer">
                <Download size={16} className="me-1" /> Download CV
              </a>
            </div>
          </div>

          {data && <ResumeView data={data} />}

          {!data && (
            <div className="py-3">
              <h2 className="mb-4 text-light">Resume</h2>
              <p className="text-muted">You can view or download the CV below.</p>
              <div style={{height: '72vh'}}>
                <iframe
                  src="/assets/cv.pdf"
                  title="Resume"
                  width="100%"
                  height="100%"
                  style={{border: 'none', backgroundColor: '#000'}}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Resume;
