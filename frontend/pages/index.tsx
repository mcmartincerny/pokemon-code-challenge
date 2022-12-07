import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useQuery } from "@apollo/client";
import { GetPokemonsData, GetPokemonsDataSinglePokemon, GetPokemonsVars, GetPokemonTypesData, GET_POKEMONS, GET_POKEMON_TYPES } from "../lib/graphql/pokemons";
import PokemonCard from "../components/PokemonCard";
import apolloClient from "../lib/graphql/apolloClient";
import { ChangeEvent, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect } from "react";
import { useRef } from "react";
import isEqual from "lodash.isequal";
import ToTheTopButton from "../components/ToTheTopButton";
import FavoriteToggle from "../components/FavoriteToggle";
import NormalViewIcon from "@mui/icons-material/ViewModule";
import ListViewIcon from "@mui/icons-material/TableRows";
import CompactViewIcon from "@mui/icons-material/ViewCompact";
import DetailViewIcon from "@mui/icons-material/ViewArray";
import classNames from "classnames";
import { normalize } from "path";

export default function Home({ pokemonTypes }: { pokemonTypes: string[] }) {
  const [viewMode, setViewMode] = useState<ViewModes>(ViewModes.normal);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [pokemons, setPokemons] = useState<GetPokemonsDataSinglePokemon[]>([]);
  const { data, loading, error } = useQuery<GetPokemonsData, GetPokemonsVars>(GET_POKEMONS, {
    variables: { limit: 10, offset: offset, search: search, isFavorite: showFavorites, type: filterType },
  });
  //TODO: Handle error and loading, add notifications
  let pokemonsData = data?.pokemons.edges || [];
  if (showFavorites) {
    //We need to filter it here again, because we are not refetching the query when favorite changes,
    //coz we don't want to request the data that we can assemble locally.
    pokemonsData = pokemonsData.filter((poke) => poke.isFavorite);
  }
  if (!loading && !isEqual(pokemons, pokemonsData)) {
    if (offset === 0) {
      //If offset is 0 and we get a new data, we want to replace the old data
      setPokemons(pokemonsData);
    } else if (!isEqual(pokemons.slice(-pokemonsData.length), pokemonsData)) {
      //If offset is not 0 and we get a new data, we want add this data to our old data
      setPokemons([...pokemons, ...pokemonsData]);
    }
  }
  //We don't want to do unnecessary calls to the server to get new list of pokemons with updated favorite state when we know what changed
  const pokemonFavoriteChanged = (pokemonId: string, favorite: boolean) => {
    const pokemon = pokemons.find((pokemon) => pokemon.id === pokemonId);
    if (!pokemon) throw new Error(`Pokemon id=${pokemonId} is not in pokemons array`);
    pokemon.isFavorite = favorite;
    if (favorite === false && showFavorites) {
      //If we unfavorited the pokemon and we are now showing only favorites, we need to remove it
      setPokemons(pokemons.filter((pok) => pok !== pokemon));
    }
  };

  const count = data?.pokemons.count;
  const footerRef = useRef(null);

  useEffect(() => {
    //creates observer that will observe footer and increases query limit when the footer (end of the list) enters the viewport (screen)
    const observer = new IntersectionObserver(
      (footer) => {
        if (footer[0].isIntersecting) {
          if (count && offset + 10 < count) {
            setOffset(offset + 10);
          }
        }
      },
      { threshold: [0] }
    );
    let observedElement: Element | undefined;
    if (footerRef.current) {
      observer.observe(footerRef.current);
      observedElement = footerRef.current;
    }
    return () => {
      if (observedElement) observer.unobserve(observedElement);
    };
  }, [footerRef, count, offset]);

  const searchChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value as string);
    setOffset(0);
  };

  const filterChanged = (e: SelectChangeEvent<string>) => {
    setFilterType(e.target.value as string);
    setOffset(0);
  };

  const showFavoritesChanged = (showFavorites: boolean) => {
    setShowFavorites(showFavorites);
    setOffset(0);
  };

  return (
    <>
      <FavoriteToggle setFavorites={showFavoritesChanged} showFavorites={showFavorites} />
      <div className={styles.container}>
        <Head>
          <title>Pokedex</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToTheTopButton />
        <div className={styles.searchAndFilterAndIcons}>
          <TextField className={styles.search} value={search} label="Search" variant="outlined" onChange={searchChanged} />
          <FormControl className={styles.filter}>
            <InputLabel id="demo-simple-select-label">Filter by type</InputLabel>
            <Select label="Filter by type" onChange={filterChanged}>
              <MenuItem value="">None</MenuItem>
              {pokemonTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={styles.iconsContainer}>
            <NormalViewIcon
              className={classNames(styles.viewIcon, viewMode === ViewModes.normal && styles.active)}
              onClick={() => setViewMode(ViewModes.normal)}
            />
            <ListViewIcon className={classNames(styles.viewIcon, viewMode === ViewModes.list && styles.active)} onClick={() => setViewMode(ViewModes.list)} />
            <CompactViewIcon
              className={classNames(styles.viewIcon, viewMode === ViewModes.compact && styles.active)}
              onClick={() => setViewMode(ViewModes.compact)}
            />
          </div>
        </div>

        <div className={styles.pokemonList}>
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} viewMode={viewMode} favoriteChanged={pokemonFavoriteChanged}></PokemonCard>
          ))}
          {count === 0 && "No pokemons found!"}
        </div>

        <footer className={styles.footer} ref={footerRef}>
          Built by Martin Černý
        </footer>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const pokemonTypes = await apolloClient.query<GetPokemonTypesData>({
    query: GET_POKEMON_TYPES,
  });

  return {
    props: { pokemonTypes: pokemonTypes.data.pokemonTypes },
  };
}

export enum ViewModes {
  normal,
  list,
  compact,
}
