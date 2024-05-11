import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import react, { useEffect, useRef, useState } from 'react';
import "../firebaseConfig";
import bcrypt from 'bcryptjs';
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router';

const Addartist:React.FC = () => {
    const history = useHistory();
    const namaartist = useRef<HTMLIonInputElement>(null);
    const [fileName,setFilename] = useState('');
    const [selectedFile, setSelectedFile] = useState<File>();
    const storage = getStorage();
    console.log(storage)

    const db = getFirestore();
    console.log(db)
    const [artists,setArtists] = useState<Array<any>>([]);

    const addArtist = async(url: string) => {
        try {
                const docRef = await addDoc(collection(db, "artists"), {
                    namaartist: namaartist.current?.value,
                    foto: fileName,
                    fotoUrl: url
                });
                console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    
    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target!.files![0]);
        setFilename(event.target!.files![0].name);
    };

    const insertHandler0 = async() => {
        const storageRef = ref(storage, fileName);
        
        uploadBytes(storageRef, selectedFile as Blob).then(() => {
            console.log('upload file success');
            getDownloadURL(ref(storage, fileName)).then((url) =>{
                addArtist(url);
            })
            history.push('/admin');
        })
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
                                                    <IonLabel>Masukkan nama artist</IonLabel>
                                                    <IonInput type="text" ref={namaartist} />
                                                </IonItem>
                                                <IonItem>
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
export default Addartist;
