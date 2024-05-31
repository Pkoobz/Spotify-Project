import React, { useEffect, useState, useContext } from 'react';
import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonPopover, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { cameraOutline, ellipsisVerticalCircleOutline, ellipsisVerticalOutline, heartOutline,newspaperOutline, heart} from 'ionicons/icons';
import { collection, getDocs, getFirestore, query, orderBy, where, updateDoc } from 'firebase/firestore';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

const Tab1: React.FC = () => {
  const [artists, setArtists] = useState<Array<any>>([]);
  const [lagus, setLagu] = useState<Array<any>>([]);
  const [albums, setAlbums] = useState<Array<any>>([]);
  const [newSongs, setNewSongs] = useState<Array<any>>([]);
  const [newArtists, setNewArtists] = useState<Array<any>>([]);
  const [likedAlbum, setLikedAlbum] = useState<Array<any>>([]);
  const [likedArtist, setLikedArtist] = useState<Array<any>>([]);
  
  const history = useHistory();
  // const location = useLocation();
  // const profilePic = (location.state as any).profilePic;
  const db = getFirestore();
  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth, setAuth } = authContext;

  const spaceBetween = {
    display: "flex",
    justifyContent: "space-between",
  };

  // useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     const uid = user.uid;
    //     console.log("uid", uid);
    //   } else {
    //     console.log("user is logged out");
    //   }
    // });
  // }, []);

  const fetchLagus = async () => {
    try {
      const songCollectionRef = collection(db, "song");
      const snapshot = await getDocs(query(songCollectionRef));
      setLagu(snapshot.docs.map(doc => ({
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
  };

  const fetchArtists = async () => {
    try {
      const artistCollectionRef = collection(db, "artist");
      const snapshot = await getDocs(query(artistCollectionRef));
      setArtists(snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          photoURL: doc.data().photoURL
      })));
    } catch (error) {
      console.error("Error getting artists: ", error);
    }
  };

  const fetchNewSongs = async () => {
    try {
      const newSongCollectionRef = collection(db, "song");
      const snapshot = await getDocs(query(newSongCollectionRef, orderBy("createdAt", "desc")));
      setNewSongs(snapshot.docs.map(doc => ({
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
      console.error("Error getting new songs: ", error);
    }
  };
  
  const fetchNewArtists = async () => {
    try {
      const newArtistCollectionRef = collection(db, "artist");
      const snapshot = await getDocs(query(newArtistCollectionRef, orderBy("createdAt", "desc")));
      setNewArtists(snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          photoURL: doc.data().photoURL
      })));
    } catch (error) {
      console.error("Error getting new artists: ", error);
    }
  };

  async function fetchAlbums() {
    try {
        const albumCollectionRef = collection(db, "album");
        const snapshot = await getDocs(query(albumCollectionRef));
        let uniqueArtist:any = [];
        snapshot.docs.forEach((doc) => {
          if(!uniqueArtist.includes(doc.data().artistId)) {
            uniqueArtist.push(doc.data().artistId)
            setAlbums((prevAlbums) => [
              ...prevAlbums,
              {
                id: doc.id,
                name: doc.data().name,
                artistId: doc.data().artistId,
                artist: doc.data().artist,
                totalSongs: doc.data().songs.length,
                photoURL: doc.data().photoURL,
                songs: doc.data().songs,
              }
            ])
          }
        })
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
  }

  async function getLikedAlbum() {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      setLikedAlbum(snapshot.docs[0].data().likedAlbum)
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
  }

  async function getLikedArtist() {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      setLikedArtist(snapshot.docs[0].data().likedArtist)
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
  }

  const likeAlbum = async (albumId: string) => {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      const usersDocRef = snapshot.docs[0].ref;

      let userLikedAlbum = [];
      if(snapshot.docs[0]) {
        userLikedAlbum = snapshot.docs[0].data().likedAlbum
      }
      const newUserLikedAlbum = [...userLikedAlbum, albumId]
      
      await updateDoc(usersDocRef, {
        likedAlbum: newUserLikedAlbum,
      });
      setLikedAlbum(newUserLikedAlbum)
    } catch (error) {
      console.error("Error like album: ", error);
    }
  }

  const dislikeAlbum = async (albumId: string) => {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      const usersDocRef = snapshot.docs[0].ref;

      await updateDoc(usersDocRef, {
        likedAlbum: snapshot.docs[0].data().likedAlbum.filter((x:any) => x != albumId),
      });
      setLikedAlbum(snapshot.docs[0].data().likedAlbum.filter((x:any) => x != albumId))
    } catch (error) {
      console.error("Error like album: ", error);
    }
  }

  const likeArtist = async (artistId: string) => {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      const usersDocRef = snapshot.docs[0].ref;

      let userLikedArtist = [];
      if(snapshot.docs[0]) {
        userLikedArtist = snapshot.docs[0].data().likedArtist
      }
      const newUserLikedArtist = [...userLikedArtist, artistId]
      
      await updateDoc(usersDocRef, {
        likedArtist: newUserLikedArtist,
      });
      setLikedArtist(newUserLikedArtist)
    } catch (error) {
      console.error("Error like album: ", error);
    }
  }

  const dislikeArtist = async (artistId: string) => {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      const usersDocRef = snapshot.docs[0].ref;

      await updateDoc(usersDocRef, {
        likedArtist: snapshot.docs[0].data().likedArtist.filter((x:any) => x != artistId),
      });
      setLikedArtist(snapshot.docs[0].data().likedArtist.filter((x:any) => x != artistId))
    } catch (error) {
      console.error("Error like album: ", error);
    }
  }

  useEffect(() => {
    fetchArtists();
    fetchAlbums();
    fetchLagus();
    fetchNewSongs();
    fetchNewArtists();
    getLikedAlbum();
    getLikedArtist();
  }, []);

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
                    {/* <img src={profilePic} alt="Profile" /> */}
                    <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Profile" />
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
                      // onSlideChange={() => console.log('slide change')}
                      // onSwiper={swiper => console.log(swiper)}
                    >
                      {shuffleArray(lagus).slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content' onClick={() => history.push(`/play/${lagu.id}`)}>
                            <div className='user-image'>
                              <img src={lagu.photoURL} style={{width: "100px", height: "100px"}} />
                            </div>
                            <h5>{lagu.name}</h5>
                            <p className='user-testimonials'><i>{lagu.artist}</i></p>
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
                      // onSlideChange={() => console.log('slide change')}
                      // onSwiper={swiper => console.log(swiper)}
                    >
                      {lagus.slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content' onClick={() => history.push(`/play/${lagu.id}`)}>
                            <div className='user-image'>
                              <img src={lagu.photoURL} style={{width: "100px", height: "100px"}}/>
                            </div>
                            <h5>{lagu.name}</h5>
                            <p className='user-testimonials'><i>{lagu.artist}</i></p>
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
                      // onSlideChange={() => console.log('slide change')}
                      // onSwiper={swiper => console.log(swiper)}
                    >
                      {newSongs.slice(0, 5).map(lagu => (
                        <SwiperSlide key={lagu.id} className='slide'>
                          <div className='slide-content' onClick={() => history.push(`/play/${lagu.id}`)}>
                            <div className='user-image'>
                              <img src={lagu.photoURL} style={{width: "100px", height: "100px"}}/>
                            </div>
                            <h5>{lagu.name}</h5>
                            <p className='user-testimonials'><i>{lagu.artist}</i></p>
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
                      // onSlideChange={() => console.log('slide change')}
                      // onSwiper={swiper => console.log(swiper)}
                    >
                      {albums.slice(0, albums.length / 2).map(album => (
                        <SwiperSlide key={album.id} className='slide'>
                          <div className='slide-content'  onClick={() => history.push(`/album/${album.id}`)}>
                            <div className='user-image'>
                              <img src={album.photoURL} style={{width: "100px", height: "100px"}}/>
                            </div>
                            <h5>{album.name}</h5>
                            <div style={spaceBetween}>
                              <IonButtons slot='start'>
                                <IonButton onClick={() => likedAlbum.includes(album.id) ? dislikeAlbum(album.id) : likeAlbum(album.id)}>
                                  <IonIcon icon={likedAlbum.includes(album.id) ? heart : heartOutline}/>
                                </IonButton>
                              </IonButtons>
                              <IonButtons slot='end'>
                                <IonButton id="v" ><IonIcon icon={ellipsisVerticalOutline}/></IonButton>
                                <IonPopover trigger="v" triggerAction="click">
                                  <IonContent class="ion-padding">
                                    <IonItem button={true} routerLink={`/album/${album.name}`}>
                                      <IonIcon icon={newspaperOutline} />
                                      <IonLabel>Selengkapnya</IonLabel>
                                    </IonItem>
                                  </IonContent>
                                </IonPopover>
                              </IonButtons>
                            </div>
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
                      // onSlideChange={() => console.log('slide change')}
                      // onSwiper={swiper => console.log(swiper)}
                    >
                      {newArtists.slice(0, 5).map(artist => (
                        <SwiperSlide key={artist.id} className='slide'>
                          <div className='slide-content' onClick={() => history.push(`/artist/${artist.id}`)}>
                            <div className='user-image'>
                              <img src={artist.photoURL} style={{width: "100px", height: "100px"}}/>
                            </div>
                            <h5>{artist.name}</h5>
                            <div style={spaceBetween}>
                              <IonButtons slot='start'>
                                <IonButton onClick={() => likedArtist.includes(artist.id) ? dislikeArtist(artist.id) : likeArtist(artist.id)}>
                                  <IonIcon icon={likedArtist.includes(artist.id) ? heart : heartOutline}/>
                                </IonButton>
                              </IonButtons>
                              <IonButtons slot='end'>
                                <IonButton id="v" ><IonIcon icon={ellipsisVerticalOutline}/></IonButton>
                                <IonPopover trigger="v" triggerAction="click">
                                  <IonContent class="ion-padding">
                                    <IonItem button={true} routerLink={`/artist/${artist.name}`}>
                                      <IonIcon icon={newspaperOutline} />
                                      <IonLabel>Selengkapnya</IonLabel>
                                    </IonItem>
                                  </IonContent>
                                </IonPopover>
                              </IonButtons>
                            </div>
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
