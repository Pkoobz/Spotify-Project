import React, { useContext, useEffect, useState } from 'react';
import { IonApp, IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPage, IonThumbnail} from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const History: React.FC = () => {
  const [historySong, setHistorySong] = useState<Array<any>>([]);
  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth, setAuth } = authContext;
  const db = getFirestore();

  const fetchHistory = async () => {
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(query(usersCollection, where("uid", "==", auth?.uid)));

      let history = snapshot.docs[0].data().history;

      const songCollectionRef = collection(db, "song");
      const snapshotSong = await getDocs(query(songCollectionRef));
      snapshotSong.docs.forEach(doc => {
        if(history.includes(doc.id)) {
          setHistorySong((prevSong) => [
            ...prevSong,
            {
              id: doc.id,
              name: doc.data().name,
              albumId: doc.data().albumId,
              album: doc.data().album,
              artistId: doc.data().artistId,
              artist: doc.data().artist,
              songURL: doc.data().songURL,
              photoURL: doc.data().photoURL,
            }
          ])
        }
      })
    } catch (error) {
      console.error("Error getting history: ", error);
    }
  }

  useEffect(() => {
    if(historySong.length == 0) fetchHistory();
  }, [])

  return (
  <>
  <IonPage>
    <IonCard>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start" >
          <IonBackButton defaultHref="/YourLibrary" />
          </IonButtons>
          <IonTitle>History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonCardContent>
        <IonList>
          {/* <IonTitle>Jumat, 3 Mei 2024</IonTitle> */}
          {historySong.slice(0, historySong.length / 2).map(lagu => (
            <IonItem routerLink={`/play/${lagu.id}`}>
              <IonThumbnail slot="start">
                <img src={lagu.photoURL} />
              </IonThumbnail>
              <IonLabel>{lagu.name}</IonLabel>
              <IonCardSubtitle>{lagu.artist}</IonCardSubtitle>
              <IonCard color="dark"></IonCard>
            </IonItem>
          ))}

          {/* <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu B" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu B</IonLabel>
            <IonCardSubtitle>Penyanyi B</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu C" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu C</IonLabel>
            <IonCardSubtitle>Penyanyi C</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Heya" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Heya</IonLabel>
            <IonCardSubtitle>IVE</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>
          <IonTitle>Sabtu, 4 Mei 2024</IonTitle>
          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu E" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu E</IonLabel>
            <IonCardSubtitle>Penyanyi Z</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu F" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu F</IonLabel>
            <IonCardSubtitle>Penyanyi V</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem> */}

        </IonList>
      </IonCardContent>
    </IonCard>
    </IonPage>
  </>
  )
}


export default History;
