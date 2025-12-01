import { useEffect, useRef, useState } from 'react'
import { Instagram, Facebook, Twitter, Send, Linkedin, Github, Mail, Phone } from 'lucide-react'

const Hero = () => {
    const descRef = useRef(null)
    const title = "I'm Abenezer Teketel"

        const ProgressiveText = ({ text = 'Hello Welcome', speed = 160, pause = 900 }) => {
            const [idx, setIdx] = useState(1)

            useEffect(() => {
                let mounted = true
                let timer = null

                const start = () => {
                    timer = setInterval(() => {
                        setIdx(prev => {
                            if (!mounted) return prev
                            if (prev >= text.length) {
                                clearInterval(timer)
                                // pause then reset
                                setTimeout(() => {
                                    if (!mounted) return
                                    setIdx(1)
                                    start()
                                }, pause)
                                return prev
                            }
                            return prev + 1
                        })
                    }, speed)
                }

                start()
                return () => { mounted = false; if (timer) clearInterval(timer) }
            }, [text, speed, pause])

            const out = text.slice(0, idx) + (idx < text.length ? '.' : '')
            return <span className="progressive">{out}</span>
        }

    useEffect(() => {
      // reveal description slightly on mount
      const el = descRef.current
      if (el) {
        requestAnimationFrame(() => {
          el.classList.add('reveal');
        })
      }
    }, [])

    return (
        <section className="px-4 py-5 my-5 fluctuate reveal-on-scroll">
            <div className="container">
                <div className="row align-items-center hero-row g-5">
                    <div className="col-5 text-center hero-image-wrap">
                        <img
                            className="d-inline-block mb-4 shadow border hero-img"
                            src="/Gemini_Generated_Image_cqgqlpcqgqlpcqgq.png"
                            alt="Profile"
                        />
                    </div>
                    <div className="col-7 text-md-start text-center hero-text-wrap">
                                                <h4 className="hero-subtitle"><ProgressiveText text={"Hello Welcome"} /></h4>
                                                <h1 className="hero-title fw-bold text-body-emphasis">
                                                    {Array.from(title).map((ch, i) => {
                                                        if (ch === ' ' || ch === '\u00A0') {
                                                            return <span className="char space" key={i} style={{ animationDelay: `${i * 30}ms` }}>&nbsp;</span>
                                                        }
                                                        return <span className="char" key={i} style={{ animationDelay: `${i * 30}ms` }}>{ch}</span>
                                                    })}
                                                </h1>
                        <p ref={descRef} className="hero-desc mb-4 reveal-on-scroll">
                            Full-Stack Developer specializing in the MERN Stack and Next.js. I craft high-performance, responsive web applications, ensuring a clean UI and production-ready code from day one.
                        </p>
                        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                            <a href="/resume" className="btn btn-ghost btn-lg px-4" >
                                View Resume
                            </a>
                            <a href="#contact" className="btn btn-outline-secondary btn-lg px-4">
                                Contact Me
                            </a>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center hero-socials" style={{marginTop: 18}} aria-label="Social links">
                    <a className="social-link" href="mailto:abenezerteketel7@gmail.com" aria-label="Email">
                        <Mail size={24} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="tel:+251902913860" aria-label="Phone">
                        <Phone size={22} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="https://www.instagram.com/ab_foll_estif/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <Instagram size={26} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="https://web.facebook.com/teketelestifanos.tulore/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <Facebook size={26} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="https://x.com/abenfollestif" target="_blank" rel="noopener noreferrer" aria-label="X">
                        <Twitter size={26} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="https://t.me/Ab02Tk" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                        <Send size={26} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="https://www.linkedin.com/in/Abfoll" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin size={26} color="#d9d9d9" />
                    </a>
                    <a className="social-link" href="https://github.com/Abfoll" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github size={26} color="#d9d9d9" />
                    </a>
                </div>
            </div>
        </section>

    )
}

export default Hero