import React, { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { cameraOutline } from 'ionicons/icons';
import { collection, getDocs, getFirestore, query, orderBy } from 'firebase/firestore';

const Tab1: React.FC = () => {
  const [artists, setArtists] = useState<Array<any>>([]);
  const [lagus, setLagu] = useState<Array<any>>([]);
  const [newSongs, setNewSongs] = useState<Array<any>>([]);
  const [newArtists, setNewArtists] = useState<Array<any>>([]);

  const db = getFirestore();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("uid", uid);
      } else {
        console.log("user is logged out");
      }
    });
  }, []);

  useEffect(() => {
    const fetchLagus = async () => {
      try {
        const querySnapshot0 = await getDocs(collection(db, "lagu"));
        const laguList = querySnapshot0.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        if (laguList.length > 0) {
          setLagu(laguList);
        }
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    fetchLagus();
  }, [db]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artists"));
        const artistList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        if (artistList.length > 0) {
          setArtists(artistList);
        }
      } catch (error) {
        console.error("Error getting artists: ", error);
      }
    };
    fetchArtists();
  }, [db]);

  useEffect(() => {
    const fetchNewSongs = async () => {
      try {
        const newSongsQuery = query(collection(db, "lagu"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(newSongsQuery);
        const newSongsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setNewSongs(newSongsList);
      } catch (error) {
        console.error("Error getting new songs: ", error);
      }
    };
    fetchNewSongs();
  }, [db]);

  useEffect(() => {
    const fetchNewArtists = async () => {
      try {
        const newArtistsQuery = query(collection(db, "artists"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(newArtistsQuery);
        const newArtistsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setNewArtists(newArtistsList);
      } catch (error) {
        console.error("Error getting new artists: ", error);
      }
    };
    fetchNewArtists();
  }, [db]);

  function shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow>
            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
              <IonGrid className='ion-no-padding'>
                <IonRow>
                  <IonCol>
                    <IonAvatar>
                      <img alt="abc" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                  </IonCol>
                </IonRow>
                <br />
                <IonRow>
                  <IonCol>
                    <h1>Recommended songs</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{ draggable: true }}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {shuffleArray(lagus).slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src={lagu.fotoUrl} />
                            </div>
                            <h5>{lagu.namalagu}</h5>
                            <p className='user-testimonials'><i>{lagu.namaartist}</i></p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <h1>Recently played</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{ draggable: true }}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {lagus.slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src={lagu.fotoUrl} />
                            </div>
                            <h5>{lagu.namalagu}</h5>
                            <p className='user-testimonials'><i>{lagu.namaartist}</i></p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <h1>Album from every artist</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{ draggable: true }}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {lagus.slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src={lagu.fotoUrl} />
                            </div>
                            <h5>{lagu.namalagu}</h5>
                            <p className='user-testimonials'><i>{lagu.namaartist}</i></p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <h1>New songs</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{ draggable: true }}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {newSongs.slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src={lagu.fotoUrl} />
                            </div>
                            <h5>{lagu.namalagu}</h5>
                            <p className='user-testimonials'><i>{lagu.namaartist}</i></p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <h1>New artists</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{ draggable: true }}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {newArtists.slice(0, 5).map(artist => (
                        <SwiperSlide key={artist.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src={artist.fotoUrl} />
                            </div>
                            <h5>{artist.namaartist}</h5>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
