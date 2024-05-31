import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import react, { useEffect, useRef, useState, useContext } from 'react';
import "../firebaseConfig";
import bcrypt from 'bcryptjs';
import { collection, addDoc, getFirestore, getDocs, serverTimestamp, query, where, updateDoc } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { useHistory, useParams } from 'react-router';
import { Directory, Filesystem } from "@capacitor/filesystem";
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

interface ArtistProps {
    id: string;
    name: string;
    photoURL: string;
}

const Editartist:React.FC = () => {
    const artistID = useParams<{artistId: string}>().artistId;
    const [artist, setArtist] = useState<ArtistProps | null>({
        id: "",
        name: "",
        photoURL: "",
    });
    const [newArtist, setNewArtist] = useState<ArtistProps | null>({
        id: "",
        name: "",
        photoURL: "",
    })
    const history = useHistory();
    const [fileName,setFilename] = useState('');
    const [selectedFile, setSelectedFile] = useState<File>();
    const storage = getStorage();
    const authContext = useContext(AuthContext) as AuthContextType;
    const { auth, setAuth } = authContext;

    const db = getFirestore();

    const getArtistData = async () => {
        const artistCollectionRef = collection(db, "artist");

        try {
            const snapshot = await getDocs(query(artistCollectionRef));
  
            snapshot.docs.map((doc) => {
                if(doc.id == artistID) {
                    const currentArtistData = {
                        id: doc.id,
                        name: doc.data().name,
                        photoURL: doc.data().photoURL
                    } as ArtistProps;
                    setArtist(currentArtistData)
                    setNewArtist(currentArtistData)
                }
            });
        } catch (error) {
        console.error("Error fetching artist data:", error);
        }
    }

    const handleInputChange = (ev: Event) => {
        const { value, name } = ev.target as HTMLInputElement;
        setNewArtist((prevArtist) => {
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

    const handleUpdateArtist = async () => {
        try {
            const artistCollection = collection(db, "artist");
            const snapshot = await getDocs(query(artistCollection));
            const artistDocRef = snapshot.docs.filter(x => x.id == artistID)[0].ref;
            
            await updateDoc(artistDocRef, {
                name: newArtist?.name,
            });

            if(selectedFile) {
                let pathArtist = decodeURIComponent(snapshot.docs.filter(x => x.id == artistID)[0].data().photoURL.split("/o/")[1].split("?alt=")[0]);
                const photoArtistRef = ref(storage, pathArtist);
                deleteObject(photoArtistRef)

                let downloadURL: string | null = null;
                downloadURL = (await savePhotoToFirebase()) as string;
                await updateDoc(artistDocRef, {
                    photoURL: downloadURL,
                });
            }

            if(artist?.name != newArtist?.name) {
                const albumCollection = collection(db, "album");
                const snapshotAlbum = await getDocs(query(albumCollection));
                const albumDocRef = snapshotAlbum.docs.filter(x => x.data().artistId == artistID);

                albumDocRef.forEach(async (ref) => {
                    await updateDoc(ref.ref, {
                        artist: newArtist?.name,
                    });
                })

                const songCollection = collection(db, "song");
                const snapshotSong = await getDocs(query(songCollection));
                const songDocRef = snapshotSong.docs.filter(x => x.data().artistId == artistID);

                songDocRef.forEach(async (ref) => {
                    await updateDoc(ref.ref, {
                        artist: newArtist?.name,
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
        getArtistData()
    }, [artistID])

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
                                                    <IonInput type="text" name='name' value={newArtist?.name} onIonInput={handleInputChange} />
                                                </IonItem>
                                                <IonItem>
                                                    <img src={newArtist?.photoURL} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan gambar untuk mengganti foto</IonLabel>
                                                </IonItem>
                                                <IonItem>
                                                    <input type="file" onChange={fileChangeHandler}/>
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleUpdateArtist}>Simpan</IonButton>
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
export default Editartist;
