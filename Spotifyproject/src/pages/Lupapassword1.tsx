import { IonPage, IonHeader, IonContent, IonBackButton, IonToolbar, IonTitle, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import React from 'react';

const Lupapassword1:React.FC = () => {

    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>  
                            <IonBackButton defaultHref='/login' />
                        </IonButtons>
                        <IonTitle>Lupa Password</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                                <IonGrid className='ion-no-padding'>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>Masukkan password baru</IonLabel>
                                            <IonInput type="text" />
                                            <IonLabel>Konfirmasi password baru</IonLabel>
                                            <IonInput type="text" />
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton routerLink='/login'>Konfirm Password</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Lupapassword1;
