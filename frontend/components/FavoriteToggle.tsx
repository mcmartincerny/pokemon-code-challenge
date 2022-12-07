import styles from "../styles/favoriteToggle.module.css";
import classNames from "classnames";
import { useState } from "react";

const FavoriteToggle = ({ showFavorites, setFavorites }: { showFavorites: boolean; setFavorites: (showFavorite: boolean) => void }) => {
  // we don't want the animations to start on page refresh, that's why we only active animations after first interaction
  const [animate, setAnimate] = useState(false);
  const showAllClicked = () => {
    if (showFavorites) setFavorites(false);
    setAnimate(true);
  };
  const showFavoritesClicked = () => {
    if (!showFavorites) setFavorites(true);
    setAnimate(true);
  };
  return (
    <>
      <div className={classNames(styles.container, showFavorites && styles.showFavorites, animate && styles.animate)}>
        <div onClick={showAllClicked} className={classNames(styles.all, !showFavorites && styles.active)}>
          All
        </div>
        <div onClick={showFavoritesClicked} className={classNames(styles.favorites, showFavorites && styles.active)}>
          Favorites
        </div>
      </div>
    </>
  );
};

export default FavoriteToggle;
