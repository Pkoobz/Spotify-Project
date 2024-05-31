import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore, getDocs, serverTimestamp, query, Timestamp } from "firebase/firestore"; // Import serverTimestamp
import { useHistory } from 'react-router';
import "../firebaseConfig";

interface AlbumProps {
    name: string;
    photoURL: string;
}

const Addalbum: React.FC = () => {
    const [album, setAlbum] = useState<AlbumProps>({
        name: "",
        photoURL: "",
    });
    const history = useHistory();
    const [fileName0, setFilename0] = useState('');
    const [selectedFile0, setSelectedFile0] = useState<File>();
    const [selectedArtist, setSelectedArtist] = useState<string>('');
    const storage = getStorage();
    const db = getFirestore();
    const [artists, setArtists] = useState<Array<any>>([]);

    useEffect(() => {
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
        getData();
    }, [db]);

    const handleInputChange = (ev: Event) => {
        const { value, name } = ev.target as HTMLInputElement;
        setAlbum((prevAlbum) => ({
          ...prevAlbum,
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

    const handleSaveAlbum = async () => {
        if(!selectedArtist &&!selectedFile0) return

        try {
            let downloadURL: string | null = null;
            downloadURL = (await savePhotoToFirebase()) as string;
            await addDoc(collection(db, "album"), {
                name: album?.name,
                artistId: selectedArtist,
                artist: artists.filter((x) => x.id == selectedArtist)[0]?.name,
                songs: [],
                photoURL: downloadURL,
                createdAt: Timestamp.now(),
            });
            history.push('/admin');
        } catch (error) {
            console.log("GAGAL")
        } finally {
            console.log("BERHASIL")
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
                                            <IonItemGroup>
                                                <IonItem>
                                                    <IonLabel>Masukkan nama album</IonLabel>
                                                    <IonInput type="text" name="name" onIonInput={handleInputChange} />
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
                                                    <IonLabel>Masukkan foto album</IonLabel>
                                                    <input type="file" onChange={fileChangeHandler} />
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleSaveAlbum}>Simpan</IonButton>
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

export default Addalbum;
