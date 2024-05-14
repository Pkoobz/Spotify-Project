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

const Genre5:React.FC = () => {
    const db = getFirestore();
    const [hipHopSongs, setHipHopSongs] = useState<Song[]>([]);

    useEffect(() => {
        async function fetchHipHopSongs() {
            try {
                const querySnapshot = await getDocs(collection(db, "lagu"));
                const hipHopSongsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
                const hipHopSongsFiltered = hipHopSongsData.filter(song => song.genre === "Hip Hop");
                setHipHopSongs(hipHopSongsFiltered);
            } catch (error) {
                console.error("Error getting rock songs: ", error);
            }
        }
        fetchHipHopSongs();
    }, [db]);
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/tab2" />
                        </IonButtons>
                        <IonTitle>Hip Hop</IonTitle>
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
                                                {hipHopSongs.map((song, index) => (
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
export default Genre5;