import { useEffect, useRef } from "react";
import Intro from "./components/Intro";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import Constat from "./sections/Constat";
import Presentation from "./sections/Presentation";
import Passeport from "./sections/Passeport";
import Comparateur from "./sections/Comparateur";
import Pros from "./sections/Pros";
import Etapes from "./sections/Etapes";
import Terrain from "./sections/Terrain";
import Rejoindre from "./sections/Rejoindre";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { ScrollTrigger, createLenis, getLenis, scrollToSection, setupReveals } from "./lib/motion";

export default function App() {
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    createLenis();
    const cleanup = setupReveals(document.body);
    // les polices et les images chargées, les déclencheurs de défilement se recalent
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // ancres : défilement maîtrisé, puis le focus suit, une fois le défilement posé
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      scrollToSection(el);
      el.setAttribute("tabindex", "-1");
      window.setTimeout(() => el.focus({ preventScroll: true }), getLenis() ? 1500 : 0);
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => {
      cleanup?.();
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#constat">
        Aller au contenu
      </a>
      <Intro />
      <Header />
      <main ref={main} id="main">
        <Hero />
        <Constat />
        <Presentation />
        <Passeport />
        <Comparateur />
        <Pros />
        <Etapes />
        <Terrain />
        <Rejoindre />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
