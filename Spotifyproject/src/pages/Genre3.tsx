import { IonAvatar, IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface Song {
    id: string;
    namalagu: string;
    namaartist: string;
    fotoUrl: string;
    genre: string;
}

const Genre3:React.FC = () => {
    const db = getFirestore();
    const [classicalSongs, setClassicalSongs] = useState<Song[]>([]);

    useEffect(() => {
        async function fetchClassicalSongs() {
            try {
                const querySnapshot = await getDocs(collection(db, "lagu"));
                const classicalSongsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
                const classicalSongsFiltered = classicalSongsData.filter(song => song.genre === "Classical");
                setClassicalSongs(classicalSongsFiltered);
            } catch (error) {
                console.error("Error getting Classical songs: ", error);
            }
        }
        fetchClassicalSongs();
    }, [db]);
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/tab2" />
                        </IonButtons>
                        <IonTitle>Classical</IonTitle>
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
                                                {classicalSongs.map((song, index) => (
                                                    <IonItem key={index}>
                                                        <IonAvatar slot="start">
                                                            <IonImg src={song.fotoUrl} />
                                                        </IonAvatar>
                                                        <IonLabel>{song.namalagu}</IonLabel>
                                                        <h5>{song.namaartist}</h5>
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
export default Genre3;