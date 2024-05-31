import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import {auth} from"../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState , useEffect} from 'react';
import bcrypt from 'bcryptjs';
import { registerWithEmailAndPassword } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router';
import './Registration.css';

interface RegisterDataProps {
    name: string;
    email: string;
    password: string;
}

const Registration:React.FC = () =>{
    const [registerData, setRegisterData] = useState<RegisterDataProps>({
        name: "",
        email: "",
        password: ""
    });
    const [notifMessage, setNotifMessage] = useState<string>("");
    const [failedRegis, setFailedRegis] = useState<boolean>(false);
    // const username = useRef<HTMLIonInputElement>(null);
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [type, setType] = useState('user');
    // const [fileName,setFilename] = useState('../public/favicon.png');
    // const [selectedFile, setSelectedFile] = useState<File>();
    const storage = getStorage();
    const history = useHistory();
    const db = getFirestore();
    const [users,setUsers] = useState<Array<any>>([]);

    const handleInputChange = (ev: Event) => {
        const { value, name } = ev.target as HTMLInputElement;
        setRegisterData((prevRegisterData) => ({
          ...prevRegisterData,
          [name]: value,
        }));
    };

    const handleRegister = async () => {
        try {
          if (
            !registerData.email ||
            !registerData.name ||
            !registerData.password
          ) {
            setFailedRegis(true);
            setNotifMessage("Mohon isi semua input.");
            return;
          }
    
          setNotifMessage("");
          const result = (await registerWithEmailAndPassword(
            registerData.name,
            registerData.email,
            registerData.password,
          )) as any;
    
          if (result.isRegistered) {
            setRegisterData({
              name: "",
              email: "",
              password: "",
            });
            setFailedRegis(false);
            setNotifMessage("Berhasil mendaftar.");
          } else {
            setFailedRegis(true);
            setNotifMessage(result.error);
          }
        } catch (err) {
          console.log("Failed to register user!");
        }
    };

    // const onSubmit = async (e: { preventDefault: () => void; }) => {
    //     e.preventDefault()
       
    //     await createUserWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             const user = userCredential.user;
    //             console.log(user);
    //             history.push('/login');
    //     })
    //     .catch((error) => {
    //           const errorCode = error.code;
    //           const errorMessage = error.message;
    //           console.log(errorCode, errorMessage);
    //     });
    //     const storageRef = ref(storage, fileName);
        
    //     uploadBytes(storageRef, selectedFile as Blob).then(() => {
    //         console.log('upload file success');
    //         getDownloadURL(ref(storage, fileName)).then((url) =>{
    //             addData(url);
    //         })
    //     })
    // }
    
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

                                            <IonLabel className='label1'>Masukkan username yang diinginkan</IonLabel>
                                                <IonItem>
                                                    <IonInput type="text" name="name" onIonInput={(e) => handleInputChange(e)} />
                                                </IonItem>

                                                <IonLabel className='label2'>Masukkan email yang diinginkan</IonLabel>
                                                <IonItem>
                                                     <IonInput type="email" name="email" onIonInput={(e) => handleInputChange(e)} />
                                                </IonItem>

                                                <IonLabel className='label2'>Masukkan password yang diinginkan</IonLabel>
                                                <IonItem>
                                                     <IonInput type="text" name="password" onIonInput={(e) => handleInputChange(e)} /> 
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton className='button-1' shape="round" onClick={handleRegister}>Daftarkan</IonButton>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        {notifMessage !== "" && (
                                            <IonRow>
                                            <IonGrid>
                                                <IonText color={`${failedRegis ? "danger" : "success"}`}>
                                                {notifMessage}
                                                </IonText>
                                            </IonGrid>
                                            </IonRow>
                                        )}
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
