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
const user_permissions=ref(localStorage.getItem("userPermissions"))
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
  width: 40px;
  height: 50px;
  border-radius: 50%;
  margin: auto;
  background-color: #a9ab7f;
  color: #ffffff;
  display: flex;
  margin: 0 2px;
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
          <v-list-group v-if="user_permissions.includes('employees list' || 'doctor list' || 'permissions list' || 'roles list' )" prepend-icon="mdi-shield-account" value="Admin">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('Adminstration')"></v-list-item>
            </template>

            <!--            here  your v- item list -->
            <v-list-item  v-can="'employees list'" :title="$t('Employees')" value="Employees" :to="{ name: 'Employees' }"></v-list-item>
           
            <v-list-item   v-can="'doctor list'" :title="$t('doctors')" value="doctors"
            :to="{ name: 'doctors' }"></v-list-item>
            
            <v-list-item v-can="'permissions list'" :title="$t('permissions')" value="permissions"
              :to="{ name: 'permissions' }"></v-list-item>

            <!-- <v-list-item  :title="$t('permissions')" value="roles"
              :to="{ name: 'permissions' }"></v-list-item> -->
            <v-list-item  v-can="'roles list'"  :title="$t('roles')" value="roles"
              :to="{ name: 'Roles' }"></v-list-item>
           
          </v-list-group>

          
          

          <v-list-group v-if="user_permissions.includes('child list'||'parents list')" prepend-icon="mdi-human-male-boy" value="Children">
            <template #activator="{ props }">
              <v-list-item v-can="'child list'" v-bind="props" :title="$t('parents')"></v-list-item>
            </template>
            
            <v-list-item   v-can="'parents list'" :title="$t('parents')" value="parents"
              :to="{ name: 'Parents' }"></v-list-item>
              <v-list-item   v-can="'parents list'" :title="$t('الاجتماعات')" value="meeting"
              :to="{ name: 'parent-meeting' }"></v-list-item>
            

            <v-list-item   v-can="'child list'"  :title="$t('children')" value="children"
              :to="{ name: 'Children' }"></v-list-item>
          </v-list-group>




       

          <v-list-group  v-if="user_permissions.includes('milestone question list'||'milestone answer list'||'milestone level list'||'side-profiles list'||'able category list'||'carolina age range list'||'carolina test list'||'barrier answer list'||'barrier question list'||'able answer list'||'able category list'||'able mission list')" prepend-icon="mdi-help-box-multiple-outline" value="Evaluation">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('evaluations')"></v-list-item>
            </template>

            <!-- <v-list-item  :title="$t('headers')" value="headers"
              :to="{ name: 'Headers' }"></v-list-item> -->
            <v-list-item v-can="'side-profiles list'" :title="$t('side profile')" value="SideProfiles"
              :to="{ name: 'SideProfiles' }"></v-list-item>
              <v-list-item  v-can="'able-mission list'" :title="$t('ablls')" value="ablls"
              :to="{ name: 'ablls' }"></v-list-item>
              <v-list-item v-if="user_permissions.includes('carolina test list'||'carolina category list'||'able category list'||'carolina answer list'||'carolina answer type list'||'able category list')" :title="$t('Carolaina')" value="Carolaina"
              :to="{ name: 'agerange' }"></v-list-item>
              <v-list-group v-if="user_permissions.includes('milestone question list'||'milestone answer list'||'milestone level list')" value="VB">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('VB')"></v-list-item>
            </template>

           
              <v-list-item v-if="user_permissions.includes('milestone question list'||'milestone answer list'||'milestone level list')"  :title="$t('milestone')" value="milestone" :to="{ name: 'levels' }"></v-list-item>
              <v-list-item v-can="'barrier-subtest list'" :title="$t('barriers')" value="barriers" :to="{ name: 'barrier-subtest' }"></v-list-item>

           
          </v-list-group>
           
          </v-list-group>
          <!-- edit Last -->
          <v-list-group v-if="(user_permissions.includes('treatment list'||'student program list'))" prepend-icon="mdi-doctor">
            <template #activator="{ props }" value="Evaluation">
              <v-list-item v-bind="props">
                <v-list-item-title  class="mb-2">
                  {{ $t("Therapeutic") }}
                </v-list-item-title>
              </v-list-item>

             
            </template>
            
            <v-list-item v-can="'treatment list'"  :title="$t('addTherapeutic')" value="Categories"
              :to="{ name: 'AllTherapeutic' }"></v-list-item>
              <v-list-item  v-can="'student program list'"  :title="$t('student_programe')" value="student-programe"
              :to="{ name: 'student-programe' }"></v-list-item>
              <v-list-item  v-can="'sessions list'" :title="$t('sessions')" value="sessions"
              :to="{ name: 'sessions' }"></v-list-item>
             
            
          </v-list-group>
          
          <v-list-group v-if="(user_permissions.includes('room list'))"  prepend-icon="mdi-bed">
            <template #activator="{ props }" value="Evaluation">
              <v-list-item v-bind="props" :title="$t('room')"></v-list-item>
            </template>
            
            <v-list-item  v-can="'room list'" :title="$t('room')" value="Rooms" :to="{ name: 'Rooms' }"></v-list-item>
           
              
          </v-list-group>
          
        

          <v-list-group  prepend-icon=" mdi-calendar" value="Calender">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('consulting')"></v-list-item>
            </template>
           

            <v-list-item   v-can="'bookings list'" :title="$t('bookings')" value="bookings"
              :to="{ name: 'ShowBooking' }"></v-list-item>
              <v-list-item   v-can="'bookings list'" :title="$t('Consultation_Settings')" value="consultation_settings"
              :to="{ name: 'recommendations' }"></v-list-item>
              
            <v-list-item v-can="'working hours list'" :title="$t('Working_hours')" value="Working hours"
              :to="{ name: 'working-hours' }"></v-list-item>
          </v-list-group>
          <v-list-group v-if="(user_permissions.includes('pages list'||'settings list'))" prepend-icon="mdi-wrench"  value="Settings">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('Settings')"></v-list-item>
            </template>
            <v-list-item v-can="'pages list'" :title="$t('Pages')" value="Pages"
              :to="{ name: 'pages' }"></v-list-item>
            <v-list-item v-can="'settings list'" :title="$t('Settings')" value="Settings"
              :to="{ name: 'settings' }"></v-list-item>
          </v-list-group>
          

         <!-- student_programe -->
          <v-list-group v-if="(user_permissions.includes(''))" prepend-icon="mdi-message-question-outline" value="custom-files">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('custom_files')"></v-list-item>
            </template>
            <v-list-item  :title="$t('custom_files')" value="custom-files"
              :to="{ name: 'custom-files' }"></v-list-item>
              <v-list-item  :title="$t('module')" value="module"
              :to="{ name: 'module' }"></v-list-item>
            
          </v-list-group>




          <!-- edits -->
          <v-list-group v-if="user_permissions.includes('department list' || 'area list'||'vehicle list'||'student transportation list'||'transportation schedule list'||'treatment list')" prepend-icon="mdi-apps" value="">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="$t('inputs')"></v-list-item>
            </template>
             <v-list-item v-can="'skills list'"  :title="$t('skills')" value="skills"
              :to="{ name: 'skills' }"></v-list-item>
              <v-list-item v-can="'department list'" :title="$t('department')" value="department"
              :to="{ name: 'department' }"></v-list-item>
             
              

              <v-list-item  v-can="'area list'"  :title="$t('area')" value="area"
              :to="{ name: 'regin' }"></v-list-item>

              <v-list-item v-can="'vehicle list'" :title="$t('veciles')" value="transportation"
              :to="{ name: 'transportation' }"></v-list-item>

              <v-list-item v-can="'student transportation list'" :title="$t('student_tans')" value="student-transportation"
              :to="{ name: 'student-transportation' }"></v-list-item>

              <v-list-item v-can="'transportation schedule list'" :title="$t('transportation_schedule')" value="transportation-schedule"
              :to="{ name: 'transportation-schedule' }"></v-list-item>

            <v-list-item  v-can="'treatment list'"  value="Settings" :to="{ name: 'treatments-type' }" class="">
              <v-list-item-title class="mb-2" style="padding: 10px">
                {{ $t("Typetreatment") }}
              </v-list-item-title>
            </v-list-item>
          
            
          </v-list-group>
          <v-list-group v-if="user_permissions.includes('leaves list' || 'hr settings edit' || 'holidays list'||'payroll list'||'bonus list'||'department list'||'positions list'||'events list'||'shifts list')" prepend-icon="mdi-bed">
            <template #activator="{ props }" value="Evaluation">
              <v-list-item v-bind="props" :title="$t('hr')"></v-list-item>
            </template>
            
       
            <v-list-item  v-can="'leaves list'"  :title="$t('leaves')" value="leaves" :to="{ name: 'leaves' }"></v-list-item>
            <v-list-item  v-can="'hr settings edit'" :title="$t('Settings')" value="setting" :to="{ name: 'setting' }"></v-list-item>
            <v-list-item  v-can="'deduction list'" :title="$t('deductions')" value="deduction" :to="{ name: 'deduction' }"></v-list-item>
            <v-list-item  v-can="'holidays list'" :title="$t('holidays')" value="holidays" :to="{ name: 'holidays' }"></v-list-item>
            <v-list-item  v-can="'holidays list'" :title="$t('official_leaves')" value="official-leaves" :to="{ name: 'official-leaves' }"></v-list-item>
            <v-list-item  v-can="'payroll list'" :title="$t('payroll')" value="payroll" :to="{ name: 'payroll' }"></v-list-item>
            <v-list-item  v-can="'bonus list'" :title="$t('bonus')" value="bonus" :to="{ name: 'bonus' }"></v-list-item>
            <v-list-item  v-can="'department list'" :title="$t('departments')" value="departments" :to="{ name: 'departments' }"></v-list-item>
            <v-list-item  v-can="'positions list'" :title="$t('posttion')" value="posttion" :to="{ name: 'posttion' }"></v-list-item>
            <v-list-item  v-can="'events list'"  :title="$t('events')" value="event" :to="{ name: 'event' }"></v-list-item>
            <v-list-item  v-can="'shifts list'"  :title="$t('shift')" value="shift" :to="{ name: 'shift' }"></v-list-item>
            <v-list-item  v-can="'shifts list'" :title="$t('advance')" value="advance" :to="{ name: 'advance' }"></v-list-item>
            <v-list-item  v-can="'shifts list'" :title="$t('reports')" value="reports" :to="{ name: 'reports' }"></v-list-item>
            
            
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
