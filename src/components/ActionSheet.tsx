import { useEffect, useRef, useState } from "react";
import "./ActionSheet.css"

interface ActionSheetProps extends React.HTMLProps<HTMLElement> {
    show: boolean;
}
export function ActionSheet (props: ActionSheetProps) {
    const { children, show } = props;
    const [showInternal, setShowInternal] = useState(false);
    const [className, setClassName] = useState("action-sheet");

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show) {
            // Show action sheet and render dialog contents
            setShowInternal(true);
        } else {
            if (el.current && showInternal) {
                // Slide down dialog
                el.current.addEventListener("animationend", () => {
                    // Hide action sheet and stop rendering dialog contents
                    setClassName("action-sheet")
                    setShowInternal(false);
                }, { once: true });

                setClassName("action-sheet action-sheet--slide-down");
            }
        }
    }, [show, showInternal])

    useEffect(() => {
        if (showInternal) {
            // Slide up dialog
            if (el.current) {
                el.current.addEventListener("animationend", () => {
                    setClassName("action-sheet action-sheet--show");
                }, { once: true });

                setClassName("action-sheet action-sheet--slide-up");
            }
        }
    }, [showInternal])

    return (
        <div ref={el} className={className}>
            {showInternal &&
                <div className="action-sheet__dialog">
                    <div className="action-sheet__header"></div>
                    <div className="action-sheet__body">{children}</div>
                    <div className="action-sheet__footer"></div>
                </div>
            }
        </div>
    );
}
