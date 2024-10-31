<script setup>
import LocaleSelect from "./LocaleSelect.vue";
import { useAppLangStore } from "../stores/AppLangStore";
import { ref, watch, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/Auth";
import UserProfileMenu from "./UserProfileMenu.vue";
import { useTheme } from "vuetify";
const router = useRouter()
import sawaLogo from "../assets/img/sawa_logo.svg";
import {useRouter} from "vue-router";
const theme = useTheme();
const drawer = ref(true);
const group = ref(null);
const authStore = useAuthStore();
const appLangStore = useAppLangStore();
const routename=ref('')

// methods
// const onClick = () => {
//     theme.value = theme.value === "light" ? "dark" : "light";
// };
const toggleTheme = () =>
(theme.global.name.value = theme.global.current.value.dark
  ? "light"
  : "dark");
const isRtl = computed({
  get() {
    return appLangStore.isRtl;
  },
  set(val) {
    appLangStore.isRtl = val;
  },
});
watch(group, (newGroupValue) => {
  drawer.value = false;
});
watch(routename.value, (newValue, oldValue) => {
         console.log('ssss')
    });
onMounted(async () => {
  routename.value=router.currentRoute._rawValue.name
  console.log(router.currentRoute._rawValue.name)
  await authStore.getUser();
});
</script>
<style lang="scss">
//@use '../settings.scss';
#local-switcher {
  width: 30px;
  height: 60px;
  border-radius: 50%;
  background-color: #a9ab7f;
  color: #ffffff;
  display: flex;
  margin: 0 15px;
  justify-content: center;

  i {
    margin: 0 !important;
  }
}

#theme-switcher {
  width: 50px;
  height: 61px;
  border-radius: 50%;
  background-color: #135c65;
  color: #ffffff;
  display: flex;
  justify-content: center;

  .v-btn__prepend {
    margin: 0;
  }
}

.setting {
  width: 50px;
  height: 61px;
  border-radius: 50%;
  background-color: #135c65;
  color: #ffffff;
  display: flex;
  justify-content: center;
}

#navbar {
  padding-top: 46px;
  background-color: #135c65 !important;
  color: #ffffff !important;
  height: calc(100% - 119.81px) !important;
  //width: 19% !important;
}

.v-list-group__items .v-list-item {
  padding-right: 20px !important;
  padding-left: 20px !important;
}

.v-list-item {
  margin: 0 0 19px 0 !important;

  .v-list-item-title {
    font-size: 17px !important;
    line-height: 110% !important;
  }

  .v-list-item__prepend {
    text-align: center !important;
    justify-content: center;
  }
}

#footer {
  width: 100% !important;
  left: 0 !important;
  background: url("../assets/img/Mask Group 1.png"), #a9ab7f;
  color: #ffffff;
  height: 55px;
}
</style>
<template>
  <v-locale-provider :rtl="isRtl">
    <v-app>
      <!-- v-system-bar -->

      <!-- v-app-bar -->
      <v-app-bar prominent>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title class="">
          <v-img class="" max-width="100" :src="sawaLogo"></v-img>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <!-- locale switcher -->
        <LocaleSelect id="local-switcher" />

        <!-- theme switcher -->
        <v-btn id="theme-switcher" :prepend-icon="theme.global.name.value === 'light'
            ? 'mdi-weather-sunny'
            : 'mdi-weather-night'
          " @click="toggleTheme">
        </v-btn>
        <template class="setting" v-if="authStore.authenticated">
          <UserProfileMenu />
        </template>
        <template class="setting" v-else>
          <v-btn :to="{ name: 'Register' }">Register</v-btn>
          <v-btn :to="{ name: 'Login' }">Login</v-btn>
        </template>
      </v-app-bar>

      <!-- sidebar menu -->
      <v-navigation-drawer id="navbar" v-model="drawer">
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home"  :title="$t('dashbored')" 
              :to="{ name: 'dashbord' }"></v-list-item>
          <v-list-group prepend-icon="mdi-shield-account" value="Admin">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('Adminstration')"></v-list-item>
            </template>

            <!--            here  your v- item list -->
            <v-list-item  :title="$t('users')" value="users"
              :to="{ name: 'Users' }"></v-list-item>

            
            <v-list-item  :title="$t('permissions')" value="permissions"
              :to="{ name: 'permissions' }"></v-list-item>

            <!-- <v-list-item  :title="$t('permissions')" value="roles"
              :to="{ name: 'permissions' }"></v-list-item> -->
            <v-list-item  :title="$t('roles')" value="roles"
              :to="{ name: 'Roles' }"></v-list-item>
           
          </v-list-group>

          
          

          <v-list-group prepend-icon="mdi-human-male-boy" value="Children">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('parents')"></v-list-item>
            </template>

            <v-list-item   :title="$t('parents')" value="parents"
              :to="{ name: 'Parents' }"></v-list-item>
              <v-list-item   v-can="'doctor list'" :title="$t('doctors')" value="doctors"
              :to="{ name: 'doctors' }"></v-list-item>

            <v-list-item  :title="$t('children')" value="children"
              :to="{ name: 'Children' }"></v-list-item>
          </v-list-group>




       

          <v-list-group  prepend-icon="mdi-help-box-multiple-outline" value="Evaluation">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('evaluations')"></v-list-item>
            </template>

            <!-- <v-list-item  :title="$t('headers')" value="headers"
              :to="{ name: 'Headers' }"></v-list-item> -->
            <v-list-item  :title="$t('side profile')" value="SideProfiles"
              :to="{ name: 'SideProfiles' }"></v-list-item>
              <v-list-item  v-can="'able-mission show'" :title="$t('ablls')" value="ablls"
              :to="{ name: 'ablls' }"></v-list-item>
              <v-list-item  :title="$t('Carolaina')" value="Carolaina"
              :to="{ name: 'agerange' }"></v-list-item>
              <v-list-group value="VB">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('VB')"></v-list-item>
            </template>

           
              <v-list-item  :title="$t('milestone')" value="milestone" :to="{ name: 'levels' }"></v-list-item>
              <v-list-item v-can="'barrier-subtest list'" :title="$t('barriers')" value="barriers" :to="{ name: 'barrier-subtest' }"></v-list-item>

           
          </v-list-group>
           
          </v-list-group>
          <!-- edit Last -->
          <v-list-group prepend-icon="mdi-doctor">
            <template #activator="{ props }" value="Evaluation">
              <v-list-item v-bind="props">
                <v-list-item-title  class="mb-2">
                  {{ $t("Therapeutic") }}
                </v-list-item-title>
              </v-list-item>

             
            </template>
            
            <v-list-item  :title="$t('addTherapeutic')" value="Categories"
              :to="{ name: 'AllTherapeutic' }"></v-list-item>
              <v-list-item  :title="$t('student_programe')" value="student-programe"
              :to="{ name: 'student-programe' }"></v-list-item>
              <v-list-item  :title="$t('sessions')" value="sessions"
              :to="{ name: 'sessions' }"></v-list-item>
             
            
          </v-list-group>
          
          <v-list-group  prepend-icon="mdi-bed">
            <template #activator="{ props }" value="Evaluation">
              <v-list-item v-bind="props" :title="$t('room')"></v-list-item>
            </template>
            
            <v-list-item   :title="$t('room')" value="Rooms" :to="{ name: 'Rooms' }"></v-list-item>
           
              
          </v-list-group>
          
        

          <v-list-group prepend-icon=" mdi-calendar" value="Calender">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('consulting')"></v-list-item>
            </template>
            <v-list-item  :title="$t('calender')" value="calender"
              :to="{ name: 'Calender' }"></v-list-item>
            <v-list-item  :title="$t('bookings')" value="bookings"
              :to="{ name: 'ShowBooking' }"></v-list-item>
          </v-list-group>
          <v-list-group prepend-icon="mdi-wrench"  value="Settings">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('Settings')"></v-list-item>
            </template>
            <v-list-item :title="$t('Pages')" value="Pages"
              :to="{ name: 'pages' }"></v-list-item>
            <v-list-item  :title="$t('Settings')" value="Settings"
              :to="{ name: 'settings' }"></v-list-item>
          </v-list-group>
          

         <!-- student_programe -->
          <!-- <v-list-group value="student_programe">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('student_programe')"></v-list-item>
            </template>
            <v-list-item prepend-icon="mdi-message-question-outline" :title="$t('Pages')" value="Pages"
              :to="{ name: 'pages' }"></v-list-item>
            <v-list-item prepend-icon="mdi-message-question-outline" :title="$t('Settings')" value="Settings"
              :to="{ name: 'settings' }"></v-list-item>
          </v-list-group> -->




          <!-- edits -->
          <v-list-group prepend-icon="mdi-apps" value="">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('inputs')"></v-list-item>
            </template>
             <v-list-item   :title="$t('skills')" value="skills"
              :to="{ name: 'skills' }"></v-list-item>
              <v-list-item v-can="'department show'" :title="$t('department')" value="department"
              :to="{ name: 'department' }"></v-list-item>
             
              

              <v-list-item  :title="$t('area')" value="area"
              :to="{ name: 'regin' }"></v-list-item>

              <v-list-item :title="$t('veciles')" value="transportation"
              :to="{ name: 'transportation' }"></v-list-item>

              <v-list-item  :title="$t('student_tans')" value="student-transportation"
              :to="{ name: 'student-transportation' }"></v-list-item>

              <v-list-item  :title="$t('transportation_schedule')" value="transportation-schedule"
              :to="{ name: 'transportation-schedule' }"></v-list-item>
<!--                

transportation_schedule
            <v-list-item  value="Pages" :to="{ name: 'ProgramType' }"
              class="mb-2 py-2"><v-list-item-title class="mb-2" style="padding: 10px">
                {{ $t("ProgramType") }}
              </v-list-item-title>student_tans
            </v-list-item> -->

            <!-- <v-list-item :to="{ name: 'SystemProgram' }" class="">
              <v-list-item-title class="mb-2" style="padding: 10px">
                {{ $t("SystemProgram") }}
              </v-list-item-title>
            </v-list-item> -->

            <!-- <v-list-item  value="Settings" :to="{ name: 'SessionType' }" class="">
              <v-list-item-title class="mb-2" style="padding: 10px">
                {{ $t("SessionType") }}
              </v-list-item-title>
            </v-list-item> -->
            <v-list-item   value="Settings" :to="{ name: 'treatments-type' }" class="">
              <v-list-item-title class="mb-2" style="padding: 10px">
                {{ $t("Typetreatment") }}
              </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item  value="Settings" :to="{ name: 'AppointmentType' }"
              class="mb-2">
              <v-list-item-title class="mb-2" style="padding: 10px">
                {{ $t("AppointmentType") }}
              </v-list-item-title>
            </v-list-item> -->
            
          </v-list-group>
          <v-list-group prepend-icon="mdi-bed">
            <template #activator="{ props }" value="Evaluation">
              <v-list-item v-bind="props" :title="$t('hr')"></v-list-item>
            </template>
            
            <v-list-item   :title="$t('Employees')" value="Employees" :to="{ name: 'Employees' }"></v-list-item>
            <v-list-item   :title="$t('leaves')" value="leaves" :to="{ name: 'leaves' }"></v-list-item>
            <v-list-item  :title="$t('Settings')" value="setting" :to="{ name: 'setting' }"></v-list-item>
            <v-list-item  :title="$t('deductions')" value="deduction" :to="{ name: 'deduction' }"></v-list-item>
            <v-list-item  :title="$t('holidays')" value="holidays" :to="{ name: 'holidays' }"></v-list-item>
            <v-list-item  :title="$t('official_leaves')" value="official-leaves" :to="{ name: 'official-leaves' }"></v-list-item>
            <v-list-item  :title="$t('payroll')" value="payroll" :to="{ name: 'payroll' }"></v-list-item>
            <v-list-item   :title="$t('bonus')" value="bonus" :to="{ name: 'bonus' }"></v-list-item>
            <v-list-item  :title="$t('departments')" value="departments" :to="{ name: 'departments' }"></v-list-item>
            <v-list-item   :title="$t('posttion')" value="posttion" :to="{ name: 'posttion' }"></v-list-item>
            <v-list-item   :title="$t('events')" value="posttion" :to="{ name: 'event' }"></v-list-item>
            <v-list-item   :title="$t('shift')" value="shift" :to="{ name: 'shift' }"></v-list-item>
           
            
          </v-list-group>
        </v-list>
        
        
      </v-navigation-drawer>

      <!-- this is main content for the application -->
      <v-main style="width:100% !important;">
        <v-container>
          <RouterView />
        </v-container>
<!-- CONTAINS of home page -->



        
       
   

      </v-main>
      <!-- footer -->
      <v-footer app id="footer" class="justify-center" border>
        all right reserved for SAWA Academy
      </v-footer>
    </v-app>
  </v-locale-provider>
</template>
<style>
.element:hover {



  animation: bounce; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
}

</style>
