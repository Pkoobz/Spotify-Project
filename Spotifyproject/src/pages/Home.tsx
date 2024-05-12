import { IonAvatar, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonTab, IonTabs, IonTitle, IonToolbar, IonicSlides } from '@ionic/react';
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Tab1: React.FC = () => {
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          console.log("uid", uid)
        } else {
          console.log("user is logged out")
        }
      });
     
}, [])
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
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonGrid>
          <IonRow>
            <IonCol size-sm="8" offset-sm="2" size-md="6" offset-md="3">
              <IonGrid className='ion-no-padding'>
                <IonRow>
                  <IonCol>
                    <IonAvatar>
                      <img alt="abc" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                  </IonCol>
                </IonRow>
                <br />
                <IonRow>
                  <IonCol>
                    <h1>Recommended songs</h1>
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
                    <h1>Recently played</h1>
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
                    <h1>Album from every artists</h1>
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
                    <h1>New songs</h1>
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
                    <h1>New artists</h1>
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

export default Tab1;
