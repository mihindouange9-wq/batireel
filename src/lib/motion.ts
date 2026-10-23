import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Grammaire de mouvement BATIRÉEL : de la masse et de la précision. Les éléments lourds (dalles, volumes)
   partent lentement et s'arrêtent net ; les lignes se tracent ; rien ne rebondit. */
gsap.defaults({ ease: "power4.out", duration: 1.1 });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

let lenis: Lenis | null = null;

/** Défilement à inertie : natif sur écran tactile, désactivé en mouvement réduit. */
export function createLenis() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

/** Va à une section en laissant la place de l'en-tête. */
export function scrollToSection(el: HTMLElement) {
  let top = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
  top = Math.max(0, top - 64);
  if (lenis) lenis.scrollTo(top, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4), lock: false });
  else window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Découpe un titre en mots masqués (les espaces insécables gardent les mots ensemble). */
export function splitWords(el: HTMLElement) {
  if (el.dataset.split) return Array.from(el.querySelectorAll<HTMLElement>(".w > i"));
  const frag = document.createDocumentFragment();
  el.childNodes.forEach((n) => {
    if (n.nodeType !== 3) {
      frag.appendChild(n.cloneNode(true));
      return;
    }
    (n.textContent || "").split(/([ \t\r\n]+)/).forEach((part) => {
      if (!part) return;
      if (/^[ \t\r\n]+$/.test(part)) return void frag.appendChild(document.createTextNode(" "));
      const w = document.createElement("span");
      w.className = "w";
      const i = document.createElement("i");
      i.textContent = part;
      w.appendChild(i);
      frag.appendChild(w);
    });
  });
  el.textContent = "";
  el.appendChild(frag);
  el.dataset.split = "1";
  return Array.from(el.querySelectorAll<HTMLElement>(".w > i"));
}

/**
 * Révélations communes : `data-title` (mots qui montent derrière leur masque), `data-reveal` (montée
 * courte en fondu), `data-draw` (chemins SVG qui se tracent, dans l'ordre), `data-rule` (filet qui
 * s'étire). Tout reste visible sans JavaScript et en mouvement réduit.
 */
export function setupReveals(scope: HTMLElement) {
  if (prefersReducedMotion()) return;

  const titles = gsap.utils.toArray<HTMLElement>("[data-title]", scope);
  titles.forEach((t) => gsap.set(splitWords(t), { yPercent: 112 }));
  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        titleObserver.unobserve(e.target);
        gsap.to((e.target as HTMLElement).querySelectorAll(".w > i"), { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.05 });
      });
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  titles.forEach((el) => titleObserver.observe(el));

  const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
  gsap.set(blocks, { autoAlpha: 0, y: 28 });
  const observer = new IntersectionObserver(
    (entries) => {
      const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (!seen.length) return;
      seen.forEach((el) => observer.unobserve(el));
      gsap.to(seen, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, overwrite: true, delay: (_i, el: HTMLElement) => parseFloat(el.dataset.revealDelay || "0") });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  blocks.forEach((el) => observer.observe(el));

  const drawings = gsap.utils.toArray<SVGSVGElement>("[data-draw]", scope);
  // tous les dessins mesurés en une seule passe, puis repliés : un seul reflow pour la page entière
  prepareStrokes(drawings.flatMap((svg) => Array.from(svg.querySelectorAll<Drawable>("[data-stroke]"))));
  drawings.forEach((svg) => gsap.set(svg.querySelectorAll("[data-pop]"), { autoAlpha: 0 }));
  const drawObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        drawObserver.unobserve(e.target);
        playDrawing(e.target as SVGSVGElement);
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  drawings.forEach((el) => drawObserver.observe(el));

  const rules = gsap.utils.toArray<HTMLElement>("[data-rule]", scope);
  gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
  const ruleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        ruleObserver.unobserve(e.target);
        gsap.to(e.target, { scaleX: 1, duration: 1.3, ease: "power4.out" });
      });
    },
    { rootMargin: "0px 0px -6% 0px" },
  );
  rules.forEach((el) => ruleObserver.observe(el));

  return () => {
    titleObserver.disconnect();
    observer.disconnect();
    drawObserver.disconnect();
    ruleObserver.disconnect();
  };
}

type Drawable = SVGPathElement | SVGLineElement | SVGPolylineElement | SVGCircleElement | SVGRectElement;

const lengths = new WeakMap<Element, number>();

/** Longueur d'un trait, mesurée une seule fois (unités du viewBox : indépendante de la taille affichée). */
export function strokeLength(s: Element) {
  let l = lengths.get(s);
  if (l === undefined) {
    l = (s as SVGGeometryElement).getTotalLength();
    lengths.set(s, l);
  }
  return l;
}

/** Replie des traits sur eux-mêmes : toutes les mesures d'abord, toutes les écritures ensuite (aucun reflow forcé). */
export function prepareStrokes(strokes: Element[]) {
  const lens = strokes.map(strokeLength);
  strokes.forEach((s, i) => gsap.set(s, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }));
}

/** Prépare les traits d'un dessin (chemins, lignes, cercles, rectangles) pour un tracé progressif. */
export function prepareDrawing(svg: SVGSVGElement) {
  prepareStrokes(Array.from(svg.querySelectorAll<Drawable>("[data-stroke]")));
  gsap.set(svg.querySelectorAll("[data-pop]"), { autoAlpha: 0 });
}

/** Trace les traits dans l'ordre du document, avec des vitesses différenciées selon leur longueur. */
export function playDrawing(svg: SVGSVGElement, opts: { delay?: number; speed?: number } = {}) {
  const strokes = Array.from(svg.querySelectorAll<Drawable>("[data-stroke]"));
  const pops = Array.from(svg.querySelectorAll<SVGElement>("[data-pop]"));
  const tl = gsap.timeline({ delay: opts.delay ?? 0 });
  let t = 0;
  strokes.forEach((s) => {
    const len = strokeLength(s);
    const d = gsap.utils.clamp(0.35, 1.6, (len / 900) * (opts.speed ?? 1));
    tl.to(s, { strokeDashoffset: 0, duration: d, ease: "power2.inOut" }, t);
    t += d * 0.55;
  });
  tl.to(pops, { autoAlpha: 1, duration: 0.5, stagger: 0.08 }, Math.max(0.2, t * 0.8));
  return tl;
}

/** Trace un chemin SVG seul. */
export function drawPath(path: Drawable, opts: { duration?: number; delay?: number } = {}) {
  const length = strokeLength(path);
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  return gsap.to(path, { strokeDashoffset: 0, duration: opts.duration ?? 1.1, delay: opts.delay ?? 0, ease: "power2.inOut" });
}

export { gsap, ScrollTrigger, useGSAP };
