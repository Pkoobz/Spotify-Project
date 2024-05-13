import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonRange, IonIcon, IonCol, IonRow, IonAvatar } from '@ionic/react';
import { play, pause, playBack, playForward, volumeHigh, volumeMute } from 'ionicons/icons';
import './PlayMusic2.css'


interface Song {
  title: string;
  artist: string;
  cover: string;
  file: string;
}

const Tab1: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([
    { title: 'Song 1', artist: 'Artist 1', cover: 'src/assets/img/album1.jpg', file: 'Losing You.mp3'},
    { title: 'Song 2', artist: 'Artist 2', cover: 'src/assets/img/album2.jpg', file: 'With U.mp3'},
    { title: 'Song 3', artist: 'Artist 3', cover: 'src/assets/img/album3.jpg', file: 'Ghost.mp3'}
  ]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', () => {
        setProgress(0);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', () => {
          setProgress(0);
        });
        audio.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    };
  }, [audio]);

  const updateTime = () => {
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const loadSong = (song: Song) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentSong(song);
    const newAudio = new Audio(`src/assets/audio/${song.file}`);
    setAudio(newAudio);
    setIsPlaying(false);
    setIsMuted(false);
  };

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  };

  const nextSong = () => {
    const currentIndex = songs.findIndex(song => song === currentSong);
    const nextIndex = (currentIndex + 1) % songs.length;
    loadSong(songs[nextIndex]);
  };

  const previousSong = () => {
    const currentIndex = songs.findIndex(song => song === currentSong);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(songs[previousIndex]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Music Player</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
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
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
