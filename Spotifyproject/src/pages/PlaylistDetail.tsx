import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import albums from '../mockdata/albums';

const AlbumPage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const decodedTitle = decodeURIComponent(title);
    setData(albums[decodedTitle]);
  }, [title]);

  // Helper function for image names
  const dasherize = (string: string) => {
    return string.replace(/[A-Z]/g, function(char, index) {
      return (index !== 0 ? '-' : '') + char.toLowerCase();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': data?.backgroundColor }}>
          <IonButtons slot="start">
            <IonBackButton text="" color="light" defaultHref="/tabs/tab1" />
          </IonButtons>
          <IonTitle color="light">{data?.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--custombg': data?.backgroundColor }}>
        {data &&
          <>
            <div className="ion-text-center image-box">
              <img src={`/assets/images/albums/${dasherize(data.image)}.jpg`} alt="" />
            </div>

            <div className="main">
              <IonRow>
                <IonCol size="12" className="album-info">
                  <p>{data.artist}</p>
                  <span>Album {data.title} · {data.released}</span>
                </IonCol>
                <IonCol size="8" className="ion-text-left ion-no-padding">
                  <IonButton fill="clear" className="ion-no-margin">
                    <IonIcon name="heart-outline" color="light" slot="icon-only" />
                  </IonButton>
                  <IonButton fill="clear">
                    <IonIcon name="arrow-down-circle-outline" color="light" slot="icon-only" />
                  </IonButton>
                  <IonButton fill="clear">
                    <IonIcon name="ellipsis-horizontal" color="light" slot="icon-only" />
                  </IonButton>
                </IonCol>
                <IonCol size="4" className="ion-text-right ion-no-padding">
                  <IonButton fill="clear">
                    <IonIcon name="play-circle" size="large" color="primary" slot="icon-only" />
                  </IonButton>
                </IonCol>
              </IonRow>

              <IonList>
                {data.tracks.map((t: any) => (
                  <IonItem key={t.title} lines="none">
                    <IonLabel>
                      {t.title}
                      <p>{data.artist}</p>
                    </IonLabel>
                    <IonIcon slot="end" size="small" name="ellipsis-horizontal" color="light" />
                  </IonItem>
                ))}
              </IonList>
            </div>
          </>
        }
      </IonContent>
    </IonPage>
  );
};


export default AlbumPage;
