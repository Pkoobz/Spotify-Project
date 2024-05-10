import { IonPage, IonHeader, IonContent, IonBackButton, IonToolbar, IonTitle, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonList } from '@ionic/react';
import React, { FormEvent, useRef, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Lupapassword:React.FC = () => {
    const [email, setEmail] = useState('')

    const handlePassword = async () => {
      await sendPasswordResetEmail(auth, email)
        .then(()=> alert("password reset email sent"))
        .catch((error:any)=>console.log(error.message));
    }
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
              <IonContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonList>
                        <IonItem>
                          <IonLabel position="floating">Masukkan Email</IonLabel>
                          <IonInput value={email} type="email" onIonChange={(e:any) => setEmail(e.target.value)} />
                        </IonItem>
                      </IonList>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonButton onClick={handlePassword}>Kirimkan</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
            </IonPage>
        </>
    );
};

export default Lupapassword;
