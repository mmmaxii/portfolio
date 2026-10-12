"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import "./TargetCursor.css";

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
}

const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export default function TargetCursor({
  targetSelector = '.cursor-target, a, button, [role="button"], [role="tab"], summary, input, select, textarea, label[for], [data-cursor-target]',
  spinDuration = 10,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = "#cfe2ff",
  cursorColorOnTarget = "#6fe3a8",
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);
  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });
  const activeTargetRef = useRef<HTMLElement | null>(null);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    const hasTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent);
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.08,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    if (hideDefaultCursor) {
      document.body.classList.add("target-cursor-active");
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");
    containingBlockRef.current = getContainingBlock(cursor);

    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: NodeJS.Timeout | null = null;

    const cleanupTarget = (target: HTMLElement) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;
      const corners = Array.from(cornersRef.current);

      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, "x") as number;
        const currentY = gsap.getProperty(corner, "y") as number;
        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    tickerFnRef.current = tickerFn;

    let hasMovedOnce = false;

    // Sincronizar capa cuando un <dialog open> está abierto
    const syncDialogLayer = () => {
      const activeDialog = document.querySelector<HTMLDialogElement>("dialog[open]");
      if (activeDialog && cursor.parentElement !== activeDialog) {
        activeDialog.appendChild(cursor);
        containingBlockRef.current = getContainingBlock(cursor);
      } else if (!activeDialog && cursor.parentElement !== document.body) {
        document.body.appendChild(cursor);
        containingBlockRef.current = getContainingBlock(cursor);
      }
    };

    const moveHandler = (e: MouseEvent) => {
      if (!hasMovedOnce) {
        hasMovedOnce = true;
        cursor.classList.add("target-cursor-visible");
      }
      syncDialogLayer();
      moveCursor(e.clientX, e.clientY);
    };

    const mouseEnterDocHandler = () => {
      cursor.classList.add("target-cursor-visible");
    };

    const mouseLeaveDocHandler = () => {
      cursor.classList.remove("target-cursor-visible");
    };

    window.addEventListener("mousemove", moveHandler, { passive: true });
    document.documentElement.addEventListener("mouseenter", mouseEnterDocHandler);
    document.documentElement.addEventListener("mouseleave", mouseLeaveDocHandler);

    const scrollHandler = () => {
      if (!activeTargetRef.current || !cursorRef.current) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = (gsap.getProperty(cursorRef.current, "x") as number) + offsetX;
      const mouseY = (gsap.getProperty(cursorRef.current, "y") as number) + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTargetRef.current ||
          (elementUnderMouse as HTMLElement).closest?.(targetSelector) === activeTargetRef.current);

      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      } else {
        const rect = activeTargetRef.current.getBoundingClientRect();
        const { borderWidth, cornerSize } = constants;
        targetCornerPositionsRef.current = [
          { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
          { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
          {
            x: rect.right + borderWidth - cornerSize - offsetX,
            y: rect.bottom + borderWidth - cornerSize - offsetY,
          },
          { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        ];
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.6, duration: 0.15 });
      gsap.to(cursorRef.current, { scale: 0.92, duration: 0.15 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.25 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.25 });
    };

    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as HTMLElement | null;
      if (!directTarget || !cursorRef.current || !cornersRef.current) return;

      const target = directTarget.closest?.(targetSelector) as HTMLElement | null;
      if (!target) return;
      if (activeTargetRef.current === target) return;

      if (activeTargetRef.current) {
        cleanupTarget(activeTargetRef.current);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTargetRef.current = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => gsap.killTweensOf(corner, "x,y"));
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      if (cursorColorOnTarget) {
        gsap.to(corners, {
          borderColor: cursorColorOnTarget,
          boxShadow: `0 0 10px ${cursorColorOnTarget}66`,
          duration: 0.2,
          ease: "power2.out",
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            boxShadow: `0 0 12px ${cursorColorOnTarget}`,
            duration: 0.2,
            ease: "power2.out",
          });
        }
      }

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        {
          x: rect.right + borderWidth - cornerSize - offsetX,
          y: rect.bottom + borderWidth - cornerSize - offsetY,
        },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current!);
      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.22,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current);
        }
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTargetRef.current = null;

        if (cursorColorOnTarget && cornersRef.current) {
          gsap.to(Array.from(cornersRef.current), {
            borderColor: cursorColor,
            boxShadow: "0 0 8px rgba(168, 200, 240, 0.35)",
            duration: 0.2,
            ease: "power2.out",
          });
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              backgroundColor: cursorColor,
              boxShadow: "0 0 10px rgba(168, 200, 240, 0.7), 0 0 4px #fff",
              duration: 0.2,
              ease: "power2.out",
            });
          }
        }

        if (cornersRef.current) {
          const cornersToReset = Array.from(cornersRef.current);
          gsap.killTweensOf(cornersToReset, "x,y");
          const { cornerSize: cSize } = constants;
          const positions = [
            { x: -cSize * 1.5, y: -cSize * 1.5 },
            { x: cSize * 0.5, y: -cSize * 1.5 },
            { x: cSize * 0.5, y: cSize * 0.5 },
            { x: -cSize * 1.5, y: cSize * 0.5 },
          ];
          const tl = gsap.timeline();
          cornersToReset.forEach((corner, index) => {
            tl.to(
              corner,
              { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: "power3.out" },
              0
            );
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTargetRef.current && cursorRef.current) {
            const currentRotation = (gsap.getProperty(cursorRef.current, "rotation") as number) || 0;
            const normalizedRotation = ((currentRotation % 360) + 360) % 360;
            if (spinTl.current) {
              spinTl.current.kill();
            }
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" });

            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler, { once: true });
    };

    window.addEventListener("mouseover", enterHandler, { passive: true });

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
    };

    window.addEventListener("resize", resizeHandler);

    // Observar apertura/cierre de modal <dialog> para sincronizar dinámicamente
    const observer = new MutationObserver(() => {
      syncDialogLayer();
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["open"] });

      const activeStrength = activeStrengthRef.current;
      return () => {
        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current);
        }
        window.removeEventListener("mousemove", moveHandler);
        document.documentElement.removeEventListener("mouseenter", mouseEnterDocHandler);
        document.documentElement.removeEventListener("mouseleave", mouseLeaveDocHandler);
        window.removeEventListener("mouseover", enterHandler);
        window.removeEventListener("scroll", scrollHandler);
        window.removeEventListener("resize", resizeHandler);
        window.removeEventListener("mousedown", mouseDownHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
        observer.disconnect();

        if (activeTargetRef.current) {
          cleanupTarget(activeTargetRef.current);
        }
        spinTl.current?.kill();
        document.body.classList.remove("target-cursor-active");
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        activeStrength.current = 0;
      };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
  ]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>
  );
}
