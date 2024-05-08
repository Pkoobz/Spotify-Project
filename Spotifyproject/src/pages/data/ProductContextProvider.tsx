import React, {useEffect, useState} from 'react';
import ProductContext, {Album, Artist, Playlist, Users, Song} from "./product-context";
import { albums } from 'ionicons/icons';
import { Preferences } from "@capacitor/preferences";

const ProductContextProvider: React.FC<{children: any}> = props => {
    const [users, setUsers] = useState<Users[]>([]);
    
    const addUser = (id: string,name: string,type: 'admin' | 'user',foto: string, email: string, pass: string, _playlist: any) => {
        const newUsers: Users = {
            id,
            name,
            type,
            foto,
            email,
            pass,
            playlist: []
        }
        setUsers(curUsers => {
            return [...curUsers, newUsers];
        });

        const url = "http://localhost/API/insert_new_users.php";
        const formData = new FormData();
        const inId = newUsers.id;
        const inName = newUsers.name;
        const inType = newUsers.type;
        const inFoto = newUsers.foto;
        const inEmail = newUsers.email;
        const inPass = newUsers.pass;
        const inPlaylist = newUsers.playlist;

        formData.append('id', inId);
        formData.append('name', inName);
        formData.append('type', inType);
        formData.append('foto', inFoto);
        formData.append('email', inEmail);
        formData.append('pass', inPass);
        
        fetch(url, {
            method: "post",
            body: formData
        }).then(response => response.text()).then((data) => {
            console.log(data);
        });
    };

    useEffect(() => {
        const stroableUsers = users.map(user => {
            return {
                id: user.id,
                name: user.name,
                type: user.type,
                foto: user.foto,
                email: user.email,
                pass: user.pass
            }
        });
        Preferences.set({key: 'users', value: JSON.stringify(stroableUsers)});
    }, [users]); 

    const changeUser = (id: string, newPass: string) => {
        setUsers(prevUsers => {
            return prevUsers.map(user => {
                if (user.id === id) {
                    return {...user, pass: newPass};
                }
                return user;
            });
        });
    };

    const [songs, setSongs] = useState<Song[]>([]);
    
    const addSong = (id: string,name: string,file1:string,photo: string, _Artist:any) => {
        const newSongs: Song = {
            id,
            name,
            file1,
            photo,
            artist: []
        }
        setSongs(curSongs => {
            return [...curSongs, newSongs];
        });

        const url = "http://localhost/API/insert_new_song.php";
        const formData = new FormData();
        const inId = newSongs.id;
        const inName = newSongs.name;
        const inFile1 = newSongs.file1;
        const inPhoto = newSongs.photo;

        formData.append('id', inId);
        formData.append('name', inName);
        formData.append('file1', inFile1);
        formData.append('photo', inPhoto);        
        fetch(url, {
            method: "post",
            body: formData
        }).then(response => response.text()).then((data) => {
            console.log(data);
        });
    };

    useEffect(() => {
        const stroableSongs = songs.map(song => {
            return {
                id: song.id,
                name: song.name,
                file1: song.file1,
                photo: song.photo
            }
        });
        Preferences.set({key: 'songs', value: JSON.stringify(stroableSongs)});
    }, [songs]);

    const [artists, setArtists] = useState<Artist[]>([]);
    
    const addArtist = (id: string,name: string,photo: string) => {
        const newArtists: Artist = {
            id,
            name,
            photo
        }
        setArtists(curArtists => {
            return [...curArtists, newArtists];
        });

        const url = "http://localhost/API/insert_new_song.php";
        const formData = new FormData();
        const inId = newArtists.id;
        const inName = newArtists.name;
        const inPhoto = newArtists.photo;

        formData.append('id', inId);
        formData.append('name', inName);
        formData.append('photo', inPhoto);        
        fetch(url, {
            method: "post",
            body: formData
        }).then(response => response.text()).then((data) => {
            console.log(data);
        });
    };

    useEffect(() => {
        const stroableArtists = artists.map(artist => {
            return {
                id: artist.id,
                name: artist.name,
                photo: artist.photo
            }
        });
        Preferences.set({key: 'artists', value: JSON.stringify(stroableArtists)});
    }, [artists]);

    const[albums, setAlbums]=useState<Album[]>([]);
    const addAlbum = (id: string,name: string, _Song:any, _Artist:any) => {
        const newAlbums: Album = {
            id,
            name,
            songs:[],
            artist:[]
        }
        setAlbums(curAlbum => {
            return [...curAlbum, newAlbums];
        });

        const url = "http://localhost/API/insert_new_album.php";
        const formData = new FormData();
        const inId = newAlbums.id;
        const inName = newAlbums.name;

        formData.append('id', inId);
        formData.append('name', inName);   
        fetch(url, {
            method: "post",
            body: formData
        }).then(response => response.text()).then((data) => {
            console.log(data);
        });
    };

    useEffect(() => {
        const stroableAlbums = albums.map(album => {
            return {
                id: album.id,
                name: album.name,
            }
        });
        Preferences.set({key: 'albums', value: JSON.stringify(stroableAlbums)});
    }, [albums]);

    const[playlists, setPlaylists]=useState<Playlist[]>([]);
    const addPlaylist = (id: string,name: string,_Song:any) => {
        const newPlaylists: Playlist = {
            id,
            name,
            songs:[]
        }
        setPlaylists(curPlaylist => {
            return [...curPlaylist, newPlaylists];
        });

        const url = "http://localhost/API/insert_new_playlist.php";
        const formData = new FormData();
        const inId = newPlaylists.id;
        const inName = newPlaylists.name;

        formData.append('id', inId);
        formData.append('name', inName);   
        fetch(url, {
            method: "post",
            body: formData
        }).then(response => response.text()).then((data) => {
            console.log(data);
        });
    };

    useEffect(() => {
        const stroablePlaylists = playlists.map(playlist => {
            return {
                id: playlist.id,
                name: playlist.name,
            }
        });
        Preferences.set({key: 'playlists', value: JSON.stringify(stroablePlaylists)});
    }, [playlists]);

    return(
        <ProductContext.Provider value={{
            users,
            albums,
            artists,
            playlists,
            songs,
            addAlbum,
            changeUser,
            addArtist,
            addPlaylist,
            addSong,
            addUser
        }}>
            {props.children}
        </ProductContext.Provider>
    )
}
export default ProductContextProvider;
