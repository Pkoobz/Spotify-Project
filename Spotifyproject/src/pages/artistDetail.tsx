import { IonPage, IonHeader, IonContent, IonBackButton, IonToolbar, IonTitle, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonImg, IonAvatar, IonList, IonIcon } from '@ionic/react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { playBackCircleOutline, playCircleOutline } from 'ionicons/icons';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const ArtistDetail: React.FC = () => {
  const db = getFirestore();
  const [artists, setArtists] = useState<Array<any>>([]);
  const [lagus, setLagu] = useState<Array<any>>([]);
  const { artistNamaartist } = useParams<{ artistNamaartist: string }>();

  useEffect(() => {
    async function fetchArtists() {
      try {
        const querySnapshot = await getDocs(collection(db, "artists"));
        setArtists(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    }
    fetchArtists();
  }, [db]);

  
  const filteredArtist = artists.find(artist => artist.namaartist === artistNamaartist);
  useEffect(() => {
    async function fetchLagus() {
      try {
        const laguQuerySnapshot = await getDocs(collection(db, "lagu"));
        const laguData = laguQuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const filteredLagus = laguData.filter(lagu => lagu.namaartist === filteredArtist?.namaartist);
        setLagu(filteredLagus);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    }
    if (filteredArtist) {
      fetchLagus();
    }
  }, [db, filteredArtist]);

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
                      {filteredArtist && (
                        <>
                          <IonAvatar>
                            <IonImg src={filteredArtist.fotoUrl} />
                          </IonAvatar>
                          <h2>{filteredArtist.namaartist}</h2>
                          {lagus.map((lagu, index) => (
                            <IonList key={index + 1}>
                              <IonItem className='ion-padding'>
                                <IonButtons slot='start'>
                                  <IonAvatar>
                                    <IonImg src={lagu.fotoUrl} />
                                  </IonAvatar>
                                </IonButtons>
                                <IonLabel>
                                  <h1>{lagu.namalagu}</h1>
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
