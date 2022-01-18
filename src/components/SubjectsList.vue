<template>
  <v-container fluid>
    <v-row 
      justify="center"
      >

      <v-toolbar
          color="primary"
          dark
          flat
        >
        
          <v-card-title class="text-h6 font-weight-regular">
            FORUM
          </v-card-title>
          <v-spacer></v-spacer>
          <v-text-field 
            class="mt-7" 
            v-model="title" 
            label="Search by Title">
          </v-text-field>
          <v-btn class="mr-2" small @click="searchTitle">
            <v-icon >mdi-send</v-icon>
          </v-btn>
        </v-toolbar>

      <v-expansion-panels 
        class="mt-7"
        popout
        focusable
        light
        >

        <v-expansion-panel
          v-for="(subject, i) in subjects"
          :key="i"
        >
          <v-expansion-panel-header class="elevation-12">
            <v-row
              align="center"
              class="spacer"
            >
              <v-col
                cols="4"
                sm="2"
                md="2"
              >
                <v-avatar
                  size="56px"
                >
                  <img
                    v-if="true"
                    alt="Avatar"
                    src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
        >
                  <v-icon
                    v-else>
                    mdi-message-image</v-icon>
                </v-avatar>
              </v-col>

              <v-col
                class="text-no-wrap"
                cols="5"
                md="3"
              >
                <strong v-html="subject.title"></strong>
                <v-chip
                  v-if="subject.comment.length > 0"
                  color="primary"
                  class="ml-2 white--text hidden-xs-only"
                  label
                  small
                >
                  {{ subject.comment.length }} comments
                </v-chip>
              </v-col>
              



              <v-col
                class="hidden-xs-only"
                sm="5"
                md="3"
              >
                <v-icon class="mr-2">mdi-account</v-icon>
                <span v-if="subject.user==null" v-html="'anonymous'"></span>
                <span v-else v-html="subject.user.username"></span>
              </v-col>

              <v-col
                v-if="subject.description"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                {{ subject.description }}
              </v-col>
              <v-col
                v-else
                class="grey--text text-truncate hidden-sm-and-down"
              >
                {{ subject.text }}
              </v-col>
            </v-row>
            
          </v-expansion-panel-header>
          
          <v-expansion-panel-content>
            
            <v-textarea
              rows="1"
              auto-grow
              :value= "subject.text"
              readonly
              ></v-textarea>

            <v-card-actions>
              <v-btn
                v-if= "(subject.userId===currentUser.id)||(currentUser.role=='admin')"
                color="secondary"
                @click="deleteSubject(subject.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                v-if= "(subject.userId===currentUser.id)"
                color="secondary"
                @click="editSubject(subject.id)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="showSubject(subject.id)"
              >
                <span>See it</span>
                <v-icon right>mdi-eye</v-icon>
              </v-btn>
            </v-card-actions>
            

            
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-card-text v-if="message">
        <v-alert type="error" v-if="!successful">
          {{message}}
        </v-alert>
        <v-alert type="success" v-else>
          {{message}}
        </v-alert>
      </v-card-text>

    </v-row>
  </v-container>
</template>

<script>
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "subjects-list",
  data() {
    return {
      subjects: [],
      title: "",
      message: "",
      successful: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {

    retrieveSubjects() {
      
      SubjectDataService.getAll()
        .then((response) => {
          this.subjects = response.data;
          console.log(response.data);
          this.successful = true;
        })
        .catch((e) => {
          console.log(e);
          this.message = e.message;
          this.successful = false;
        });
      
    },

    refreshList() {
      this.retrieveSubjects();
    },

    searchTitle() {
      SubjectDataService.findByTitle(this.title)
        .then((response) => {
          this.subjects = response.data;
          console.log(response.data);
          this.successful = true;
        })
        .catch((e) => {
          console.log(e);
          this.successful = false;
        });
    },

    editSubject(id) {
      this.$router.push({ name: "edit-subject", params: { id: id } });
    },

    showSubject(id) {
      this.$router.push({ name: "show-subject", params: { id: id } });
    },

    deleteSubject(id) {
      SubjectDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  mounted() {
    this.retrieveSubjects();
  },
};
</script>

<style>
</style>
