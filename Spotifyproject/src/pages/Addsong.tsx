import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { useHistory } from 'react-router';
import "../firebaseConfig";

const Addsong: React.FC = () => {
    const history = useHistory();
    const namalagu = useRef<HTMLIonInputElement>(null);
    const [fileName0, setFilename0] = useState('');
    const [fileName1, setFilename1] = useState('');
    const [selectedFile0, setSelectedFile0] = useState<File>();
    const [selectedFile1, setSelectedFile1] = useState<File>();
    const [selectedArtist, setSelectedArtist] = useState<string>('');
    const storage = getStorage();
    const db = getFirestore();
    const [artists, setArtists] = useState<Array<any>>([]);

    useEffect(() => {
        async function getData() {
            try {
                const querySnapshot = await getDocs(collection(db, "artists"));
                setArtists(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        }
        getData();
    }, [db]);

    const addLagu = async (urlFoto: string, urlLagu: string) => {
        try {
            await addDoc(collection(db, "lagu"), {
                namalagu: namalagu.current?.value,
                namaartist: selectedArtist,
                fotoUrl: urlFoto,
                laguUrl: urlLagu,
            });
            console.log("Song added successfully");
            history.push('/admin');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile0(event.target.files![0]);
        setFilename0(event.target.files![0].name);
    };

    const fileLaguChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile1(event.target.files![0]);
        setFilename1(event.target.files![0].name);
    };

    const insertHandler0 = async () => {
        if (selectedFile0 && selectedFile1 && selectedArtist) {
            const storageRef0 = ref(storage, fileName0);
            const storageRef1 = ref(storage, fileName1);
            Promise.all([
                uploadBytes(storageRef0, selectedFile0),
                uploadBytes(storageRef1, selectedFile1)
            ]).then(() => {
                console.log('upload files success');
                Promise.all([
                    getDownloadURL(storageRef0),
                    getDownloadURL(storageRef1)
                ]).then(([urlFoto, urlLagu]) => {
                    addLagu(urlFoto, urlLagu);
                }).catch((error) => {
                    console.error("Error getting download URL: ", error);
                });
            }).catch((error) => {
                console.error("Error uploading files: ", error);
            });
        }
    };

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
                                                    <IonLabel>Masukkan nama lagu</IonLabel>
                                                    <IonInput type="text" ref={namalagu} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Pilih nama artis</IonLabel>
                                                    <IonSelect value={selectedArtist} onIonChange={(e) => setSelectedArtist(e.detail.value)}>
                                                        {artists.map((artist) => (
                                                            <IonSelectOption key={artist.id} value={artist.namaartist}>{artist.namaartist}</IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan lagunya</IonLabel>
                                                    <input type="file" accept=".mp4" onChange={fileLaguChangeHandler} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan foto lagu</IonLabel>
                                                    <input type="file" onChange={fileChangeHandler} />
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={insertHandler0}>Simpan</IonButton>
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

export default Addsong;
