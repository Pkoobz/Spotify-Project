import React, { useState } from 'react';
import './PlayMusic2.css'
import { IonList, IonItem, IonLabel, IonButton, IonAvatar, IonCardSubtitle, IonCard, IonToolbar, IonIcon, IonButtons } from '@ionic/react';
import { arrowBackCircleOutline } from 'ionicons/icons';

interface Song {
  title: string;
  file: string;
}

const MusicPlayer: React.FC = () => {
  const songs: Song[] = [
    { title: 'Song 1', file: 'song1.mp3' },
    { title: 'Song 2', file: 'song2.mp3' },
    { title: 'Song 3', file: 'song3.mp3' }
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playSong = (song: Song) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(`assets/audio/${song.file}`);
    newAudio.play();
    setAudio(newAudio);
  };

  const pauseSong = () => {
    if (audio) {
      audio.pause();
    }
  };

  const playNextSong = () => {
    if (currentSongIndex < songs.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
      playSong(songs[nextIndex]);
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      const previousIndex = currentSongIndex - 1;
      setCurrentSongIndex(previousIndex);
      playSong(songs[previousIndex]);
    }
  };

  return (
    // <IonList>
    //   {songs.map((song, index) => (
    //     <IonItem key={index}>
    //       <IonLabel>{song.title}</IonLabel>
    //       <IonButton onClick={() => playSong(song)}>Play</IonButton>
    //     </IonItem>
    //   ))}
    <>

    <IonToolbar>
    <IonButtons>
            <IonButton routerLink="/yourlibrary">
            <IonIcon slot="icon-only" icon={arrowBackCircleOutline}></IonIcon>
            </IonButton>
    </IonButtons>
    </IonToolbar>
    <div className='divmusic'>
    <IonAvatar className='image-play-music'>
      <img src='https://i1.sndcdn.com/artworks-plGyt67Z4u4iBtD8-RKliuw-t500x500.jpg'  />
      </IonAvatar>
      <h2 className='h2musicplay'>Blanke</h2>
      <IonCardSubtitle className='cardsubmusic'>
        Used To Losing You
      </IonCardSubtitle>
    
    

      <IonButton onClick={playPreviousSong}>Back</IonButton>
      <IonButton onClick={pauseSong}>Pause</IonButton>
      <IonButton onClick={() => playSong(song)}>Play</IonButton>
      <IonButton onClick={playNextSong}>Next</IonButton>
      </div>
      </>

    
  );
};

export default MusicPlayer;
