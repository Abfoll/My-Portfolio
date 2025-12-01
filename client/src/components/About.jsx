
import ProgressiveTitle from './ProgressiveTitle'
import { useEffect, useRef } from 'react'

const rand = (min, max) => Math.random() * (max - min) + min

const useScatterPieces = (containerRef) => {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let pieces = []
        let resizeTimer = null

        const build = () => {
            const src = container.dataset.src
            const rect = container.getBoundingClientRect()
            const width = Math.max(160, Math.round(rect.width) || 320)
            const height = Math.max(160, Math.round(rect.height) || 320)
            const cols = 6
            const rows = 4
            const pw = Math.ceil(width / cols)
            const ph = Math.ceil(height / rows)

            // clear existing
            pieces.forEach(p => p.remove())
            pieces = []
            container.style.position = 'relative'
            container.style.width = width + 'px'
            container.style.height = height + 'px'
            container.style.maxWidth = '100%'

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const piece = document.createElement('div')
                    piece.className = 'scatter-piece'
                    piece.style.width = pw + 'px'
                    piece.style.height = ph + 'px'
                    piece.style.left = (c * pw) + 'px'
                    piece.style.top = (r * ph) + 'px'
                    piece.style.backgroundImage = `url(${src})`
                    piece.style.backgroundSize = `${width}px ${height}px`
                    piece.style.backgroundPosition = `-${c * pw}px -${r * ph}px`

                    // initial scattered transform
                    const tx = rand(-140, 140)
                    const ty = rand(-140, 140)
                    const rot = rand(-40, 40)
                    const sc = rand(0.8, 1.15)
                    piece.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc})`
                    piece.style.opacity = '0'
                    piece.style.transitionDelay = `${rand(0, 260)}ms`

                    container.appendChild(piece)
                    pieces.push(piece)
                }
            }
        }

        // listen for reveal (the global reveal-on-scroll adds .show)
        const section = container.closest('.reveal-on-scroll') || container.parentElement
        const mo = new MutationObserver((mut) => {
            for (const m of mut) {
                if (m.attributeName === 'class') {
                    const cls = section.classList
                    if (cls && cls.contains && cls.contains('show')) {
                        // assemble pieces
                        requestAnimationFrame(() => {
                            pieces.forEach((p, i) => {
                                const dur = 420 + Math.round(rand(0, 320))
                                p.style.transition = `transform ${dur}ms cubic-bezier(.22,.9,.28,1) ${p.style.transitionDelay}, opacity ${Math.max(280, dur - 80)}ms ease ${p.style.transitionDelay}`
                                p.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)'
                                p.style.opacity = '1'
                            })
                        })
                    }
                }
            }
        })

        const onResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => { build() }, 220)
        }

        build()
        mo.observe(section, { attributes: true, attributeFilter: ['class'] })
        window.addEventListener('resize', onResize)

        return () => {
            mo.disconnect()
            window.removeEventListener('resize', onResize)
            pieces.forEach(p => p.remove())
        }
    }, [containerRef])
}

const About = () => {
    const photoRef = useRef(null)
    useScatterPieces(photoRef)

    return (
        <section className=" col-xxl-8 px-4 py-5 reveal-on-scroll reveal-from-left" id="about">

            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">

                <div className="col-10 col-sm-8 col-lg-6">

                    <div
                        ref={photoRef}
                        className="about-photo-scatter"
                        role="img"
                        aria-label="Profile photo"
                        data-src="/Gemini_Generated_Image_cqgqlpcqgqlpcqgq.png"
                    />

                </div>
                <div className="col-lg-6">

                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
                                {/* progressive About animation */}
                                <ProgressiveTitle base={"About"} suffix={"Me"} />
                            </h1>
                                        <p className="lead">
                                            Fullstack Developer (MERN) passionate about designing and developing scalable web applications using React, Node.js, and PostgreSQL. Experienced in building ERP and Inventory Management Systems with a strong focus on clean architecture, RESTful security, and smooth user interfaces. Enthusiastic about continuous learning, collaboration, and contributing to impactful software projects.
                                        </p>
                    
                </div>
            </div>
        </section>

    )
}

export default About
