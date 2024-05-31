import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore, getDocs, serverTimestamp, query, updateDoc, Timestamp } from "firebase/firestore"; // Import serverTimestamp
import { useHistory } from 'react-router';
import "../firebaseConfig";

interface SongProps {
    name: string;
    photoURL: string;
}

const Addsong: React.FC = () => {
    const [song, setSong] = useState<SongProps>({
        name: "",
        photoURL: "",
    });
    const history = useHistory();
    const namalagu = useRef<HTMLIonInputElement>(null);
    const [fileName0, setFilename0] = useState('');
    const [fileName1, setFilename1] = useState('');
    const [selectedFile0, setSelectedFile0] = useState<File>();
    const [selectedFile1, setSelectedFile1] = useState<File>();
    const [selectedAlbum, setSelectedAlbum] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [albums, setAlbums] = useState<Array<any>>([]);
    const storage = getStorage();
    const db = getFirestore();

    const genres = [
        {
          id: 1,
          nama: 'Rock',
          image: '',
          link: '/genre0'
        },
        {
          id: 2,
          nama: 'Pop',
          image: '',
          link: '/genre1'
        },
        {
          id: 3,
          nama: 'Jazz',
          image: '',
          link: '/genre2'
        },
        {
          id: 4,
          nama: 'Classical',
          image: '',
          link: '/genre3'
        },
        {
          id: 5,
          nama: "80's",
          image: '',
          link: '/genre4'
        },
        {
          id: 6,
          nama: "Hip-Hop",
          image: '',
          link: '/genre5'
        },
        {
          id: 7,
          nama: "Indie",
          image: '',
          link: '/genre6'
        }
    ];

    useEffect(() => {
        async function getData() {
            try {
                const artistCollectionRef = collection(db, "album");
                const snapshot = await getDocs(query(artistCollectionRef));
                setAlbums(snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    artistId: doc.data().artistId,
                    artist: doc.data().artist,
                    songs: doc.data().songs,
                })));
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        }
        getData();
    }, [db]);

    const handleInputChange = (ev: Event) => {
        const { value, name } = ev.target as HTMLInputElement;
        setSong((prevSong) => ({
          ...prevSong,
          [name]: value,
        }));
    };

    const savePhotoToFirebase = async () => {
        try {
          const storageRef = ref(
            storage,
            `song_photo/${song?.name}/${fileName0}`
          );

          await uploadBytes(storageRef, selectedFile0 as Blob);
    
          return await getDownloadURL(storageRef);
        } catch (error) {
          return error;
        }
    };

    const saveSongToFirebase = async () => {
        try {
            const storageRef = ref(
              storage,
              `song/${song?.name}/${fileName1}`
            );
  
            await uploadBytes(storageRef, selectedFile1 as Blob);
      
            return await getDownloadURL(storageRef);
          } catch (error) {
            return error;
        }
    }

    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile0(event.target.files![0]);
        setFilename0(event.target.files![0].name);
    };

    const fileLaguChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile1(event.target.files![0]);
        setFilename1(event.target.files![0].name);
    };

    const handleSaveSong = async () => {
        if (!song.name && !selectedFile0 && !selectedFile1 && !selectedAlbum && !selectedGenre) return

        try {
            let downloadURL: string | null = null;
            let downloadSongURL: string | null = null;
            downloadURL = (await savePhotoToFirebase()) as string;
            downloadSongURL = (await saveSongToFirebase()) as string;
            await addDoc(collection(db, "song"), {
                name: song?.name,
                albumId: selectedAlbum,
                album: albums.filter((x) => x.id == selectedAlbum)[0]?.name,
                artistId: albums.filter((x) => x.id == selectedAlbum)[0]?.artistId,
                artist: albums.filter((x) => x.id == selectedAlbum)[0]?.artist,
                genre: selectedGenre,
                photoURL: downloadURL,
                songURL: downloadSongURL,
                createdAt: Timestamp.now(),
            });
            try {
                const songCollectionRef = collection(db, "song");
                const snapshot = await getDocs(query(songCollectionRef));
                snapshot.docs.forEach(async (doc) => {
                    if(doc.data().name == song?.name && doc.data().albumId == selectedAlbum) {
                        const albumCollection = collection(db, "album");
                        const snapshotAlbum = await getDocs(query(albumCollection));
                        const albumDocRef = snapshotAlbum.docs.filter(x => x.id == selectedAlbum)[0].ref;
                        const albumSongs = [...albums.filter((x) => x.id == selectedAlbum)[0]?.songs, doc.id]
                        await updateDoc(albumDocRef, {
                            songs: albumSongs,
                        });
                    }
                })
                
            } catch (error) {
                console.error("Error getting documents: ", error);
            }

            history.push('/admin');
        } catch (error) {
            console.log("GAGAL")
        } finally {
            console.log("BERHASIL")
        }
    }
    
    // const insertHandler0 = async () => {
    //     if (selectedFile0 && selectedFile1 && selectedAlbum) {
    //         const storageRef0 = ref(storage, fileName0);
    //         const storageRef1 = ref(storage, fileName1);
    //         Promise.all([
    //             uploadBytes(storageRef0, selectedFile0),
    //             uploadBytes(storageRef1, selectedFile1)
    //         ]).then(() => {
    //             console.log('upload files success');
    //             Promise.all([
    //                 getDownloadURL(storageRef0),
    //                 getDownloadURL(storageRef1)
    //             ]).then(([urlFoto, urlLagu]) => {
    //                 addLagu(urlFoto, urlLagu);
    //             }).catch((error) => {
    //                 console.error("Error getting download URL: ", error);
    //             });
    //         }).catch((error) => {
    //             console.error("Error uploading files: ", error);
    //         });
    //     }
    // };

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Admin</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
                                <IonGrid className='ion-no-padding'>
                                    <IonRow>
                                        <IonCol>
                                            <IonItemGroup>
                                                <IonItem>
                                                    <IonLabel>Masukkan nama lagu</IonLabel>
                                                    <IonInput type="text" name="name" onIonInput={handleInputChange} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Pilih album</IonLabel>
                                                    <IonSelect value={selectedAlbum} onIonChange={(e) => setSelectedAlbum(e.detail.value)}>
                                                        {albums.map((album) => (
                                                            <IonSelectOption key={album.id} value={album.id}>{album.name}</IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Pilih genre</IonLabel>
                                                    <IonSelect value={selectedGenre} onIonChange={(e) => setSelectedGenre(e.detail.value)}>
                                                        {genres.map((genre) => (
                                                            <IonSelectOption key={genre.id} value={genre.nama}>{genre.nama}</IonSelectOption>
                                                        ))}
                                                    </IonSelect>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan lagunya</IonLabel>
                                                    <input type="file" accept=".mp4, .mp3" onChange={fileLaguChangeHandler} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan foto lagu</IonLabel>
                                                    <input type="file" onChange={fileChangeHandler} />
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleSaveSong}>Simpan</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    )
};

export default Addsong;
