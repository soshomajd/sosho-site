import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { SiClaude, SiOpenai } from "react-icons/si";
import type { Locale } from "@/app/i18n";
import PortraitEyes from "./PortraitEyes";
import RobotPortraitEyes from "./RobotPortraitEyes";
import TeamCarouselMotion from "./TeamCarouselMotion";
import { STUDIO_TEAM, TEAM_COPY } from "./team-data";

export default function TeamCarousel({ locale }: { locale: Locale }) {
  const copy = TEAM_COPY[locale];
  const number = (value: number) => value.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

  return (
    <section id="studio-team" className="sh-team" aria-label={copy.label} aria-roledescription={locale === "fa" ? "اسلایدر" : "carousel"}>
      <fieldset className="sh-team-fieldset">
        <legend className="sr-only">{copy.label}</legend>
        {STUDIO_TEAM.map((member, index) => (
          <div className="sh-team-entry" key={member.id}>
            <input
              className="sh-team-radio sr-only"
              type="radio"
              id={`team-${member.id}`}
              name="studio-team"
              value={member.id}
              defaultChecked={index === 0}
              aria-label={`${copy.choose} ${member.name[locale]} — ${member.role[locale]} — ${number(index + 1)} ${copy.of} ${number(STUDIO_TEAM.length)}`}
              data-team-announcement={`${member.name[locale]}، ${member.role[locale]}، ${number(index + 1)} ${copy.of} ${number(STUDIO_TEAM.length)}`}
            />
            <figure className="sh-team-slide" data-team-member={member.id} role="group" aria-roledescription={copy.slide} aria-label={`${number(index + 1)} ${copy.of} ${number(STUDIO_TEAM.length)}`}>
              <div className="sh-team-visual">
                <div className="sh-portrait">
                  <Image
                    src={member.image}
                    alt={member.alt[locale]}
                    width={1000}
                    height={1000}
                    sizes="(max-width: 480px) 85vw, (max-width: 1023px) 440px, 480px"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="sh-character"
                  />
                  {member.id === "soheil" ? <PortraitEyes /> : <RobotPortraitEyes member={member.id} />}
                </div>
                {member.id !== "soheil" && (
                  <span className={`sh-team-brand sh-team-brand-${member.id}`} aria-hidden="true">
                    {member.id === "claude" ? <SiClaude /> : <SiOpenai />}
                  </span>
                )}
              </div>
              <figcaption className="sh-team-caption">
                <p className="sh-team-kind">{member.kind[locale]}</p>
                <h2 className="sh-team-name" dir={member.id === "soheil" ? undefined : "ltr"}>{member.name[locale]}</h2>
                <p className="sh-team-role">{member.role[locale]}</p>
                <p className="sh-team-bio">{member.bio[locale]}</p>
              </figcaption>
            </figure>
          </div>
        ))}
        <div className="sh-team-nav">
          <button type="button" className="sh-team-arrow sh-team-enhanced sh-team-previous" data-team-step="-1" aria-label={copy.previous} aria-controls="studio-team">
            <FiArrowLeft className="rtl:-scale-x-100" aria-hidden="true" />
          </button>
          {STUDIO_TEAM.map((member, index) => (
            <label key={member.id} className="sh-team-arrow sh-team-native sh-team-previous" htmlFor={`team-${STUDIO_TEAM[(index + STUDIO_TEAM.length - 1) % STUDIO_TEAM.length].id}`} data-team-native={member.id} data-team-step="-1" title={copy.previous} aria-hidden="true">
              <FiArrowLeft className="rtl:-scale-x-100" />
            </label>
          ))}
          <div className="sh-team-dots">
            {STUDIO_TEAM.map((member) => (
              <label className="sh-team-dot" htmlFor={`team-${member.id}`} key={member.id} title={`${copy.choose} ${member.name[locale]}`}>
                <span className="sh-team-dot-mark" aria-hidden="true" />
                <span className="sr-only">{member.name[locale]}</span>
              </label>
            ))}
          </div>
          <button type="button" className="sh-team-arrow sh-team-enhanced sh-team-next" data-team-step="1" aria-label={copy.next} aria-controls="studio-team">
            <FiArrowRight className="rtl:-scale-x-100" aria-hidden="true" />
          </button>
          {STUDIO_TEAM.map((member, index) => (
            <label key={member.id} className="sh-team-arrow sh-team-native sh-team-next" htmlFor={`team-${STUDIO_TEAM[(index + 1) % STUDIO_TEAM.length].id}`} data-team-native={member.id} data-team-step="1" title={copy.next} aria-hidden="true">
              <FiArrowRight className="rtl:-scale-x-100" />
            </label>
          ))}
        </div>
      </fieldset>
      <p className="sr-only sh-team-status" role="status" aria-live="polite" aria-atomic="true" />
      <TeamCarouselMotion locale={locale} />
    </section>
  );
}
