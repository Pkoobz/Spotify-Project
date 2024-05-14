import { IonContent, 
    IonIcon, 
    IonButton, 
    IonPage, 
    IonItem,
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton} from '@ionic/react';
  import ExploreContainer from '../components/ExploreContainer';
  import { addCircleOutline, 
    appsOutline, 
    arrowBackCircleOutline, 
    caretBack, 
    searchCircleOutline, 
    swapVerticalOutline} from 'ionicons/icons';
  import './OfflineM.css';
  import { Redirect, Route, withRouter } from 'react-router';
  import MainTabs from '../mainTabs';
  import Sound from 'react-native-sound';
  
  let sound = new Sound();

const downloadSong = async (songUrl: string | URL | Request) => {
  try {
    // Fetch the song from the server
    const response = await fetch(songUrl);
    const blob = await response.blob();

    // Get a reference to the local file system
    const fs = require('react-native-fs');
    const path = fs.DocumentDirectoryPath + '/song.mp3';

    // Write the blob to the local file system
    fs.writeFile(path, blob, 'blob');

    // Load the song
    sound = new Sound(path, '', (error: any) => {
      if (error) {
        console.log('Failed to load the sound', error);
      }
    });
  } catch (error) {
    console.error('Failed to download the song', error);
  }
};

const playSong = () => {
  // Play the song
  sound.play((success: any) => {
    if (!success) {
      console.log('Sound did not play successfully');
    }
  });
};
  const Offline: React.FC = () => {
    return (
      <IonPage>
  
        <IonToolbar>

          <IonButtons>
            <IonButton routerLink="/yourlibrary">
            <IonIcon slot="icon-only" icon={arrowBackCircleOutline}></IonIcon>
            </IonButton>

          
          <IonTitle>Your Downloaded</IonTitle>
          
          <IonButton routerLink="/tab2" className='searchbutton'slot='end'>
           <IonIcon slot="icon-only" icon={searchCircleOutline}></IonIcon>
         </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
        <IonButton className='artist' slot='start' fill='clear' color={'white'}>Playlists</IonButton>
        <IonButton className='artist' slot='start' fill='clear' color={'white'}>Song</IonButton>
        </IonToolbar>

        <IonContent>
      
        
  
  
        </IonContent>
      </IonPage>
      
    );
  };
  
  export default Offline;
  
