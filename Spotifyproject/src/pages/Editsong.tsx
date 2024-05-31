import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getFirestore, getDocs, serverTimestamp, query, updateDoc, where } from "firebase/firestore"; // Import serverTimestamp
import { useHistory, useParams } from 'react-router';
import "../firebaseConfig";

interface SongProps {
    name: string;
    album: string;
    albumId: string;
    artist: string;
    genre: string;
    photoURL: string;
    songURL: string;
}

const Editsong: React.FC = () => {
    const songID = useParams<{songId: string}>().songId;
    const [song, setSong] = useState<SongProps>({
        name: "",
        album: "",
        albumId: "",
        artist: "",
        genre: "",
        photoURL: "",
        songURL: "",
    });
    const [newSong, setNewSong] = useState<SongProps>({
        name: "",
        album: "",
        albumId: "",
        artist: "",
        genre: "",
        photoURL: "",
        songURL: "",
    });
    const history = useHistory();
    const namalagu = useRef<HTMLIonInputElement>(null);
    const [fileName0, setFilename0] = useState('');
    const [fileName1, setFilename1] = useState('');
    const [selectedFile0, setSelectedFile0] = useState<File>();
    const [selectedFile1, setSelectedFile1] = useState<File>();
    const [selectedAlbum, setSelectedAlbum] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const storage = getStorage();
    const db = getFirestore();
    const [albums, setAlbums] = useState<Array<any>>([]);

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

    const getSongData = async () => {
        const artistCollectionRef = collection(db, "song");

        try {
            const snapshot = await getDocs(query(artistCollectionRef));
  
            snapshot.docs.map((doc) => {
                if(doc.id == songID) {
                    const currentSongData = {
                        name: doc.data().name,
                        albumId: doc.data().albumId,
                        album: doc.data().album,
                        artistId: doc.data().artistId,
                        artist: doc.data().artist,
                        genre: doc.data().genre,
                        photoURL: doc.data().photoURL,
                        songURL: doc.data().songURL,
                    } as SongProps;
                    setSelectedAlbum(doc.data().albumId)
                    setSelectedGenre(doc.data().genre)
                    setSong(currentSongData)
                    setNewSong(currentSongData)
                }
            });
        } catch (error) {
            console.error("Error fetching artist data:", error);
        }
    }

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

    const handleUpdateSong = async () => {
        if (song?.name == newSong?.name && 
            !selectedFile0 && 
            !selectedFile1 && 
            song?.albumId == selectedAlbum &&
            song?.genre == selectedGenre) return

        try {
            const songCollection = collection(db, "song");
            const snapshot = await getDocs(query(songCollection));
            const songDocRef = snapshot.docs.filter(x => x.id == songID)[0].ref;

            await updateDoc(songDocRef, {
                name: newSong?.name,
                albumId: selectedAlbum,
                album: albums.filter((x) => x.id == selectedAlbum)[0]?.name,
                artistId: albums.filter((x) => x.id == selectedAlbum)[0]?.artistId,
                artist: albums.filter((x) => x.id == selectedAlbum)[0]?.artist,
                genre: selectedGenre
            });

            if(selectedFile0) {
                let pathPhotoSong = decodeURIComponent(snapshot.docs.filter(x => x.id == songID)[0].data().photoURL.split("/o/")[1].split("?alt=")[0]);
                const photoSongRef = ref(storage, pathPhotoSong);
                deleteObject(photoSongRef)

                let downloadURL: string | null = null;
                downloadURL = (await savePhotoToFirebase()) as string;
                await updateDoc(songDocRef, {
                    photoURL: downloadURL,
                });
            }

            if(selectedFile1) {
                let pathSong = decodeURIComponent(snapshot.docs.filter(x => x.id == songID)[0].data().songURL.split("/o/")[1].split("?alt=")[0]);
                const songRef = ref(storage, pathSong);
                deleteObject(songRef)

                let downloadSongURL: string | null = null;
                downloadSongURL = (await saveSongToFirebase()) as string;
                await updateDoc(songDocRef, {
                    songURL: downloadSongURL,
                });
            }

            if(song?.albumId != selectedAlbum) {
                try {
                    const albumCollectionRef = collection(db, "album");
                    const snapshotAlbum = await getDocs(query(albumCollectionRef));
                    const oldAlbumDocRef = snapshotAlbum.docs.filter(x => x.id == song?.albumId)[0].ref;
                    const newAlbumDocRef = snapshotAlbum.docs.filter(x => x.id == selectedAlbum)[0].ref;
    
                    if(oldAlbumDocRef) {
                        await updateDoc(oldAlbumDocRef, {
                            songs: albums.filter((x) => x.id == song?.albumId)[0]?.songs.filter((y:any) => y != songID)
                        });
                    }

                    if(newAlbumDocRef) {
                        const newAlbumSongs = [...albums.filter((x) => x.id == selectedAlbum)[0]?.songs, songID]
                        await updateDoc(newAlbumDocRef, {
                            songs: newAlbumSongs
                        });
                    }
                } catch (error) {
                    console.error("Error getting documents: ", error);
                }
            }
            history.push('/admin');
        } catch (error) {
            console.log("GAGAL")
        } finally {
            console.log("BERHASIL")
        }
    }

    useEffect(() => {
        setNewSong({ ...newSong, songURL: song.songURL })
    }, [song])

    useEffect(() => {
        getSongData();
        getData();
    }, [])
    
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
                                                    <IonInput type="text" name="name" value={newSong?.name} onIonInput={handleInputChange} />
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
                                                    {newSong.songURL &&   
                                                        <audio controls>
                                                            <source src={newSong.songURL} type="audio/mpeg"></source>
                                                        </audio>
                                                    }
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan lagu untuk mengganti lagu</IonLabel>
                                                </IonItem>
                                                <IonItem>
                                                    <input type="file" accept=".mp4, .mp3" onChange={fileLaguChangeHandler} />
                                                </IonItem>
                                                <IonItem>
                                                    <img src={newSong?.photoURL} />
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Masukkan gambar untuk mengganti foto</IonLabel>
                                                </IonItem>
                                                <IonItem>
                                                    <input type="file" onChange={fileChangeHandler} />
                                                </IonItem>
                                            </IonItemGroup>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleUpdateSong}>Simpan</IonButton>
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

export default Editsong;
