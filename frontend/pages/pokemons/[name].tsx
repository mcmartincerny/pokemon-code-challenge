import Link from "next/link";
import {
  GetPokemonByNameData,
  GetPokemonByNameForEvolutionData,
  GetPokemonByNameDataPokemon,
  GetPokemonByNameVars,
  GetPokemonsDataSinglePokemon,
  GET_POKEMON_BY_NAME,
  GET_POKEMON_BY_NAME_FOR_EVOLUTION,
} from "../../lib/graphql/pokemons";
import client from "../../lib/graphql/apolloClient";
import { GetStaticProps } from "next";
import Head from "next/head";
import PokemonDetails from "../../components/PokemonDetails";

const PokemonPage = ({ pokemon, evolutions }: { pokemon: GetPokemonByNameDataPokemon; evolutions: GetPokemonByNameDataPokemon[] }) => {
  return (
    <>
      <Head>
        <title>{pokemon.name} - Pokedex</title>
        <link rel="icon" href={pokemon.image} />
      </Head>
      <PokemonDetails pokemon={pokemon} evolutions={evolutions} />
    </>
  );
};

export default PokemonPage;

export const getServerSideProps: GetStaticProps = async (context) => {
  const name = context.params?.name;
  // If pokemon name is not valid, redirect to 404 page
  if (!name || Array.isArray(name))
    return {
      notFound: true,
    };
  const pokemonData = await client.query<GetPokemonByNameData, GetPokemonByNameVars>({
    query: GET_POKEMON_BY_NAME,
    variables: { name },
  });
  const pokemon = pokemonData.data.pokemonByName;
  // If pokemon was not found, redirect to 404 page
  if (!pokemon)
    return {
      notFound: true,
    };
  const evolutions = await Promise.all(
    pokemon.evolutions.map(
      async (poke) =>
        (
          await client.query<GetPokemonByNameForEvolutionData, GetPokemonByNameVars>({
            query: GET_POKEMON_BY_NAME_FOR_EVOLUTION,
            variables: { name: poke.name },
          })
        ).data.pokemonByName
    )
  );
  return {
    props: { pokemon: pokemon, evolutions: evolutions },
  };
};
