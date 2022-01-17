<template>
  <v-container>
    <v-row justify="space-around">
      <v-card
      width="700">
        <v-img
          height="200px"
          src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
        >
          <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >

            <v-toolbar-title class="text-h4 white--text pl-0">
              <strong>{{currentSubject.title}}</strong>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
              v-if= "currentSubject.user.username===currentUser.username" small @click="editSubject(currentSubject.id)"
              color="white"
              icon
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if= "(currentSubject.user.username===currentUser.username)||(currentUser.role === 'admin')" small @click="deleteSubject(currentSubject.id)"
              color="white"
              icon
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-app-bar>

          <v-card-title class="white--text mt-14">
            <v-avatar>
              <v-icon color="white">
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <p class="ml-2 mt-4">
              {{currentSubject.user.username}}
            </p>
          </v-card-title>

        </v-img>

        <v-card-subtitle>
             {{currentSubject.description}}
        </v-card-subtitle>

        <v-card-text>
          <div class="font-weight-bold ml-8 mr-8 mb-2">
            {{currentSubject.text}}
          </div>

          <v-divider class="my-5"></v-divider>
          <v-icon right>
            mdi-comment-text
          </v-icon>
          <strong> Discussions : </strong>
          <v-timeline
            dense
          >
            <v-timeline-item
              v-for="comment in currentSubject.comment"
              :key="comment.updatedAt"
              small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ comment.userId }}</strong> @ {{ comment.updatedAt.substring(0,10) }} {{ comment.updatedAt.substring(11,13) }}h{{ comment.updatedAt.substring(14,16) }}min
                </div>
                <div>{{ comment.text }}</div>
                <v-icon v-if= "comment.userId===currentUser.id" small class="mr-2" @click="getComment(comment.id)">mdi-pencil</v-icon>
                <v-icon v-if= "(comment.userId===currentUser.id)||(currentUser.role === 'admin')" small @click="deleteComment(comment.id)">mdi-delete</v-icon>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        
        <v-container fluid>
          
          <v-form 
            ref="form"
            v-model="valid"
            lazy-validation>
            
            <v-textarea
              filled
              counter
              outlined
              auto-grow
              clearable
              v-model="comment.text"
              label="Comment"
              placeholder="Comment here..."
              :rules="[(v) => !!v || 'Text is required']"
              maxlength="255"
            ></v-textarea>

            <v-btn 
            :disabled="!valid"
            block 
            color="primary" 
            @click="saveComment"
            class = "mb-4">
                <span>Send</span>
                <v-icon right>
                  mdi-send
                </v-icon>
            </v-btn>
            
          </v-form>

          <v-card-text v-if="message">
            <v-alert type="error" v-if="!successful">
              {{message}}
            </v-alert>
          </v-card-text>

        </v-container>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import SubjectDataService from "../services/SubjectDataService";
import CommentDataService from "../services/CommentDataService";

export default {
  name: "show-subject",
  data() {
    return {
      currentSubject: null,
      message: "",
      comment: {
        id: null,
        subjectId: null,
        text: ""
      },
      valid: true,
      successful: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {

    getComment(id) {
      CommentDataService.get(id)
        .then((response) => {
          this.comment = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    saveComment() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()){
        
        if (this.comment.id){
          CommentDataService.update(this.comment.id, this.comment)
            .then((response) => {
              console.log(response.data);
              this.comment.id = null;
              this.comment.text = "";
              this.refreshSubject(this.currentSubject.id);
              this.successful = true;
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
            })
            .catch((e) => {
              console.log(e);
              this.message = e.message;
              this.successful = false;
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
            });
        } else {
          var data = {
            subjectId: this.currentSubject.id,
            text: this.comment.text
          };
          CommentDataService.create(data)
            .then((response) => {
              this.comment.id = response.data.id;
              console.log(response.data);
              this.comment.id = null;
              this.comment.text = "";
              this.refreshSubject(this.currentSubject.id);
              this.successful = true;
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
            })
            .catch((e) => {
              console.log(e);
              this.message = e.message;
              this.successful = false;
              this.$refs.form.reset();
              this.$refs.form.resetValidation();
            });
        }
        
      } else {
          this.message = "Incorrect inputs";
          this.successful = false;
      }
    },

    deleteComment(id) {

      CommentDataService.delete(id)
        .then(() => {
          this.refreshSubject(this.currentSubject.id);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshSubject(id) {
      this.getSubject(id);
    },

    getSubject(id) {
      
      SubjectDataService.get(id)
        .then((response) => {
          this.currentSubject = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          this.message = e.message;
        });
    },

    editSubject(id) {
      this.$router.push({ name: "edit-subject", params: { id: id } });
    },

    deleteSubject() {
      SubjectDataService.delete(this.currentSubject.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: "subjects" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = "";
    this.getSubject(this.$route.params.id);
  },
};
</script>

<style>
</style>
