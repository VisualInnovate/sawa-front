import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import router from "./router";
// i18n
import i18n from "@/plugins/i18n";
import PrimeVue from "primevue/config";
import VueHtmlToPaper from "vue-html-to-paper";
import './main.css'
// Vuetify
import "vuetify/styles";
import vuetify from "@/plugins/vuetify";

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';





import 'primevue/resources/themes/saga-blue/theme.css'; // Choose the theme you prefer
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import "primevue/resources/themes/lara-light-indigo/theme.css";
import print from "vue3-print-nb";
import VueCarousel from 'vue-carousel';


import "primevue/resources/primevue.min.css";

/* import font awesome icon component */

// import vuetify sass
// import './main.scss'
//import vueitfy icons
import "@mdi/font/css/materialdesignicons.css";
// pinia resetStore
import resetStore from "@/plugins/reset-store";
import "animate.css";

import "./axios";
import "./style.css";
import "./views/frontend/assets/main.css";
///////////////////////////////////////////////////////////////////////////////////////////
import DataTable from 'primevue/datatable'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import DialogService from 'primevue/dialogservice'
import DynamicDialog from 'primevue/dynamicdialog'
import MultiSelect from 'primevue/multiselect'
import FileUpload from 'primevue/fileupload'
import Password from 'primevue/password';
import Calendar from 'primevue/calendar'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import OrganizationChart from 'primevue/organizationchart'
import Chart from 'primevue/chart'
import InputSwitch from 'primevue/inputswitch'

import Paginator from 'primevue/paginator';

import Rating from 'primevue/rating';

import RadioButton from 'primevue/radiobutton';





import ColorPicker from 'primevue/colorpicker';

//////////////////////////////////////////////////////////////////////////////////////////////
import App from "@/App.vue";
const pinia = createPinia();




//
//  main.js or main.ts



import VOtpInput from "vue3-otp-input";



/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret,faChevronLeft } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret,faChevronLeft)





// use router in pinia store
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
pinia.use(resetStore);
const app = createApp(App);
app.use(pinia);
app.use(i18n);
app.use(vuetify);
app.use(router);
app.use(PrimeVue);
app.use(print);
app.use(VueHtmlToPaper);
app.use(VueCarousel);
app.use(DialogService)
app.use(ToastService)
app.component('DataTable', DataTable);
app.component('Toast', Toast)
app.use(ToastService)
app.component('Toolbar', Toolbar)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('v-otp-input', VOtpInput,'font-awesome-icon', FontAwesomeIcon)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Dropdown', Dropdown)
app.component('Calendar', Calendar)
app.mount("#app");
app.component('InputNumber', InputNumber)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Dialog', Dialog)
app.component('DynamicDialog', DynamicDialog)
app.component('ColorPicker', ColorPicker)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)



app.component('Rating', Rating)
app.component('Paginator', Paginator)

app.component('RadioButton', RadioButton)
app.component('OrganizationChart', OrganizationChart)


app.component('Toast', Toast)
app.component('MultiSelect', MultiSelect)
app.component('FileUpload', FileUpload)
app.component('Password ', Password )
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Chart', Chart)
app.component('InputSwitch', InputSwitch)
app.directive('can', (el, binding, vnode) =>{
  // console.log(JSON.parse(localStorage.getItem('permissions')))
  if (! JSON.parse(localStorage.getItem('userPermissions'))
      .includes(binding.value)) {
      // console.log(vnode)
      el.style.display = "none";
  }

})

let k= document.getElementsByClassName("switcher")
console.log(k)
if( i18n.global.locale.value == 'ar')
  k[0].dir="rtl"
else
  k[0].dir="ltr"