import Navbar from '../components/Navbar';
import About from "../components/About"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Projects from "../components/Projects"


const Home = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto">
        <Hero />
        <About />
        <Projects />
        <Contact />

      </main>
      <Footer />
    </>
  )
}

export default Home