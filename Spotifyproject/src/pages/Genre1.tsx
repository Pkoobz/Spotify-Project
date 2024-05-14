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

const Genre1:React.FC = () => {
    const db = getFirestore();
    const [popSongs, setPopSongs] = useState<Song[]>([]);

    useEffect(() => {
        async function fetchPopSongs() {
            try {
                const querySnapshot = await getDocs(collection(db, "lagu"));
                const popSongsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
                const popSongsFiltered = popSongsData.filter(song => song.genre === "Pop");
                setPopSongs(popSongsFiltered);
            } catch (error) {
                console.error("Error getting Pop songs: ", error);
            }
        }
        fetchPopSongs();
    }, [db]);
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/tab2" />
                        </IonButtons>
                        <IonTitle>Pop</IonTitle>
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
                                                {popSongs.map((song, index) => (
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
export default Genre1;