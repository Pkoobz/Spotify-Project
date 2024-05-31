import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import "../firebaseConfig";
import { collection, getFirestore, getDocs, deleteDoc, doc, query, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Admin: React.FC = () => {
    const db = getFirestore();
    const storage = getStorage();
    const [artists, setArtists] = useState<Array<any>>([]);
    const [albums, setAlbums] = useState<Array<any>>([]);
    const [lagus, setLagu] = useState<Array<any>>([]);

    async function fetchArtists() {
        try {
            const artistCollectionRef = collection(db, "artist");
            const snapshot = await getDocs(query(artistCollectionRef));
            setArtists(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                photoURL: doc.data().photoURL
            })));
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    async function fetchAlbums() {
        try {
            const albumCollectionRef = collection(db, "album");
            const snapshot = await getDocs(query(albumCollectionRef));
            setAlbums(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                artistId: doc.data().artistId,
                artist: doc.data().artist,
                totalSongs: doc.data().songs.length,
                photoURL: doc.data().photoURL,
                songs: doc.data().songs,
            })));
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }
    
    async function fetchLagus() {
        try {
            const songCollectionRef = collection(db, "song");
            const snapshot = await getDocs(query(songCollectionRef));
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
            console.error("Error getting documents: ", error);
        }
    }
    
    async function deleteArtist(artistId: string) {
        try {
            let pathArtist = decodeURIComponent(artists.filter((x) => x.id == artistId)[0].photoURL.split("/o/")[1].split("?alt=")[0]);
            const photoArtistRef = ref(storage, pathArtist);
            deleteObject(photoArtistRef)
            await deleteDoc(doc(db, "artist", artistId));
            setArtists(artists.filter(artist => artist.id !== artistId));

            albums.filter((x) => x.artistId == artistId).forEach(async (item:any) => {
                let pathAlbum = decodeURIComponent(item.photoURL.split("/o/")[1].split("?alt=")[0]);
                const photoAlbumRef = ref(storage, pathAlbum);
                deleteObject(photoAlbumRef)
                await deleteDoc(doc(db, "album", item.id));
                setAlbums(albums.filter(album => album.id !== item.id));
            })

            lagus.filter((x) => x.artistId == artistId).forEach(async (item:any) => {
                let pathSong = decodeURIComponent(item.songURL.split("/o/")[1].split("?alt=")[0]);
                let pathSongPhoto = decodeURIComponent(item.photoURL.split("/o/")[1].split("?alt=")[0]);
                const songRef = ref(storage, pathSong)
                const photoSongRef = ref(storage, pathSongPhoto);
                deleteObject(songRef)
                deleteObject(photoSongRef)
                await deleteDoc(doc(db, "song", item.id));
                setLagu(lagus.filter(lagu => lagu.id !== item.id));
            })
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

    async function deleteAlbum(albumId: string) {
        try {
            let pathAlbum = decodeURIComponent(albums.filter((x) => x.id == albumId)[0].photoURL.split("/o/")[1].split("?alt=")[0]);
            const photoAlbumRef = ref(storage, pathAlbum);
            deleteObject(photoAlbumRef)
            await deleteDoc(doc(db, "album", albumId));
            setAlbums(albums.filter(album => album.id !== albumId));

            albums.filter((x) => x.id == albumId)[0]?.songs.forEach(async (id:any) => {
                await deleteDoc(doc(db, "song", id));
                setLagu(lagus.filter(lagu => lagu.id !== id));
            })

            lagus.filter((x) => x.albumId == albumId).forEach(async (item:any) => {
                let pathSong = decodeURIComponent(item.songURL.split("/o/")[1].split("?alt=")[0]);
                let pathSongPhoto = decodeURIComponent(item.photoURL.split("/o/")[1].split("?alt=")[0]);
                const songRef = ref(storage, pathSong)
                const photoSongRef = ref(storage, pathSongPhoto);
                deleteObject(songRef)
                deleteObject(photoSongRef)
                await deleteDoc(doc(db, "song", item.id));
                setLagu(lagus.filter(lagu => lagu.id !== item.id));
            })
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

    async function deleteLagu(laguId: string, albumId: string) {
        try {
            let pathSong = decodeURIComponent(lagus.filter((x) => x.id == laguId)[0].songURL.split("/o/")[1].split("?alt=")[0]);
            let pathPhotoSong = decodeURIComponent(lagus.filter((x) => x.id == laguId)[0].photoURL.split("/o/")[1].split("?alt=")[0]);
            const songRef = ref(storage, pathSong)
            const photoSongRef = ref(storage, pathPhotoSong);
            deleteObject(songRef)
            deleteObject(photoSongRef)
            await deleteDoc(doc(db, "song", laguId));
            setLagu(lagus.filter(lagu => lagu.id !== laguId));

            const albumCollectionRef = collection(db, "album");
            const snapshotAlbum = await getDocs(query(albumCollectionRef));
            const albumDocRef = snapshotAlbum.docs.filter(x => x.id == albumId)[0].ref;
            await updateDoc(albumDocRef, {
                songs: albums.filter((x) => x.id == albumId)[0]?.songs.filter((y:any) => y != laguId)
            });
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

    useEffect(() => {
        fetchArtists();
        fetchAlbums();
        fetchLagus();
    }, []);

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Admin</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                                <IonGrid className='ion-no-padding'>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>Artists</IonLabel>
                                            <table border={1}>
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Nama</th>
                                                        <th>Foto</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {artists.map((artist, index) => (
                                                        <tr key={artist.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{artist.name}</td>
                                                            <td><img src={artist.photoURL} /></td>
                                                            <td><IonButton routerLink={`/editartist/${artist.id}`}>Edit</IonButton></td>
                                                            <td><IonButton onClick={() => deleteArtist(artist.id)}>Delete</IonButton></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <IonButton routerLink='/addartist'>Add Artist</IonButton>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>Albums</IonLabel>
                                            <table border={1}>
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Nama</th>
                                                        <th>Artis</th>
                                                        <th>Foto</th>
                                                        <th>Lagu</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {albums.map((album, index) => (
                                                        <tr key={album.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{album.name}</td>
                                                            <td>{album.artist}</td>
                                                            <td><img src={album.photoURL} /></td>
                                                            <td>{album.totalSongs}</td>
                                                            <td><IonButton routerLink={`/editalbum/${album.id}`}>Edit</IonButton></td>
                                                            <td><IonButton onClick={() => deleteAlbum(album.id)}>Delete</IonButton></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <IonButton routerLink='/addalbum'>Add Album</IonButton>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>Songs</IonLabel>
                                            <table border={1}>
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Nama</th>
                                                        <th>Artis</th>
                                                        <th>Album</th>
                                                        {/* <th>Lagu</th> */}
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {lagus.map((lagu, index) => (
                                                        <tr key={lagu.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{lagu.name}</td>
                                                            <td>{lagu.artist}</td>
                                                            <td>{lagu.album}</td>
                                                            {/* <td> */}
                                                                {/* <audio controls>
                                                                    <source src={lagu.songURL} type="audio/mpeg"></source>
                                                                </audio> */}
                                                                {/* {lagu.laguUrl.endsWith('.mp4,.mp3') ? (
                                                                    <video width="100" controls>
                                                                        <source src={lagu.songUrl} type="video/mp3" />
                                                                        Your browser does not support the video tag.
                                                                        <source src={lagu.songUrl} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : (
                                                                    <audio controls>
                                                                        <source src={lagu.songUrl} type="audio/mpeg" />
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                )} */}
                                                            {/* </td> */}
                                                            <td><IonButton routerLink={`/editsong/${lagu.id}`}>Edit</IonButton></td>
                                                            <td><IonButton onClick={() => deleteLagu(lagu.id, lagu.albumId)}>Delete</IonButton></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <IonButton routerLink='/addsong'>Add Song</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Admin;
