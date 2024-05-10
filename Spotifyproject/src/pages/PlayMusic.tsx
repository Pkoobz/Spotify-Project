import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonToggle, IonTitle, IonProgressBar } from "@ionic/react";
import { arrowDownOutline, ellipsisVertical, pauseOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import './PlayMusic.css';

const Playmusic = () => {
    const [progress, setProgress] = useState(0); 
    const handlePause = () => {
    };

  useEffect(() => {
    const song = {
      duration: 200, 
      currentTime: 0
    };

    const interval = setInterval(() => {
      setProgress(song.currentTime / song.duration);
      song.currentTime++;
    }, 1000);

    return () => clearInterval(interval);
  }, []);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/YourLibrary">
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
                <IonProgressBar value={progress}></IonProgressBar> 
                <IonButton onClick={handlePause}>
                    <IonIcon slot="icon-only" icon={pauseOutline} />
                </IonButton> 
            </IonContent>
        </IonPage>

    );
};

export default Playmusic;