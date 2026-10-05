<template>
  <div>

  
  </div>
  <div class="sawa-card">
    <div>

      <Message v-if="alert_text" severity="error" class="mb-3">{{ alert_text }}</Message>
      
    
      <form style="max-height: 80vh; overflow-y: scroll;" ref="form" @submit.prevent="getanswer" class="p-[2%]  bg-[#FDFDFD] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-4" >
        <!-- ... existing code ... -->
          
            
    
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('child_name') }}</label>
                  <Select disabled filter required v-model="answer.child_id"  option-value="id" :options="childs" optionLabel="name" :placeholder='$t("child_name")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.child_id">{{ error.child_id[0] }}</div>
              </div>
             
              <div  v-if="answer.child_id" class="flex flex-column gap-2">
                <label for="username">{{ $t('date') }}</label>
                <DatePicker  @update:model-value="getage" style="width: 100%" showButtonBar v-model.number="answer.date" showIcon  :placeholder='$t("date")'   />   
                <div class="mt-1 mb-5 text-red-500" v-if="error?.child_age">{{ error.child_age[0] }}</div>

            </div> 
            <div  v-if="answer.date" class="flex flex-column gap-2">
                  <label for="username">{{ $t('age') }}</label>
                  <InputNumber readonly  required v-model="answer.child_age" :placeholder='$t("age")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.child_age">{{ error.child_age[0] }}</div>
              </div> 
             
            
                 
              <div v-if="answer.child_age"  class=" flex flex-column gap-2">
                  <label>{{ $t('color') }}</label>
                  <div class="flex gap-2">
                    <div class="ablls-colors">
                      <button v-for="color in colorOptions" :key="color" type="button"
                        :class="{ selected: answer.color === color }" :style="{ backgroundColor: '#' + color }"
                        :aria-label="'#' + color" @click="answer.color = color"></button>
                    </div>
                    <Button v-if="!strart_evaluate" @click="createevalutae" class="m-auto w-full h-[50px]" :label='$t("strart_evaluate")'></Button>
                  </div>
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.color">{{ error.color[0] }}</div>
              </div> 
              <div v-if="strart_evaluate" class="col-span-2 at-nav">
                <template v-for="(que, index) in qustions" :key="index"><a v-if="que.missions?.length" class="at-nav-link" :href="'#ablls-domain-' + index">
                  <span class="ab-symbol is-sm">{{ que.symbol }}</span>{{ que.category }}
                </a></template>
                <span class="at-progress">{{ $t('ablls_ui.answered_n', { n: answeredCount, total: totalMissions }) }}</span>
              </div>

              <template v-if="strart_evaluate">
                <template v-for="g in groupedByType" :key="g.type">
                  <h2 class="col-span-2 at-type">
                    <i :class="typeIcon(g.type)" aria-hidden="true" />{{ $t(`ablls_ui.types.${g.type}`) }}
                  </h2>
                  <section v-for="que in g.items" :id="'ablls-domain-' + que.index" :key="que.index" class="col-span-2 at-domain">
                    <header class="at-domain-head">
                      <span class="ab-symbol">{{ que.symbol }}</span>
                      <h3>{{ que.category }}</h3>
                    </header>

                    <article v-for="q in que.missions" :key="q.id" class="at-skill" :class="{ 'is-answered': isAnswered(q.id) }">
                      <div class="at-skill-head">
                        <span class="ab-key">{{ q.key }}</span>
                        <h4>{{ q.name }}</h4>
                        <span v-if="q.criteria?.length" class="at-criteria">
                          {{ $t('ablls_ui.criteria') }}:
                          <span class="ab-criteria"><span v-for="n in q.criteria" :key="n">{{ n }}</span></span>
                        </span>
                      </div>

                      <!-- academic preparation: the questions; math / reading / spelling: the goals -->
                      <template v-if="isAcademic(que)">
                        <ol class="at-list">
                          <li v-for="(item, i) in listOf(q, 'questions', 'question')" :key="i">
                            <span class="at-code">{{ q.key }}-{{ i + 1 }}</span>{{ item }}
                          </li>
                        </ol>
                        <details v-if="(q.goals || []).length || (q.strengths || []).length" class="at-details">
                          <summary>{{ $t('ablls_ui.show_details') }}</summary>
                          <div v-if="(q.goals || []).length">
                            <b>{{ $t('ablls_ui.goals') }}</b>
                            <ol class="at-list">
                              <li v-for="(item, i) in q.goals" :key="i"><span class="at-code">{{ q.key }}-{{ i + 1 }}</span>{{ item }}</li>
                            </ol>
                          </div>
                          <div v-if="(q.strengths || []).length">
                            <b>{{ $t('ablls_ui.strengths') }}</b>
                            <ol class="at-list">
                              <li v-for="(item, i) in q.strengths" :key="i"><span class="at-code">{{ q.key }}-{{ i + 1 }}</span>{{ item }}</li>
                            </ol>
                          </div>
                        </details>
                      </template>
                      <template v-else>
                        <p v-if="q.long_term_goal" class="at-ltg"><b>{{ $t('ablls_ui.long_term_goal') }}:</b> {{ q.long_term_goal }}</p>
                        <ol class="at-list">
                          <li v-for="(item, i) in q.sub_goals || []" :key="i">
                            <span class="at-code">{{ q.key }}-{{ i + 1 }}</span>{{ item }}
                          </li>
                        </ol>
                      </template>

                      <div class="at-scores" role="radiogroup" :aria-label="$t('ablls_ui.score')">
                        <span class="at-scores-label">{{ $t('ablls_ui.score') }}</span>
                        <button
                          v-for="n in scoreOptions(q)"
                          :key="n"
                          type="button"
                          role="radio"
                          :aria-checked="score[q.id] === n"
                          class="at-score"
                          :class="{ 'is-active': score[q.id] === n, 'is-zero': n === 0 }"
                          :style="score[q.id] === n && n > 0 ? { background: '#' + answer.color, borderColor: '#' + answer.color } : null"
                          :title="n === 0 ? $t('ablls_ui.not_achieved') : null"
                          @click="setScore(q.id, n)"
                        >
                          {{ n }}
                        </button>
                      </div>
                    </article>
                  </section>
                </template>
              </template>
              <div v-if="strart_evaluate" class="flex flex-column gap-2 w-full">
                <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                <Button @click="getanswer"  class="m-auto w-full" :label='$t("submit")'></Button>
                <small id="username-help"></small>
              </div>
            
       
       
           
              
              

      
      </form>
<Toast />
      <!-- ... existing code ... -->
    </div>
  </div>
</template>

<script>
import { getEvaluationTypeLabel } from "../../utils/evaluationTypes";
import { isAcademic, listOf, scoreOptions, typeIcon, typeOf, typeOrder } from "@/components/ablls/abllsTypes";
import "@/components/ablls/ablls.css";
import axios from "axios";
import InputNumber from "primevue/inputnumber";

export default {
  components:{},


  data() {
    return {
      change:{
      status:"1"
    },
      strart_evaluate:false,
      alert_text:"",
      answers:{
        answers:[]
      },
      type:4,
      
      score:{},
      colorOptions: ["00B8D9", "36B37E", "FFAB00", "FF5630", "6554C0"],
      answer:{
          color:"00B8D9",
      },
     allquestion:{},
      childs:[],
      qustions:{},
      error: {},
      maxDate: new Date(),
      notanswer:[],
     
      // Add other validation rules for the title field
    };

  },


  computed: {
    // Domains grouped by type (academic preparation, math, reading, spelling), keeping each domain's index for the links.
    groupedByType() {
      const groups = [];
      (Array.isArray(this.qustions) ? this.qustions : []).forEach((que, index) => {
        if (!que.missions?.length) return;
        const type = typeOf(que);
        let group = groups.find((g) => g.type === type);
        if (!group) groups.push((group = { type, items: [] }));
        group.items.push({ ...que, index });
      });
      return groups.sort((a, b) => typeOrder(a.type) - typeOrder(b.type));
    },
    totalMissions() {
      return (Array.isArray(this.qustions) ? this.qustions : []).reduce((n, que) => n + (que.missions?.length || 0), 0);
    },
    answeredCount() {
      return Object.keys(this.score).length;
    },
  },
  methods: {
    isAcademic,
    listOf,
    scoreOptions,
    typeIcon,
    isAnswered(id) {
      return this.score[id] !== undefined;
    },
    setScore(id, value) {
      this.score = { ...this.score, [id]: value };
      this.getanswerscore({ value }, id);
    },
    // ... existing methods ...
    Therapeutic (){
      this.$router.push({ name: 'answer' });
    },
    showContrast() {
      this.$toast.add({ severity: 'success', summary: this.$t('success_message'), detail: this.$t('successful'), life: 3000 });
      },


    getanswerscore(e,id,index){
      this.answer.mission_id=id
      this.answers.answers[id]=({mission_id:id,score:e.value,color:this.answer.color,child_id:this.answer.child_id,date:this.answer.date,child_age:this.answer.child_age,evaluation_id:this.answer.evaluation_id})
      console.log(this.answers.answers)
    },
    createevalutae(id){
      console.log(id)
      
      axios
        .post(`api/evaluations/create`,{
          type:4,
          title: getEvaluationTypeLabel(4, this.$t, this.$t("evaluation_results")),
          child_id:this.answer.child_id,
          specialist_id:localStorage.getItem("user_id"),
          date:this.answer.date,
        
        
        })
        .then((response) => {
        
          this.answer.evaluation_id=response.data.evaluation.id
         this.strart_evaluate=!(this.strart_evaluate)
         
         
        })
    },
    anserdata(id,val){
      console.log(id)
      console.log(val)
    },
    getcolor(id){
      this.answer.color=id.target.value
    },
    getquation(id){
      axios
        .get(`api/able-mission/1`)
        .then((response) => {
          console.log(response.data.data)
          this.allquestion = response.data.data
         
         
        })
    },
    getage(){
      axios
        .post("api/milestone-answers/get-age-child",{
          date:this.answer.date,
          child_id:this.answer.child_id
        })
        .then((response) => {
         this.answer.child_age=response.data
         
        })
    },
    getanswer(){
      // The color can still change after answering; every answer takes the final one.
      this.answers.answers.forEach((answer) => {
        if (answer) answer.color = this.answer.color;
      });
      axios.post("/api/able-answer",this.answers).then((res) => {
        this.change_status
        axios.post(`/api/evaluation-request/change-status/${localStorage.getItem("eavl_id")}`,this.change)
        this.$router.push({ name: 'ablls-resulte', params:{'id':this.answer.evaluation_id}});
        
      }).catch((el)=>{
          this.alert_text=this.$t('answer_all_questions')
          setTimeout(() => {
      this.alert_text=''
    }, 2500); // Hide after 3 seconds
     
    })
    

    },
    change_status(){
      axios.post("/api/evaluation-request/change-status",this.answers)
    },
    getusers(){
      
     
      axios
        .get("api/child")
        .then((response) => {
         
          this.childs = response.data.children
          this.answer.child_id=parseInt(localStorage.getItem("child_id")) 
          this.answer.evaluation_id=parseInt(this.$route.params.evaluation)
        })
        axios
        .get("api/able-category/grouped/category")
        .then((response) => {
          console.log(response.data.data)
          this.qustions = response.data.data
         
        })
       

    },
   
    
  
    createtreatment() {
    
      axios.post("/api/milestone-answers/check/answers",{
        child_id:this.answer.child_id,
        level_id:this.answer.level_id,

      }).then((res) => {
        console.log(res.data.data)
        this.notanswer=res.data.data
        if(this.notanswer == ''){
          this.$toast.add({ severity: 'success', summary: this.$t('success_message'), detail: this.$t('successful'), life: 3000 });
        }
      }).catch((el)=>{
        console.log(el.response.data.errors.name)
     this.error = el.response.data.errors
    })
    },
   
  },
  mounted() {
   this.getusers()
   this.getquation()
  },
};
</script>

<style scoped>
.ablls-colors { display: flex; align-items: center; gap: .4rem; }
.ablls-colors button { width: 40px; height: 50px; border-radius: 8px; border: 3px solid transparent; cursor: pointer; transition: transform .15s; }
.ablls-colors button:hover { transform: scale(1.05); }
.ablls-colors button.selected { border-color: #333; box-shadow: 0 0 0 2px #fff inset; }
/* Add custom styles for the name input field */
.name-input {
  height: 70vh;
  margin: auto !important;
   overflow-y: scroll;
  width: 100%;
  position: relative;
  background-color: #e7e7e7;
  padding: 10px;
  margin-bottom: 15px !important;
  border-radius: 10px;
}
.name-input::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.name-input {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.name-input {
  width: 606px;
}



.seed {
  width: 600px;

  margin: auto !important;
  background-color: #135c65;
  display: block;
  color: white;
 

 
  /* Set the width to 606px */
}

.custom-select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #f8f8f8;
  color: #333;
  appearance: none;
  /* Remove default arrow in some browsers */
  -webkit-appearance: none;
  /* Remove default arrow in Chrome and Safari */
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}




.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
  /* Adjust margin as needed */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  align-items: center;
  color: #ff0000;
  /* Red color for errors */
  margin-top: 5px;
  font-size: 0.9em;
}

.error-icon {
  margin-right: 5px;
  /* Add styles for your error icon */
}

@media (max-width: 768px) {

  .name-input,
  .custom-select,
  .error-message {
    width: 100%;
    /* Full width on smaller screens */
    margin-bottom: 15px;
  }

  .v-btn {
    width: 100%;
    /* Full width button */
    padding: 12px;
    /* Larger touch target */
  }

  .error-message {
    font-size: 0.8em;
    /* Adjust font size */
  }
}

/* Add additional CSS for animation or other styling as needed */

/* Add any other custom styles here */

/* ABLLS skills: domains grouped by type, each skill with its questions / goals and its score buttons. */
.at-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; }
.at-nav-link { display: inline-flex; align-items: center; gap: .4rem; padding: .3rem .6rem; border: 1px solid var(--sawa-border); border-radius: 999px; background: #fff; color: #334155; font-size: .85rem; font-weight: 600; text-decoration: none; }
.at-nav-link:hover { border-color: var(--sawa-primary); color: var(--sawa-primary); }
.at-progress { margin-inline-start: auto; color: var(--sawa-muted); font-size: .85rem; font-weight: 700; }
.at-type { display: flex; align-items: center; gap: .5rem; margin: .75rem 0 0; color: var(--sawa-primary); font-size: 1.15rem; font-weight: 800; }
.at-domain { display: grid; gap: .75rem; padding: 1rem; background: #fff; border: 1px solid var(--sawa-border); border-radius: var(--sawa-radius); scroll-margin-top: 1rem; }
.at-domain-head { display: flex; align-items: center; gap: .6rem; }
.at-domain-head h3 { margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--sawa-text); }
.at-skill { display: grid; gap: .6rem; padding: .85rem 1rem; border: 1px solid var(--sawa-border); border-inline-start: 4px solid #cbd5e1; border-radius: 10px; background: #fbfcfd; }
.at-skill.is-answered { border-inline-start-color: var(--sawa-primary); background: #fff; }
.at-skill-head { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.at-skill-head h4 { margin: 0; font-size: 1rem; font-weight: 700; color: var(--sawa-text); }
.at-criteria { display: inline-flex; align-items: center; gap: .35rem; margin-inline-start: auto; color: var(--sawa-muted); font-size: .8rem; font-weight: 600; }
.at-list { display: grid; gap: .35rem; margin: 0; padding: 0; list-style: none; }
.at-list li { display: flex; align-items: flex-start; gap: .5rem; line-height: 1.7; font-size: .92rem; color: #334155; }
.at-code { flex: none; padding: .05rem .4rem; border-radius: 6px; background: #f1f5f9; color: #475569; font-size: .75rem; font-weight: 700; direction: ltr; unicode-bidi: isolate; margin-top: .2rem; }
.at-ltg { margin: 0; line-height: 1.7; color: #334155; }
.at-details { font-size: .9rem; }
.at-details summary { cursor: pointer; color: var(--sawa-primary); font-weight: 600; }
.at-details > div { display: grid; gap: .35rem; margin-top: .5rem; }
.at-scores { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; padding-top: .5rem; border-top: 1px dashed var(--sawa-border); }
.at-scores-label { color: var(--sawa-muted); font-size: .82rem; font-weight: 700; margin-inline-end: .25rem; }
.at-score { min-width: 2.4rem; height: 2.4rem; border: 1px solid var(--sawa-border); border-radius: 10px; background: #fff; color: #334155; font: inherit; font-weight: 800; cursor: pointer; transition: background-color .15s, border-color .15s, color .15s; }
.at-score:hover { border-color: var(--sawa-primary); color: var(--sawa-primary); }
.at-score.is-active { background: var(--sawa-primary); border-color: var(--sawa-primary); color: #fff; }
.at-score.is-zero.is-active { background: #64748b; border-color: #64748b; }
</style>
