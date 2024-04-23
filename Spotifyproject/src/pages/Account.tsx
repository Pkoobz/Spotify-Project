import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonTitle, IonButton, IonIcon, IonItem } from '@ionic/react';
import { ellipsisVerticalOutline } from 'ionicons/icons';
import React from 'react';

const Account:React.FC = () => {

    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref='/tab1' />
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
                                            <IonTitle>Jonathan</IonTitle>
                                            <h5>0 pengikut . 3 mengikuti</h5>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButtons slot="start">
                                                <IonButton shape="round" fill="outline">Edit</IonButton>
                                                <IonIcon icon={ellipsisVerticalOutline} />
                                            </IonButtons>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <h2>Playlist</h2>
                                            <br />
                                            <IonItem>
                                                
                                            </IonItem>
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

export default Account;
