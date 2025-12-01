import { useEffect, useRef, useState } from 'react'

// ProgressiveTitle: reveals prefixes of `base` one char at a time with dots,
// then shows base + '.' and '..' before showing full `base + ' ' + suffix`.
// It waits for the nearest ancestor with `.reveal-on-scroll` to receive `.show`.
const ProgressiveTitle = ({ base = 'About', suffix = 'Me', speed = 140, pause = 700 }) => {
  const [text, setText] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    let mounted = true
    let parent = null
    let mo = null
    let activeTimers = []
    let looping = false

    const clearAll = () => {
      activeTimers.forEach(t => clearTimeout(t))
      activeTimers = []
    }

    const runSequence = () => {
      clearAll()
      const steps = []
      for (let i = 1; i <= base.length; i++) {
        const prefix = base.slice(0, i)
        steps.push(i < base.length ? `${prefix}.` : prefix)
      }
      steps.push(`${base}.`)
      steps.push(`${base}..`)
      steps.push(`${base} ${suffix}`)

      let t = 0
      steps.forEach((s, idx) => {
        const tm = setTimeout(() => {
          if (!mounted) return
          setText(s)
        }, t)
        activeTimers.push(tm)
        t += speed + (idx === steps.length - 1 ? pause : 60)
      })

      // schedule next loop after the full sequence duration
      const restart = setTimeout(() => {
        if (!mounted) return
        if (parent && !parent.classList.contains('show')) {
          // wait until visible again
          return
        }
        if (looping) runSequence()
      }, t + 80)
      activeTimers.push(restart)
    }

    const startLoop = () => {
      if (looping) return
      looping = true
      runSequence()
    }

    const stopLoop = () => {
      looping = false
      clearAll()
      setText('')
    }

    const setup = () => {
      const el = ref.current
      if (!el) return
      parent = el.parentElement
      while (parent && !parent.classList.contains('reveal-on-scroll')) parent = parent.parentElement
      if (!parent) {
        // no parent reveal container; just loop always
        startLoop()
        return
      }

      // if already visible start loop
      if (parent.classList.contains('show')) startLoop()

      mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.attributeName === 'class') {
            if (parent.classList.contains('show')) startLoop()
            else stopLoop()
          }
        }
      })
      mo.observe(parent, { attributes: true })
    }

    setup()

    return () => {
      mounted = false
      if (mo) mo.disconnect()
      clearAll()
    }
  }, [base, suffix, speed, pause])

  return <span ref={ref} className="progressive-title">{text}</span>
}

export default ProgressiveTitle
