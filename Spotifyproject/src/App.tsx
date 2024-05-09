import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { flash, homeOutline, libraryOutline, person, searchOutline, settings, time } from 'ionicons/icons';
import Tab1 from './pages/Home';
import Tab2 from './pages/Search';
import YourLibrary from './pages/YourLibrary';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Settings from './pages/Settings';
import Account from './pages/Account';
import New from './pages/New';
import History from './pages/History';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Lupapassword from './pages/Lupapassword';
import Lupapassword1 from './pages/Lupapassword1';
import Playmusic from './pages/PlayMusic';
import PlaylistDetail1 from './pages/PlaylistDetail1';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

setupIonicReact();

const App: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      history.push("/login");
      console.log("Signed out successfully");
    }).catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
  };

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
                  <IonLabel className='menu'>What's new</IonLabel>
                </IonItem>
                <IonItem button routerLink="/history">
                  <IonIcon icon={time} size="large"/>
                  <IonLabel className='menu'>Listening History</IonLabel>
                </IonItem>
                <IonItem button routerLink="/settings">
                  <IonIcon icon={settings} size="large"/>
                  <IonLabel className='menu'>Settings and privacy</IonLabel>
                </IonItem>
                <IonItem button onClick={handleLogout}>
                  <IonLabel className='menu'>Logout</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
        </IonMenu>
      <IonTabs>
        <IonRouterOutlet id="main">
          <Route exact path="/tab1" component={Tab1} />
          <Redirect exact path="/" to="/login" />
          <Route exact path="/account" component={Account} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/playmusic" component={Playmusic} />
          <Route exact path="/new" component={New} />
          <Route exact path="/history" component={History} />
          <Route exact path="/tab2" component={Tab2} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/lupa" component={Lupapassword} />
          <Route exact path="/lupa1" component={Lupapassword1} />
          <Route exact path="/YourLibrary" component={YourLibrary} />
          <Route exact path="/playlist/:playlistId" component={PlaylistDetail1} />
        </IonRouterOutlet>
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
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
