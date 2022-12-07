import { GetPokemonByNameDataPokemon, GetPokemonByNameDataPokemonForEvolution } from "../lib/graphql/pokemons";
import styles from "../styles/pokemonDetails.module.css";
import PokemonTypeChips from "./PokemonTypeChips";
import FavoriteHeart from "./FavoriteHeart";
import classNames from "classnames";
import HPIcon from "@mui/icons-material/LocalHospital";
import { FC } from "react";
import CPIcon from "@mui/icons-material/SportsKabaddi";
import HeightIcon from "@mui/icons-material/Height";
import WeightIcon from "@mui/icons-material/FitnessCenter";
import CategoryIcon from "@mui/icons-material/Category";
import FleeIcon from "@mui/icons-material/DirectionsWalk";
import PokemonCard from "./PokemonCard";
import { ViewModes } from "../pages";
import ArrowBottomRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import AudioPlayIcon from "@mui/icons-material/VolumeUp";

const PokemonDetails = ({ pokemon, evolutions }: { pokemon: GetPokemonByNameDataPokemon; evolutions: GetPokemonByNameDataPokemonForEvolution[] }) => {
  const favoriteChanged = (pokemonId: string, favorite: boolean) => {
    [pokemon, ...evolutions].find((poke) => poke.id === pokemonId)!.isFavorite = favorite;
  };
  const playAudio = () => {
    new Audio(pokemon.sound.replace("localhost", location.hostname)).play();
  };

  return (
    <div className={styles.vertical}>
      <div className={styles.horizontal}>
        <div className={classNames(styles.vertical, styles.left)}>
          <h1>{pokemon.name}</h1>
          <img src={pokemon.image} alt={`picture of  ${pokemon.name}`} className={styles.image} />
          <PokemonTypeChips types={pokemon.types} />
          <div className={styles.audioHeartWrapper}>
            <AudioPlayIcon onClick={playAudio} />
            <FavoriteHeart pokemon={pokemon} favoriteChanged={favoriteChanged} />
          </div>
        </div>
        <div className={classNames(styles.vertical, styles.stats)}>
          <h2>Stats:</h2>
          <div className={styles.statsColumn}>
            <Stat name="HP" Icon={HPIcon} value={pokemon.maxHP} />
            <Stat name="CP" Icon={CPIcon} value={pokemon.maxCP} />
            <Stat name="Height" Icon={HeightIcon} value={pokemon.height.maximum} />
            <Stat name="Weight" Icon={WeightIcon} value={pokemon.weight.maximum} />
            <Stat name="Flee rate" Icon={FleeIcon} value={pokemon.fleeRate} />
            <Stat name="Category" Icon={CategoryIcon} value={pokemon.classification} />
          </div>
        </div>
      </div>
      <div className={styles.horizontal}>
        {pokemon.evolutionRequirements && (
          <div className={styles.requirements}>
            {`${pokemon.evolutionRequirements.amount}x ${pokemon.evolutionRequirements.name}`} <ArrowBottomRightIcon fontSize="inherit" />
          </div>
        )}
        {evolutions.map((poke) => (
          <>
            <PokemonCard key={poke.name} pokemon={poke} favoriteChanged={favoriteChanged} viewMode={ViewModes.normal} />
            {poke.evolutionRequirements && (
              <div className={styles.requirements}>
                {`${poke.evolutionRequirements.amount}x ${poke.evolutionRequirements.name}`} <ArrowRightIcon fontSize="inherit" />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ name, Icon, value }: { name: string; Icon: FC; value: string | number }) => {
  return (
    <div className={styles.stat} data-type={name}>
      <span className={styles.label}>
        <Icon /> {name}:
      </span>
      <span className={styles.value}>{value}</span>
    </div>
  );
};

export default PokemonDetails;
