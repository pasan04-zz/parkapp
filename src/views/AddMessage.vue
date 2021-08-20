<template>
  <div>
    <div v-if="loading"><h3>Loading...</h3></div>
    <div>


      <v-card
        class="overflow-hidden"
        min-height="500"
        color="purple lighten-1"
        dark
      >
        <v-toolbar flat color="purple">
          <v-toolbar-title class="font-weight-light ml-3">
            Add New Message</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text>
          <v-row>
            <v-textarea
                  v-model="messageToEmployee"
                  label="Enter message here"
                  outlined
                  class="mt-5 ml-5 mr-5"
            ></v-textarea>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn color="warning" @click="this.resetForm"> Annuleren </v-btn>
          <v-btn color="success" @click="send_message">
            Send Message
          </v-btn>
        </v-card-actions>

        <v-divider></v-divider><br />

        <v-card-text>
          <h3>Sent Messages</h3>
          <br/>
          <v-row>
            <v-col cols="40" md="12">
              <v-card class="mx-auto">
                <v-list
                  shaped
                  style="max-height: 140px"
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
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="`${item.messageToEmployee} --->  ${item.date}`"
                            ></v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-icon @click="handleDelete(item.id)"
                              >mdi-close</v-icon
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
        </v-card-text>

        <AlertBox :show="show" :showError="message" @clickOK="handleOK" />
      </v-card>

    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import AlertBox from '../components/DialogBox/Alertbox.vue';

export default {
  components: {
    AlertBox,
  },

  created() {
    firebase
      .firestore()
      .collection('message')
      .get()
      .then(snap => {
        snap.forEach(message => {
          this.allMessages.push({ messageToEmployee: message.data().messageToEmployee, username: message.data().username, date: message.data().date, id: message.id});
        });
      });
  },

  data() {
    return {
      show: false,
      loading: false,
      message: '',
      model: null,

      user_list: [],
      selected_user: '',
      retype_password: '',
      new_password: '',
      userType: '',
      messageToEmployee: '',
      allMessages: [], 
    };
  },

  methods: {

    update_data() {
      this.allMessages = [];
      firebase
        .firestore()
        .collection('message')
        .get()
        .then(snap => {
          snap.forEach(message => {
            this.allMessages.push({ messageToEmployee: message.data().messageToEmployee,username: message.data().username, date: message.data().date, id: message.id});
          });
        });
    },


    handleDelete(id) {
        firebase
          .firestore()
          .collection('message')
          .doc(id)
          .delete()
          .then(() => {
            this.show = true;
            this.message = 'Message Deleted Successfully!';
            this.update_data();
          })
          .catch(err => console.log(err));
    },

    resetForm() {
      this.messageToEmployee = '';
    },

    handleOK() {
      this.show = false;
    },

    send_message() {
        if (
            this.messageToEmployee !== ''
        ) {
            firebase
              .firestore()
              .collection('message')
              .doc(this.messagetoemployee)
              .get()
              .then(userDoc => {
                if (userDoc.exists) {
                  this.show = true;
                  this.message = 'Message already exists. Please enter different type message !';
                } else {
                  firebase
                    .firestore()
                    .collection('message')
                    .doc(this.messagetoemployee)
                    .set({
                        username: this.$store.state.currentOPCO.username,
                        messageToEmployee: this.messageToEmployee,
                        date: new Date().toLocaleDateString()
                    })
                    .then(() => {
                      this.show = true;
                      (this.message = 'You have successfully sent a message.'),
                        this.update_data();
                    });
                }
              });
        } else {
            this.show = true;
            this.message = 'Please enter a message here !';
        }
    },
  },
};


</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* Track */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 6px;
  border-radius: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 6px;
  border-radius: 6px;
  background: rgba(255, 0, 0, 0.8);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}
</style>
