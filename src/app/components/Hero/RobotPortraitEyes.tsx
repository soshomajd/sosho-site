/** Eye apertures follow the two 1000×1000 mascot renders. Sclera covers the
 * baked iris; the clipped inner group moves without moving lids or the head. */
const ROBOT_EYES = {
  claude: {
    light: "#b77b46", middle: "#865026", edge: "#402719", white: "#f5ede4", shade: "#d4b9a7",
    eyes: [
      { id: "left", x: 375, y: 487, radius: 35, outline: "M297 492 C310 459 338 443 367 447 C402 446 426 467 436 507 C401 524 334 526 300 507 Z" },
      { id: "right", x: 622, y: 488, radius: 35, outline: "M561 508 C568 473 591 449 621 448 C655 447 684 466 700 494 L699 508 C664 526 597 527 561 508 Z" },
    ],
  },
  codex: {
    light: "#8ac2d9", middle: "#427d9a", edge: "#18394c", white: "#f4f0e9", shade: "#d8c9b9",
    eyes: [
      { id: "left", x: 371, y: 465, radius: 37, outline: "M290 468 C301 438 329 424 360 426 C397 425 421 451 431 490 C396 503 325 500 296 484 Z" },
      { id: "right", x: 634, y: 469, radius: 38, outline: "M570 493 C580 455 604 433 635 434 C672 431 702 449 718 476 C694 499 616 509 570 493 Z" },
    ],
  },
} as const;

export default function RobotPortraitEyes({ member }: { member: keyof typeof ROBOT_EYES }) {
  const style = ROBOT_EYES[member];
  const iris = `sh-${member}-iris`;
  const sclera = `sh-${member}-sclera`;

  return (
    <svg className="sh-eye-layer" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={iris} cx="47%" cy="43%" r="57%">
          <stop offset="0" stopColor={style.edge} />
          <stop offset=".46" stopColor={style.middle} />
          <stop offset=".72" stopColor={style.light} />
          <stop offset=".93" stopColor={style.edge} />
          <stop offset="1" stopColor="#162027" />
        </radialGradient>
        <radialGradient id={sclera} cx="50%" cy="72%" r="76%">
          <stop offset=".3" stopColor={style.white} />
          <stop offset=".83" stopColor={style.shade} />
          <stop offset="1" stopColor="#8c7163" />
        </radialGradient>
        {style.eyes.map((eye) => <clipPath id={`sh-${member}-eye-${eye.id}`} key={eye.id}><path d={eye.outline} /></clipPath>)}
      </defs>
      {style.eyes.map((eye) => (
        <g clipPath={`url(#sh-${member}-eye-${eye.id})`} key={eye.id}>
          <path d={eye.outline} fill={`url(#${sclera})`} />
          <g transform={`translate(${eye.x} ${eye.y})`}>
            <g data-eye-pupil data-eye-x={eye.x} data-eye-y={eye.y} data-eye-range-x="12" data-eye-range-y="7">
              <circle r={eye.radius} fill={`url(#${iris})`} />
              {Array.from({ length: 44 }, (_, index) => (
                <path key={index} d={`M0 -19 L1 -${eye.radius - 3}`} transform={`rotate(${index * 360 / 44})`} stroke={index % 2 ? style.light : style.edge} strokeWidth="1.2" opacity=".4" />
              ))}
              <circle r="17" fill="#0b1013" />
              <ellipse cx="-9" cy="-12" rx="7" ry="8" fill="#fff" opacity=".95" />
              <circle cx="11" cy="12" r="2.5" fill="#e7f3f7" opacity=".5" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
