import { IonAvatar, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonTab, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow>
            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
              <IonGrid className='ion-no-padding'>
                <IonRow>
                  <IonCol>
                    <IonAvatar>
                      <img alt="abc" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonSearchbar showClearButton="always" value=""></IonSearchbar>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
