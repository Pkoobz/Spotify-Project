import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import {auth} from"../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState , useEffect} from 'react';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router';
import './Registration.css';

const Registration:React.FC = () =>{
    const username = useRef<HTMLIonInputElement>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('user');
    const [fileName,setFilename] = useState('../public/favicon.png');
    const [selectedFile, setSelectedFile] = useState<File>();
    const storage = getStorage();
    console.log(storage)
    const history = useHistory();
    const db = getFirestore();
    console.log(db)
    const [users,setUsers] = useState<Array<any>>([]);

    const addData = async(url: string) => {
        try {
                const passwordValue = password;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(passwordValue, salt);
                const docRef = await addDoc(collection(db, "users"), {
                    username: username.current?.value,
                    email: email,
                    password: hashedPassword,
                    type: type,
                    foto: fileName,
                    fotoUrl: url
                });
                console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

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
        const storageRef = ref(storage, fileName);
        
        uploadBytes(storageRef, selectedFile as Blob).then(() => {
            console.log('upload file success');
            getDownloadURL(ref(storage, fileName)).then((url) =>{
                addData(url);
            })
        })
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

                                            <IonLabel className='label1'>Masukkan username yang diinginkan</IonLabel>
                                                <IonItem>
                                                    <IonInput type="text" ref={username} />
                                                </IonItem>

                                                <IonLabel className='label2'>Masukkan email yang diinginkan</IonLabel>
                                                <IonItem>
                                                     <IonInput type="email" onIonChange={(e:any)=>setEmail(e.target.value)}/>
                                                </IonItem>

                                                <IonLabel className='label2'>Masukkan password yang diinginkan</IonLabel>
                                                <IonItem>
                                                     <IonInput type="text" onIonChange={(e:any)=>setPassword(e.target.value)}/> 
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton className='button-1' shape="round" onClick={onSubmit}>Daftarkan</IonButton>
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
