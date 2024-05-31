import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState, useContext } from "react";
import { getFirestore, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { useHistory, useParams } from 'react-router';
import { add } from "ionicons/icons";
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

const SearchGenre: React.FC = () => {
    const db = getFirestore();
    const [lagus, setLagu] = useState<Array<any>>([]);
    const [playlists, setPlaylists] = useState<Array<any>>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
    const [openSelect, setOpenSelect] = useState<boolean>(false);
    const genreName = useParams<{genre: string}>().genre;
    const authContext = useContext(AuthContext) as AuthContextType;
    const { auth, setAuth } = authContext;

    const spaceBetween = {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    };

    const addSongToPlaylist = async (playlistId: string, songId: string) => {
        try {
          const playlistCollection = collection(db, "playlist")
          const snapshotPlaylist = await getDocs(query(playlistCollection))
          snapshotPlaylist.docs.forEach( async (doc) => {
            if(doc.id == playlistId) {
                const newSongList = [...doc.data().song, songId]
                await updateDoc(doc.ref, {
                    song: newSongList,
                });
            }
          })
          setOpenSelect(false);
        } catch (error) {
          console.error("Error add to playlist: ", error);
        }
    }

    async function fetchPlaylists() {
        try {
            const userCollection = collection(db, "users");
            const snapshotUser = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
    
            const playlistCollectionRef = collection(db, "playlist");
            const snapshot = await getDocs(query(playlistCollectionRef, where("userId", "==", snapshotUser.docs[0].id)));
            setPlaylists(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                photoURL: doc.data().photoURL
            })));
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    async function fetchRockSongs() {
        try {
            const songCollectionRef = collection(db, "song");
            const snapshot = await getDocs(query(songCollectionRef, where("genre", "==", genreName)));
            setLagu(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                albumId: doc.data().albumId,
                album: doc.data().album,
                artistId: doc.data().artistId,
                artist: doc.data().artist,
                songURL: doc.data().songURL,
                photoURL: doc.data().photoURL,
            })));
        } catch (error) {
            console.error("Error getting rock songs: ", error);
        }
    }

    useEffect(() => {
        fetchPlaylists();
        fetchRockSongs();
    }, []);

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/tab2" />
                        </IonButtons>
                        <IonTitle>{genreName}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                                <IonGrid className='ion-no-padding'>
                                    <IonRow>
                                        <IonCol>
                                            <IonList>
                                                {lagus.map((song, index) => (
                                                    <IonItem key={index}>
                                                        <IonAvatar slot="start">
                                                            <IonImg src={song.photoURL} />
                                                        </IonAvatar>
                                                        <div style={spaceBetween}>
                                                            <IonLabel style={{marginTop: 'auto', marginBottom: 'auto'}}>{song.name}</IonLabel>
                                                            <IonLabel style={{marginTop: 'auto', marginBottom: 'auto'}}>{song.artist}</IonLabel>
                                                            <IonItem>
                                                                <IonSelect label="Add To Playlist" id="addPlaylist" value={selectedPlaylist} 
                                                                    onClick={() => setOpenSelect(true)} 
                                                                    onIonCancel={() => setOpenSelect(false)}
                                                                    onIonChange={(e) => addSongToPlaylist(e.detail.value, song.id)}
                                                                    >
                                                                    {playlists.map((playlist) => (
                                                                        <IonSelectOption key={playlist.id} value={playlist.id}>{playlist.name}</IonSelectOption>
                                                                    ))}
                                                                </IonSelect>
                                                            </IonItem>
                                                        </div>
                                                    </IonItem>
                                                ))}
                                            </IonList>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    )
}

export default SearchGenre;