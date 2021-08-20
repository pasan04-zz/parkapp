<template>
  <v-form>
    <v-row @keydown.enter="login" justify="center" class="mt-10">
      <v-col v-if="!loading" cols="12" sm="10" md="8" lg="6">
        <v-card ref="form">
          <v-toolbar flat color="#ed5628">
            <v-icon class="white--text">mdi-account-star</v-icon>
            <v-toolbar-title class="font-weight-light white--text ml-3">
              OPCO login
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-text-field
              v-model="username"
              :rules="[() => !!username || 'Verplicht in tevullen']"
              label="Gebruikersnaam"
              placeholder="John Doe"
              @keydown.enter="login"
              required
            ></v-text-field
            ><br />

            <v-text-field
              v-model="password"
              autocomplete
              type="password"
              :rules="[() => !!password || 'Verplicht in tevullen']"
              label="Wachtwoord"
              placeholder="password"
              @keydown.enter="login"
              required
            ></v-text-field>
          </v-card-text>

          <v-divider class="mt-12"></v-divider>
          <v-card-actions>
            <v-btn class="ma-2" outlined color="warning" @click="clear" large
              >Annuleren</v-btn
            >

            <v-spacer></v-spacer>

            <v-btn class="ma-2" outlined color="success" large @click="login"
              >Inloggen</v-btn
            >
          </v-card-actions>

          <AlertBox :show="show" :showError="message" @clickOK="handleOK" />
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import AlertBox from '../components/DialogBox/Alertbox.vue';
import firebase from 'firebase';

export default {
  name: 'OPCO-Login',
  components: {
    AlertBox,
  },

  methods: {
    clear() {
      this.username = null;
      this.password = null;
    },

    login() {
      if (!this.username || !this.password) {
        this.show = false;
        this.message = 'Fields cannot be empty';
      } else {
        firebase
          .firestore()
          .collection('opco')
          .doc(this.username)
          .get()
          .then(usrDoc => {
            if (usrDoc.exists) {
              if (
                usrDoc.data().username === this.username &&
                usrDoc.data().password === this.password
              ) {
                const now_timestamp = Date.now();
                const expire_timestamp = now_timestamp + (10000000 * 60 * 60);

                this.$store.state.currentOPCO.username = this.username;
                this.$store.state.currentOPCO.login_time = now_timestamp;
                this.$store.state.currentOPCO.logout_time = expire_timestamp;

                this.show = true;
                this.message = 'Logged in!';

                this.$router.push('/opcodash').catch(() => {});
              } else {
                this.show = true;
                this.message = 'Incorrect password';
              }
            } else {
              this.show = true;
              this.message = 'No such user!';
            }
          });
      }
    },

    handleOK() {
      this.show = false;
    },
  },

  data() {
    return {
      username: '',
      password: '',
      show: false,
      message: '',
      loading: false,
    };
  },
};
</script>
