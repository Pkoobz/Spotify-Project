import React from 'react';
import { IonApp, IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPage, IonThumbnail} from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const History: React.FC = () => {
  return (
  <>
  <IonPage>
    <IonCard>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start" >
          <IonBackButton defaultHref="/YourLibrary" />
          </IonButtons>
          <IonTitle>History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonCardContent>
        <IonList>
          <IonTitle>Jumat, 3 Mei 2024</IonTitle>
          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu A" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu A</IonLabel>
            <IonCardSubtitle>Penyanyi A</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu B" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu B</IonLabel>
            <IonCardSubtitle>Penyanyi B</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu C" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu C</IonLabel>
            <IonCardSubtitle>Penyanyi C</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Heya" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Heya</IonLabel>
            <IonCardSubtitle>IVE</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>
          <IonTitle>Sabtu, 4 Mei 2024</IonTitle>
          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu E" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu E</IonLabel>
            <IonCardSubtitle>Penyanyi Z</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

          <IonItem>
            <IonThumbnail slot="start">
              <img alt="Lagu F" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
            </IonThumbnail>
            <IonLabel>Lagu F</IonLabel>
            <IonCardSubtitle>Penyanyi V</IonCardSubtitle>
            <IonCard color="dark"></IonCard>
          </IonItem>

        </IonList>
      </IonCardContent>
    </IonCard>
    </IonPage>
  </>
  )
}


export default History;
