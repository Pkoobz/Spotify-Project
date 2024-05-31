import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonAvatar, IonTitle, IonButton, IonIcon, IonItem, IonList, IonImg, IonLabel } from '@ionic/react';
import { ellipsisVerticalOutline } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
collection,
getDocs,
updateDoc,
doc,
where,
query,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";
import './Account.css'

interface ProfileProps {
    id: string;
    name: string;
    email: string;
    photoURL: string;
}

const defaultPP = "https://ionicframework.com/docs/img/demos/avatar.svg"

const Account:React.FC = () => {
    const [profile, setProfile] = useState<ProfileProps | null>({
        id: "",
        name: "",
        email: "",
        photoURL: "",
    });
    const profileRef = useRef(false);
    const history = useHistory();
    const [playlists, setPlaylists] = useState<Array<any>>([]);
    const authContext = useContext(AuthContext) as AuthContextType;
    const { auth, setAuth } = authContext;

    const getUserProfile = async () => {
        if (!auth) return;
    
        const uid = auth.uid;
        const usersCollectionRef = collection(db, "users");
    
        try {
          const snapshot = await getDocs(
            query(usersCollectionRef, where("uid", "==", uid))
          );
          const currentProfile = snapshot.docs[0] as any;
    
          if (currentProfile) {
            const profile = {
              id: currentProfile.id,
              name: currentProfile.data().name,
              email: currentProfile.data().email,
              photoURL: currentProfile.data().photoURL ?? defaultPP,
            } as ProfileProps;
            setProfile(profile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
    };

    async function fetchPlaylists() {
        try {
            const userCollection = collection(db, "users");
            const snapshotUser = await getDocs(query(userCollection, where("uid", "==", auth?.uid)));
    
            const playlistCollectionRef = collection(db, "playlist");
            const snapshot = await getDocs(query(playlistCollectionRef, where("userId", "==", snapshotUser.docs[0].id)));
            setPlaylists(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                photoURL: doc.data().photoURL
            })));
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        setAuth(null);
        history.push("/login");
    };

    useEffect(() => {
        getUserProfile();
        fetchPlaylists();
    }, [auth]);

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
                                                <img src={profile?.photoURL} />
                                            </IonAvatar>
                                            <IonTitle>{profile?.name}</IonTitle>
                                            {/* <h5>0 pengikut | 3 mengikuti</h5> */}
                                        </IonCol>
                                    </IonRow>
                                    <IonList>
                                        {playlists.map((playlist) => (
                                            <>
                                            <IonItem key={playlist.id} routerLink={`/playlist/${playlist.id}`} className='ion-padding'>
                                            <IonButtons slot='start'>
                                            <IonImg src={playlist.photoURL || '../public/favicon.png'} style={{width: "80px", height: "80px"}}/>
                                            </IonButtons>
                                            <IonLabel>{playlist.name}</IonLabel>
                                            <IonButtons slot='end'>
                                                <IonIcon icon={ellipsisVerticalOutline} />
                                            </IonButtons>
                                            </IonItem>
                                            </>
                                        ))}
                                    </IonList>
                                    {/* <IonRow>
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
                                    </IonRow> */}
                                    <IonRow>
                                        <IonButton onClick={handleLogout}>Logout</IonButton>
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
