/** Server-rendered iris layers aligned to the 1000×1000 owned head render.
 * The underlying render has blank sclera so no baked pupil shows through.
 * Only the inner groups move; eyelid masks, face and hair stay fixed.
 */
const EYES = [
  { id: "left", x: 378, y: 455, outline: "M325 458 C337 434 356 428 376 430 C399 430 418 446 431 466 C410 479 347 484 325 462 Z" },
  { id: "right", x: 607, y: 466, outline: "M552 474 C567 448 585 440 606 441 C630 440 648 454 660 474 C639 491 584 495 554 479 Z" },
] as const;

export default function PortraitEyes() {
  return (
    <svg className="sh-eye-layer" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sh-iris-brown" cx="45%" cy="42%" r="55%">
          <stop offset="0" stopColor="#24130b" />
          <stop offset=".47" stopColor="#623b20" />
          <stop offset=".73" stopColor="#8a6137" />
          <stop offset=".91" stopColor="#4b2e1d" />
          <stop offset="1" stopColor="#211811" />
        </radialGradient>
        {EYES.map((eye) => <clipPath id={`sh-eye-${eye.id}`} key={eye.id}><path d={eye.outline} /></clipPath>)}
      </defs>
      {EYES.map((eye) => (
        <g clipPath={`url(#sh-eye-${eye.id})`} key={eye.id}>
          <g transform={`translate(${eye.x} ${eye.y})`}>
            <g data-eye-pupil data-eye-x={eye.x} data-eye-y={eye.y}>
              <circle r="29" fill="url(#sh-iris-brown)" />
              {Array.from({ length: 36 }, (_, index) => (
                <path key={index} d="M0 -16 L1 -25" transform={`rotate(${index * 10})`} stroke={index % 2 ? "#c29967" : "#25190f"} strokeWidth="1.2" opacity=".27" />
              ))}
              <circle r="13" fill="#100d0c" />
              <ellipse cx="-8" cy="-11" rx="6" ry="7" fill="#fff" opacity=".92" />
              <circle cx="9" cy="10" r="2.6" fill="#ecf2f5" opacity=".55" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
