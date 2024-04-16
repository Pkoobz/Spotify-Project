import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonBackButton, IonSearchbar } from '@ionic/react';

const PlaylistPage: React.FC = () => {
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
                    <IonTitle>My Playlists</IonTitle>
                    {/* user pfp */}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
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

export default PlaylistPage;