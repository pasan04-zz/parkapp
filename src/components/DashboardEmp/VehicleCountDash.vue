<template>
<div>
  <v-card
    class="overflow-hidden"
    min-height="500"
    color="white"
    
  >
    <v-toolbar flat color="#0036d9">
      <v-icon class="white--text">mdi-antenna</v-icon>
      <v-toolbar-title class="font-weight-light ml-3 white--text">
        Live data</v-toolbar-title
      >
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-row justify="center" align="center" class="mt-4">
        <v-col cols="24" md="5">
          <v-card-text style="padding-left: 60px;">
            <h2 style="color: black;padding-left: 60px;"><u>Category</u></h2>
            <br/>
              <ul style="color: black;list-style: none; ">
                <li v-for="item in allVehicleTypes" :key="item.vehicle_type_name">
                  <h2>{{ item.vehicle_type_name }}</h2><br/>
                </li>
              </ul>
          </v-card-text>
        </v-col>
            <v-col cols="24" md="5">
              <v-card-text style="padding-left: 80px;">
                <h2 style="color: black;padding-left: 120px;"> <u>Online</u></h2>
                <br/>
                  <ul style="color: black;list-style: none; text-align:center;">
                    <li v-for="item in allVehicleTypes" :key="item.vehicle_count">
                      <h2>{{ item.vehicle_count }}</h2><br/>
                    </li>
                  </ul>
              </v-card-text>
        </v-col>
    </v-row>

    <!-- <v-divider></v-divider> -->

    <AlertBox :show="show" @clickOK="handleOK" :showError="message" />
  </v-card>
</div>
</template>

<script>
import firebase from "firebase";
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
      loading: true,
      show : false,
      message : '',


      allVehicleTypes: [],
      vehicleType: '',
      vehicleCount: '',

    };
  },

  methods: {

  },
};
</script>