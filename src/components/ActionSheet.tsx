import { useEffect, useRef, useState } from "react";
import "./ActionSheet.css"

interface ActionSheetProps extends React.HTMLProps<HTMLElement> {
    show: boolean;
}
export function ActionSheet (props: ActionSheetProps) {
    const { children, show } = props;
    const [showDialog, setShowDialog] = useState(false);
    const [className, setClassName] = useState("action-sheet");

    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show) {
            // Show action sheet and render dialog contents
            setShowDialog(true);
        } else {
            if (el.current && showDialog) {
                // Slide down dialog
                el.current.addEventListener("animationend", () => {
                    // Hide action sheet and stop rendering dialog contents
                    setClassName("action-sheet")
                    setShowDialog(false);
                }, { once: true });

                setClassName("action-sheet action-sheet--slide-down");
            }
        }
    }, [show, showDialog])

    useEffect(() => {
        if (showDialog) {
            // Slide up dialog
            if (el.current) {
                el.current.addEventListener("animationend", () => {
                    setClassName("action-sheet action-sheet--show");
                }, { once: true });

                setClassName("action-sheet action-sheet--slide-up");
            }
        }
    }, [showDialog])

    return (
        <div ref={el} className={className}>
            {showDialog &&
                <div className="action-sheet__dialog">
                    <div className="action-sheet__header"></div>
                    <div className="action-sheet__body">{children}</div>
                    <div className="action-sheet__footer"></div>
                </div>
            }
        </div>
    );
}
