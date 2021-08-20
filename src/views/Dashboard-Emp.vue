<template >
  <div @click="checkLogin">
    <div v-if="loading">
      <h4>Loading...</h4>
    </div>


    <!-- <v-row justify="center" align="center" class="mt-4">
        <v-col cols="24" md="5"> -->
       
            <AccessVehicle />
        
        <!-- </v-col>
           
           

    </v-row> -->



    <v-row justify="center" align="center">
     
      <v-col cols="12" sm="10" md="8" lg="10">
          <v-row>
            <v-col cols="12" md="20">
              <v-card class="mx-auto">
                <v-list
                  shaped
                  style="max-height: 500px"
                  class="overflow-y-auto"
                >
                  <v-list-item-group v-model="model">
                    <template v-for="(item, i) in allMessages">
                      <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>

                      <v-list-item
                        v-else
                        :key="`item-${i}`"
                        :value="item"
                        active-class="deep-purple--text text--accent-4"
                      >
                        <template v-slot:default="{}">
                          <v-list-item-content class="text-left align-self-start">
                            <v-list-item-title
                              v-text="`${item.messageToEmployee}`"
                              text-align: left
                            ></v-list-item-title>
                          </v-list-item-content>


                          <v-list-item-action>
                            <v-icon @click="showDialogbox('ok', item.messageToEmployee)"
                              >mdi-window-open</v-icon
                            >
                          </v-list-item-action>
                        
                        </template>
                      </v-list-item>
                    </template>

                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
      </v-col>
    </v-row>
    <!-- </v-row> -->
  </div>

</template>

<script>
import Vue from "vue";
import firebase from "firebase";
import AccessVehicle from "../components/DashboardEmp/AccessVehicle.vue";
// import VehicleCountDash from "../components/DashboardEmp/VehicleCountDash.vue";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; 

Vue.use(VueSweetalert2);  

export default {
  components: {
    AccessVehicle,
    // VehicleCountDash
  },

    updated() {
      if (this.$store.state.currentUser.logout_time != null) {
        if (Date.now() > this.$store.state.currentUser.logout_time) {
          this.$store.state.currentUser.username = "";
          this.$store.state.currentUser.fname = "";
          this.$store.state.currentUser.lname = "";
          this.$store.state.currentUser.login_time = null;
          this.$store.state.currentUser.logout_time = null;

          this.$router.push("/");
        }
      } else {
        this.$router.push("/");
      }
    },

    data() {
      return {
        show: false,
        loading: true,
        hasSaved: false,
        isEditing: null,
        model: null,
        states: [],
        message: '',
        slides: [],
        allMessages:[],
      };
    },



    methods: {
      showDialogbox(hello, messagesent){
        console.log(messagesent);
            this.$swal('Message', messagesent, 'OK');
      },

      checkLogin() {
        if (this.$store.state.currentUser.logout_time != null) {
          if (Date.now() > this.$store.state.currentUser.logout_time) {
            this.$store.state.currentUser.fname = "";
            this.$store.state.currentUser.lname = "";
            this.$store.state.currentUser.username = "";
            this.$store.state.currentUser.login_time = null;
            this.$store.state.currentUser.logout_time = null;

            this.$router.push("/");
          }
        } else {
          this.$router.push("/");
        }
      },

      customFilter(item, queryText) {
        const textOne = item.name.toLowerCase();
        const textTwo = item.abbr.toLowerCase();
        const searchText = queryText.toLowerCase();

        return (
          textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
        );
      },

      save() {
        this.isEditing = !this.isEditing;
        this.hasSaved = true;
      },

      cancel() {
        this.isEditing = !this.isEditing;
        this.hasSaved = true;
      },
    },

    created() {
      firebase
        .firestore()
        .collection('message')
        .get()
        .then(snap => {
          snap.forEach(message => {
            if(new Date().toLocaleDateString() == message.data().date){
                this.allMessages.push({ messageToEmployee: message.data().messageToEmployee, username: message.data().username, date: message.data().date, id: message.id});
            }
          });
        });

      console.log(this.allMessages);

      firebase
        .firestore()
        .collection("news")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            this.slides.push(doc.data().news);
          });
        });

      if (this.$store.state.currentUser.username != "") {
        this.loading = false;
      } else {
        this.$router.push("/");
      }
    },
};
</script>
