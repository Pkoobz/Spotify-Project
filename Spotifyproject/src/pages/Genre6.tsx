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

const Genre6:React.FC = () => {
    const db = getFirestore();
    const [indieSongs, setIndieSongs] = useState<Song[]>([]);

    useEffect(() => {
        async function fetchIndieSongs() {
            try {
                const querySnapshot = await getDocs(collection(db, "lagu"));
                const indieSongsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
                const indieSongsFiltered = indieSongsData.filter(song => song.genre === "Indie");
                setIndieSongs(indieSongsFiltered);
            } catch (error) {
                console.error("Error getting rock songs: ", error);
            }
        }
        fetchIndieSongs();
    }, [db]);
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/tab2" />
                        </IonButtons>
                        <IonTitle>Indie</IonTitle>
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
                                                {indieSongs.map((song, index) => (
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
export default Genre6;