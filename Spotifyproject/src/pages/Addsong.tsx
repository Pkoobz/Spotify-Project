import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import react, { useEffect, useRef, useState } from 'react';
import "../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs, doc} from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router';

const Addsong:React.FC = () => {
    const history = useHistory();
    const namalagu = useRef<HTMLIonInputElement>(null);
    const [fileName0,setFilename0] = useState('');
    const [fileName1,setFilename1] = useState('');
    const [selectedFile0, setSelectedFile0] = useState<File>();
    const [selectedFile1, setSelectedFile1] = useState<File>();
    const [selectedArtist, setSelectedArtist] = useState<string>(''); // State to hold the selected artist
    const storage = getStorage();
    console.log(storage)
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

    const addLagu = async(url: string) => {
        try {
            await addDoc(collection(db, "lagu"), {
                namalagu: namalagu.current?.value,
                namaartist: selectedArtist, // Use selected artist's name
                foto0: fileName0,
                fotoUrl0: url,
                foto1: fileName1,
                fotoUrl1: url,
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

    const insertHandler0 = async() => {
        if (selectedFile0 && selectedFile1 && selectedArtist) {
            const storageRef0 = ref(storage, fileName0);
            const storageRef1 = ref(storage, fileName1);
            Promise.all([
                uploadBytes(storageRef0, selectedFile0),
                uploadBytes(storageRef1, selectedFile1)
            ]).then(() => {
                console.log('upload files success');
                getDownloadURL(storageRef0).then((url) =>{
                    addLagu(url);
                    
            history.push('/admin');
                }).catch((error) => {
                    console.error("Error getting download URL: ", error);
                });
            }).catch((error) => {
                console.error("Error uploading files: ", error);
            });
        }
    };

    return(
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
                                                    <IonLabel>Masukkan file lagu</IonLabel>
                                                    <input type="file" onChange={fileLaguChangeHandler}/>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan foto lagu</IonLabel>
                                                    <input type="file" onChange={fileChangeHandler}/>
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
