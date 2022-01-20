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
          <v-expansion-panel-header class="elevation-12 pa-3">
            <v-row
              align="center"
              class="spacer"
            >
              <v-col
                cols="3"
                sm="2"
                md="2"
              >
                <v-avatar
                  size="56px"
                >
                  <img
                    v-if="subject.imageUrl"
                    :alt= subject.title
                    :src = subject.imageUrl
                  >
                  <v-icon
                    v-else>
                    mdi-message-image</v-icon>
                </v-avatar>
              </v-col>

              <v-col
                cols="4"
                md="2"
                sm="3"
              >
                <strong v-html="subject.title"></strong>
              </v-col>

              <v-col
                cols="4"
                md="2"
                sm="3"
                align="center"
              >
                <v-chip
                  color="secondary lighten-1"
                  class="ml-1 mb-1 white--text"
                  label
                  small
                  v-if="dateNow[0]-subject.createdAt.substring(8,10) + (dateNow[1]-subject.createdAt.substring(5,7))*30 + 365*(dateNow[2]-subject.createdAt.substring(0,4))!=0"
                >
                  {{ dateNow[0]-subject.createdAt.substring(8,10) + (dateNow[1]-subject.createdAt.substring(5,7))*30 + 365*(dateNow[2]-subject.createdAt.substring(0,4)) }} day(s) ago
                </v-chip>
                <v-chip
                  color="success lighten-1"
                  class="ml-1 mb-1 white--text"
                  label
                  small
                  v-else
                >
                  Today
                </v-chip>
                <v-chip
                  v-if="subject.comment.length > 0"
                  color="primary lighten-1"
                  class="ml-1 mb-1 white--text"
                  label
                  small
                >
                  {{ subject.comment.length }} comments
                </v-chip>
              </v-col>

              <v-col
                class="hidden-xs-only"
                sm="3"
                align="center"
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
          
          <v-expansion-panel-content
          color="secondary lighten-4">
            
            <v-row
              align-content="space-between"
              v-if="subject.imageUrl"
              >
              <v-col cols="6">
                <v-textarea
                  rows="3"
                  auto-grow
                  :value= "subject.text"
                  readonly
                  ></v-textarea>
              </v-col>
 
              <v-col cols="6">
                  <v-img
                    :alt= subject.title
                    :src = subject.imageUrl
                    contain
                  >
                  </v-img>
              </v-col>
            </v-row>
            <v-row
              align-content="space-between"
              v-else
              >
                <v-textarea
                  rows="3"
                  auto-grow
                  :value= "subject.text"
                  readonly
                  ></v-textarea>
            </v-row>


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
//-------------------------
// Composant/page "FORUM" :
//--------------------------
// Charge les services axios pour accéder à l'API "subjects" du backend :
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "subjects-list",
  data() {
    return {
      subjects: [],
      title: "",
      message: "",
      successful: false,
    };
  },

  computed: {
    // Charge les données de l'utilisateur stocké dans le store (vuex)
    currentUser() {
      return this.$store.state.auth.user;
    },
    
    dateNow() {
      const date = new Date();
      return [date.getDate(), date.getMonth()+1, date.getFullYear()];
    }
  },

  methods: {
    // Charge tous les sujets existants dans notre base de donnée (backend)
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

    // Charge les sujets "filtrés" de notre base de donnée (backend)
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

    // Renvoie vers la page "edit" du sujet
    editSubject(id) {
      this.$router.push({ name: "edit-subject", params: { id: id } });
    },

    // Renvoie vers la page "show" du sujet
    showSubject(id) {
      this.$router.push({ name: "show-subject", params: { id: id } });
    },

    // Efface le sujet
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

  // charge les sujets dès que possible
  mounted() {
    this.retrieveSubjects();
    this.message = "";
  },
};
</script>

<style>
</style>
