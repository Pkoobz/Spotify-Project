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

const Genre4:React.FC = () => {
    const db = getFirestore();
    const [a80sSongs, setA80sSongs] = useState<Song[]>([]);

    useEffect(() => {
        async function fetchA80sSongs() {
            try {
                const querySnapshot = await getDocs(collection(db, "lagu"));
                const a80sSongsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
                const a80sSongsFiltered = a80sSongsData.filter(song => song.genre === "80's");
                setA80sSongs(a80sSongsFiltered);
            } catch (error) {
                console.error("Error getting 80's songs: ", error);
            }
        }
        fetchA80sSongs();
    }, [db]);
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/tab2" />
                        </IonButtons>
                        <IonTitle>80's</IonTitle>
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
                                                {a80sSongs.map((song, index) => (
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
export default Genre4;