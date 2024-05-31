import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, IonText } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { logoGoogle, logoTwitter, logoYahoo } from 'ionicons/icons';
import { useRef, useState, useContext } from 'react';
import "../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { GoogleAuthProvider,getAuth, signInWithEmailAndPassword, signInWithPopup,TwitterAuthProvider, OAuthProvider } from "firebase/auth";
import './Login.css';
import { logInWithEmailAndPassword } from "../firebaseConfig";
import { AuthContext, SessionProps } from "../context/ContextProvider";

interface LoginDataProps {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginDataProps>({
    email: "",
    password: "",
  });
  const [notifMessage, setNotifMessage] = useState<string>("");
  const { setAuth } = useContext(AuthContext) ?? {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const provider = new GoogleAuthProvider();
  const provider0 = new OAuthProvider('yahoo.com');
  const provider1 = new TwitterAuthProvider();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const auth = getAuth();

  const handleInputChange = (ev: Event) => {
    const { value, name } = ev.target as HTMLInputElement;
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [name]: value,
    }));
  };

  const saveToLocalStorage = (data: any) => {
    const storeData = {
      uid: data.user.uid,
      email: data.user.email,
      token: data.user.stsTokenManager,
    } as SessionProps;
    if (setAuth) setAuth(storeData);
    localStorage.setItem("auth", JSON.stringify(storeData));
  };

  const handleLogin = async () => {
    try {
      const email = loginData.email;
      const password = loginData.password;

      if (!email || !password) {
        setNotifMessage("Mohon isi email dan password.");
        return;
      }

      const result = (await logInWithEmailAndPassword(email, password)) as any;
      if (result.isLogged) {
        setNotifMessage("");
        setLoginData({
          email: "",
          password: "",
        });
        saveToLocalStorage(result.data);
        history.push("/tab1");
      } else {
        setNotifMessage(result.error);
      }
    } catch (err) {
      console.log("Login failed: ", err);
    }
  };

  // const onLogin = (e: { preventDefault: () => void; }) => {
  //     e.preventDefault();
  //     signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //         const user = userCredential.user;
  //         history.push('/tab1');
  //         console.log(user);
  //     })
  //     .catch((error) => {
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         console.log(errorCode, errorMessage)
  //     });
  // }

  const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      setProfilePic(user.photoURL);
      history.push('/tab1', { profilePic: user.photoURL });
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
          <IonRow>
            <IonCol>

            <IonLabel className='labelemail' position="floating">Masukkan Email</IonLabel>
              <IonItem>
                <IonInput type="text" name="email" onIonInput={(event) => { handleInputChange(event) }} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow>
            <IonCol>

            <IonLabel className='labelpw' position="floating" >Masukkan Password</IonLabel>
              <IonItem className='item'>
                <IonInput type="password" name="password" onIonInput={(event) => { handleInputChange(event) }} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol>

                <IonButton className='button-login' onClick={handleLogin}>Log In</IonButton>
                <IonButton className='button-daftar'  routerLink='/registration'>Daftar</IonButton>

            </IonCol>
          </IonRow>
        </IonGrid>
        

          <IonRow className="ion-text-center">
            <IonCol className='colbutton'>

                {/* <IonButton className='button1' onClick={signInWithGoogle}><IonIcon icon={logoGoogle} />Sign in with Google</IonButton>  */}
                {/* <IonButton className='button2' onClick={signInWithTwitter}><IonIcon icon={logoTwitter} />Sign in with Twitter</IonButton> */}
                {/* <IonButton className='button3' onClick={signInWithYahoo}><IonIcon icon={logoYahoo}/>Sign in with Yahoo</IonButton> */}
                <IonButton className='button4' routerLink='/lupa'>Lupa Password ?</IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            {notifMessage !== "" && (
              <IonRow>
                <IonGrid>
                  <IonText color="danger">{notifMessage}</IonText>
                </IonGrid>
              </IonRow>
            )}
          </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
