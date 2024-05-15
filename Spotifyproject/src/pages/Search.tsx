import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { getDocs, collection, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const Tab2: React.FC = () => {
  const data = [
    {
      id: 1,
      nama: 'Rock',
      image: '',
      link: '/genre0'
    },
    {
      id: 2,
      nama: 'Pop',
      image: '',
      link: '/genre1'
    },
    {
      id: 3,
      nama: 'Jazz',
      image: '',
      link: '/genre2'
    },
    {
      id: 4,
      nama: 'Classical',
      image: '',
      link: '/genre3'
    },
    {
      id: 5,
      nama: "80's",
      image: '',
      link: '/genre4'
    },
    {
      id: 6,
      nama: "Hip-Hop",
      image: '',
      link: '/genre5'
    },
    {
      id: 7,
      nama: "Indie",
      image: '',
      link: '/genre6'
    }
  ];

  const [artists, setArtists] = useState<Array<any>>([]);
  const db = getFirestore();
  const history = useHistory();
  const [lagus, setLagu] = useState<Array<any>>([]);
  const [filteredLagus, setFilteredLagus] = useState<Array<any>>([]);
  const [filteredArtists, setFilteredArtists] = useState<Array<any>>([]);
  const [showSongSearch, setShowSongSearch] = useState(false);
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    async function fetchLagus() {
      try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        const songsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log("Fetched songs: ", songsData);
        setLagu(songsData);
      } catch (error) {
        console.error("Error getting songs: ", error);
      }
    }
    fetchLagus();
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
        lagu.namalagu.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLagus(filteredSongs);

      const filteredArtists = artists.filter(artist =>
        artist.namaartist.toLowerCase().includes(value.toLowerCase())
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
                          onSlideChange={() => console.log('slide change')}
                          onSwiper={swiper => console.log(swiper)}
                        >
                          {data.map(user => (
                            <SwiperSlide key={user.id} className='slide' onClick={() => handleCardClick(user.link)}>
                              <div className='slide-content'>
                                <div className='user-image'>
                                  <img src={user.image} alt={user.nama} />
                                </div>
                                <h5>{user.nama}</h5>
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
                          onSlideChange={() => console.log('slide change')}
                          onSwiper={swiper => console.log(swiper)}
                        >
                          {artists.slice(0, 8).map(artist => (
                            <SwiperSlide key={artist.id} className='slide'>
                              <div className='slide-content'>
                                <div className='user-image'>
                                  <img src={artist.fotoUrl} alt={artist.namaartist} />
                                </div>
                                <h5>{artist.namaartist}</h5>
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
                          onSlideChange={() => console.log('slide change')}
                          onSwiper={swiper => console.log(swiper)}
                        >
                        {filteredLagus.map(lagu => (
                          <SwiperSlide key={lagu.id} className='slide'>
                            <div className='slide-content'>
                              <div className='user-image'>
                                <img src={lagu.fotoUrl} alt={lagu.namalagu} />
                              </div>
                              <h5>{lagu.namalagu}</h5>
                              <p className='user-testimonials'><i>{lagu.namaartist}</i></p>
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
                          onSlideChange={() => console.log('slide change')}
                          onSwiper={swiper => console.log(swiper)}
                        >
                        {filteredArtists.map(artist => (
                          <SwiperSlide key={artist.id} className='slide'>
                            <div className='slide-content'>
                              <div className='user-image'>
                                <img src={artist.fotoUrl} alt={artist.namaartist} />
                              </div>
                              <h5>{artist.namaartist}</h5>
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
