import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import "../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState , useEffect} from 'react';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useHistory } from 'react-router';

const Registration:React.FC = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('user');
    const history = useHistory();

    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
       
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                history.push('/login');
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
          });
      }
    
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
                                                    <IonLabel>Masukkan email yang diinginkan</IonLabel>
                                                    <IonInput type="email" onIonChange={(e:any)=>setEmail(e.target.value)}/>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan password yang diinginkan</IonLabel>
                                                    <IonInput type="text" onIonChange={(e:any)=>setPassword(e.target.value)}/> 
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton shape="round" onClick={onSubmit}>Daftarkan</IonButton>
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

