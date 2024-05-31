import { IonPage, IonHeader, IonContent, IonBackButton, IonToolbar, IonTitle, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonImg, IonAvatar, IonList, IonIcon } from '@ionic/react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { playBackCircleOutline, playCircleOutline } from 'ionicons/icons';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

interface ArtistProps {
  id: string;
  name: string;
  photoURL: string;
}

const ArtistDetail: React.FC = () => {
  const artistID = useParams<{artistId: string}>().artistId;
  const db = getFirestore();
  const [artist, setArtist] = useState<ArtistProps | null>({
    id: "",
    name: "",
    photoURL: "",
});
  const [song, setSong] = useState<Array<any>>([]);

  async function fetchArtists() {
    try {
      const artistCollectionRef = collection(db, "artist");
      const snapshot = await getDocs(query(artistCollectionRef));
      snapshot.docs.forEach(doc => {
        if(doc.id == artistID) {
          const currArtist = {
            id: doc.id,
            name: doc.data().name,
            photoURL: doc.data().photoURL,
          } as ArtistProps;
          setArtist(currArtist)
        }
      })
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
  }

  async function fetchLagus() {
    try {
      const songCollectionRef = collection(db, "song");
      const snapshot = await getDocs(query(songCollectionRef, where("artistId", "==", artistID)));
      setSong(snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          albumId: doc.data().albumId,
          album: doc.data().album,
          artistId: doc.data().artistId,
          artist: doc.data().artist,
          songURL: doc.data().songURL,
          photoURL: doc.data().photoURL,
      })));
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  useEffect(() => {
    fetchArtists();
    fetchLagus();
  }, [db]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonBackButton defaultHref='/tab1' />
            </IonButtons>
            <IonTitle>Detail Artist</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonGrid>
            <IonRow>
              <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                <IonGrid className='ion-no-padding'>
                  <IonRow className='ion-text-center'>
                    <IonCol>
                      {artist && (
                        <>
                          <div style={{display: 'flex'}}>
                            <IonAvatar>
                              <IonImg src={artist.photoURL} />
                            </IonAvatar>
                            <h2 style={{margin: 'auto'}}>{artist.name}</h2>
                          </div>
                          {song.map((lagu, index) => (
                            <IonList key={index + 1}>
                              <IonItem className='ion-padding' routerLink={`/play/${lagu.id}`}>
                                <IonButtons slot='start'>
                                  <IonAvatar>
                                    <IonImg src={lagu.photoURL} />
                                  </IonAvatar>
                                </IonButtons>
                                <IonLabel>
                                  <h1>{lagu.name}</h1>
                                  <h4>{lagu.genre}</h4>  
                                </IonLabel>
                                <IonButtons slot='end'>
                                  <IonButton><IonIcon icon={playCircleOutline} /></IonButton>
                                </IonButtons>
                              </IonItem>
                            </IonList>
                          ))}
                        </>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ArtistDetail;
