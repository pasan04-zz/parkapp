import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';


import firebase from 'firebase';


//original firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyCymO1f8p8Vj29nXeNPgmu5Iw_QBa8HTe0',
//   authDomain: 'bookaride-dbff6.firebaseapp.com',
//   projectId: 'bookaride-dbff6',
//   storageBucket: 'bookaride-dbff6.appspot.com',
//   messagingSenderId: '497615065978',
//   appId: '1:497615065978:web:3fc27d164ec4a9ca81bcc3',
//   measurementId: 'G-T891S2PBHV',
// };


//testing firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyBHwLstR1mpHVN9OkEvwcpLPkFHfgu64Cs",
//   authDomain: "vuejsapp-ee06e.firebaseapp.com",
//   projectId: "vuejsapp-ee06e",
//   storageBucket: "vuejsapp-ee06e.appspot.com",
//   messagingSenderId: "158431559458",
//   appId: "1:158431559458:web:d78c037bfef172e879af7b",
//   measurementId: "G-3SNMHMXGTE"
// };

//new hosting..
var firebaseConfig = {
  apiKey: "AIzaSyB32DEZlLJ3dPU3Ppnb0euVRg6Og8YO0qw",
  authDomain: "vehiclebookingapp-79cc4.firebaseapp.com",
  projectId: "vehiclebookingapp-79cc4",
  storageBucket: "vehiclebookingapp-79cc4.appspot.com",
  messagingSenderId: "971856229865",
  appId: "1:971856229865:web:18d2ea44dbc18907770778",
  measurementId: "G-1GLLNFF6Y8"
};

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');


