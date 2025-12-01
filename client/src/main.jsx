import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import App from './App.jsx'

function Root() {
  useEffect(() => {
    // global reveal-on-scroll observer for any element with .reveal-on-scroll
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) el.classList.add('show');
        else el.classList.remove('show');
      });
    }, { threshold: 0.12 });

    const observeEl = (el, i = 0) => {
      if (!el) return;
      el.style.transition = 'opacity 520ms ease, transform 520ms ease';
      if (!el.style.transitionDelay || el.style.transitionDelay === '') el.style.transitionDelay = `${i * 80}ms`;
      obs.observe(el);
    }

    // initial elements
    const items = Array.from(document.querySelectorAll('.reveal-on-scroll'));
    items.forEach((el, i) => observeEl(el, i));

    // watch for new elements added later (lazy routes/components)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches && node.matches('.reveal-on-scroll')) observeEl(node);
          const inner = node.querySelectorAll ? node.querySelectorAll('.reveal-on-scroll') : [];
          inner.forEach((el, i) => observeEl(el));
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Toggle a 'pointer-focused' class on body when the user moves the mouse into the page
    const onEnter = () => document.body.classList.add('pointer-focused')
    const onLeave = () => document.body.classList.remove('pointer-focused')
    window.addEventListener('pointerenter', onEnter)
    window.addEventListener('pointerleave', onLeave)

    return () => { obs.disconnect(); mo.disconnect(); window.removeEventListener('pointerenter', onEnter); window.removeEventListener('pointerleave', onLeave); };
  }, []);
  return <App />
}

createRoot(document.getElementById('root')).render(
  <>
    <Root />
  </>,
)
