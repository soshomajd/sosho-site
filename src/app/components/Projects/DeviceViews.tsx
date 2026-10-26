import Image from "next/image";
import type { CSSProperties } from "react";
import type { Locale } from "@/app/i18n";
import type { ProjectImage } from "./data";

const DEVICES = ["desktop", "tablet", "mobile"] as const;
const LABELS = {
  fa: ["دسکتاپ", "تبلت", "موبایل"],
  en: ["Desktop", "Tablet", "Mobile"],
} as const;

/** Each asset is an actual viewport rendition; CSS never crops it to another device. */
export default function DeviceViews({ images, locale }: { images: readonly ProjectImage[]; locale: Locale }) {
  return (
    <div className="project-device-gallery" aria-label={locale === "fa" ? "نمای هیرو در سه دستگاه" : "Hero views across three devices"}>
      {images.map((image, index) => (
        <figure key={image.src} className={`project-device project-device--${DEVICES[index]}`} style={{ "--view-ratio": image.width / image.height } as CSSProperties}>
          <figcaption className="project-device-label">
            <span className="project-device-dots" aria-hidden="true"><i /><i /><i /></span>
            <span>{LABELS[locale][index]}</span>
          </figcaption>
          <div className="project-device-screen">
            <Image
              src={image.src}
              alt={image.alt[locale]}
              width={image.width}
              height={image.height}
              sizes={index === 0 ? "(max-width: 767px) 90vw, 650px" : index === 1 ? "(max-width: 767px) 52vw, 360px" : "(max-width: 767px) 30vw, 200px"}
              loading="lazy"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
