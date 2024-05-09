import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { logoGoogle, logoTwitter, logoYahoo } from 'ionicons/icons';
import { useRef, useState } from 'react';
import "../firebaseConfig";

import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";

import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';
import { GoogleAuthProvider } from "firebase/auth";


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const provider = new GoogleAuthProvider();

  const onLogin = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          history.push('/home');
          console.log(user);
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
      });
  }
  
  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Masukkan Email</IonLabel>
                <IonInput type="text" onIonChange={(e:any)=>setEmail(e.target.value)}/>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Masukkan Password</IonLabel>
                <IonInput type="password" onIonChange={(e:any)=>setPassword(e.target.value)} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonButton color="success" onClick={onLogin}>Log In</IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonButton color="success" routerLink='/registration'>Daftar</IonButton>
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
          <IonRow className="ion-text-center">
            <IonCol>
              <IonItem>
                <IonButton color="danger" routerLink='/lupa'>Lupa Password ?</IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;

