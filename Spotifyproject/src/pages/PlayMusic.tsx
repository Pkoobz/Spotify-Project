import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonToggle, IonTitle } from "@ionic/react";
import { arrowDownOutline, ellipsisVertical } from "ionicons/icons";
import './PlayMusic.css';

const Playmusic = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton>
                            <IonIcon slot="icon-only" icon={arrowDownOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="playlist-name">PLAYING FROM PLAYLIST</IonTitle>
                    <IonTitle className="playlist-name">Pinecone</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon slot="icon-only" icon={ellipsisVertical} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonItem>
                        <IonLabel>Notifications</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Logout</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>

    );
};

export default Playmusic;