import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

import Accordion from "primevue/accordion";
import AccordionContent from "primevue/accordioncontent";
import AccordionHeader from "primevue/accordionheader";
import AccordionPanel from "primevue/accordionpanel";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import Button from "primevue/button";
import Card from "primevue/card";
import Chart from "primevue/chart";
import Checkbox from "primevue/checkbox";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import ConfirmDialog from "primevue/confirmdialog";
import DataTable from "primevue/datatable";
import DatePicker from "primevue/datepicker";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Drawer from "primevue/drawer";
import DynamicDialog from "primevue/dynamicdialog";
import FileUpload from "primevue/fileupload";
import IconField from "primevue/iconfield";
import Image from "primevue/image";
import InputIcon from "primevue/inputicon";
import InputNumber from "primevue/inputnumber";
import InputOtp from "primevue/inputotp";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import OrganizationChart from "primevue/organizationchart";
import Paginator from "primevue/paginator";
import Password from "primevue/password";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import RadioButton from "primevue/radiobutton";
import Rating from "primevue/rating";
import Row from "primevue/row";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import Skeleton from "primevue/skeleton";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToggleSwitch from "primevue/toggleswitch";
import Toolbar from "primevue/toolbar";

import { primeLocales } from "./locale";

// Sawa teal (#135c65) as the primary palette; shade 700 is the brand color itself.
const SawaPreset = definePreset(Aura, {
  primitive: {
    sawa: {
      50: "#eef8f9",
      100: "#d5eef0",
      200: "#aedde2",
      300: "#7cc4cc",
      400: "#4aa3ad",
      500: "#2e8791",
      600: "#226f78",
      700: "#135c65",
      800: "#134b53",
      900: "#133f45",
      950: "#08282d",
    },
  },
  semantic: {
    primary: {
      50: "{sawa.50}",
      100: "{sawa.100}",
      200: "{sawa.200}",
      300: "{sawa.300}",
      400: "{sawa.400}",
      500: "{sawa.500}",
      600: "{sawa.600}",
      700: "{sawa.700}",
      800: "{sawa.800}",
      900: "{sawa.900}",
      950: "{sawa.950}",
    },
    formField: {
      paddingX: "0.85rem",
      paddingY: "0.6rem",
      borderRadius: "{border.radius.lg}",
    },
    colorScheme: {
      light: {
        surface: {
          0: "#ffffff",
          50: "{slate.50}",
          100: "{slate.100}",
          200: "{slate.200}",
          300: "{slate.300}",
          400: "{slate.400}",
          500: "{slate.500}",
          600: "{slate.600}",
          700: "{slate.700}",
          800: "{slate.800}",
          900: "{slate.900}",
          950: "{slate.950}",
        },
        primary: {
          color: "{primary.700}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.800}",
          activeColor: "{primary.900}",
        },
        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.100}",
          color: "{primary.800}",
          focusColor: "{primary.900}",
        },
        formField: {
          hoverBorderColor: "{primary.400}",
          color: "{surface.800}",
        },
      },
    },
  },
});

const components = {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
  Avatar,
  Badge,
  Button,
  Card,
  Chart,
  Checkbox,
  ColorPicker,
  Column,
  ColumnGroup,
  ConfirmDialog,
  DataTable,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  DynamicDialog,
  FileUpload,
  IconField,
  Image,
  InputIcon,
  InputNumber,
  InputOtp,
  InputText,
  Message,
  MultiSelect,
  OrganizationChart,
  Paginator,
  Password,
  ProgressBar,
  ProgressSpinner,
  RadioButton,
  Rating,
  Row,
  Select,
  SelectButton,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Textarea,
  Toast,
  ToggleSwitch,
  Toolbar,
};

let defaultLocale = null;

/** Switches PrimeVue's own texts (date picker, paginator, filters…) to the given app language. */
export function setPrimeLocale(app, lang) {
  const config = app.config.globalProperties.$primevue?.config;
  if (!config) return;
  defaultLocale ??= JSON.parse(JSON.stringify(config.locale));
  const texts = primeLocales[lang] ?? primeLocales.en;
  config.locale = {
    ...defaultLocale,
    ...texts,
    aria: { ...defaultLocale.aria, ...(texts.aria ?? {}) },
  };
}

export default function installPrimeVue(app, lang) {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: SawaPreset,
      // The dashboard and the parent site are light-only.
      options: { darkModeSelector: false },
    },
  });
  app.use(ConfirmationService);
  app.use(DialogService);
  app.use(ToastService);
  app.directive("tooltip", Tooltip);
  for (const [name, component] of Object.entries(components)) app.component(name, component);
  setPrimeLocale(app, lang);
}
