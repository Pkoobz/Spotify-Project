import { IonPage, IonHeader, IonContent, IonBackButton, IonToolbar, IonTitle, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonImg, IonAvatar, IonList, IonIcon } from '@ionic/react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { playBackCircleOutline, playCircleOutline } from 'ionicons/icons';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

interface AlbumProps {
  id: string;
  name: string;
  artistId: string;
  artist: string;
  photoURL: string;
}

const AlbumDetail: React.FC = () => {
  const albumID = useParams<{albumId: string}>().albumId;
  const db = getFirestore();
  const [album, setAlbum] = useState<AlbumProps | null>({
    id: "",
    name: "",
    artistId: "",
    artist: "",
    photoURL: "",
});
  const [song, setSong] = useState<Array<any>>([]);

  async function fetchArtists() {
    try {
      const artistCollectionRef = collection(db, "album");
      const snapshot = await getDocs(query(artistCollectionRef));
      snapshot.docs.forEach(doc => {
        if(doc.id == albumID) {
          const currArtist = {
            id: doc.id,
            name: doc.data().name,
            photoURL: doc.data().photoURL,
          } as AlbumProps;
          setAlbum(currArtist)
        }
      })
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
  }

  async function fetchLagus() {
    try {
      const songCollectionRef = collection(db, "song");
      const snapshot = await getDocs(query(songCollectionRef, where("albumId", "==", albumID)));
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
                      {album && (
                        <>
                          <div style={{display: 'flex'}}>
                            <IonAvatar>
                              <IonImg src={album.photoURL} />
                            </IonAvatar>
                            <h2 style={{margin: 'auto'}}>{album.name}</h2>
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

export default AlbumDetail;
