import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Mail,
  Phone,
  Linkedin,
  Send
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center py-4 gap-2 px-3 border-top panel-dark reveal-on-scroll reveal-from-left">
      <div className="col-md-4 d-flex flex-column footer-copy" style={{gap: '6px'}}>
        <span className="text-muted" style={{color: '#bfbfbf'}}>
          © {new Date().getFullYear()} Abenezer Teketel
        </span>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <a className="text-muted d-flex align-items-center" href="mailto:abenezerteketel7@gmail.com" style={{color:'#d9d9d9'}}>
            <Mail size={18} className="footer-icon" color="#d9d9d9" />
            <span style={{marginLeft:8, fontSize: '0.95rem'}}>abenezerteketel7@gmail.com</span>
          </a>
        </div>
        <div style={{display: 'flex', gap: '14px', alignItems: 'center'}}>
          <a className="text-muted d-flex align-items-center" href="tel:+251902913860" style={{color:'#d9d9d9'}}>
            <Phone size={16} color="#d9d9d9" />
            <span style={{marginLeft:8, fontSize: '0.95rem'}}>+251 90 291 3860</span>
          </a>
          <a className="text-muted d-flex align-items-center" href="tel:+251955295719" style={{color:'#d9d9d9'}}>
            <Phone size={16} color="#d9d9d9" />
            <span style={{marginLeft:8, fontSize: '0.95rem'}}>+251 95 529 5719</span>
          </a>
        </div>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex footer-links wiggle-subtle">
        <li className="ms-3">
          <a className="text-muted" href="https://www.instagram.com/ab_foll_estif/" target="_blank" rel="noopener noreferrer">
            <Instagram size={24} className="footer-icon" color="#d9d9d9" />
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://web.facebook.com/teketelestifanos.tulore/" target="_blank" rel="noopener noreferrer">
            <Facebook size={24} className="footer-icon" color="#d9d9d9" />
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://x.com/abenfollestif" target="_blank" rel="noopener noreferrer">
            <Twitter size={24} className="footer-icon" color="#d9d9d9" />
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://t.me/Ab02Tk" target="_blank" rel="noopener noreferrer">
            <Send size={24} className="footer-icon" color="#d9d9d9" />
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://www.linkedin.com/in/Abfoll" target="_blank" rel="noopener noreferrer">
            <Linkedin size={24} className="footer-icon" color="#d9d9d9" />
          </a>
        </li>
        <li className="ms-3">
          <a className="text-muted" href="https://github.com/Abfoll" target="_blank" rel="noopener noreferrer">
            <Github size={24} className="footer-icon" color="#d9d9d9" />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
