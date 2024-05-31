import { Redirect, Route } from 'react-router-dom';
import { IonApp,IonContent,IonHeader,IonIcon,IonItem,IonLabel,IonList,IonMenu,IonMenuToggle,IonRouterOutlet,IonTabBar,IonTabButton,IonTabs,IonTitle,IonToggle,setupIonicReact} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { flash, hammerOutline, homeOutline, libraryOutline, musicalNote, person, searchOutline, settings, time, triangle } from 'ionicons/icons';
import Tab1 from './pages/Home';
import Tab2 from './pages/Search';
import YourLibrary from './pages/YourLibrary';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import Account from './pages/Account';
import History from './pages/History';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Lupapassword from './pages/Lupapassword';
import Offline from './pages/OfflineM';
import PlaylistDetail1 from './pages/PlaylistDetail1';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Admin from './pages/Admin';
import { useState, useEffect, useContext, useRef } from 'react';
import Addartist from './pages/Addartist';
import PlayMusic2 from './pages/PlayMusic2';
import artistDetail from './pages/artistDetail';
import LogicRoute from './pages/LogicRoute';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { AuthContext } from "./context/ContextProvider";
import { AuthContextType } from "./context/ContextProvider";
import Addsong from './pages/Addsong';
import Addalbum from './pages/Addalbum';
import Editartist from './pages/Editartist';
import Editalbum from './pages/Editalbum';
import Editsong from './pages/Editsong';
import SearchGenre from './pages/SearchGenre';
import AlbumDetail from './pages/AlbumDetail';

setupIonicReact();

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const db = getFirestore();

  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth, setAuth } = authContext;

  const getStatusAdmin = async () => {
    if (!auth) return;

    const uid = auth.uid;
    const usersCollectionRef = collection(db, "users");

    try {
      const snapshot = await getDocs(
        query(usersCollectionRef, where("uid", "==", uid))
      );
      const currentProfile = snapshot.docs[0] as any;
      
      if (currentProfile.data().isAdmin == true) {
        setIsAdmin(true)
      }
      else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    getStatusAdmin();
  }, [auth]);

  return(
  <IonApp>
    <IonReactRouter>
      <IonMenu contentId="main">
        <IonHeader className="ion-padding">
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle>
              <IonItem button routerLink="/account">
                <IonIcon icon={person}size="large" />
                <IonLabel className='menu'>Profile</IonLabel>
              </IonItem>
              <IonItem button routerLink="/new">
                <IonIcon icon={flash}size="large" />
                <IonLabel className='menu'>Downloaded Music</IonLabel>
              </IonItem>
              <IonItem button routerLink="/history">
                <IonIcon icon={time} size="large"/>
                <IonLabel className='menu'>Listening History</IonLabel>
              </IonItem>
              {/* <IonItem button routerLink="/settings">
                <IonIcon icon={settings} size="large"/>
                <IonLabel className='menu'>Settings and privacy</IonLabel>
              </IonItem> */}
              { isAdmin && 
                <IonItem button routerLink="/admin">
                  <IonIcon icon={hammerOutline} size="large"/>
                  <IonLabel className='menu'>Admin</IonLabel>
                </IonItem>
              }
              {/* <IonItem button onClick={handleLogout}>
                <IonLabel className='menu'>Logout</IonLabel>
              </IonItem> */}
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonTabs>
        <IonRouterOutlet id="main">
          <Route exact path="/" component={LogicRoute} />
          <Route exact path="/tab1" component={Tab1} />
          <Route exact path="/account" component={Account} />
          <Route exact path="/history" component={History} />
          <Route exact path="/new" component={Offline} />
          <Route exact path="/tab2" component={Tab2} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/login" component={Login} />
          <Route path="/genre/:genre" component={SearchGenre} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/addartist" component={Addartist} />
          <Route path="/editartist/:artistId" component={Editartist} />
          <Route exact path="/addalbum" component={Addalbum} />
          <Route path="/editalbum/:albumId" component={Editalbum} />
          <Route exact path="/addsong" component={Addsong} />
          <Route path="/editsong/:songId" component={Editsong} />
          <Route exact path="/lupa" component={Lupapassword} />
          <Route exact path="/YourLibrary" component={YourLibrary} />
          <Route path="/album/:albumId" component={AlbumDetail} />
          <Route path="/artist/:artistId" component={artistDetail} />
          <Route path="/playlist/:playlistId" component={PlaylistDetail1} />
          <Route path="/play/:songId" component={PlayMusic2} />
        </IonRouterOutlet>
        { auth ?
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={searchOutline} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/YourLibrary">
              <IonIcon aria-hidden="true" icon={libraryOutline} />
              <IonLabel>Your Library</IonLabel>
            </IonTabButton>
            {/* <IonTabButton tab="tab4" href="/playmusic2">
              <IonIcon aria-hidden="true" icon={musicalNote} />
              <IonLabel>Play Music</IonLabel>
            </IonTabButton> */}
          </IonTabBar>
        :
          <IonTabBar slot="bottom"></IonTabBar>
        }
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
};
export default App;
