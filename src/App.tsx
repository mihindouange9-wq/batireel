import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import Intro from "./components/Intro";
import { Marquee } from "./components/Plan";
import { PageHead, PageNext } from "./components/Page";
import { LogoMark } from "./brand/Logo";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import Constat from "./sections/Constat";
import Presentation from "./sections/Presentation";
import Passeport from "./sections/Passeport";
import Comparateur from "./sections/Comparateur";
import Pros from "./sections/Pros";
import Etapes from "./sections/Etapes";
import Explorer from "./sections/Explorer";
import Terrain from "./sections/Terrain";
import Rejoindre from "./sections/Rejoindre";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { HERO_BANDE, PAGES } from "./content/site";
import { ScrollTrigger, createLenis, getLenis, gsap, prefersReducedMotion, scrollToSection, setupReveals } from "./lib/motion";
import { navigate, toRoute, useRoute, type Route } from "./lib/router";

/** Le contenu de chaque page. Les sections restent des enfants directs de <main>. */
function Page({ route }: { route: Route }) {
  switch (route) {
    case "/concept":
      return (
        <>
          <PageHead route={route} />
          <Presentation />
          <Terrain />
          <PageNext route={route} />
        </>
      );
    case "/passeport":
      return (
        <>
          <PageHead route={route} />
          <Passeport />
          <PageNext route={route} />
        </>
      );
    case "/comparateur":
      return (
        <>
          <PageHead route={route} />
          <Comparateur />
          <PageNext route={route} />
        </>
      );
    case "/professionnels":
      return (
        <>
          <PageHead route={route} />
          <Pros />
          <PageNext route={route} />
        </>
      );
    case "/projet":
      return (
        <>
          <PageHead route={route} />
          <Contact />
        </>
      );
    default:
      return (
        <>
          <Hero />
          <Marquee text={HERO_BANDE} />
          <Constat />
          <Etapes />
          <Explorer />
          <Rejoindre />
        </>
      );
  }
}

export default function App() {
  const route = useRoute();
  const volet = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const busy = useRef(false);
  const first = useRef(true);

  /* Changement de page : deux dalles montent et couvrent l'écran, la page change dessous, puis elles
     continuent leur course et découvrent la nouvelle feuille. En mouvement réduit : changement direct. */
  const go = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    const el = volet.current;
    if (prefersReducedMotion() || !el) return navigate(to);
    if (busy.current) return;
    busy.current = true;
    covered.current = true;
    const label = el.querySelector(".volet__label");
    const page = PAGES[toRoute(url.pathname)];
    if (label) label.textContent = page.nom;
    gsap
      .timeline()
      .set(el, { visibility: "visible" })
      .fromTo(el.querySelectorAll(".volet__dalle"), { yPercent: 101 }, { yPercent: 0, duration: 0.6, ease: "power4.inOut", stagger: 0.08 })
      .fromTo(el.querySelector(".volet__in"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0.3)
      .add(() => navigate(to), "+=0.05");
  }, []);

  // moteur de défilement, liens internes, lueur du pointeur : posés une fois
  useEffect(() => {
    createLenis();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const raw = a.getAttribute("href")!;
      if (!raw.startsWith("/") && !raw.startsWith("#")) return;
      const url = new URL(raw, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      const same = toRoute(url.pathname) === toRoute(window.location.pathname) && url.search === window.location.search;
      if (!same) return go(url.pathname + url.search + url.hash);
      // même page : une ancre, ou le retour en haut
      const id = url.hash.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        scrollToSection(el);
        el.setAttribute("tabindex", "-1");
        window.setTimeout(() => el.focus({ preventScroll: true }), getLenis() ? 1500 : 0);
      } else if (getLenis()) getLenis()!.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);

    // la lueur cuivre suit le pointeur (souris uniquement), comme une lampe posée sur le plan
    const g = glow.current;
    let onMove: ((e: PointerEvent) => void) | null = null;
    if (g && !prefersReducedMotion() && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const x = gsap.quickTo(g, "x", { duration: 0.9, ease: "power3" });
      const y = gsap.quickTo(g, "y", { duration: 0.9, ease: "power3" });
      onMove = (e) => {
        g.classList.add("is-on");
        x(e.clientX);
        y(e.clientY);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
      if (onMove) window.removeEventListener("pointermove", onMove);
    };
  }, [go]);

  // avant l'affichage de la nouvelle page : retour en haut, sans animation
  useLayoutEffect(() => {
    if (first.current) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [route]);

  // à chaque page : titre du document, révélations, jauge de défilement, ancre éventuelle, puis le volet se lève
  useEffect(() => {
    document.title = PAGES[route].doc;
    const cleanup = setupReveals(document.body);
    const bar = meter.current;
    const st = bar && !prefersReducedMotion() ? ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }) }) : null;
    if (bar) gsap.set(bar, { scaleX: 0 });
    ScrollTrigger.refresh();

    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) window.setTimeout(() => scrollToSection(target), first.current ? 600 : 450);
    else if (!first.current) document.getElementById("main")?.focus({ preventScroll: true });

    const el = volet.current;
    if (covered.current && el) {
      covered.current = false;
      gsap
        .timeline({ delay: 0.12, onComplete: () => void (busy.current = false) })
        .to(el.querySelector(".volet__in"), { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" })
        .to(el.querySelectorAll(".volet__dalle"), { yPercent: -101, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.08, from: "end" } }, 0.1)
        .set(el, { visibility: "hidden" });
    } else busy.current = false;
    first.current = false;
    return () => {
      cleanup?.();
      st?.kill();
    };
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <Intro />
      <div className="jauge" aria-hidden="true">
        <div className="jauge__barre" ref={meter} />
      </div>
      <div className="lueur" ref={glow} aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1} key={route}>
        <Page route={route} />
      </main>
      <Footer />
      <div className="volet" ref={volet} aria-hidden="true">
        <span className="volet__dalle volet__dalle--cuivre" />
        <span className="volet__dalle" />
        <div className="volet__in">
          <LogoMark size={44} />
          <span className="volet__label cote cote--plain" />
        </div>
      </div>
    </>
  );
}
