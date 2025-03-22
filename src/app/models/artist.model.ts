export type ArtistModel = {
  id: string;
  name: string;
  popularity: number;
  followers: {
    total: number;
  };
  genres: string[];
  external_urls: {
    spotify: string;
  };
  images: ArtistImage[];
  type: string;
};

type ArtistImage = {
  url: string | undefined;
  height: number;
  width: number;
};
