import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonPopover, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { cameraOutline, ellipsisVerticalOutline, heartOutline, newspaperOutline, skull, walk, headset, ear, hourglass, accessibility, sunny, heart } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { getDocs, collection, getFirestore, query, where, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

const Tab2: React.FC = () => {
  const data = [
    {
      id: 1,
      nama: 'Rock',
      icon: skull
    },
    {
      id: 2,
      nama: 'Pop',
      icon: walk
    },
    {
      id: 3,
      nama: 'Jazz',
      icon: headset
    },
    {
      id: 4,
      nama: 'Classical',
      icon: ear
    },
    {
      id: 5,
      nama: "80's",
      icon: hourglass
    },
    {
      id: 6,
      nama: "Hip-Hop",
      icon: accessibility
    },
    {
      id: 7,
      nama: "Indie",
      icon: sunny
    }
  ];

  const [artists, setArtists] = useState<Array<any>>([]);
  const db = getFirestore();
  const history = useHistory();
  const [lagus, setLagu] = useState<Array<any>>([]);
  const [filteredLagus, setFilteredLagus] = useState<Array<any>>([]);
  const [filteredArtists, setFilteredArtists] = useState<Array<any>>([]);
  const [likedArtist, setLikedArtist] = useState<Array<any>>([]);
  const [showSongSearch, setShowSongSearch] = useState(false);
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth, setAuth } = authContext;

  const spaceBetween = {
    display: "flex",
    justifyContent: "space-between",
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

  async function fetchLagus() {
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
      console.error("Error getting songs: ", error);
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
    fetchLagus();
    getLikedArtist();
  }, [db]);

  const handleCardClick = (link: string) => {
    history.push(link);
  };

  const handleSearchChange = (event: CustomEvent) => {
    const value = event.detail.value;
    setSearchQuery(value);
    if (value) {
      setShowSongSearch(true);
      setShowArtistSearch(true);

      const filteredSongs = lagus.filter(lagu =>
        lagu.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLagus(filteredSongs);

      const filteredArtists = artists.filter(artist =>
        artist.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredArtists(filteredArtists);
    } else {
      setShowSongSearch(false);
      setShowArtistSearch(false);
      setFilteredLagus([]);
      setFilteredArtists([]);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow>
            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
              <IonGrid className='ion-no-padding'>
                <IonButtons slot='end'>
                  <IonButton><IonIcon icon={cameraOutline} /></IonButton>
                </IonButtons>
                <IonRow>
                  <IonCol>
                    <IonSearchbar
                      showClearButton="always"
                      value={searchQuery}
                      onIonInput={handleSearchChange}
                    ></IonSearchbar>
                  </IonCol>
                </IonRow>
                {!searchQuery && (
                  <>
                    <IonRow>
                      <IonCol>
                        <h1>Jelajahi Genre</h1>
                        <br />
                        <Swiper
                          spaceBetween={20}
                          slidesPerView={2}
                          scrollbar={{ draggable: true }}
                          // onSlideChange={() => console.log('slide change')}
                          // onSwiper={swiper => console.log(swiper)}
                        >
                          {data.map(user => (
                            <SwiperSlide key={user.id} className='slide' onClick={() => handleCardClick('/genre/' + user.nama)}>
                              <div className='slide-content'>
                                <div className='user-image' style={{display: 'flex'}}>
                                  {/* <img src={user.image} alt={user.nama} /> */}
                                  <IonIcon icon={user.icon} style={{margin: 'auto 8px',}}/>
                                  <h5>{user.nama}</h5>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <h1>Jelajahi Artis</h1>
                        <br />
                        <Swiper
                          spaceBetween={20}
                          slidesPerView={2}
                          scrollbar={{ draggable: true }}
                          // onSlideChange={() => console.log('slide change')}
                          // onSwiper={swiper => console.log(swiper)}
                        >
                          {artists.slice(0, 8).map(artist => (
                            <SwiperSlide key={artist.id} className='slide'>
                              <div className='slide-content' onClick={() => history.push(`/artist/${artist.id}`)}>
                                <div className='user-image'>
                                  <img src={artist.photoURL} alt={artist.name} style={{width: "100px", height: "100px"}}/>
                                </div>
                                <h5>{artist.name}</h5>
                                <div style={spaceBetween}>
                                <IonButtons slot='start'>
                                  <IonButton onClick={() => likedArtist.includes(artist.id) ? dislikeArtist(artist.id) : likeArtist(artist.id)}>
                                    <IonIcon icon={likedArtist.includes(artist.id) ? heart : heartOutline}/>
                                  </IonButton>
                                </IonButtons>
                                  <IonButtons slot='end'>
                                    <IonButton id="vu" ><IonIcon icon={ellipsisVerticalOutline}/></IonButton>
                                    <IonPopover trigger="vu" triggerAction="click">
                                      <IonContent class="ion-padding">
                                        <IonItem button={true} routerLink={`/artist/${artist.id}`}>
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
                  </>
                )}
                {showSongSearch && (
                  <IonRow>
                    <IonCol>
                      <h1>Pencarian berdasarkan nama lagu</h1>
                      <br />
                      <Swiper
                          spaceBetween={20}
                          slidesPerView={2}
                          scrollbar={{ draggable: true }}
                          // onSlideChange={() => console.log('slide change')}
                          // onSwiper={swiper => console.log(swiper)}
                        >
                        {filteredLagus.map(lagu => (
                          <SwiperSlide key={lagu.id} className='slide'>
                            <div className='slide-content' onClick={() => history.push(`/play/${lagu.id}`)}>
                              <div className='user-image'>
                                <img src={lagu.photoURL} alt={lagu.name} style={{width: "100px", height: "100px"}}/>
                              </div>
                              <h5>{lagu.name}</h5>
                              <p className='user-testimonials'><i>{lagu.artist}</i></p>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </IonCol>
                  </IonRow>
                )}
                {showArtistSearch && (
                  <IonRow>
                    <IonCol>
                      <h1>Pencarian berdasarkan nama artis</h1>
                      <br />
                      <Swiper
                          spaceBetween={20}
                          slidesPerView={2}
                          scrollbar={{ draggable: true }}
                          // onSlideChange={() => console.log('slide change')}
                          // onSwiper={swiper => console.log(swiper)}
                        >
                        {filteredArtists.map(artist => (
                          <SwiperSlide key={artist.id} className='slide'>
                            <div className='slide-content' onClick={() => history.push(`/artist/${artist.id}`)}>
                              <div className='user-image'>
                                <img src={artist.photoURL} alt={artist.name} style={{width: "100px", height: "100px"}}/>
                              </div>
                              <h5>{artist.name}</h5>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </IonCol>
                  </IonRow>
                )}
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
