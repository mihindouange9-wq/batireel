/* Le même volume, en axonométrie dessinée : sert sans WebGL, en mouvement réduit, et comme premier
   état avant que la scène 3D ne soit chargée. Les traits se tracent avec `data-draw`. */
export default function HeroDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 720 520" fill="none" aria-hidden="true" data-draw>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* dalle */}
        <path data-stroke d="M120 400 L420 480 L660 380 L360 300 Z" />
        <path data-stroke d="M120 400 V416 L420 496 L660 396 V380" />
        {/* corps bas */}
        <path data-stroke d="M200 380 L370 425 L470 383 L300 338 Z" />
        <path data-stroke d="M200 380 V290 L300 248 L470 293 V383" />
        <path data-stroke d="M300 338 V248 M370 425 V335 L470 293" />
        {/* corps haut en porte-à-faux */}
        <path data-stroke d="M240 290 L430 340 L600 270 L410 220 Z" />
        <path data-stroke d="M240 290 V200 L410 130 L600 180 V270" />
        <path data-stroke d="M410 220 V130 M430 340 V250 L600 180" />
        {/* casquette */}
        <path data-stroke d="M220 196 L430 252 L620 174 L410 118 Z" strokeWidth="2" />
        {/* poteaux */}
        <path data-stroke d="M500 350 V300 M540 334 V284 M580 316 V266" />
        {/* escalier */}
        <path data-stroke d="M150 392 L170 386 L170 374 L190 368 L190 356 L210 350" />
      </g>
      {/* le montant cuivre et les cotes */}
      <g stroke="#b86f45" strokeWidth="1.5" strokeLinecap="round">
        <path data-stroke d="M602 272 V176" strokeWidth="3" />
        <path data-stroke d="M100 440 V456 M420 520 V536 M100 448 L420 528" />
        <path data-stroke d="M680 380 H696 M680 180 H696 M688 380 V180" />
      </g>
      <g fill="#d08c62" fontFamily="Manrope Variable, sans-serif" fontSize="12" fontWeight="600" letterSpacing="2">
        <text data-pop x="236" y="508" transform="rotate(14 236 508)">
          14,60
        </text>
        <text data-pop x="704" y="284" transform="rotate(90 704 284)" textAnchor="middle">
          6,90
        </text>
      </g>
    </svg>
  );
}
