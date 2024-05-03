// SettingsPage.tsx
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton } from '@ionic/react';

const SettingsPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/YourLibrary" />
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonItem>
                        <IonLabel>Dark Saver</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Content Preferences</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Devices</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Navigation and Other Apps</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Car</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Privacy and Social</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Audio Quality</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Video Quality</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Storage</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Notifications</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Local Files</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Advertisements</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>About</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Logout</IonLabel>
                        <IonToggle slot="end" />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default SettingsPage;
