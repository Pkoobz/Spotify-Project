import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { search, add, ellipsisVerticalCircle, ellipsisVerticalOutline, camera } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { OverlayEventDetail } from '@ionic/core/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { collection, addDoc, getFirestore, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const Tab3: React.FC = () => {
  const db = getFirestore();
  const [artists, setArtists] = useState<Array<any>>([]);

  const [takenPhoto, setTakenPhoto] = useState<{
    path: string | undefined,
    preview: string
}>();

const takePhotoHandler = async () => {
    const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 80,
        width: 500
    });
    console.log(photo);

    if (!photo || !photo.webPath) {
        return;
    }

    setTakenPhoto({
        path: photo.path,
        preview: photo.webPath
    });
};
  useEffect(() => {
      async function getData() {
          try {
              const querySnapshot = await getDocs(collection(db, "artists"));
              setArtists(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          } catch (error) {
              console.error("Error getting documents: ", error);
          }
      }
      getData();
  }, [db]);
  const [selectedSegment, setSelectedSegment] = useState<string>('playlists');
  const [modalLabel, setModalLabel] = useState<string>('Buat nama playlist baru');
  const playlists = [
    { id: 1, name: 'Playlist 1' },
    { id: 2, name: 'Playlist 2' },
    { id: 3, name: 'Playlist 3' },
    // tambahkan lebih banyak playlist jika diperlukan
  ];
  
  const data = [
    {
      id:1,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:2,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:3,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:4,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:5,
      username:'abc',
      testimonial:'dwedo'
    },
    {
      id:6,
      username:'abc',
      testimonial:'dwedo'
    },
  ];
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  useEffect(() => {
    if (selectedSegment === 'albums') {
      setModalLabel('Buat nama album baru');
    } else if (selectedSegment === 'artists'){
      setModalLabel('Buat nama artist baru');
    } else {
      setModalLabel('Buat nama playlist baru')
    }
  }, [selectedSegment]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            <img src="path_to_your_profile_picture.jpg" alt="Profile" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
          </IonButtons>
          <IonTitle>Your Library</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
            <IonButton id="open-modal" expand="block" >
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar>
          <IonSegment onIonChange={(e) => setSelectedSegment(e.detail.value as string)}>
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
        {selectedSegment === 'albums' && (
        <>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Your library</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonToolbar>
          <IonSelect onIonChange={(e) => console.log('Sort selected', e.detail.value)}>
            <IonSelectOption value="recent">Most Recent</IonSelectOption>
            <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
          </IonSelect>
          <IonTitle slot="end">View</IonTitle>
          <IonToggle slot="end" onIonChange={(e) => console.log('View changed', e.detail.checked)} />
        </IonToolbar>
          <IonRow>
            <IonCol>
              {data.map((user) => (
                <>
                  <IonCard className='ion-text-center ion-padding'>
                    <IonCardHeader>
                      <div id="a">
                        <IonAvatar>
                          <IonImg src='../public/favicon.png' />
                        </IonAvatar>
                      </div>
                    </IonCardHeader>
                    <IonCardTitle>{user.username}</IonCardTitle>
                    <IonCardContent>{user.testimonial}</IonCardContent>
                  </IonCard>
                </>
              ))}
            </IonCol>
          </IonRow>
        </>
        )}
        {selectedSegment === 'artists' && (
        <>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Your library</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonToolbar>
            <IonSelect onIonChange={(e) => console.log('Sort selected', e.detail.value)}>
              <IonSelectOption value="recent">Most Recent</IonSelectOption>
              <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
            </IonSelect>
            <IonTitle slot="end">View</IonTitle>
            <IonToggle slot="end" onIonChange={(e) => console.log('View changed', e.detail.checked)} />
          </IonToolbar>
          <IonRow>
            <IonCol>
              <IonList>
                {artists.map((artist, index) => (
                  <IonItem key={index + 1} className='ion-padding'>
                    <IonButtons slot='start'>
                      <IonAvatar>
                        <IonImg src={artist.fotoUrl} />
                      </IonAvatar>
                    </IonButtons>
                    <IonTitle>{artist.namaartist}</IonTitle>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </>
        )}
        {selectedSegment !== 'albums' && selectedSegment !== 'artists' && (
          <>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Your library</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonToolbar>
              <IonSelect onIonChange={(e) => console.log('Sort selected', e.detail.value)}>
                <IonSelectOption value="recent">Most Recent</IonSelectOption>
                <IonSelectOption value="alphabetical">Alphabetical</IonSelectOption>
              </IonSelect>
              <IonTitle slot="end">View</IonTitle>
              <IonToggle slot="end" onIonChange={(e) => console.log('View changed', e.detail.checked)} />
            </IonToolbar>
            <IonRow className="ion-text-center">
              <IonCol>
                <div className="image-preview">
                  {!takenPhoto && <h3>No photo chosen.</h3>}
                  {takenPhoto && <img src={takenPhoto.preview} alt="Preview" />}
                </div>
                <IonButton fill="clear" onClick={takePhotoHandler}>
                  <IonIcon slot="start" icon={camera} />
                  <IonLabel>Take Photo</IonLabel>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonList>
              {playlists.map((playlist) => (
                <>
                <IonItem key={playlist.id} routerLink={`/playlist/${playlist.id}`} className='ion-padding'>
                  <IonButtons slot='start'>
                    <IonImg src='../public/favicon.png' />
                  </IonButtons>
                  <IonLabel>{playlist.name}</IonLabel>
                  <IonButtons slot='end'>
                    <IonIcon icon={ellipsisVerticalOutline} />
                  </IonButtons>
                </IonItem>
                </>
              ))}
            </IonList>
          </>
        )}
        <IonModal ref={modal} trigger="open-modal">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Welcome</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position='floating'>{modalLabel}</IonLabel>
              <IonInput type='text' />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
export default Tab3;
