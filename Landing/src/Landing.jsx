import Test from "./Test";
import "./app.scss"
import Hero from "./navbar/components/hero/Hero";
import Navbar from "./navbar/components/Navbar";
import Parallax from "./navbar/components/parallax/Parallax";
import Services from "./navbar/components/services/Services";
import Portfolio from "./navbar/components/portfolio/Portfolio";
import Contact from "./navbar/components/contact/Contact";
import About from "./login/Login";

const Landing = () => {
  return (<div>
      <section id="Homepage">
       <Navbar/>
       <Hero/>
      </section>
       <section id = "Features"><Parallax type="services"/></section>
       <section><Services /></section>
       <section id = "Uniqueness"><Parallax type="portfolio" /></section>
       <Portfolio />
       <section id="Contact">
         <Contact />
       </section>
       {/* <section id="Login">
         <Login />
       </section> */}

      {/* <Test/> */}
    </div>
  );

  
};

export default Landing;