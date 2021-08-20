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
            Vehicle Count</v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text>
          <v-row justify="center" align="center">

            <v-col cols="24" md="6">
              <v-card class="mx-auto">
                <v-list shaped>
                  <v-list-item-group v-model="model">
                    
                    <template v-for="(item, i) in allVehicleTypes">
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
                              v-text="item.vehicle_type_name"
                            ></v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-icon @click="handleUpdate(item.vehicle_type_name,item.vehicle_count)"
                              >mdi-update</v-icon
                            >
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="24" md="6">
              <v-card class="mx-auto">
                 <v-card-actions>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Vehicle Count"
                          v-model="vehicleCount"
                          placeholder="Vehicle Count"
                        />
                      </v-col>
                    <v-btn color="success" @click="updateVehicleCount()">
                      Update Count
                    </v-btn>
                  </v-card-actions>
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
import firebase from "firebase/app";
import "firebase/firestore";
import AlertBox from "../DialogBox/Alertbox.vue";

export default {
  components: {
    AlertBox,
  },

  created() {
    this.allVehicleTypes = [];
    firebase
      .firestore()
      .collection('vehicle_type')
      .get()
      .then(snap => {
        snap.forEach(vehicle => {
          this.allVehicleTypes.push({ vehicle_type_name: vehicle.data().name, vehicle_count: vehicle.data().vehicle_count});
        });
    });

  },

  

  data() {
    return {
      loading: false,
      show: false,
      message: "",
      type_items: [],
      model: ["Carrots"],

      allVehicleTypes: [],
      vehicleCount: '',
      vehicleType: '',
    };
  },

  methods: {
    handleOK() {
      this.show = false;
    },

    update_status_list() {
      this.allVehicleTypes = [];
      firebase
        .firestore()
        .collection('vehicle_type')
        .get()
        .then(snap => {
          snap.forEach(vehicle => {
            this.allVehicleTypes.push({ vehicle_type_name: vehicle.data().name, vehicle_count: vehicle.data().vehicle_count});
          });
      });
    },

    handleUpdate(vehicle_type, vehicle_count) {
      this.vehicleCount = vehicle_count;
      this.vehicleType = vehicle_type;
    },

  update_vehicle_list() {
      this.type_items = [];

      firebase
        .firestore()
        .collection("vehicle_type")
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            this.type_items.push(doc.data());
          });
        });
  },

    updateVehicleCount(){
      firebase
        .firestore()
        .collection("vehicle_type")
        .doc(this.vehicleType).update({vehicle_count: parseInt(this.vehicleCount)})
        .then(() =>{
          this.show = true;
          this.message = "Vehicle count updated succesfully!";
          this.update_status_list(); // reload the updated vehicle types again..
      }).catch(err => console.error(err));
    },
  },
};
</script>
