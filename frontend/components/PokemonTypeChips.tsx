import styles from "../styles/pokemonTypeChips.module.css";

const PokemonTypeChips = ({ types }: { types: string[] }) => {
  return (
    <div className={styles.chiplets}>
      {types.map((type) => (
        <span key={type} className={styles.chiplet} data-type={type}>
          {type}
        </span>
      ))}
    </div>
  );
};

export default PokemonTypeChips;
