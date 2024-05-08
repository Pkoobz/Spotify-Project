import React from "react";
export interface Users {
    id: string,
    name: string,
    type: 'admin' | 'user',
    foto: string,
    email: string,
    pass: string,
    playlist : Playlist[]
}

export interface Artist {
    id: string,
    name: string,
    photo: string
}

export interface Song {
    id: string,
    name: string,
    file1: string,
    photo: string,
    artist: Artist[]
}

export interface Playlist {
    id: string,
    name: string,
    songs : Song[]
}

export interface Album {
    id: string,
    name: string,
    artist: Artist[],
    songs : Song[]
}

interface Context {
    users: Users[];
    artists: Artist[];
    albums: Album[];
    songs: Song[];
    playlists: Playlist[];
    addUser: (id: string,name: string,type: 'admin' | 'user',foto: string, email: string, pass: string, playlist: Playlist[]) => void,
    changeUser: (id: string,pass: string)=> void,
    addArtist: (id: string,name: string, photo:string) => void,
    addPlaylist: (id: string,name: string, artist: Artist[],songs : Song[]) => void,
    addAlbum: (id: string,name: string,artist: Artist[],songs : Song[]) => void
    addSong: (id: string,name: string,file1: string, photo:string, artist: Artist[])=> void
}
const ProductContext = React.createContext<Context>({
    users: [],
    artists: [],
    albums: [],
    songs: [],
    playlists: [],
    addUser: () => {},
    changeUser: () => {},
    addArtist: () => {},
    addAlbum: () => {},
    addSong: () => {},
    addPlaylist: () => {}
});

export default ProductContext;