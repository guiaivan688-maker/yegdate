"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface SplitSectionProps {
  eyebrow?: string;
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function SplitSection({
  eyebrow, title, text, buttonText, buttonLink, imageSrc, imageAlt, reverse,
}: SplitSectionProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
      <motion.div
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`relative h-64 lg:h-80 rounded-3xl overflow-hidden ${reverse ? "lg:order-2" : ""}`}
      >
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover saturate-[0.92]" sizes="(max-width: 1024px) 100vw, 50vw" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={reverse ? "lg:order-1" : ""}
      >
        {eyebrow && <span className="text-gold font-semibold text-sm uppercase tracking-wider">{eyebrow}</span>}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy mt-2 mb-4">{title}</h3>
        <p className="text-navy/65 leading-relaxed mb-6">{text}</p>
        {buttonText && buttonLink && (
          <Link href={buttonLink} className="inline-block gradient-gold text-navy font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity">
            {buttonText}
          </Link>
        )}
      </motion.div>
    </div>
  );
}
