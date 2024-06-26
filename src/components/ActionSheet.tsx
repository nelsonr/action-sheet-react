import { useEffect, useRef, useState } from "react";
import "./ActionSheet.css"

function stopPropagation (ev: TouchEvent) {
    ev.preventDefault();
    ev.stopPropagation();
}

interface ActionSheetProps extends React.HTMLProps<HTMLElement> {
    show: boolean;
    onSlideDown: () => unknown;
}

export function ActionSheet (props: ActionSheetProps) {
    const { children, show, onSlideDown } = props;
    const [showDialog, setShowDialog] = useState(false);
    const [className, setClassName] = useState("action-sheet");

    const rootEl = useRef<HTMLDivElement>(null);
    const dialogEl = useRef<HTMLDivElement>(null);
    const dialogHeaderEl = useRef<HTMLDivElement>(null);
    const cursorPosY = useRef(0);
    const deltaTime = useRef(0);

    const onTouchStart = (ev: TouchEvent) => {
        cursorPosY.current = ev.changedTouches[0].clientY;

        deltaTime.current = Date.now();

        rootEl.current?.setAttribute("style", `--posY: 0px`);
        setClassName((state) => state + " action-sheet--dragging");
    }

    const onTouchMove = (ev: TouchEvent) => {
        ev.preventDefault();

        const diff = ev.changedTouches[0].clientY - cursorPosY.current;

        if (diff > 0) {
            rootEl.current?.setAttribute("style", `--posY: ${diff}px; --speed: ${deltaTime.current}ms`);
        }
    }

    const onTouchEnd = (ev: TouchEvent) => {
        ev.preventDefault();

        if (dialogEl.current) {
            const diff = ev.changedTouches[0].clientY - cursorPosY.current;

            if (diff > 0) {
                deltaTime.current = Date.now() - deltaTime.current;

                const willClose = diff > 100;
                const target = willClose ? "100%" : "0px";
                const speed = willClose ? Math.min(deltaTime.current, 200) : 300;
                const animation = dialogEl.current.animate(
                    [
                        { 'transform': `translateY(${diff}px)` },
                        { 'transform': `translateY(${target})` },
                    ],
                    {
                        duration: speed,
                        easing: "ease-out"
                    }
                );

                animation.onfinish = () => {
                    rootEl.current?.setAttribute("style", `--posY: ${target}; --speed: ${speed}ms;`);
                    setClassName((state) => state.replace(" action-sheet--dragging", ""));

                    if (willClose) {
                        onSlideDown();
                    }
                };
            }
        }
    }

    useEffect(() => {
        // 1. Show action sheet and render dialog contents (off screen)
        if (show) {
            setShowDialog(true);
            rootEl.current?.removeAttribute("style")

            // Prevent browser triggering browser pull to refresh when
            // attempting to drag the action sheet dialog
            rootEl.current?.addEventListener("touchmove", stopPropagation);
        } else {
            // 3. Slide down dialog
            if (rootEl.current && showDialog) {
                // Callback after slide down animation
                rootEl.current.addEventListener("animationend", () => {
                    // Clean up event listeners
                    dialogHeaderEl.current?.removeEventListener("touchstart", onTouchStart);
                    dialogHeaderEl.current?.removeEventListener("touchmove", onTouchMove);
                    dialogHeaderEl.current?.removeEventListener("touchend", onTouchEnd);
                    rootEl.current?.removeEventListener("touchmove", stopPropagation);

                    // 4. Hide action sheet and stop rendering dialog contents
                    setClassName("action-sheet")
                    setShowDialog(false);
                }, { once: true });

                // Trigger slide down animation
                setClassName("action-sheet action-sheet--slide-down");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, showDialog])

    useEffect(() => {
        // 2. Slide up dialog
        if (showDialog && rootEl.current) {
            // Setup event listeners
            dialogHeaderEl.current?.addEventListener("touchstart", onTouchStart);
            dialogHeaderEl.current?.addEventListener("touchmove", onTouchMove);
            dialogHeaderEl.current?.addEventListener("touchend", onTouchEnd);

            // Callback after slide up animation
            rootEl.current.addEventListener("animationend", () => {
                setClassName("action-sheet action-sheet--show");
            }, { once: true });

            // Trigger slide up animation
            setClassName("action-sheet action-sheet--slide-up");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showDialog])

    return (
        <div ref={rootEl} className={className}>
            {showDialog && (
                <div ref={dialogEl} className="action-sheet__dialog">
                    <div ref={dialogHeaderEl} className="action-sheet__header"></div>
                    <div className="action-sheet__body">{children}</div>
                    <div className="action-sheet__footer"></div>
                </div>
            )}
        </div>
    );
}
