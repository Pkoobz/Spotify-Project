import { IonBackButton, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Registration:React.FC = () =>{
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>  
                            <IonBackButton defaultHref='/login' />
                        </IonButtons>
                        <IonTitle>Buat akun</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                                <IonGrid className='ion-no-padding'>
                                    <IonRow>
                                        <IonCol>
                                            <IonItemGroup>
                                                <IonItem>
                                                    <IonLabel>Masukkan username yang diinginkan</IonLabel>
                                                    <IonInput type="text" />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan password yang diinginkan</IonLabel>
                                                    <IonInput type="text" /> 
                                                </IonItem>
                                                <IonItem>   
                                                    <IonLabel>Konfirmasi password</IonLabel> 
                                                    <IonInput type="text" />
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton shape="round">Daftarkan</IonButton>
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
}

export default Registration;
