import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import "../firebaseConfig";
import { collection, getFirestore, getDocs, deleteDoc, doc } from "firebase/firestore";

const Admin: React.FC = () => {
    const db = getFirestore();
    const [artists, setArtists] = useState<Array<any>>([]);
    const [lagus, setLagu] = useState<Array<any>>([]);
    const [albums, setAlbum] = useState<Array<any>>([]);

    useEffect(() => {
        async function fetchArtists() {
            try {
                const querySnapshot = await getDocs(collection(db, "artists"));
                setArtists(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        }
        fetchArtists();
    }, [db]);

    useEffect(() => {
        async function fetchLagus() {
            try {
                const querySnapshot0 = await getDocs(collection(db, "lagu"));
                setLagu(querySnapshot0.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        }
        fetchLagus();
    }, [db]);

    useEffect(() => {
        async function fetchAlbums() {
            try {
                const querySnapshot1 = await getDocs(collection(db, "album"));
                setAlbum(querySnapshot1.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        }
        fetchAlbums();
    }, [db]);

    async function deleteArtist(artistId: string) {
        try {
            await deleteDoc(doc(db, "artists", artistId));
            setArtists(artists.filter(artist => artist.id !== artistId));
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

    async function deleteLagu(laguId: string) {
        try {
            await deleteDoc(doc(db, "lagu", laguId));
            setLagu(lagus.filter(lagu => lagu.id !== laguId));
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

    async function deleteAlbum(albumId: string) {
        try {
            await deleteDoc(doc(db, "album", albumId));
            setAlbum(albums.filter(album => album.id !== albumId));
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }

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
                                            <IonButton routerLink='/addartist'>Add Artist</IonButton>
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
                                                            <td>{artist.namaartist}</td>
                                                            <td><img src={artist.fotoUrl} alt={artist.namaartist} /></td>
                                                            <td><IonButton routerLink={`/admin/${artist.id}`}>Edit</IonButton></td>
                                                            <td><IonButton onClick={() => deleteArtist(artist.id)}>Delete</IonButton></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton routerLink='/addsong'>Add Song</IonButton>
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
                                                    {lagus.map((lagu, index) => (
                                                        <tr key={lagu.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{lagu.namalagu}</td>
                                                            <td>{lagu.namaartist}</td>
                                                            <td><img src={lagu.fotoUrl} alt={lagu.namalagu} /></td>
                                                            <td>
                                                                {lagu.laguUrl.endsWith('.mp4') ? (
                                                                    <video width="100" controls>
                                                                        <source src={lagu.laguUrl} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : (
                                                                    <audio controls>
                                                                        <source src={lagu.laguUrl} type="audio/mpeg" />
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                )}
                                                            </td>
                                                            <td><IonButton routerLink={`/admin/${lagu.id}`}>Edit</IonButton></td>
                                                            <td><IonButton onClick={() => deleteLagu(lagu.id)}>Delete</IonButton></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton routerLink='/addalbum'>Add Album</IonButton>
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
                                                            <td>{album.namaalbum}</td>
                                                            <td>{album.namaartist}</td>
                                                            <td><img src={album.fotoUrl2} alt={album.namaalbum} /></td>
                                                            <td><img src={album.fotoUrl3} alt={album.namaalbum} /></td>
                                                            <td><IonButton routerLink={`/admin/${album.id}`}>Edit</IonButton></td>
                                                            <td><IonButton onClick={() => deleteAlbum(album.id)}>Delete</IonButton></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
