<script setup>
import { useStore } from "vuex";
import { useAuth0 } from "@auth0/auth0-vue";
import { computed, ref } from "vue";
import axios from "axios";

const {
  loginWithPopup,
  isLoading,
  isAuthenticated,
  getAccessTokenSilently,
  logout,
} = useAuth0();
const store = useStore();

const isStart = computed(() => store.getters["user/isStart"]);
const user = computed(() => store.getters["user/user"]);
const newName = ref("");
const isChangeName = ref(false);
const newMeetingCode = ref("");
const meetingCode = computed(() => store.getters["user/meetingCode"]);

const handleLogin = () => {
  loginWithPopup({ prompt: "login" }).then(async () => {
    const token = await getAccessTokenSilently();

    const userinfo = await axios.get(
      `https://dev-r16wa2rubknr8uv5.us.auth0.com/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const {
      nickname,
      name,
      sub,
      email,
      picture,
      [`https://customclaim.com/id`]: id,
      [`https://customclaim.com/role`]: role,
    } = userinfo.data;

    const user = {
      token,
      nickname,
      name,
      id,
      sub,
      email,
      picture,
      role,
    };

    store.dispatch("user/updateUser", user);
  });
};

const handleLogout = () => {
  logout().then(() => {
    store.dispatch("user/fetchUser", {});
    store.dispatch("user/toggleSetMeetingCode", { meetingCode: null });
    window.location.reload();
  });
};

const handleChangeNameToggle = () => {
  isChangeName.value = !isChangeName.value;
  newName.value = store.getters["user/username"];
};

const handleUpdateName = () => {
  store.dispatch("user/updateName", { name: newName.value }).then(() => {
    handleChangeNameToggle();
  });
};

const handleEnterCode = () => {
  store.dispatch("user/toggleSetMeetingCode", {
    meetingCode: newMeetingCode.value,
  });
};

const handleLeaveMeeting = () => {
  store.dispatch("user/toggleSetMeetingCode", { meetingCode: null });
};
</script>

<template>
  <main class="pa-4">
    <div class="d-flex flex-row align-center mb-4">
      <img src="../assets/logo.png" width="30" height="30" />
      <h5 class="ml-2 text-h6 font-weight-bold text-center">
        Emoview for Students
      </h5>
    </div>
    <div v-if="isLoading" class="text-center mb-2">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <div v-if="!isAuthenticated">
        <v-btn
          class="text-capitalize"
          variant="flat"
          color="primary"
          rounded="lg"
          block
          @click="handleLogin"
          >Login</v-btn
        >
      </div>
      <div v-else>
        <div v-if="!meetingCode">
          <form ref="form" @submit.prevent="handleEnterCode">
            <v-text-field
              v-model="newMeetingCode"
              label="Enter meeting PIN"
              variant="solo"
              hide-details="true"
            ></v-text-field>
            <v-btn
              class="mt-4 text-capitalize"
              variant="flat"
              type="submit"
              color="primary"
              rounded="lg"
              :disabled="!newMeetingCode"
              block
              >Join Meeting</v-btn
            >
          </form>
        </div>
        <div v-else>
          <h6 v-if="isAuthenticated" class="text-body-1 mb-2">
            Hello, {{ user?.name }}
          </h6>
          <h6 v-if="isAuthenticated" class="text-body-1">
            Meeting PIN : {{ meetingCode }}
          </h6>
          <v-switch
            v-model="isStart"
            :label="`Recognition ${isStart ? 'On' : 'Off'}`"
            class="my-4"
            color="primary"
            inset
            readonly
            hide-details="true"
            @click="store.dispatch('user/toggleIsStart')"
          ></v-switch>
          <v-btn
            class="text-capitalize"
            variant="outlined"
            color="error"
            rounded="lg"
            block
            @click="handleLeaveMeeting"
            >Leave Meeting</v-btn
          >
          <v-btn
            class="text-capitalize"
            variant="text"
            color="primary"
            rounded="lg"
            block
            @click="handleLogout"
            >Logout</v-btn
          >
        </div>
      </div>
    </div>
  </main>
  <!--    <main>-->
  <!--        <h5 class="text-h5 font-weight-bold text-center text-blue">Emoview Extension</h5>-->
  <!--        <div v-if="isLoading && !isMeetingCode" class="text-center mt-4 mb-2">-->
  <!--            <v-progress-circular indeterminate></v-progress-circular>-->
  <!--        </div>-->
  <!--        <div v-else>-->
  <!--            <div v-if="isAuthenticated && !isMeetingCode">-->
  <!--                <form ref="form" @submit.prevent="handleEnterCode">-->
  <!--                    <v-text-field-->
  <!--                            v-model="newMeetingCode"-->
  <!--                            label="Enter meeting code"-->
  <!--                            variant="solo"-->
  <!--                            hide-details="true"-->
  <!--                    ></v-text-field>-->
  <!--                    <v-btn class="text-capitalize" type="submit" :disabled="!newMeetingCode" block>Enter Meeting</v-btn>-->
  <!--                </form>-->
  <!--            </div>-->
  <!--            <div v-if="isAuthenticated && isMeetingCode">-->
  <!--                <h6 v-if="isAuthenticated" class="text-body-1 mt-4 mb-2">Hello, {{ meetingCode?.name }}</h6>-->
  <!--                <v-switch-->
  <!--                        v-model="isStart"-->
  <!--                        :label="`Recognition ${isStart ? 'On' : 'Off'}`"-->
  <!--                        class="mb-2"-->
  <!--                        color="blue"-->
  <!--                        inset-->
  <!--                        readonly-->
  <!--                        hide-details="true"-->
  <!--                        @click="store.dispatch('user/toggleIsStart')"-->
  <!--                ></v-switch>-->
  <!--                <h6>{{ meetingCode?.name }}</h6>-->
  <!--                <v-btn class="text-capitalize" block @click="handleChangeNameToggle">Change Name</v-btn>-->
  <!--                <form v-if="isChangeName" ref="form" @submit.prevent="handleUpdateName">-->
  <!--                    <v-text-field-->
  <!--                            v-model="newName"-->
  <!--                            label="Enter your name"-->
  <!--                            variant="solo"-->
  <!--                            hide-details="true"-->
  <!--                    ></v-text-field>-->
  <!--                    <v-btn class="text-capitalize" type="submit" :disabled="!newName" block>Save</v-btn>-->
  <!--                </form>-->
  <!--                <v-btn class="text-capitalize" block @click="handleLogout">Logout</v-btn>-->
  <!--            </div>-->
  <!--            <v-btn v-else class="text-capitalize" block @click="handleLogin">Login</v-btn>-->
  <!--        </div>-->
  <!--    </main>-->
</template>

<style scoped>
main {
    padding: 1rem;
}

button {
    margin: 1rem 0;
}

h5,
h6,
p {
    cursor: default;
}
</style>
