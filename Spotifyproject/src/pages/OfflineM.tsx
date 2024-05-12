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
  import { withRouter } from 'react-router';
  


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
  
