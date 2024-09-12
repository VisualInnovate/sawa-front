<template>
       <div v-can="'show dashboard'">
        <div  class="grid   grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-1 ">
        <div class="px-3 ">
                <div class="element w-full shadow-md bg-[#EC477C] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                    <i class="pi pi-car w-16 h-10 fill-current mr-4 " style="font-size: 2.5rem"></i>                  <div class="text-white">
                    <p class="font-semibold text-3xl">{{ totla.TotalDrivers }}</p>
                    <p>{{ $t("driver") }}</p>
                  </div>
                </div>
        </div>
        <div class="px-3 ">
                <div class="element w-full shadow-md bg-[#135B64] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                  <i class=" pi pi-user w-16 h-10 fill-current mr-4 " style="font-size: 2.5rem"></i>
                  <div class="text-white">
                    <p class="font-semibold text-3xl">{{ totla.TotalUsers }}</p>
                    <p>{{ $t("users") }}</p>
                  </div>
                </div>
        </div>
        <div class="px-3 ">
                <div class="element w-full shadow-md bg-[#C8CAAE] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                  <i class="pi pi-bell w-16 h-10 fill-current mr-4 " style="font-size: 2.5rem"></i>
                  <div class="text-white">
                    <p class="font-semibold text-3xl">{{ totla.TotalChild }}</p>
                    <p>{{ $t("children") }}</p>
                  </div>
                </div>
        </div>
        <div class="px-3 ">
                <div class="element w-full shadow-md bg-[green] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                    <svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>                  <div class="text-white">
                    <p class="font-semibold text-3xl">{{ totla.TotalRoom }}</p>
                    <p>{{ $t("room") }}</p>
                  </div>
                </div>
        </div>
         <div class="px-3 ">
                <div class="element w-full shadow-md bg-[#EBCB53] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                    <svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>                  <div class="text-white">
                    <p class="font-semibold text-3xl">27</p>
                    <p>{{ $t("roles") }}</p>
                  </div>
                </div>
        </div>
        <div class="px-3 ">
                <div class="element w-full shadow-md bg-[#9253eb] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                    <svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>                  <div class="text-white">
                    <p class="font-semibold text-3xl">{{ totla.session }}</p>
                    <p>{{ $t("sessions") }}</p>
                  </div>
                </div>
        </div>
        <div class="px-3 ">
                <div class="element w-full shadow-md bg-[#30a6aa] border text-white rounded-lg flex items-center p-6 mb-6 xl:mb-0"> 
                    <svg class="p-3" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 22L2 22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 11L10.1259 4.49931C11.2216 3.62279 12.7784 3.62279 13.8741 4.49931L22 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15.5 5.5V3.5C15.5 3.22386 15.7239 3 16 3H18.5C18.7761 3 19 3.22386 19 3.5V8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 22V9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 22V17C15 15.5858 15 14.8787 14.5607 14.4393C14.1213 14 13.4142 14 12 14C10.5858 14 9.87868 14 9.43934 14.4393C9 14.8787 9 15.5858 9 17V22" stroke="#ffffff" stroke-width="1.5"></path> <path d="M14 9.5C14 10.6046 13.1046 11.5 12 11.5C10.8954 11.5 10 10.6046 10 9.5C10 8.39543 10.8954 7.5 12 7.5C13.1046 7.5 14 8.39543 14 9.5Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>                  <div class="text-white">
                    <p class="font-semibold text-3xl">{{ totla.program }}</p>
                    <p>{{ $t("addTherapeutic") }}</p>
                  </div>
                </div>
        </div>
       </div> 

       <div class="card w-full m-auto text-center shadow-lg  grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart class="card w-full m-auto text-center shadow-yellow-100" type="bar" :data="chartData" :options="chartOptions" />
        <Chart class="card w-full m-auto text-center " type="line" :data="chartData" :options="chartOptions" />
       </div>
       </div>

       <div class="mt-4 p-2 shadow-lg">
        <iframe class="w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3492525.6382319154!2d39.76398280242961!3d31.25756942295812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15006f476664de99%3A0x8d285b0751264e99!2z2KfZhNij2LHYr9mG!5e0!3m2!1sar!2seg!4v1726127614071!5m2!1sar!2seg" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
       </div>
</template>


<script>
import axios from "axios";
export default {
    data() {
        return {
            chartData: null,
            chartOptions: null,
            lang:'', 
            totla:{}
        };
    },
    mounted() {
        axios
        .get("api/total/users")
        .then((response) => {
          this.totla = response.data
          this.chartData.datasets[0].data[0]=response.data.TotalUsers
          this.chartData.datasets[0].data[1]=response.data.TotalDrivers
          this.chartData.datasets[0].data[2]=response.data.TotalChild
          this.chartData.datasets[0].data[3]=response.data.TotalRoom
          this.chartData.datasets[0].data[3]=response.data.TotalRoom
         
        })
        .catch((error) => {
          console.error("Error retrieving doctors:", error);
        });

        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
    },
    
    watch: {
    "localStorage.appLang"(newLang) {
       console.log("csac")
    },
  },
    methods: {
        setChartData() {
            return {
                labels: [this.$t('users'),  this.$t('driver'), this.$t('children'),this.$t('room')],
                datasets: [
                    {
                        label: this.$t('total'),
                        data: [],
                        backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
                        borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                        borderWidth: 1
                    }
                ]
            };
        },
        setChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            return {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
        }
    },
   
};
</script>


