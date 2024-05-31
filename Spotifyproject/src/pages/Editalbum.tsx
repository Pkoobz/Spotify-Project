import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getFirestore, getDocs, serverTimestamp, query, updateDoc } from "firebase/firestore"; // Import serverTimestamp
import { useHistory, useParams } from 'react-router';
import "../firebaseConfig";

interface AlbumProps {
    id: string;
    name: string;
    artistId: string;
    artist: string;
    photoURL: string;
}

const Editalbum: React.FC = () => {
    const albumID = useParams<{albumId: string}>().albumId;
    const [album, setAlbum] = useState<AlbumProps>({
        id: "",
        name: "",
        artistId: "",
        artist: "",
        photoURL: "",
    });
    const [newAlbum, setNewAlbum] = useState<AlbumProps>({
        id: "",
        name: "",
        artistId: "",
        artist: "",
        photoURL: "",
    });
    const history = useHistory();
    const [fileName0, setFilename0] = useState('');
    const [selectedFile0, setSelectedFile0] = useState<File>();
    const [selectedArtist, setSelectedArtist] = useState<string>('');
    const storage = getStorage();
    const db = getFirestore();
    const [artists, setArtists] = useState<Array<any>>([]);

    async function getData() {
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

    const getAlbumData = async () => {
        const albumCollectionRef = collection(db, "album");

        try {
            const snapshot = await getDocs(query(albumCollectionRef));
  
            snapshot.docs.map((doc) => {
                if(doc.id == albumID) {
                    const currentAlbumData = {
                        id: doc.id,
                        name: doc.data().name,
                        artistId: doc.data().artistId,
                        artist: doc.data().artist,
                        photoURL: doc.data().photoURL
                    } as AlbumProps;
                    setAlbum(currentAlbumData)
                    setNewAlbum(currentAlbumData)
                    setSelectedArtist(doc.data().artistId)
                }
            });
        } catch (error) {
        console.error("Error fetching artist data:", error);
        }
    }

    const handleInputChange = (ev: Event) => {
        const { value, name } = ev.target as HTMLInputElement;
        setNewAlbum((prevNewAlbum) => ({
          ...prevNewAlbum,
          [name]: value,
        }));
    };

    const savePhotoToFirebase = async () => {
        try {
          const storageRef = ref(
            storage,
            `album_photo/${album?.name}/${fileName0}`
          );

          await uploadBytes(storageRef, selectedFile0 as Blob);
    
          return await getDownloadURL(storageRef);
        } catch (error) {
          return error;
        }
    };

    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile0(event.target.files![0]);
        setFilename0(event.target.files![0].name);
    };

    const handleUpdateAlbum = async () => {
        if (album?.name == newAlbum?.name && 
            album?.artistId == selectedArtist && 
            !selectedFile0) return

        try {
            const albumCollection = collection(db, "album");
            const snapshot = await getDocs(query(albumCollection));
            const albumDocRef = snapshot.docs.filter(x => x.id == albumID)[0].ref;
            
            await updateDoc(albumDocRef, {
                name: newAlbum?.name,
                artistId: selectedArtist,
                artist: artists.filter((x) => x.id == selectedArtist)[0]?.name,
            });

            if(selectedFile0) {
                let pathAlbum = decodeURIComponent(snapshot.docs.filter(x => x.id == albumID)[0].data().photoURL.split("/o/")[1].split("?alt=")[0]);
                const photoAlbumRef = ref(storage, pathAlbum);
                deleteObject(photoAlbumRef)

                let downloadURL: string | null = null;
                downloadURL = (await savePhotoToFirebase()) as string;
                await updateDoc(albumDocRef, {
                    photoURL: downloadURL,
                });
            }

            if(album?.name != newAlbum?.name) {
                const songCollection = collection(db, "song");
                const snapshotSong = await getDocs(query(songCollection));
                const songDocRef = snapshotSong.docs.filter(x => x.data().albumId == albumID);

                songDocRef.forEach(async (ref) => {
                    await updateDoc(ref.ref, {
                        album: newAlbum?.name,
                    });
                })
            }
            
            if(album?.artistId != selectedArtist) {
                const songCollection = collection(db, "song");
                const snapshotSong = await getDocs(query(songCollection));
                const songDocRef = snapshotSong.docs.filter(x => x.data().albumId == albumID);

                songDocRef.forEach(async (ref) => {
                    await updateDoc(ref.ref, {
                        artistId: artists.filter((x) => x.id == selectedArtist)[0]?.id,
                        artist: artists.filter((x) => x.id == selectedArtist)[0]?.name,
                    });
                })
            }
            history.push('/admin');
        } catch (error) {
            console.log("GAGAL")
        } finally {
            console.log("BERHASIL")
        }
    }

    useEffect(() => {
        getAlbumData();
        getData();
    }, [])

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
                                            <IonItemGroup>
                                                <IonItem>
                                                    <IonLabel>Masukkan nama album</IonLabel>
                                                    <IonInput type="text" name="name" value={newAlbum?.name} onIonInput={handleInputChange} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Pilih nama artis</IonLabel>
                                                    <IonSelect value={selectedArtist} onIonChange={(e) => setSelectedArtist(e.detail.value)}>
                                                        {artists.map((artist) => (
                                                            <IonSelectOption key={artist.id} value={artist.id}>{artist.name}</IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan gambar untuk mengganti foto</IonLabel>
                                                </IonItem>
                                                <IonItem>
                                                    <img src={album?.photoURL} />
                                                </IonItem>
                                                <IonItem>
                                                    <input type="file" onChange={fileChangeHandler} />
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleUpdateAlbum}>Simpan</IonButton>
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
};

export default Editalbum;
