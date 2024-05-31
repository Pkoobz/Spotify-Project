import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import react, { useEffect, useRef, useState, useContext } from 'react';
import "../firebaseConfig";
import bcrypt from 'bcryptjs';
import { collection, addDoc, getFirestore, getDocs, serverTimestamp, query, where, Timestamp } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router';
import { Directory, Filesystem } from "@capacitor/filesystem";
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

interface ArtistProps {
    name: string;
    photoURL: string;
}

const Addartist:React.FC = () => {
    const [artist, setArtist] = useState<ArtistProps | null>({
        name: "",
        photoURL: "",
    });
    const history = useHistory();
    const namaartist = useRef<HTMLIonInputElement>(null);
    const [fileName,setFilename] = useState('');
    const [selectedFile, setSelectedFile] = useState<File>();
    const storage = getStorage();
    const authContext = useContext(AuthContext) as AuthContextType;
    const { auth, setAuth } = authContext;

    const db = getFirestore();

    const handleInputChange = (ev: Event) => {
        const { value, name } = ev.target as HTMLInputElement;
        setArtist((prevArtist) => {
          if (!prevArtist) {
            return null;
          }
          return {
            ...prevArtist,
            [name]: value,
          };
        });
    };
    
    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target!.files![0]);
        setFilename(event.target!.files![0].name);
    };

    const savePhotoToFirebase = async () => {
        try {
          const storageRef = ref(
            storage,
            `artist_photo/${artist?.name}/${fileName}`
          );

          await uploadBytes(storageRef, selectedFile as Blob);
    
          return await getDownloadURL(storageRef);
        } catch (error) {
          return error;
        }
    };

    const handleSaveArtist = async () => {
        if (artist?.name &&!selectedFile) {
            return;
        }
        try {
            let downloadURL: string | null = null;
            downloadURL = (await savePhotoToFirebase()) as string;
            await addDoc(collection(db, "artist"), {
                name: artist?.name,
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

    const addArtist = async(url: string) => {
        try {
                const docRef = await addDoc(collection(db, "artists"), {
                    namaartist: namaartist.current?.value,
                    foto: fileName,
                    fotoUrl: url,
                    timestamp: serverTimestamp()
                });
                console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
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
                                                    <IonInput type="text" name='name' onIonInput={handleInputChange} />
                                                </IonItem>
                                                <IonItem>
                                                    <input type="file" onChange={fileChangeHandler}/>
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleSaveArtist}>Simpan</IonButton>
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
