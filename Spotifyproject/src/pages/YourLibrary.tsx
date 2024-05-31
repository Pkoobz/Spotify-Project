import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { search, add, ellipsisVerticalCircle, ellipsisVerticalOutline, camera } from 'ionicons/icons';
import { useEffect, useRef, useState, useContext } from 'react';
import { OverlayEventDetail } from '@ionic/core/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { collection, addDoc, getFirestore, getDocs, deleteDoc, doc, query, where, updateDoc, Timestamp, orderBy } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

const Tab3: React.FC = () => {
  const db = getFirestore();
  const [takenPhoto, setTakenPhoto] = useState<{
    path: string | undefined,
    preview: string
  }>();
  const [selectedSegment, setSelectedSegment] = useState<string>('playlists');
  const [playlistName, setPlaylistName] = useState<string>('');
  const [modalLabel, setModalLabel] = useState<string>('Buat nama playlist baru');
  const [playlists, setPlaylists] = useState<Array<any>>([]);
  const [albums, setAlbums] = useState<Array<any>>([]);
  const [artists, setArtists] = useState<Array<any>>([]);
  const [likedAlbum, setLikedAlbum] = useState<Array<any>>([]);
  const [likedArtist, setLikedArtist] = useState<Array<any>>([]);
  const [typeSort, setTypeSort] = useState<string>('');

  const data = [
    {
      id:1,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:2,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:3,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:4,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:5,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:6,
      username:'abc',
      testimonial:'dwedo'
    },
  ];
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth, setAuth } = authContext;

  const takePhotoHandler = async () => {
      const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 80,
          width: 500
      });
      console.log(photo);

      if (!photo || !photo.webPath) {
          return;
      }

      setTakenPhoto({
          path: photo.path,
          preview: photo.webPath
      });
  };

  const fetchArtists = async () => {
    try {
      const newArtistCollectionRef = collection(db, "artist");
      const snapshot = await getDocs(query(newArtistCollectionRef));
      snapshot.docs.forEach((doc) => {
        if(likedArtist.includes(doc.id)) {
          setArtists((prevArtist) => [
            ...prevArtist,
            {
              id: doc.id,
              name: doc.data().name,
              photoURL: doc.data().photoURL
            }
          ])
        }
      })
    } catch (error) {
      console.error("Error getting new artists: ", error);
    }
  };

  async function fetchAlbums() {
    try {
        const albumCollectionRef = collection(db, "album");
        const snapshot = await getDocs(query(albumCollectionRef));
        snapshot.docs.forEach((doc) => {
          if(likedAlbum.includes(doc.id)) {
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
  };

  async function fetchPlaylists() {
    try {
        const userCollection = collection(db, "users");
        const snapshotUser = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));

        const playlistCollectionRef = collection(db, "playlist");
        const snapshot = await getDocs(query(playlistCollectionRef, where("userId", "==", snapshotUser.docs[0].id)));
        setPlaylists(snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            photoURL: doc.data().photoURL
        })));
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
  }

  const fetchSortArtists = async () => {
    try {
      setArtists([]);
      const newArtistCollectionRef = collection(db, "artist");
      let snapshot: any;
      if(typeSort == 'recent') {
        snapshot = await getDocs(query(newArtistCollectionRef, orderBy("createdAt", "desc")));
      } else {
        snapshot = await getDocs(query(newArtistCollectionRef, orderBy("name")));
      }

      snapshot.docs.forEach((doc:any) => {
        if(likedArtist.includes(doc.id)) {
          setArtists((prevArtist) => [
            ...prevArtist,
            {
              id: doc.id,
              name: doc.data().name,
              photoURL: doc.data().photoURL
            }
          ])
        }
      })
    } catch (error) {
      console.error("Error getting new artists: ", error);
    }
  };

  async function fetchSortAlbums() {
    try {
        setAlbums([]);
        const albumCollectionRef = collection(db, "album");
        let snapshot: any;
        if(typeSort == 'recent') {
          snapshot = await getDocs(query(albumCollectionRef, orderBy("createdAt", "desc")));
        } else {
          snapshot = await getDocs(query(albumCollectionRef, orderBy("name")));
        }

        snapshot.docs.forEach((doc: any) => {
          if(likedAlbum.includes(doc.id)) {
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
  };

  async function fetchSortPlaylists() {
    try {
        setPlaylists([]);
        const userCollection = collection(db, "users");
        const snapshotUser = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));

        const playlistCollectionRef = collection(db, "playlist");
        let snapshot: any;
        if(typeSort == 'recent') {
          snapshot = await getDocs(query(playlistCollectionRef, where("userId", "==", snapshotUser.docs[0].id), orderBy("createdAt", "desc")));
        } else {
          snapshot = await getDocs(query(playlistCollectionRef, where("userId", "==", snapshotUser.docs[0].id), orderBy("name")));
        }

        setPlaylists(snapshot.docs.map((doc:any) => ({
            id: doc.id,
            name: doc.data().name,
            photoURL: doc.data().photoURL
        })));
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

  function confirm() {
    handleCreatePlaylist();
    setPlaylistName('');
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  const handleCreatePlaylist = async () => {
    if(!playlistName && !auth) return

    const uid = auth?.uid;

    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", uid)));
      const usersDocRef = snapshot.docs[0].ref;

      await addDoc(collection(db, "playlist"), {
          userId: snapshot.docs[0].id,
          name: playlistName,
          song: [],
          photoURL: '',
          createdAt: Timestamp.now(),
      });

      let userPlaylist = [];
      if(snapshot.docs[0]) {
        userPlaylist = snapshot.docs[0].data().playlist
      }
      
      const playlistCollection = collection(db, "playlist");
      const snapshotPlaylist = await getDocs(query(playlistCollection, where("userId", "==", snapshot.docs[0].id)));
      const newUserPlaylist = [...userPlaylist, snapshotPlaylist.docs[0].id]
      
      await updateDoc(usersDocRef, {
        playlist: newUserPlaylist,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  useEffect(() => {
    if (selectedSegment === 'albums') {
      fetchSortAlbums();
    } else if (selectedSegment === 'artists'){
      fetchSortArtists();
    } else {
      fetchSortPlaylists();
    }
  }, [typeSort]);

  useEffect(() => {
    if (selectedSegment === 'albums') {
      setModalLabel('Buat nama album baru');
    } else if (selectedSegment === 'artists'){
      setModalLabel('Buat nama artist baru');
    } else {
      setModalLabel('Buat nama playlist baru')
    }

    if(likedAlbum.length == 0) getLikedAlbum();
    if(likedArtist.length == 0) getLikedArtist();
    if(playlists.length == 0) fetchPlaylists();
    if(albums.length == 0) fetchAlbums();
    if(artists.length == 0) fetchArtists();
  }, [selectedSegment]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            {/* Ke Profile Picture User */}
            <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Profile" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
          </IonButtons>
          <IonTitle>Your Library</IonTitle>
          <IonButtons slot="end">
            {/* <IonButton>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton> */}
            <IonButton id="open-modal" expand="block" >
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonSegment onIonChange={(e) => setSelectedSegment(e.detail.value as string)}>
            <IonSegmentButton value="playlists">
              <IonLabel>Playlists</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="albums">
              <IonLabel>Albums</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="artists">
              <IonLabel>Artists</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {selectedSegment === 'albums' && albums && (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Your library</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonToolbar>
              <IonSelect onIonChange={(e) => setTypeSort(e.detail.value)}>
                <IonSelectOption value="recent">Most Recent</IonSelectOption>
                <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
              </IonSelect>
              {/* <IonTitle slot="end">View</IonTitle>
              <IonToggle slot="end" onIonChange={(e) => console.log('View changed', e.detail.checked)} /> */}
            </IonToolbar>
            <IonRow>
              <IonCol>
                {albums.map((album, index) => (
                  <>
                    <IonCard key={album.id} className='ion-text-center ion-padding' routerLink={`/album/${album.id}`}>
                      <IonCardHeader>
                        <div id="a" style={{display: 'flex', justifyContent: 'center'}}>
                          <IonAvatar>
                            <IonImg src={album.photoURL} />
                          </IonAvatar>
                        </div>
                      </IonCardHeader>
                      <IonCardTitle>{album.name}</IonCardTitle>
                      <IonCardContent>{album.artist}</IonCardContent>
                    </IonCard>
                  </>
                ))}
              </IonCol>
            </IonRow>
          </>
        )}
        {selectedSegment === 'artists' && artists && (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Your library</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonToolbar>
              <IonSelect onIonChange={(e) => setTypeSort(e.detail.value)}>
                <IonSelectOption value="recent">Most Recent</IonSelectOption>
                <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
              </IonSelect>
              {/* <IonTitle slot="end">View</IonTitle>
              <IonToggle slot="end" onIonChange={(e) => console.log('View changed', e.detail.checked)} /> */}
            </IonToolbar>
            <IonRow>
              <IonCol>
                <IonList key="artist">
                  {artists.map((artist, index) => (
                    <IonItem key={artist.id} className='ion-padding' routerLink={`/artist/${artist.id}`}>
                      <IonButtons slot='start'>
                        <IonAvatar>
                          <IonImg src={artist.photoURL} />
                        </IonAvatar>
                      </IonButtons>
                      <IonLabel>{artist.name}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCol>
            </IonRow>
          </>
        )}
        {selectedSegment !== 'albums' && selectedSegment !== 'artists' && playlists && (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Your library</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonToolbar>
              <IonSelect onIonChange={(e) => setTypeSort(e.detail.value)}>
                <IonSelectOption value="recent">Most Recent</IonSelectOption>
                <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
              </IonSelect>
              {/* <IonTitle slot="end">View</IonTitle>
              <IonToggle slot="end" onIonChange={(e) => console.log('View changed', e.detail.checked)} /> */}
            </IonToolbar>
            {/* <IonRow className="ion-text-center">
              <IonCol>
                <div className="image-preview">
                  {!takenPhoto && <h3>No photo chosen.</h3>}
                  {takenPhoto && <img src={takenPhoto.preview} alt="Preview" />}
                </div>
                <IonButton fill="clear" onClick={takePhotoHandler}>
                  <IonIcon slot="start" icon={camera} />
                  <IonLabel>Take Photo</IonLabel>
                </IonButton>
              </IonCol>
            </IonRow> */}
            <IonList key="playlists">
              {playlists.map((playlist) => (
                <>
                <IonItem key={playlist.id} routerLink={`/playlist/${playlist.id}`} className='ion-padding'>
                  <IonButtons slot='start'>
                    <IonImg src={playlist.photoURL || '../public/favicon.png'} style={{width: "80px", height: "80px"}}/>
                  </IonButtons>
                  <IonLabel>{playlist.name}</IonLabel>
                  <IonButtons slot='end'>
                    <IonIcon icon={ellipsisVerticalOutline} />
                  </IonButtons>
                </IonItem>
                </>
              ))}
            </IonList>
          </>
        )}
        <IonModal ref={modal} trigger="open-modal">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Welcome</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonLabel position='floating'>{modalLabel}</IonLabel>
            <IonItem style={{margin: '16px auto'}}>
              <IonInput type='text' onIonInput={(e) => { setPlaylistName(e.detail.value!) }} />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
export default Tab3;
