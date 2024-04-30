import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonThumbnail} from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const History: React.FC = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>History Mu</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonTitle>Jumat, 3 Mei 2024</IonTitle>
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

          <IonItem>
            <IonTitle>Sabtu, 4 Mei 2024</IonTitle>
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
  )
}

export default History;
