import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {

  /** Fade-in-up reveal for section elements */
  revealElements(selector: string, stagger = 0.15): void {
    gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  /** Stagger children animation */
  staggerReveal(parent: string, children: string, stagger = 0.12): void {
    gsap.fromTo(`${parent} ${children}`,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  /** Pin the 3D canvas and sync with scroll progress */
  pinMangoScene(
    triggerEl: string,
    onProgress: (progress: number) => void
  ): ScrollTrigger {
    return ScrollTrigger.create({
      trigger: triggerEl,
      start: 'top top',
      end: 'bottom bottom',
      pin: false,
      scrub: 1.5,
      onUpdate: (self) => onProgress(self.progress),
    });
  }

  /** Parallax effect */
  parallax(selector: string, yPercent = -20): void {
    gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
      gsap.to(el, {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /** Horizontal text reveal */
  textReveal(selector: string): void {
    gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
      gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  /** Scale-in with rotation */
  scaleRotateIn(selector: string): void {
    gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
      gsap.fromTo(el,
        { scale: 0.7, rotation: -5, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  /** Counter animation */
  animateCounter(el: HTMLElement, target: number, duration = 2): void {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = Math.floor(obj.val).toString();
      },
    });
  }

  /** Kill all triggers (cleanup) */
  killAll(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }
}
