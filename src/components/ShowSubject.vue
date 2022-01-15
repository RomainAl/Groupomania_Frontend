<template>
  <v-container v-if="currentSubject" class="show-form" >
    <v-row justify="space-around">
      <v-card width="600">
        <v-img
          height="200px"
          :src="currentSubject.imageUrl"
        >
          <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >

            <v-toolbar-title class="text-h6 white--text pl-0">
              {{currentSubject.title}}
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

          <v-card-title class="white--text mt-8">
            <v-avatar size="56">
              <v-icon>
                mdi-account-circle
              </v-icon>
            </v-avatar>
            <p class="ml-3">
              {{currentUser.username}}
            </p>
          </v-card-title>

        </v-img>

        <v-card-subtitle>
             {{currentSubject.description}}
        </v-card-subtitle>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2">
            {{currentSubject.text}}
          </div>

          <v-timeline
            align-top
            dense
          >
            <v-timeline-item
              v-for="comment in currentSubject.comment"
              :key="comment.updatedAt"
              small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ comment.userId }}</strong> @{{ comment.updatedAt }}
                </div>
                <div>{{ comment.text }}</div>
                <v-icon v-if= "comment.userId===currentUser.id" small class="mr-2" @click="getComment(comment.id)">mdi-pencil</v-icon>
                <v-icon v-if= "(comment.userId===currentUser.id)||(currentUser.role === 'admin')" small @click="deleteComment(comment.id)">mdi-delete</v-icon>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>

        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="comment.text"
            :rules="[(v) => !!v || 'Comment is required']"
            label="Comment"
            required
          ></v-text-field>
          <v-icon @click="saveComment">mdi-send</v-icon>
        </v-form>
              
      </v-card>
    </v-row>
  </v-container>
  <div v-else>
    <p>Please click on a Subject...</p>
  </div>
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
      submitted: false,
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

      if (this.comment.id){
        CommentDataService.update(this.comment.id, this.comment)
          .then((response) => {
            console.log(response.data);
            this.message = "The subject was updated successfully!";
            this.comment.id = null;
            this.comment.text = "";
            this.refreshSubject(this.currentSubject.id);
          })
          .catch((e) => {
            console.log(e);
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
            this.submitted = true;
            this.comment.id = null;
            this.comment.text = "";
            this.refreshSubject(this.currentSubject.id);
          })
          .catch((e) => {
            console.log(e);
          });
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
.show-form {
  max-width: 500px;
  margin: auto;
}
</style>
