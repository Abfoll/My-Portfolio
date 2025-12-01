import { useState, useEffect } from "react"

import axios from "axios";
const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [cols, setCols] = useState(3)

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProjects = async () => {
      try {
        // fetch backend projects (may be empty)
        let backendProjects = [];
        try {
          const res = await axios.get("http://localhost:5000/api/projects");
          if (Array.isArray(res.data) && res.data.length > 0) backendProjects = res.data;
        } catch (e) {
          // ignore backend errors and continue with GitHub
          console.warn('Backend projects not available, falling back to GitHub');
        }

        // Always fetch public GitHub repos for the user as featured projects
        try {
          const gh = await axios.get('https://api.github.com/users/Abfoll/repos?sort=updated&per_page=12');
          const mapped = gh.data.map(r => {
            const name = (r.name || '').toLowerCase();
            let imageUrl = null;
            if (name.includes('taskflow') || name.includes('task-flow')) imageUrl = '/assets/taskflow.svg';
            if (name.includes('landing') || name.includes('landing-page')) imageUrl = '/assets/landing-page.svg';
            if (name.includes('addis') || name.includes('visit') || name.includes('visit-addis')) imageUrl = '/assets/visit-addis.svg';

            return ({
              _id: r.id,
              title: r.name,
              description: r.description || 'No description provided.',
              liveUrl: r.homepage || r.html_url,
              githubUrl: r.html_url,
              technologies: [],
              imageUrl
            })
          });
          // Combine Github projects first, then backend projects (backend may contain curated projects)
          setProjects([...mapped, ...backendProjects]);
        } catch (e) {
          console.error('Error fetching GitHub repos:', e);
          // fallback to backend only
          setProjects(backendProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Reveal on scroll using IntersectionObserver
  useEffect(() => {
    const list = document.getElementById('projects-list');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('.project-reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const top = entry.boundingClientRect.top;
        const rootHeight = (entry.rootBounds && entry.rootBounds.height) || window.innerHeight;

        if (entry.isIntersecting) {
          el.classList.add('show');
          el.classList.remove('hide-up');
        } else {
          // If the element left the viewport upward (top < 0), fade-up
          if (top < 0) {
            el.classList.remove('show');
            el.classList.add('hide-up');
          } else if (top > rootHeight) {
            // left downward: remove any hide-up state
            el.classList.remove('show');
            el.classList.remove('hide-up');
          } else {
            el.classList.remove('show');
            el.classList.remove('hide-up');
          }
        }
      });
    }, { threshold: 0.15 });

    items.forEach((el, i) => {
      // compute column count responsively
      const colCount = cols || 3;
      const colIndex = i % colCount;
      // alternate direction by column index so items in same column share direction
      if (colIndex % 2 === 0) el.classList.add('left');
      else el.classList.add('right');

      el.style.transition = `transform 600ms ease, opacity 600ms ease`;
      el.style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [projects, showAll]);

  // calculate number of columns based on viewport width (Bootstrap breakpoints used)
  useEffect(() => {
    const getCols = () => {
      const w = window.innerWidth;
      if (w >= 768) return 3; // md and up
      if (w >= 576) return 2; // sm
      return 1;
    }
    const update = () => setCols(getCols());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if(loading) return <></>

  const visible = showAll ? projects : projects.slice(0, 3)

  return (
    <>
      <section className="text-center container reveal-on-scroll" id="projects">

        <div className="row py-lg-5">

          <div className="col-lg-6 col-md-8 mx-auto">

            <h1 className="fw-light">My Projects</h1>
            <p className="lead text-body-secondary">
              Here are the some of my project.
            </p>
          
          </div>
        </div>
        
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" id="projects-list">

        {
          visible.map((project, idx)=>{
            const key = project._id || project.id || project.githubUrl || project.title || idx
            const hrefLive = project.liveUrl || project.githubUrl || '#'
            return <div className="col project-reveal" key={key}>

          <div className="card shadow-sm overflow-hidden position-relative">

            {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    className="card-img-top project-card-image"
                    alt={project.title}
                    loading="lazy"
                  />
                ) : null}
            <div className="card-body">

              <h5 className="card-title">{project.title}</h5>
              <p className="card-text text-body-secondary">
               {project.description}
              </p>
              <div className="mb-3 d-flex flex-wrap gap-2">
                {
                  project.technologies?.map((tech,idx)=>{
                    return <span className="badge text-bg-secondary  fw-light" key={idx}>{tech}</span>
                  })
                }
              </div>
              <div className="d-flex justify-content-end align-items-center">

                <div className="btn-group">

                  <a
                  target="_blank"
                  rel="noreferrer"
                  href={hrefLive}
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Live Demo
                  </a>
                  <a
                  target="_blank"
                  rel="noreferrer"
                  href={project.githubUrl || hrefLive}
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Code
                  </a>
                    {
                      // show delete for backend projects (ObjectId pattern)
                      /^[0-9a-fA-F]{24}$/.test(String(project._id)) && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={async () => {
                            if (!confirm('Delete this project?')) return;
                            try {
                              await axios.delete(`http://localhost:5000/api/projects/${project._id}`);
                              setProjects(prev => prev.filter(p => p._id !== project._id));
                            } catch (err) {
                              console.error('Failed to delete project', err);
                              alert('Failed to delete project');
                            }
                          }}
                        >
                          Delete
                        </button>
                      )
                    }
                </div>
               
              </div>
            </div>
          </div>
        </div>
          })
        }


      </div>
        {projects.length > 3 && (
          <div className="projects-footer">
            <button className="btn btn-outline-secondary" onClick={()=>setShowAll(s => !s)}>{showAll ? 'Show less' : 'Show more'}</button>
          </div>
        )}
      </section>






    </>


  )
}

export default Projects