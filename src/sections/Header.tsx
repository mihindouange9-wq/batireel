import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "../brand/Logo";
import { NAV, NAV_CTA } from "../content/site";
import "./header.css";

/* En-tête : transparent sur le hero, puis minéral et plus bas au défilement, sans déplacer le contenu.
   Sur mobile, un menu en calque, accessible au clavier, fermé à Échap. */
export default function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`header ${compact ? "is-compact" : ""} ${open ? "is-open" : ""}`}>
      <div className="header__bar">
        <a className="header__logo" href="#top" aria-label="BATIRÉEL, retour en haut de page">
          <Logo size={22} tone="dark" />
        </a>
        <nav className="header__nav" aria-label="Navigation principale">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="header__link">
              {item.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--primary header__cta" href={NAV_CTA.href}>
          <span className="btn__label">{NAV_CTA.label}</span>
          <span className="btn__arrow" aria-hidden="true" />
        </a>
        <button
          ref={toggle}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
        </button>
      </div>
      <div className="header__menu" id="menu-mobile" hidden={!open}>
        <nav aria-label="Navigation mobile">
          {NAV.map((item, i) => (
            <a key={item.href} href={item.href} className="header__menu-link" style={{ "--i": i } as React.CSSProperties} onClick={() => setOpen(false)}>
              <span className="header__menu-num tabular">0{i + 1}</span>
              {item.label}
            </a>
          ))}
          <a href={NAV_CTA.href} className="header__menu-link header__menu-link--cta" style={{ "--i": NAV.length } as React.CSSProperties} onClick={() => setOpen(false)}>
            {NAV_CTA.label}
            <ArrowUpRight size={20} strokeWidth={2} />
          </a>
        </nav>
      </div>
    </header>
  );
}
