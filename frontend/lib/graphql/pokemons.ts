import { gql } from "@apollo/client/core";
import { type } from "os";

interface PokemonDimension {
  minimum: string;
  maximum: string;
}

interface Attack {
  name: string;
  type: string;
  damage: number;
}

interface PokemonAttack {
  fast: Attack[];
  special: Attack[];
}

interface PokemonEvolutionRequirement {
  amount: number;
  name: string;
}

/**
 * All the Pokemon data that we can get from graphql
 */
export interface Pokemon {
  id: string;
  number: number;
  name: string;
  weight: PokemonDimension;
  height: PokemonDimension;
  classification: string;
  types: string[];
  resistant: string[];
  attacks: PokemonAttack;
  weaknesses: string[];
  fleeRate: number;
  maxCP: number;
  evolutions: { name: string; id: string }[];
  evolutionRequirements?: PokemonEvolutionRequirement;
  maxHP: number;
  image: string;
  sound: string;
  isFavorite: boolean;
}

export type GetPokemonsDataSinglePokemon = Pick<Pokemon, "name" | "image" | "types" | "isFavorite" | "id">;

export interface GetPokemonsData {
  pokemons: {
    edges: GetPokemonsDataSinglePokemon[];
    count: number;
  };
}

export interface GetPokemonsVars {
  limit: number;
  offset: number;
  search?: string;
  type?: string;
  isFavorite?: boolean;
}

/**
 * get pokemons pokemons with search, filters and stuff - used in pokemon list (home page)
 */
export const GET_POKEMONS = gql`
  query getPokemons($limit: Int!, $offset: Int!, $search: String, $isFavorite: Boolean, $type: String) {
    pokemons(query: { limit: $limit, offset: $offset, search: $search, filter: { type: $type, isFavorite: $isFavorite } }) {
      edges {
        name
        image
        types
        isFavorite
        id
      }
      count
    }
  }
`;

export type GetPokemonByNameDataPokemon = Pick<
  Pokemon,
  | "name"
  | "image"
  | "types"
  | "isFavorite"
  | "id"
  | "evolutions"
  | "evolutionRequirements"
  | "maxHP"
  | "maxCP"
  | "height"
  | "weight"
  | "classification"
  | "fleeRate"
  | "sound"
>;

export interface GetPokemonByNameData {
  pokemonByName: GetPokemonByNameDataPokemon;
}

export interface GetPokemonByNameVars {
  name: string;
}

/**
 * get all necessary data for pokemon detail view
 */
export const GET_POKEMON_BY_NAME = gql`
  query getPokemonByName($name: String!) {
    pokemonByName(name: $name) {
      name
      image
      types
      isFavorite
      id
      evolutions {
        name
      }
      evolutionRequirements {
        name
        amount
      }
      maxHP
      maxCP
      height {
        maximum
      }
      weight {
        maximum
      }
      classification
      fleeRate
      sound
    }
  }
`;

export type GetPokemonByNameDataPokemonForEvolution = Pick<Pokemon, "name" | "image" | "types" | "isFavorite" | "id" | "evolutions" | "evolutionRequirements">;

export interface GetPokemonByNameForEvolutionData {
  pokemonByName: GetPokemonByNameDataPokemonForEvolution;
}

/**
 * get only the data necessary for displaying evolution on pokemon detail view
 */
export const GET_POKEMON_BY_NAME_FOR_EVOLUTION = gql`
  query getPokemonByName($name: String!) {
    pokemonByName(name: $name) {
      name
      image
      types
      isFavorite
      id
      evolutionRequirements {
        name
        amount
      }
    }
  }
`;

export interface FavoritePokemonVars {
  id: string;
}

/**
 * add pokemon to favorite
 */
export const MUTATION_FAVORITE_POKEMON = gql`
  mutation favoritePokemon($id: ID!) {
    favoritePokemon(id: $id) {
      isFavorite
    }
  }
`;

/**
 *  remove pokemon to favorite
 */
export const MUTATION_UNFAVORITE_POKEMON = gql`
  mutation unFavoritePokemon($id: ID!) {
    unFavoritePokemon(id: $id) {
      isFavorite
    }
  }
`;

export interface GetPokemonTypesData {
  pokemonTypes: string[];
}
/**
 * get all pokemon types - ex. fire, grass poison
 */
export const GET_POKEMON_TYPES = gql`
  {
    pokemonTypes
  }
`;
