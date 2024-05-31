import { IonPage, IonHeader, IonContent, IonGrid, IonRow, IonCol, IonButtons, IonBackButton, IonIcon, IonTitle, IonToolbar, IonImg, IonList, IonAvatar, IonItem, IonButton, IonLabel, IonInput } from '@ionic/react';
import { add, addOutline, camera, ellipsisVerticalOutline, play } from 'ionicons/icons';
import React, { useEffect, useState } from'react';
import { Photo, Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useHistory, useParams } from 'react-router';
import { collection, getDocs, getFirestore, query, updateDoc } from 'firebase/firestore';
import { isPlatform } from "@ionic/react";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface PlaylistProps {
    id: string;
    name: string;
    userId: string;
    photoURL: string;
    song: [];
}

interface PhotoProps {
    filePath: string;
    webviewPath?: string;
}

const PlaylistDetail1:React.FC = () =>{
    const playlistID = useParams<{playlistId: string}>().playlistId;
    const [playlist, setPlaylist] = useState<PlaylistProps | null>({
        id: "",
        name: "",
        userId: "",
        photoURL: "",
        song: [],
    });
    const [songsId, setSongsId] = useState<Array<any>>([]);
    const [songs, setSongs] = useState<Array<any>>([]);
    const db = getFirestore();
    const storage = getStorage();
    const history = useHistory();

    const [photoState, setPhoto] = useState<PhotoProps | null>(null);
    const [newPhoto, setNewPhoto] = useState<string>('');

    const spaceBetween = {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    };

    const base64FromPath = async (path: string): Promise<string> => {
        const response = await fetch(path);
        const blob = await response.blob();
    
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject("Method didn't return a string.");
            }
          };
    
          reader.readAsDataURL(blob);
        });
    };

    const takePhotoHandler = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = new Date().getTime() + ".jpeg";
        const savedFileImage = await savePhoto(photo, fileName);
        setPhoto(savedFileImage);
        setNewPhoto(savedFileImage?.webviewPath ?? '')
    };

    const saveToFirestore = async () => {
        const playlistCollectionRef = collection(db, "playlist");
        const snapshot = await getDocs(query(playlistCollectionRef));
        // snapshot.docs.forEach((doc) => {
        //     if(doc.id == playlistID && doc.data().photoURL) {
        //         let pathPlaylistPhoto = decodeURIComponent(doc.data()?.photoURL.split("/o/")[1].split("?alt=")[0]);
        //         const photoPlaylistRef = ref(storage, pathPlaylistPhoto);
        //         deleteObject(photoPlaylistRef)
        //     }
        // })

        let downloadURL: string | null = null;
        if (photoState) {
          downloadURL = (await savePhotoToFirebase(photoState)) as string;
          snapshot.docs.forEach(async (doc) => {
            if(doc.id == playlistID) {
                await updateDoc(doc.ref, {
                    photoURL: downloadURL,
                })
            }
          })
        }
    }

    useEffect(() => {
        saveToFirestore();
        fetchPlaylist();
    }, [newPhoto])

    const savePhoto = async (
        photo: Photo,
        fileName: string
      ): Promise<PhotoProps> => {
        let base64data: string;
    
        if (isPlatform("hybrid")) {
          const file = await Filesystem.readFile({
            path: fileName,
            directory: Directory.Data,
          });
          base64data = file.data as string;
        } else {
          base64data = await base64FromPath(photo.webPath!);
        }
    
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: base64data,
        });
    
        if (isPlatform("hybrid")) {
          return {
            filePath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
          };
        }
        return {
          filePath: fileName,
          webviewPath: photo.webPath,
        };
    };

    const savePhotoToFirebase = async (photo: PhotoProps) => {
        try {
          const storageRef = ref(
            storage,
            `playlist_photo/${playlist?.name}/${photo.filePath}`
          );
    
          const fileContent = await Filesystem.readFile({
            path: photo.filePath,
            directory: Directory.Data,
          });
    
          const binaryString = atob(fileContent.data as string);
    
          const blob = new Blob(
            [new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)))],
            { type: "image/jpeg" }
          );
    
          const file = new File([blob], photo.filePath, { type: "image/jpeg" });
    
          await uploadBytes(storageRef, file);
    
          return await getDownloadURL(storageRef);
        } catch (error) {
          return error;
        }
      };

    const removeFromPlaylist = async (songId: string) => {
      try {
        const playlistCollection = collection(db, "playlist")
        const snapshotPlaylist = await getDocs(query(playlistCollection))
        snapshotPlaylist.docs.forEach( async (doc) => {
          if(doc.id == playlistID) {
            await updateDoc(doc.ref, {
                song: doc.data().song.filter((x:any) => x != songId),
            });
            setSongs(songs.filter(x => x.id != songId))
            console.log("BERHASIL DELETE")
          }
        })
      } catch (error) {
        console.error("Error add to playlist: ", error);
      }
    }

    async function fetchPlaylist() {
        try {
            setPlaylist({        
                id: "",
                name: "",
                userId: "",
                photoURL: "",
                song: [],
            });
            const playlistCollectionRef = collection(db, "playlist");
            const snapshot = await getDocs(query(playlistCollectionRef));
            snapshot.docs.forEach((doc) => {
                if(doc.id == playlistID) {
                  setSongsId(doc.data().song)
                  const currPlaylist = {
                    id: doc.id,
                    name: doc.data().name,
                    userId: doc.data().userId,
                    photoURL: doc.data().photoURL,
                    song: doc.data().song,
                  } as PlaylistProps;
                  setPlaylist(currPlaylist);
                }
            })
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    const fetchSongs = async () => {
        try {
          const songCollection = collection(db, "song");
          const snapshot = await getDocs(query(songCollection));
          snapshot.docs.forEach((doc) => {
            if(songsId.includes(doc.id)) {
              setSongs((prevSong) => [
                ...prevSong,
                {
                    id: doc.id,
                    name: doc.data().name,
                    albumId: doc.data().albumId,
                    album: doc.data().album,
                    artistId: doc.data().artistId,
                    artist: doc.data().artist,
                    songURL: doc.data().songURL,
                    photoURL: doc.data().photoURL,
                }
              ])
            }
          })
        } catch (error) {
          console.error("Error getting songs: ", error);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [])
    
    useEffect(() => {
        if(songs.length == 0) fetchSongs();
    }, [playlist])

    return(
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <IonBackButton defaultHref='/YourLibrary' />
                        </IonButtons>
                        <IonTitle>
                            <IonInput value={playlist?.name}/>
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
                                                {
                                                    newPhoto ? <img src={newPhoto} /> :
                                                    playlist?.photoURL ? <img src={playlist?.photoURL} /> :
                                                    <h3>No photo chosen.</h3>
                                                }
                                                {/* {!playlist?.photoURL && <h3>No photo chosen.</h3>}
                                                {newPhoto && <img src={newPhoto} />}
                                                {playlist?.photoURL && <img src={playlist?.photoURL} />} */}
                                            </div>
                                            <IonButton fill="clear" onClick={takePhotoHandler}>
                                                <IonIcon slot="start" icon={camera} />
                                                <IonLabel>Take Photo</IonLabel>
                                            </IonButton>
                                            <IonList>
                                                {songs.map((song, index) => (
                                                    <IonItem key={index}>
                                                        <IonAvatar slot="start">
                                                            <IonImg src={song.photoURL} />
                                                        </IonAvatar>
                                                        <div style={spaceBetween}>
                                                            <IonLabel style={{marginTop: 'auto', marginBottom: 'auto'}}>{song.name}</IonLabel>
                                                            <IonLabel onClick={() => history.push(`/play/${song.id}`)} style={{marginTop: 'auto', marginBottom: 'auto'}}>Play</IonLabel>
                                                            <IonButton onClick={() => removeFromPlaylist(song.id)} style={{marginTop: 'auto', marginBottom: 'auto'}}>Remove</IonButton>
                                                        </div>
                                                    </IonItem>
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