import {
  FavoritePokemonVars,
  GetPokemonsDataSinglePokemon,
  GET_POKEMONS,
  MUTATION_FAVORITE_POKEMON,
  MUTATION_UNFAVORITE_POKEMON,
} from "../lib/graphql/pokemons";
import styles from "../styles/favoriteHeart.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useMutation } from "@apollo/client";
import apolloClient from "../lib/graphql/apolloClient";
import { useState } from "react";
import classNames from "classnames";

const FavoriteHeart = ({
  pokemon,
  favoriteChanged,
}: {
  pokemon: GetPokemonsDataSinglePokemon;
  favoriteChanged: (pokemonId: string, favorite: boolean) => void;
}) => {
  const [showAddedSuccess, setShowAddedSuccess] = useState(false);
  const [showRemovedSuccess, setShowRemovedSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const onAdded = () => {
    setShowAddedSuccess(true);
    setTimeout(() => setShowAddedSuccess(false), 1500);
  };

  const onRemoved = () => {
    setShowRemovedSuccess(true);
    setTimeout(() => setShowRemovedSuccess(false), 1500);
  };

  const onError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  };

  const [mutateFavorite] = useMutation<{}, FavoritePokemonVars>(MUTATION_FAVORITE_POKEMON, { onCompleted: onAdded, onError: onError });
  const [mutateUnfavorite] = useMutation<{}, FavoritePokemonVars>(MUTATION_UNFAVORITE_POKEMON, { onCompleted: onRemoved, onError: onError });
  const heartClicked = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (pokemon.isFavorite) {
      mutateUnfavorite({ variables: { id: pokemon.id } });
    } else {
      mutateFavorite({ variables: { id: pokemon.id } });
    }
    favoriteChanged(pokemon.id, !pokemon.isFavorite);
    setAnimate(true);
  };
  // we don't want the animations to start on rerender, that's why we only active animations after interaction
  const [animate, setAnimate] = useState(false);
  return (
    <>
      {pokemon.isFavorite && <FavoriteIcon className={classNames(styles.favoriteIcon, animate && styles.animate)} onClick={heartClicked} />}
      {!pokemon.isFavorite && <FavoriteBorderIcon className={classNames(styles.favoriteIcon, animate && styles.animate)} onClick={heartClicked} />}
      {showAddedSuccess && <div className={styles.successMessage}>Added to favorites</div>}
      {showRemovedSuccess && <div className={styles.successMessage}>Removed from favorites</div>}
      {showError && <div className={styles.errorMessage}>There was an error while saving favorite change!</div>}
    </>
  );
};

export default FavoriteHeart;
