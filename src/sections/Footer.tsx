import { Logo, LogoMark } from "../brand/Logo";
import { FOOTER, NAV, NAV_CTA, SITE } from "../content/site";
import "./footer.css";

/* Pied de page : les lignes du plan convergent vers le repère, puis la navigation, les contacts à
   compléter et les mentions à prévoir. Sobre, architectural. */
export default function Footer() {
  const email = SITE.contact.email.trim();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" data-tone="dark">
      <div className="footer__close" aria-hidden="true">
        <svg className="footer__lines" viewBox="0 0 1200 240" preserveAspectRatio="none" data-draw>
          <path data-stroke d="M0 40H440L600 200" />
          <path data-stroke d="M1200 40H760L600 200" />
          <path data-stroke d="M0 120H380L600 200" />
          <path data-stroke d="M1200 120H820L600 200" />
          <path data-stroke d="M600 0V200" />
        </svg>
        <span className="footer__mark">
          <LogoMark size={64} />
        </span>
      </div>
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo size={28} tone="dark" />
            <p className="footer__mission">{FOOTER.mission}</p>
            <p className="footer__note">{FOOTER.nameNote}</p>
          </div>
          <nav className="footer__nav" aria-label="Pied de page">
            <p className="cote cote--plain">Navigation</p>
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={NAV_CTA.href}>{NAV_CTA.label}</a>
          </nav>
          <div className="footer__contact">
            <p className="cote cote--plain">Contact</p>
            {email ? <a href={`mailto:${email}`}>{email}</a> : <p className="footer__pending">À compléter avant publication.</p>}
            <p className="cote cote--plain footer__legal-label">Informations légales</p>
            <p className="footer__pending">{SITE.legal.noticeStatus}</p>
            <p className="footer__pending">{SITE.legal.privacyStatus}</p>
          </div>
        </div>
        <p className="footer__partner">
          <span className="cote cote--plain">{FOOTER.partner.label}</span>
          <a className="footer__partner-link" href={FOOTER.partner.url} target="_blank" rel="noopener" aria-label={`${FOOTER.partner.name} (nouvel onglet)`}>
            <img className="footer__partner-logo" src="/partenaires/methode-aura.png" alt={FOOTER.partner.name} width="800" height="246" loading="lazy" decoding="async" />
          </a>
          <span className="footer__partner-note">{FOOTER.partner.note}</span>
        </p>
        <div className="footer__bottom">
          <p>
            © <span className="tabular">{year}</span> {SITE.name}.
          </p>
          <p>{FOOTER.demo}</p>
        </div>
      </div>
    </footer>
  );
}
