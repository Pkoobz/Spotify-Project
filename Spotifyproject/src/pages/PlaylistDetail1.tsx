import { IonPage, IonHeader, IonContent, IonGrid, IonRow, IonCol, IonButtons, IonBackButton, IonIcon, IonTitle, IonToolbar, IonImg, IonList, IonAvatar, IonItem, IonButton, IonLabel, IonInput } from '@ionic/react';
import { add, addOutline, camera, ellipsisVerticalOutline } from 'ionicons/icons';
import React, { useState } from'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const PlaylistDetail1:React.FC = () =>{
    const data = [
        { id: 1, username: 'abc', testimonial: 'dwedo' },
        { id: 2, username: 'abc', testimonial: 'dwedo' },
        { id: 3, username: 'abc', testimonial: 'dwedo' },
        { id: 4, username: 'abc', testimonial: 'dwedo' },
        { id: 5, username: 'abc', testimonial: 'dwedo' },
        { id: 6, username: 'abc', testimonial: 'dwedo' },
    ];

    const [playlistName, setPlaylistName] = useState<string>('Playlist 1');
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
    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <IonBackButton defaultHref='/YourLibrary' />
                        </IonButtons>
                        <IonTitle>
                            Playlist 1
                        </IonTitle>
                        <IonButtons slot='end'>
                            <IonIcon icon={add} size='large' />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                                <IonGrid className='ion-no-padding'>
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
                                            <br />
                                            <IonInput value={playlistName} onIonChange={e => setPlaylistName(e.detail.value!)} />
                                            <br />
                                            <IonList>
                                                {data.map((user) => (
                                                    <>
                                                        <IonItem>
                                                            <IonButtons slot='start'>
                                                                <IonAvatar>
                                                                    <IonImg src='../public/favicon.png' />
                                                                </IonAvatar>
                                                            </IonButtons>
                                                            <IonTitle>{user.username}</IonTitle>
                                                            <IonButtons slot='end'>
                                                                <IonIcon icon={ellipsisVerticalOutline} />
                                                            </IonButtons>
                                                        </IonItem>
                                                        <br />
                                                    </>
                                                ))}
                                            </IonList>
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
};
export default PlaylistDetail1;