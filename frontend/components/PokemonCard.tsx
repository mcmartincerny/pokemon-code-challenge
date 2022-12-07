import Link from "next/link";
import {
  FavoritePokemonVars,
  GetPokemonsDataSinglePokemon,
  GET_POKEMONS,
  MUTATION_FAVORITE_POKEMON,
  MUTATION_UNFAVORITE_POKEMON,
} from "../lib/graphql/pokemons";
import styles from "../styles/pokemonCard.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useMutation } from "@apollo/client";
import PokemonTypeChips from "./PokemonTypeChips";
import FavoriteHeart from "./FavoriteHeart";
import { ViewModes } from "../pages";
import classNames from "classnames";

const PokemonCard = ({
  pokemon,
  favoriteChanged,
  viewMode,
}: {
  pokemon: GetPokemonsDataSinglePokemon;
  favoriteChanged: (pokemonId: string, favorite: boolean) => void;
  viewMode: ViewModes;
}) => {
  if (viewMode === ViewModes.normal)
    return (
      <div className={styles.card}>
        <Link href={`/pokemons/${pokemon.name}`} className={styles.link}>
          <h2>{pokemon.name}</h2>
        </Link>
        <Link href={`/pokemons/${pokemon.name}`} className={styles.link}>
          <img src={pokemon.image} alt={`picture of  ${pokemon.name}`} />
        </Link>
        <div className={styles.typesFavoriteRow}>
          <PokemonTypeChips types={pokemon.types} />
          <FavoriteHeart pokemon={pokemon} favoriteChanged={favoriteChanged} />
        </div>
      </div>
    );
  if (viewMode === ViewModes.list)
    return (
      <div className={styles.listItem}>
        <Link href={`/pokemons/${pokemon.name}`} className={styles.link}>
          <img src={pokemon.image} alt={`picture of  ${pokemon.name}`} />
        </Link>
        <Link href={`/pokemons/${pokemon.name}`} className={styles.link}>
          <h2>{pokemon.name}</h2>
        </Link>
        <PokemonTypeChips types={pokemon.types} />
        <FavoriteHeart pokemon={pokemon} favoriteChanged={favoriteChanged} />
      </div>
    );
  if (viewMode === ViewModes.compact)
    return (
      <Link href={`/pokemons/${pokemon.name}`} className={styles.link}>
        <div className={styles.tooltip} data-tooltip={pokemon.name}>
          <img src={pokemon.image} alt={pokemon.name} className={styles.compactImage} />
        </div>
      </Link>
    );
  throw new Error("unsupported viewMode: " + viewMode);
};

export default PokemonCard;
