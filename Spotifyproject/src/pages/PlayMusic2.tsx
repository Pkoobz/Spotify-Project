import React, { useState, useEffect, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonRange, IonIcon, IonCol, IonRow, IonAvatar, IonButtons, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { play, pause, playBack, playForward, volumeHigh, volumeMute, arrowBackCircleOutline } from 'ionicons/icons';
import './PlayMusic2.css'
import { useParams } from 'react-router';
import { collection, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

interface SongProps {
  id: string;
  name: string;
  genre: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  photoURL: string;
  songURL: string;
}

const Tab1: React.FC = () => {
  const songID = useParams<{songId: string}>().songId;
  const db = getFirestore();
  const [song, setSong] = useState<SongProps | null>({
    id: "",
    name: "",
    genre: "",
    artist: "",
    artistId: "",
    album: "",
    albumId: "",
    photoURL: "",
    songURL: "",
});
const [playlists, setPlaylists] = useState<Array<any>>([]);
  // const [songs, setSongs] = useState<Song[]>([
  //   { title: 'Losing You ', artist: 'Blanke', cover: 'src/assets/img/album1.jpg', file: 'Losing You.mp3'},
  //   { title: 'With U ', artist: 'Roy Knox', cover: 'src/assets/img/album2.jpg', file: 'With U.mp3'},
  //   { title: 'Ghost', artist: 'Justin Bieber', cover: 'src/assets/img/album3.jpg', file: 'Ghost.mp3'}
  // ]);
  // const [currentSong, setCurrentSong] = useState<Song | null>(null);
  // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  // const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const [isMuted, setIsMuted] = useState<boolean>(false);
  // const [progress, setProgress] = useState<number>(0);
  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth, setAuth } = authContext;

  const addSongToHistory = async () => {
    try {
      const userCollection = collection(db, "users");
      const snapshot = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
      const usersDocRef = snapshot.docs[0].ref;
      let history = snapshot.docs[0].data().history
      if(history.includes(songID)) {
        history = snapshot.docs[0].data().history.filter((x:any) => x != songID)
      }
      history.unshift(songID);

      await updateDoc(usersDocRef, {
        history: history,
      })
      
    } catch (error) {
      console.error("Error unshift history: ", error);
    }
  }

  const fetchSong = async () => {
    try {
      const songCollection = collection(db, "song");
      const snapshot = await getDocs(query(songCollection));
      snapshot.docs.forEach((doc) => {
        if(doc.id == songID) {
          const song = {
            id: doc.id,
            name: doc.data().name,
            genre: doc.data().genre,
            albumId: doc.data().albumId,
            album: doc.data().album,
            artistId: doc.data().artistId,
            artist: doc.data().artist,
            songURL: doc.data().songURL,
            photoURL: doc.data().photoURL,
          } as SongProps;
          setSong(song);
        }
      })
    } catch (error) {
      console.error("Error getting songs: ", error);
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

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    try {
      const playlistCollection = collection(db, "playlist")
      const snapshotPlaylist = await getDocs(query(playlistCollection))
      snapshotPlaylist.docs.forEach( async (doc) => {
        if(doc.id == playlistId) {
            const newSongList = [...doc.data().song, songId]
            await updateDoc(doc.ref, {
                song: newSongList,
            });
        }
      })
    } catch (error) {
      console.error("Error like album: ", error);
    }
  }

  useEffect(() => {
    addSongToHistory();
    fetchSong();
    fetchPlaylists();
  }, []);

  // useEffect(() => {
  //   if (audio) {
  //     audio.addEventListener('timeupdate', updateTime);
  //     audio.addEventListener('loadedmetadata', () => {
  //       setProgress(0);
  //     });
  //     audio.addEventListener('ended', () => {
  //       setIsPlaying(false);
  //     });
  //   }
  //   return () => {
  //     if (audio) {
  //       audio.removeEventListener('timeupdate', updateTime);
  //       audio.removeEventListener('loadedmetadata', () => {
  //         setProgress(0);
  //       });
  //       audio.removeEventListener('ended', () => {
  //         setIsPlaying(false);
  //       });
  //     }
  //   };
  // }, [audio]);

  // const updateTime = () => {
  //   if (audio) {
  //     setProgress((audio.currentTime / audio.duration) * 100);
  //   }
  // };

  // const loadSong = (song: Song) => {
  //   if (audio) {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   }
  //   setCurrentSong(song);
  //   const newAudio = new Audio(`src/assets/audio/${song.file}`);
  //   setAudio(newAudio);
  //   setIsPlaying(false);
  //   setIsMuted(false);
  // };

  // const togglePlay = () => {
  //   if (audio) {
  //     if (isPlaying) {
  //       audio.pause();
  //     } else {
  //       audio.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  // const toggleMute = () => {
  //   if (audio) {
  //     audio.muted = !audio.muted;
  //     setIsMuted(audio.muted);
  //   }
  // };

  // const nextSong = () => {
  //   const currentIndex = songs.findIndex(song => song === currentSong);
  //   const nextIndex = (currentIndex + 1) % songs.length;
  //   loadSong(songs[nextIndex]);
  // };

  // const previousSong = () => {
  //   const currentIndex = songs.findIndex(song => song === currentSong);
  //   const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
  //   loadSong(songs[previousIndex]);
  // };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButton routerLink="/yourlibrary">
            <IonIcon slot="icon-only" icon={arrowBackCircleOutline}></IonIcon>
            </IonButton>
          <IonTitle>Music Player</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <img src={song?.photoURL} />
          <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <IonLabel style={{marginTop: "16px"}} className="ion-text-center">{song?.name}</IonLabel>
            <IonLabel style={{margin: "16px auto"}} className="ion-text-center">{song?.artist}</IonLabel>
            <div style={{margin: '16px auto'}}>
              {song?.songURL &&   
                  <audio controls>
                      <source src={song?.songURL} type="audio/mpeg"></source>
                  </audio>
              }
            </div>
            <div style={{margin: 'auto'}}>
              <IonSelect label="Add To Playlist" id="addPlaylist" 
                onIonChange={(e) => addSongToPlaylist(e.detail.value, songID)}
                >
                  {playlists.map((playlist) => (
                      <IonSelectOption key={playlist.id} value={playlist.id}>{playlist.name}</IonSelectOption>
                  ))}
            </IonSelect>
            </div>
          </div>
        </IonRow>
        {/* <IonList>
          <IonAvatar className='image-play-music'>
            {currentSong && <img src={currentSong?.cover} alt='/src/altimage/altimage.jpg' />}
          </IonAvatar>
          <IonItem>
            <IonLabel>{currentSong?.title}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{currentSong?.artist}</IonLabel>
          </IonItem>
          <IonItem>
            <IonRange min={0} max={100} value={progress} color="secondary"></IonRange>
          </IonItem>
        </IonList>

        <IonRow className="ion-align-items-center ion-justify-content-center">
          <IonCol size="auto">
            <IonIcon icon={playBack} onClick={previousSong}></IonIcon>
          </IonCol>
          <IonCol size="auto">
            <IonIcon icon={isPlaying ? pause : play} onClick={togglePlay}></IonIcon>
          </IonCol>
          <IonCol size="auto">
            <IonIcon icon={playForward} onClick={nextSong}></IonIcon>
          </IonCol>
          <IonCol size="auto">
            <IonIcon icon={isMuted ? volumeMute : volumeHigh} onClick={toggleMute}></IonIcon>
          </IonCol>
        </IonRow> */}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
