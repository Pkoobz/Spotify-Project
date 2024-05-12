import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { logoGoogle, logoTwitter, logoYahoo } from 'ionicons/icons';
import { useRef, useState } from 'react';
import "../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { GoogleAuthProvider,getAuth, signInWithEmailAndPassword, signInWithPopup,TwitterAuthProvider, OAuthProvider } from "firebase/auth";
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const provider = new GoogleAuthProvider();
  const provider0 = new OAuthProvider('yahoo.com');
  const provider1 = new TwitterAuthProvider();
    
  const auth = getAuth();

  const onLogin = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          history.push('/tab1');
          console.log(user);
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
      });
  }  
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      history.push('/tab1');
      console.log(user);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });
  }

  const signInWithTwitter = () => {
    signInWithPopup(auth, provider1)
    .then((result) => {
      const user = result.user;
      history.push('/tab1');
      console.log(user);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });
  }
  const signInWithYahoo = () => {
    signInWithPopup(auth, provider0)
    .then((result) => {
      const user = result.user;
      history.push('/tab1');
      console.log(user);
    }).catch((error) => {
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
              <IonItem className='item'>
                <IonLabel position="floating" >Masukkan Password</IonLabel>
                <IonInput type="password" onIonChange={(e:any)=>setPassword(e.target.value)} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>

                <IonButton className='button-login' onClick={onLogin}>Log In</IonButton>
                <IonButton className='button-daftar'  routerLink='/registration'>Daftar</IonButton>

            </IonCol>
          </IonRow>
        </IonGrid>
        

          <IonRow className="ion-text-center">
            <IonCol className='colbutton'>

                <IonButton className='button1' onClick={signInWithGoogle}><IonIcon icon={logoGoogle} />Sign in with Google</IonButton>
                <IonButton className='button2' onClick={signInWithTwitter}><IonIcon icon={logoTwitter} />Sign in with Twitter</IonButton>
                <IonButton className='button3' onClick={signInWithYahoo}><IonIcon icon={logoYahoo}/>Sign in with Yahoo</IonButton>
                <IonButton className='button4' routerLink='/lupa'>Lupa Password ?</IonButton>
            </IonCol>
          </IonRow>
          

      </IonContent>
    </IonPage>
  );
};

export default Login;
