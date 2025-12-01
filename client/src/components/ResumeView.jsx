import React from 'react';
import { Github, Linkedin, Instagram, Facebook, Twitter, Send, Mail, Phone } from 'lucide-react';

const ResumeView = ({ data }) => {
  if (!data) return null;

  return (
    <div className="container py-5 text-light">
      <div className="row g-4">
        <aside className="col-lg-4">
          <div className="panel-dark p-4 text-center">
            <img src="/Gemini_Generated_Image_cqgqlpcqgqlpcqgq.png" alt="profile" className="hero-img mb-3" style={{ width: 260, height: 260 }} />
            <h2 className="h4 mb-1">{data.name}</h2>
            <div className="text-body-secondary mb-3">{data.title}</div>

            <div className="mb-3 text-start">
              <strong>Contact</strong>
              <div className="text-body-secondary">{data.location}</div>
              <div className="text-body-secondary">{data.email}</div>
              {data.phone && data.phone.map((p, i) => (
                <div key={i} className="text-body-secondary">{p}</div>
              ))}
            </div>

            <div className="mb-3 text-start">
              <strong>Social</strong>
              <div className="d-flex gap-3 mt-2">
                <a href="https://www.instagram.com/ab_foll_estif/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                  <Instagram color="#e6e6e6" />
                </a>
                <a href="https://web.facebook.com/teketelestifanos.tulore/" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                  <Facebook color="#e6e6e6" />
                </a>
                <a href="https://x.com/abenfollestif" target="_blank" rel="noreferrer" aria-label="X" title="X">
                  <Twitter color="#e6e6e6" />
                </a>
                <a href="https://t.me/Ab02Tk" target="_blank" rel="noreferrer" aria-label="Telegram" title="Telegram">
                  <Send color="#e6e6e6" />
                </a>
                <a href="https://www.linkedin.com/in/Abfoll" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <Linkedin color="#e6e6e6" />
                </a>
                <a href="https://github.com/Abfoll" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
                  <Github color="#e6e6e6" />
                </a>
              </div>
            </div>
          </div>
        </aside>

        <main className="col-lg-8">
          {data.summary && (
            <section className="mb-4 reveal-on-scroll reveal-from-bottom">
              <h3 className="h5 text-light mb-2">Summary</h3>
              <p className="text-body-secondary">{data.summary}</p>
            </section>
          )}

          {data.experience && (
            <section className="mb-4 reveal-on-scroll reveal-from-left">
              <h3 className="h5 text-light mb-3">Experience</h3>
              <div className="timeline">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="timeline-item panel-dark p-3 mb-3" style={{transitionDelay: `${idx * 90}ms`}}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{exp.role}</strong>
                        <div className="text-body-secondary">{exp.company}</div>
                      </div>
                      <div className="text-body-secondary">{exp.period}</div>
                    </div>
                    <ul className="mt-2">
                      {exp.details && exp.details.map((d, i) => <li key={i} className="text-body-secondary">{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && (
            <section className="mb-4 reveal-on-scroll reveal-from-right">
              <h3 className="h5 text-light mb-3">Education</h3>
              <div className="timeline">
                {data.education.map((ed, idx) => (
                  <div key={idx} className="timeline-item panel-dark p-3 mb-3" style={{transitionDelay: `${idx * 90}ms`}}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{ed.degree}</strong>
                        <div className="text-body-secondary">{ed.institution}</div>
                      </div>
                      <div className="text-body-secondary">{ed.period}</div>
                    </div>
                    {ed.details && <div className="mt-2 text-body-secondary">{ed.details}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && (
            <section className="mb-4 reveal-on-scroll reveal-scale">
              <h3 className="h5 text-light mb-2">Skills</h3>
              <div className="d-flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span key={i} className="badge text-bg-secondary skill-badge" style={{transitionDelay: `${i * 60}ms`}}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {data.projects && (
            <section className="mb-4 reveal-on-scroll reveal-stagger">
              <h3 className="h5 text-light mb-2">Projects</h3>
              <div className="row g-3">
                {data.projects.map((p, i) => (
                  <div key={i} className="col-md-6">
                    <div className="card panel-dark h-100 project-card" style={{transitionDelay: `${i * 90}ms`}}>
                      <div className="card-body">
                        <h5 className="card-title">{p.title}</h5>
                        <p className="card-text text-body-secondary">{p.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResumeView;
