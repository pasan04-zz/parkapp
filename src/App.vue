<template>
  <v-app>
    <div v-if="!loading">
      <v-app-bar color="#FFC926" dense dark>
        <v-toolbar-title><b>TDA ANWB Aanmeldsysteem</b></v-toolbar-title>

        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              icon
              large
              class="mr-5"
              @click="employee"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <span>Employee / Logout</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              icon
              large
              @click="opcologin"
              class="mr-5"
            >
              <v-icon>mdi-account-star </v-icon>
            </v-btn>
          </template>
          <span>OPCO / Logout</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              icon
              large
              @click="adminlogin"
              class="mr-5"
            >
              <v-icon>mdi-account-key </v-icon>
            </v-btn>
          </template>
          <span>Admin / Logout</span>
        </v-tooltip>

        <!-- <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list style="width: 200px">
            <v-list-item @click="true">
              <v-list-item-title>About</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="logged_in" @click="handleSignOut">
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->

        <Comfirm :show="show" @results="handleLogout" />
        <Drawer />
      </v-app-bar>
    </div>

    <v-main>
      <router-view />
    </v-main>

    <v-footer>
      <a
        v-if="this.$route.name == 'EmployeeDash'"
        href="https://discordapp.com/users/brahimarmani#4707"
        style="text-decoration: none"
        target="blank"
        >Heeft u problemen? Discord: brahimarmani#4707</a
      >
      <a
        v-if="this.$route.name == 'AdminDash'"
        href="https://discordapp.com/users/brahimarmani#4707"
        style="text-decoration: none"
        target="blank"
        >Heeft u problemen? Discord: brahimarmani#4707</a
      >
      <a
        v-if="this.$route.name == 'Home'"
        href="https://discordapp.com/users/brahimarmani#4707"
        style="text-decoration: none"
        target="blank"
        >Heeft u problemen? Discord: brahimarmani#4707</a
      >
      <a
        v-if="this.$route.name == 'AdminLogin'"
        href="https://discordapp.com/users/brahimarmani#4707"
        style="text-decoration: none"
        target="blank"
        >Heeft u problemen? Discord: brahimarmani#4707</a
      >
      <a
        v-if="this.$route.name == 'OPCOLogin'"
        href="https://discordapp.com/users/brahimarmani#4707"
        style="text-decoration: none"
        target="blank"
        >Heeft u problemen? Discord: brahimarmani#4707</a
      >
      <a
        v-if="this.$route.name == 'OPCODash'"
        href="https://discordapp.com/users/brahimarmani#4707"
        style="text-decoration: none"
        target="blank"
        >Heeft u problemen? Discord: brahimarmani#4707</a
      >
      <v-spacer></v-spacer>
      <div>
        &copy; {{ new Date().getFullYear() }}
        <a href="#" style="text-decoration: none" target="blank">TDA ANWB</a>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from "firebase";
import Drawer from "../src/components/Navigation/Drawer";
import Comfirm from "../src/components/DialogBox/ConfirmLogout.vue";

export default {
  name: "App",

  components: {
    Drawer,
    Comfirm,
  },

  data: () => ({
    url: "",
    show: false,
    drawer: false,
    loading: true,
    logged_in: false,
    count: 0,
  }),

  updated() {
    if (this.$store.state.currentUser.logout_time != null) {
      if (Date.now() > this.$store.state.currentUser.logout_time) {
        this.$store.state.currentUser.username = "";
        this.$store.state.currentUser.login_time = null;
        this.$store.state.currentUser.logout_time = null;
      }
    }
  },

  created() {
    if (this.$store.state.currentUser.username != "") {
      this.logged_in = true;
    }
    this.loading = false;
  },

  methods: {
    employee() {
      this.url = "/";

      if (
        this.$store.state.currentAdmin.username != "" ||
        this.$store.state.currentUser.username != "" ||
        this.$store.state.currentOPCO.username != ""
      ) { 
        this.show = true;
      } else {
        this.$router.push("/");
      }
    },

    adminlogin() {
      this.url = "/adminlogin";

      if (
        this.$store.state.currentAdmin.username != "" ||
        this.$store.state.currentUser.username != "" ||
        this.$store.state.currentOPCO.username != ""
      ) {
        this.show = true;
      } else {
        this.$router.push("/adminlogin");
      }
    },

    opcologin() {
      this.url = "/opcologin";

      if (
        this.$store.state.currentAdmin.username != "" ||
        this.$store.state.currentUser.username != "" ||
        this.$store.state.currentOPCO.username != ""
      ) {
        this.show = true;
      } else {
        this.$router.push("/opcologin");
      }
    },

    handleLogout(res) {
      if (res) {
        //remove vehicle from db
        if (this.$store.state.currentUser != "") {
          this.changeCount();
        }

        this.$store.state.currentUser.username = "";
        this.$store.state.currentAdmin.username = "";
        this.$store.state.currentOPCO.username = "";
        this.$router.push(this.url);
      }
      this.show = false;
    },

    changeCount() {
      firebase
        .firestore()
        .collection("access_list")
        .doc(
          this.$store.state.currentUser.fname +
            "_" +
            this.$store.state.currentUser.lname
        )
        .get()
        .then((doc) => {
          const type = doc.data().type;

          firebase
            .firestore()
            .collection("vehicle_type")
            .doc(type)
            .get()
            .then((doc) => {
              this.count = Number(doc.data().vehicle_count);
            })
            .then(() => {
              firebase
                .firestore()
                .collection("vehicle_type")
                .doc(type)
                .update({
                  vehicle_count: this.count - 1,
                });
            })
            .then(() => {
              firebase
                .firestore()
                .collection("access_list")
                .doc(
                  this.$store.state.currentUser.fname +
                    "_" +
                    this.$store.state.currentUser.lname
                )
                .delete();
            });
        });
    },

    // handleSignOut() {
    //   firebase
    //     .auth()
    //     .signOut()
    //     .then(() => {
    //       this.logged_in = false;
    //       this.$router.push("/");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
  },
};
</script>
