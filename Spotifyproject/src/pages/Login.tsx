import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { logoGoogle, logoTwitter, logoYahoo } from 'ionicons/icons';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Masukkan Username</IonLabel>
                <IonInput type="text" />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Masukkan Password</IonLabel>
                <IonInput type="text" />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonButton color="success">Log In</IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItemGroup>
                <IonItem><IonButton><IonIcon icon={logoGoogle} />Sign in with Google</IonButton></IonItem>
                <IonItem><IonButton><IonIcon icon={logoTwitter} />Sign in with Twitter</IonButton></IonItem>
                <IonItem><IonButton><IonIcon icon={logoYahoo}/>Sign in with Yahoo</IonButton></IonItem>
              </IonItemGroup>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
