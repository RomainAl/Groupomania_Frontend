<template>
  <v-row align="center" class="list px-3 mx-auto">

    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Users</v-card-title>

        <v-data-table
          :headers="headers"
          :items="users"
          enable-pagination
          :hide-default-footer="false"
          @click:row="handleClick"
        >

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="deleteUser(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        
        <v-alert  type="error" v-if="message">
          {{message}}
        </v-alert>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import UserDataService from "../services/UserDataService";
export default {
  name: "user-list",
  data() {
    return {
      users: [],
      username: "",
      headers: [],
      message: ''
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {

    handleClick(value) {
      this.highlightClickedRow(value);
    },

    retrieveUsers() {

      UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
          
        })
        .catch((e) => {
          console.log(e);
          this.message = "Impossible to show user list!";
        });
        
    },

    refreshList() {
      this.retrieveUsers();
    },

    headersScreenDependance(){
        this.headers = [
                        { text: "Username", align: "start", sortable: true, value: "username" },
                        { text: "email", value: "email", sortable: true },
                        { text: "Actions", value: "actions", sortable: false },
                      ]
    },

    deleteUser(id) {
      UserDataService.delete(id)
        .then(() => {
          this.refreshList();
          this.message = "User deleted!";
        })
        .catch((e) => {
          console.log(e);
          this.message = "Impossible to delete the user!";
        });
    },
  },

  mounted() {
    this.message = "";
    this.retrieveUsers();
    this.headersScreenDependance();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
