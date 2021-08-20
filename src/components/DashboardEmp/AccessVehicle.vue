<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col sm="6">
          <v-card class="overflow-hidden ms-6" min-height="500" color="white">
            <v-toolbar flat color="#0036d9">
              <v-icon class="white--text">mdi-account</v-icon>
              <v-toolbar-title class="font-weight-light ml-3 white--text">
                Kies Je Voertuig</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="fname"
                    solo
                    :rules="[() => !!fname || 'This field is required']"
                    :disabled="true"
                    color="white"
                    label="Voornaam"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="lname"
                    solo
                    :rules="[() => !!fname || 'This field is required']"
                    :disabled="true"
                    color="white"
                    label="Achternaam"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-autocomplete
                :disabled="!isEditing"
                solo
                v-model="type"
                :items="vehicle_list"
                color="white"
                item-text="name"
                label="Type voertuig"
              ></v-autocomplete>

              <v-autocomplete
                name="LeaveType"
                :disabled="!isEditing"
                solo
                v-model="status"
                :items="status_list"
                color="white"
                item-text="name"
                label="Status"
                @change="onChange"
              ></v-autocomplete>
            </v-card-text>

            <v-card-actions>
              <v-btn
                :disabled="!isEditing"
                color="error"
                x-large
                @click="handleLogout"
              >
                UITLOGGEN
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!isEditing"
                color="success"
                x-large
                @click="save"
              >
                Indienen
              </v-btn>
            </v-card-actions>
            <v-divider></v-divider>

      <center><h3 style="font-family: Roboto; font-size : 25px; margin-top : 10px; font-weight : bold; ">Vergeet niet bij het uit dienst gaan op de uitloggen knop te drukken</h3></center>
            <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
              New Access Vehicle Created
            </v-snackbar>

            <AlertBox :show="show" @clickOK="handleOK" :showError="message" />
          </v-card>
        </v-col>
        <v-col sm="6">
          <v-card class="overflow-hidden ms-6" min-height="500" color="white">
            <v-toolbar flat color="#0036d9">
              <v-icon x-large class="white--text">mdi-antenna</v-icon>
              <v-toolbar-title class="font-weight-light ml-3 white--text">
                Live informatie</v-toolbar-title
              >

              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <v-container class="mb-6"> <div style="font-family: Roboto; font-size : 18px; margin-top : 10px; font-weight : bold; color :black">
                <v-row no-gutters style="height: 40px; fontsize: 18px">
                  <v-col> Category </v-col>
                  <v-col style="padding-left: 20px"> Active </v-col>
                </v-row>

                <div v-for="item in liveCounter" :key="item">
                 
                  <v-row>
                    <v-col>
                      {{ item.name }}
                    </v-col>
                    <v-col>
                      {{ item.vehicle_count }}
                    </v-col>
                  </v-row>
                 
                </div> </div>
                  <Comfirm :show="show" @results="handleLogout" />
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import firebase from "firebase";
import AlertBox from "../DialogBox/Alertbox.vue";
import Comfirm from "../../../src/components/DialogBox/ConfirmLogout.vue";

export default {
  components: {
    AlertBox,
    Comfirm,
  },

  created() {
    this.vehicle_list = [];
    this.status_list = [];
    this.names = [];
    this.liveCounter = [];

    this.fname = this.$store.state.currentUser.fname;
    this.lname = this.$store.state.currentUser.lname;

    firebase
      .firestore()
      .collection("access_list")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          if (doc.data().merge == false || !doc.data().merge) {
            if (
              doc.data().fname == this.$store.state.currentUser.fname &&
              doc.data().lname == this.$store.state.currentUser.lname
            ) {
              this.names.push(doc.id);
              this.fname = doc.data().fname;
              this.lname = doc.data().lname;
              this.status = doc.data().status;
              this.type = doc.data().type;
            }
          } else {
            if (
              doc.data().name1 ==
                this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname ||
              doc.data().name2 ==
                this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname
            ) {
              if (
                doc.data().name1 ==
                this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname
              ) {
                this.status = doc.data().status1;
                this.type = doc.data().type1;
              } else {
                this.status = doc.data().status2;
                this.type = doc.data().type2;
              }

              this.fname = this.$store.state.currentUser.fname;
              this.lname = this.$store.state.currentUser.lname;

              this.names.push(doc.id);
            }
          }
        });
      });

    firebase
      .firestore()
      .collection("access_list")
      .onSnapshot((newSnap) => {
        newSnap.forEach((doc) => {
          if (doc.data().merge == false || !doc.data().merge) {
            if (
              doc.data().fname == this.$store.state.currentUser.fname &&
              doc.data().lname == this.$store.state.currentUser.lname
            ) {
              this.names.push(doc.id);
              this.fname = doc.data().fname;
              this.lname = doc.data().lname;
              this.status = doc.data().status;
              this.type = doc.data().type;
            }
          } else {
            if (
              doc.data().name1 ==
                this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname ||
              doc.data().name2 ==
                this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname
            ) {
              if (
                doc.data().name1 ==
                this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname
              ) {
                this.status = doc.data().status1;
                this.type = doc.data().type1;
              } else {
                this.status = doc.data().status2;
                this.type = doc.data().type2;
              }

              this.fname = this.$store.state.currentUser.fname;
              this.lname = this.$store.state.currentUser.lname;

              this.names.push(doc.id);
            }
          }
        });
      });

    firebase
      .firestore()
      .collection("vehicle_type")
      .get()
      .then((snapshot) => {
        this.vehicle_list = [];
        snapshot.forEach((doc) => {
          this.vehicle_list.push(doc.data().name);
        });
      })
      .catch((err) => console.log(err));

    firebase
      .firestore()
      .collection("status")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.status_list.push(doc.data().name);
        });
      })
      .then(() => {
        this.status_list.push("Uitdient");
      });

    firebase
      .firestore()
      .collection("vehicle_type")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.vehicle_list.push(doc.data());
        });
      })
      .catch((err) => console.log(err));

    setInterval(() => {
      this.liveCounter = [];
      firebase
        .firestore()
        .collection("vehicle_type")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.liveCounter.push(doc.data());
          });
        })
        .catch((err) => console.log(err));
    }, 3000);


  },

  data() {
    return {
      loading: true,
      hasSaved: false,
      isEditing: true,
      model: null,
      status_list: [],
      vehicle_list: [],

      names: [],
      fullname: null,
      updated_status: null,

      fname: "",
      lname: "",
      type: null,
      status: null,
      show: false,
      message: "",
      liveCounter: [],
      tempLiveCount: [],
    };
  },

  methods: {



    handleLogout(res) {

      this.show = true;
      if(res === true){
          firebase
            .firestore()
            .collection("access_list")
            .doc(`${this.fname}_${this.lname}`)
            .delete()
            .then(() => {
              console.log("deleted!");
            })
            .then(() => {
              console.log("Change count called");
              setTimeout(() => {
                console.log(this.type);
                this.changeCount(this.type, "dec");
              }, 1000);
            })
            .then(() => {
              this.$router.push("/");
            });
      }
      if(res === false){
          this.show = false;
      }
    },



    update_name_list() {
      this.names = [];
      firebase
        .firestore()
        .collection("access_list")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.data().merge == false || !doc.data().merge) {
              if (
                doc.data().fname == this.$store.state.currentUser.fname &&
                doc.data().lname == this.$store.state.currentUser.lname
              ) {
                this.names.push(doc.id);
                this.fullname =
                  this.$store.state.currentUser.fname +
                  " " +
                  this.$store.state.currentUser.lname;
              }
            } else {
              if (
                doc.data().name1 ==
                  this.$store.state.currentUser.fname +
                    " " +
                    this.$store.state.currentUser.lname ||
                doc.data().name2 ==
                  this.$store.state.currentUser.fname +
                    " " +
                    this.$store.state.currentUser.lname
              ) {
                this.names.push(doc.id);
              }
            }
          });
        });
    },

    get_today_date() {
      const d = new Date();
      const year = d.getFullYear();
      const month =
        (d.getMonth() + 1).toString().length == 2
          ? d.getMonth() + 1
          : "0" + (d.getMonth() + 1).toString();
      const date = d.getDate();
      return year.toString() + "-" + month + "-" + date.toString();
    },

    get_today_time() {
      const today = new Date();
      let mins;
      let seconds = today.getSeconds().toString();

      if (today.getMinutes().toString().length < 2) {
        mins = "0" + today.getMinutes().toString();
      } else {
        mins = today.getMinutes().toString();
      }

      if (seconds.length < 2) {
        seconds = "0" + today.getSeconds().toString();
      }

      return today.getHours() + ":" + mins + ":" + seconds;
    },

    save() {
      if (
        this.fname == "" ||
        this.lname == "" ||
        this.type == null ||
        this.status == null
      ) {
        this.show = true;
        this.message = "Fields cannot be empty";
      } else { 
        //check for the vehicle type availability
        firebase
          .firestore()
          .collection("vehicle_type")
          .doc(this.type)
          .get() 
          .then((check) => {
            if (check.data().vehicle_count > 0) {
              firebase
                .firestore()
                .collection("access_list")
                .doc(this.fname + "_" + this.lname)
                .get()
                .then((check) => {
                  firebase
                    .firestore()
                    .collection("access_list")
                    .get()
                    .then((snap) => {
                      snap.forEach((checkItem) => {
                        if (
                          checkItem.id.includes(this.fname + " " + this.lname)
                        ) {
                          if (
                            checkItem.data().name1 ==
                            this.$store.state.currentUser.fname +
                              " " +
                              this.$store.state.currentUser.lname
                          ) {
                            if (this.status == "Uitdienst") {
                              firebase
                                .firestore()
                                .collection("access_list")
                                .doc(checkItem.id)
                                .delete()
                                .then(() => {
                                  this.show = true;
                                  this.message =
                                    "You have updated your old status";
                                });
                            } else {
                              firebase
                                .firestore()
                                .collection("access_list")
                                .doc(checkItem.id)
                                .update({
                                  status1: this.status,
                                  type1: this.type,
                                  time:
                                    this.get_today_date() +
                                    " " +
                                    this.get_today_time(),
                                })
                                .then(() => {
                                  console.log("type 1");
                                });
                            }
                          } else {
                            if (this.status == "Uitdienst") {
                              firebase
                                .firestore()
                                .collection("access_list")
                                .doc(checkItem.id)
                                .delete()
                                .then(() => {
                                  this.show = true;
                                  this.message =
                                    "You have updated your old status";
                                });
                            } else {
                              firebase
                                .firestore()
                                .collection("access_list")
                                .doc(checkItem.id)
                                .update({
                                  status2: this.status,
                                  type2: this.type,
                                  time:
                                    this.get_today_date() +
                                    " " +
                                    this.get_today_time(),
                                })
                                .then(() => {
                                  console.log("type 2");
                                });
                            }
                          }
                        }
                      });
                    });
                  if (check.exists) {
                    if (this.status == "Uitdienst") {
                      firebase
                        .firestore()
                        .collection("access_list")
                        .doc(this.fname + "_" + this.lname)
                        .delete()
                        .then(() => {
                          this.show = true;
                          this.message =
                            "Status updated successfully [Deleted Record!]";
                          this.update_name_list();
                        });
                    } else {
                      firebase
                        .firestore()
                        .collection("access_list")
                        .doc(this.fname + "_" + this.lname)
                        .update({
                          status: this.status,
                          type: this.type,
                          time:
                            this.get_today_date() + " " + this.get_today_time(),
                        })
                        .then(() => {
                          this.show = true;
                          this.message = "You have updated your old status";
                        })
                        .catch((update_err) => {
                          this.show = true;
                          this.message = update_err;
                        });
                    }
                  } else {
                    firebase
                      .firestore()
                      .collection("access_list")
                      .doc(this.fname + "_" + this.lname)
                      .set({
                        fname: this.fname,
                        lname: this.lname,
                        status: this.status,
                        time:
                          this.get_today_date() + " " + this.get_today_time(),
                        type: this.type,
                      })
                      .then(() => {
                        this.show = true;
                        this.message = "Your Vehicle Data Saved!";
                        // this.isEditing = !this.isEditing;
                        this.hasSaved = true;
                        // this.fname = null;
                        // this.lname = null;
                        // this.status = null;
                        // this.type = null;
                        this.fname = this.$store.state.currentUser.fname;
                        this.lname = this.$store.state.currentUser.lname;
                      })
                      .then(() => {
                        console.log("Change count called");
                        setTimeout(() => {
                          if(this.status == "Beschikbaar")
                          this.changeCount(this.type, "inc");
                        }, 1000);
                      })
                      .catch((error) => {
                        console.error("Error writing document: ", error);
                      });
                  }
                });
            } else {
              this.show = true;
              this.message = "Not available";
            }
          });
      }
    },

    update_status() {
      if (this.fullname != null && this.updated_status != null) {
        if (this.updated_status == "Uitdienst") {
          firebase
            .firestore()
            .collection("access_list")
            .doc(this.fullname)
            .delete()
            .then(() => {
              this.show = true;
              this.message = "Status updated successfully";
              this.update_name_list();
            });
        } else {
          firebase
            .firestore()
            .collection("access_list")
            .doc(this.fullname)
            .get()
            .then((document) => {
              if (document.data().merge) {
                firebase
                  .firestore()
                  .collection("access_list")
                  .doc(document.id)
                  .update({
                    status1: this.updated_status,
                    status2: this.updated_status,
                  })
                  .then(() => {
                    this.show = true;
                    this.message = "Status updated successfully";

                    this.fullname = null;
                    this.updated_status = null;
                  })
                  .catch((err) => {
                    console.log("the new error is ", err);
                  });
              } else {
                firebase
                  .firestore()
                  .collection("access_list")
                  .doc(document.data().fname + "_" + document.data().lname)
                  .update({
                    status: this.updated_status,
                  })
                  .then(() => {
                    this.show = true;
                    this.message = "Status updated successfully";

                    this.fullname = null;
                    this.updated_status = null;
                  })
                  .catch((err) => {
                    if (err.includes("No document to update")) {
                      this.show = true;
                      this.message =
                        "Your access data might be deleted by the admin";
                    } else {
                      this.show = true;
                      this.message =
                        "[Error Code 001] - Please contact tech team for more informations!";
                    }
                  });
              }
            })
            .catch((err) => {
              console.log("new", err);
            });
        }
      } else {
        this.show = true;
        this.message = "Please fill out all fields!";
      }
    },

    handleOK() {
      this.show = false;
    },

    onChange(event) {
      //remove value from db and redirect the user on changing the value of dropdown
      if (event == "Uitdient") {
        this.cancel();
      }



    },
    cancel() {



      firebase
        .firestore()
        .collection("access_list")
        .doc(`${this.fname}_${this.lname}`)
        .delete()
        .then(() => {
          console.log("deleted!");
        })
        .then(() => {
          console.log("Change count called");
          setTimeout(() => {
            console.log(this.type);
            this.changeCount(this.type, "dec");
          }, 1000);
        })
        .then(() => {
          //redirect to user login
          this.$router.push("/");
        });



    },

    changeCount(vehicle, type) {
      firebase
        .firestore()
        .collection("vehicle_type")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let count = Number(doc.data().vehicle_count);
            let name = doc.data().name;
            if (name == vehicle) {
              if (type == "inc") {
                firebase
                  .firestore()
                  .collection("vehicle_type")
                  .doc(name)
                  .update({
                    vehicle_count: count + 1,
                  });
              } else {
                firebase
                  .firestore()
                  .collection("vehicle_type")
                  .doc(name)
                  .update({
                    vehicle_count: count - 1,
                  });
              }
            }
          });
        });
    },
  },
};
</script>