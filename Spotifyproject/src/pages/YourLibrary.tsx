import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import { search, add } from 'ionicons/icons';

const Tab3: React.FC = () => {
  const playlists = [
    { id: 1, name: 'Playlist 1' },
    { id: 2, name: 'Playlist 2' },
    { id: 3, name: 'Playlist 3' },
    // tambahkan lebih banyak playlist jika diperlukan
];
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <img src="path_to_your_profile_picture.jpg" alt="Profile" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
          </IonButtons>
          <IonTitle>Your Library</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
            <IonSegmentButton value="playlists">
              <IonLabel>Playlists</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="albums">
              <IonLabel>Albums</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="artists">
              <IonLabel>Artists</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Your library</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonToolbar>
          <IonSelect onIonChange={e => console.log('Sort selected', e.detail.value)}>
            <IonSelectOption value="recent">Most Recent</IonSelectOption>
            <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
          </IonSelect>
          <IonTitle slot='end'>View</IonTitle>
          <IonToggle slot='end' onIonChange={e => console.log('View changed', e.detail.checked)} />
        </IonToolbar>
          <IonList>
            {playlists.map(playlist => (
              <IonItem key={playlist.id} routerLink={`/playlist/${playlist.id}`}>
                <IonLabel>{playlist.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;