import { useEffect, useRef, useState } from "react";
import styles from "../styles/ToTheTopButton.module.css";

const ToTheTopButton = () => {
  const top = useRef(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    //creates observer that will observe the top invisible element and shows the button when the top element is not in the viewport
    const observer = new IntersectionObserver(
      (top) => {
        setShowButton(!top[0].isIntersecting);
      },
      { threshold: [0] }
    );
    let observedElement: Element | undefined;
    if (top.current) {
      observer.observe(top.current);
      observedElement = top.current;
    }
    return () => {
      if (observedElement) observer.unobserve(observedElement);
    };
  }, [top]);

  const onClick = () => window.scrollTo(0, 0);

  return (
    <>
      <span className={styles.top} ref={top} />
      {showButton && (
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={onClick}>
            To the top
          </button>
        </div>
      )}
    </>
  );
};

export default ToTheTopButton;
