import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Tab2: React.FC = () => {
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
  ]
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow>
            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
              <IonGrid className='ion-no-padding'>
                <IonCol>
                  <IonAvatar>
                    <img alt="abc" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                  </IonAvatar>
                  <IonTitle>Cari</IonTitle>
                </IonCol>
                <IonButtons slot='end'>
                  <IonButton><IonIcon icon={cameraOutline} /></IonButton>
                </IonButtons>
                <IonRow>
                  <IonCol>
                    <IonSearchbar showClearButton="always" value=""></IonSearchbar>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <h1>Jelajahi Genre</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{draggable:true}}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {data.map(user => (
                        <SwiperSlide key={user.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src='../public/favicon.png' className='user-photo' />
                            </div>
                            <h5>{user.username}</h5>
                            <p className='user-testimonials'>"<i>{user.testimonial}</i>"</p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <h1>Jelajahi Artis</h1>
                    <br />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2}
                      scrollbar={{draggable:true}}
                      onSlideChange={() => console.log('slide change')}
                      onSwiper={swiper => console.log(swiper)}
                    >
                      {data.map(user => (
                        <SwiperSlide key={user.id} className='slide'>
                          <div className='slide-content'>
                            <div className='user-image'>
                              <img src='../public/favicon.png' className='user-photo' />
                            </div>
                            <h5>{user.username}</h5>
                            <p className='user-testimonials'>"<i>{user.testimonial}</i>"</p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
