<template>
  <main>
    <!-- HERO -->
    <section class="bg-[#f6f3f2] overflow-hidden relative">
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Text -->
        <div class="flex flex-col gap-4 lg:gap-8">
          <div class="text-start">
            <h1
              class="mb-5 text-[36px] font-black leading-[1.15] tracking-normal sm:text-[44px] lg:text-[47px] lg:leading-[1.12]"
            >
              <span class="block text-[#1c6772]">نرافق طفلك في رحلة <br>النمو نحو</span>
              <span class="block text-[#b21553]">الاستقلالية والدمج</span>
            </h1>
          </div>
          <p
            class="text-[#594045] text-base lg:text-xl text-start leading-relaxed font-bol" 
          >
            في أكاديمية سوا، ندمج بين أحدث المنهجيات العلمية العالمية والخبرة
            المهنية العميقة لتوفير بيئة تعليمية تضمن تمكين كل طفل من الوصول
            لأقصى قدراته.
          </p>
          <div class="flex flex-wrap gap-4 items-center">
            <a
              href="#story"
              class="bg-[#b21553] text-white font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full shadow-[0_20px_25px_-5px_rgba(178,21,83,0.25)]"
              >تعرف على رسالتنا</a
            >
            <a
              href="/contact"
              class="border-2 border-[#1c6772] text-[#1c6772] font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full"
              >تواصل معنا</a
            >
          </div>
        </div>
        <!-- Image -->
        <div class="relative mt-6 lg:mt-0">
          <div
            class="absolute w-64 h-64 rounded-full bg-[#b21553]/10 blur-[32px] -top-8 -right-10"
          ></div>
          <div
            class="absolute w-64 h-64 rounded-full bg-[#1c6772]/10 blur-[32px] -bottom-8 -left-8"
          ></div>
          <div
            class="rotate-2 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
          >
            <img
              src="./images/hero-gate.jpg"
              alt="أكاديمية سوا"
              class="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- OUR STORY -->
    <section id="story" class="bg-[#fcf9f8] py-16 lg:py-24">
      <div
        class="max-w-[1440px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
      >
        <!-- Right 7 cols: Text -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="flex items-center gap-2">
            <div class="bg-[#b21553] h-0.5 w-12"></div>
            <p class="text-[#b21553] font-bold text-base tracking-[0.8px]">
              قصتنا
            </p>
          </div>
          <h2
            class="text-2xl lg:text-[36px] font-bold text-[#1c1b1b] text-start leading-tight"
          >
            استجابة لاحتياجات المجتمع<br />بمعايير إكلينيكية
          </h2>
          <div class="flex flex-col gap-4">
            <p
              class="text-[#594045] text-base lg:text-lg text-start leading-[2]"
            >
              جاء تأسيس أكاديمية سوا للتربية الخاصة استجابةً لحاجة مجتمعية
              حقيقية بوجود مؤسسة تجمع بين العلم والخبرة والمهنية، وتطبق
              المعايير العالمية في التعامل مع الأطفال الذين يحتاجون للبرامج
              التأهيلية الشاملة.
            </p>
            <p
              class="text-[#594045] text-base lg:text-lg text-start leading-[2]"
            >
              نحن متخصصون في تقديم الخدمات التأهيلية والتعليمية للأطفال، نعمل
              كفريق متكامل التخصصات من خلال برامجنا المتخصصة وكادرنا المؤهل،
              وتحت إشراف إدارة ذات خبرة طويلة في مجال التأهيل والتعليم، للوصول
              بكل طفل إلى أقصى درجات الاستقلالية والاعتماد على الذات، لنمكّنه من
              النجاح في دمجه بين أقرانه وأسرته ومجتمعه بثقة وفاعلية.
            </p>
          </div>
        </div>
        <!-- Left 5 cols: Cards grid -->
        <div class="lg:col-span-5 grid grid-cols-2 gap-4">
          <div
            class="bg-white rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-sm pb-12 lg:pb-16"
          >
            <img src="./images/icon-learn.svg" alt="" class="w-8 h-6" />
            <h3 class="text-[#1c6772] font-bold text-base">التعلم</h3>
          </div>
          <div
            class="bg-[#a7ebf6] rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-sm mt-8"
          >
            <img src="./images/icon-merge.svg" alt="" class="w-9 h-[18px]" />
            <h3 class="text-[#1c6772] font-bold text-base">الدمج</h3>
          </div>
          <div
            class="bg-[#e5e2e1] rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-sm pb-12 lg:pb-16"
          >
            <img src="./images/icon-growth.svg" alt="" class="w-8 h-[18px]" />
            <h3 class="text-[#1c6772] font-bold text-base">النمو</h3>
          </div>
          <div
            class="bg-white rounded-3xl p-6 lg:p-8 flex flex-col gap-4 shadow-sm mt-8"
          >
            <img src="./images/icon-care.svg" alt="" class="w-8 h-7" />
            <h3 class="text-[#1c6772] font-bold text-base">الرعاية</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSION CARDS -->
    <section class="bg-[#f6f3f2] py-16 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 lg:px-8">
        <h2
          class="text-2xl lg:text-[36px] font-bold text-[#1c6772] text-center mb-10 lg:mb-16"
        >
          رسالتنا في أكاديمية سوا
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          <div class="bg-white rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <img src="./images/icon-iep.svg" alt="" class="w-[52px] h-[55px]" />
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              استقلالية الطفل
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              تمكين الطفل من مهارات الاعتماد على الذات في حياته اليومية.
            </p>
          </div>
          <div class="bg-white rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <div
              class="bg-[#1c6772] w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              <img
                src="./images/icon-inclusion.svg"
                alt=""
                class="w-[27px] h-[25px]"
              />
            </div>
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              الدمج المجتمعي
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              بناء جسور التواصل بين أطفالنا والمجتمع الخارجي بفعالية.
            </p>
          </div>
          <div class="bg-white rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <img
              src="./images/icon-programs.svg"
              alt=""
              class="w-[45px] h-[45px]"
            />
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              برامج مثبتة علمياً
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              تطبيق أحدث البروتوكولات العلاجية المبنية على الأدلة والبراهين.
            </p>
          </div>
          <div class="bg-white rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <div
              class="bg-[#1c6772]/10 w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              <img
                src="./images/icon-family.svg"
                alt=""
                class="w-[27px] h-[25px]"
              />
            </div>
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              شراكة الأسرة
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              إشراك الوالدين كشركاء أساسيين في كل خطوة من رحلة التطور.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- VISION -->
    <section
      class="py-16 lg:py-32 relative overflow-hidden bg-gradient-to-br from-[#1c6772] to-[#004f58]"
    >
      <div class="max-w-[896px] mx-auto px-4 lg:px-8 text-center relative">
        <img
          src="./images/icon-star.svg"
          alt=""
          class="w-14 h-[38px] mx-auto mb-8"
        />
        <h2
          class="text-2xl sm:text-[36px] lg:text-[48px] font-extrabold text-white leading-tight mb-6"
        >
          رؤيتنا هي أن نكون المؤسسة الرائدة في تحقيق الاندماج الحقيقي والنمو
          المستدام لكل طفل
        </h2>
        <div class="bg-[#d4346b] h-1 w-24 mx-auto"></div>
      </div>
    </section>

    <!-- CORE VALUES -->
    <section class="bg-[#fcf9f8] py-16 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 lg:px-8">
        <h2
          class="text-2xl lg:text-[36px] font-bold text-[#1c6772] text-center mb-10 lg:mb-16"
        >
          قيمنا الجوهرية
        </h2>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            class="bg-[#f6f3f2] rounded-3xl p-6 lg:p-8 flex items-start gap-6"
          >
            <img
              src="./images/icon-professionalism.svg"
              alt=""
              class="w-6 h-8 shrink-0 mt-1"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[#1c6772] font-bold text-xl text-start">
                المهنية
              </h3>
              <p class="text-[#594045] text-base text-start leading-relaxed">
                الالتزام بأعلى معايير الجودة في كل تفاصيل خدماتنا.
              </p>
            </div>
          </div>
          <div
            class="bg-[#f6f3f2] rounded-3xl p-6 lg:p-8 flex items-start gap-6"
          >
            <img
              src="./images/icon-empathy.svg"
              alt=""
              class="w-8 h-8 shrink-0 mt-1"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[#1c6772] font-bold text-xl text-start">
                التعاطف
              </h3>
              <p class="text-[#594045] text-base text-start leading-relaxed">
                التعامل بحب وتفهم عميق لاحتياجات الأطفال وأهاليهم.
              </p>
            </div>
          </div>
          <div
            class="bg-[#f6f3f2] rounded-3xl p-6 lg:p-8 flex items-start gap-6"
          >
            <img
              src="./images/icon-science.svg"
              alt=""
              class="w-7 h-7 shrink-0 mt-1"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[#1c6772] font-bold text-xl text-start">
                الدقة العلمية
              </h3>
              <p class="text-[#594045] text-base text-start leading-relaxed">
                تحليل البيانات والنتائج لضمان مسار علاجي صحيح.
              </p>
            </div>
          </div>
          <div
            class="bg-[#f6f3f2] rounded-3xl p-6 lg:p-8 flex items-start gap-6"
          >
            <img
              src="./images/icon-development.svg"
              alt=""
              class="w-7 h-7 shrink-0 mt-1"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[#1c6772] font-bold text-xl text-start">
                التطوير المستمر
              </h3>
              <p class="text-[#594045] text-base text-start leading-relaxed">
                مواكبة كل ما هو جديد في عالم التربية الخاصة.
              </p>
            </div>
          </div>
          <div
            class="bg-[#f6f3f2] rounded-3xl p-6 lg:p-8 flex items-start gap-6"
          >
            <img
              src="./images/icon-child.svg"
              alt=""
              class="w-7 h-8 shrink-0 mt-1"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[#1c6772] font-bold text-xl text-start">
                تركيزنا الطفل
              </h3>
              <p class="text-[#594045] text-base text-start leading-relaxed">
                كل قراراتنا تتمحور حول مصلحة الطفل الفضلى أولاً.
              </p>
            </div>
          </div>
          <div
            class="bg-[#f6f3f2] rounded-3xl p-6 lg:p-8 flex items-start gap-6"
          >
            <img
              src="./images/icon-teamwork.svg"
              alt=""
              class="w-9 h-[34px] shrink-0 mt-1"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[#1c6772] font-bold text-xl text-start">
                العمل الجماعي
              </h3>
              <p class="text-[#594045] text-base text-start leading-relaxed">
                تكامل التخصصات للوصول إلى أفضل النتائج المرجوة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="bg-white py-16 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div class="text-center mb-4">
          <h2 class="text-2xl lg:text-[36px] font-bold text-[#1c6772]">
            فريقنا
          </h2>
        </div>
        <p class="text-[#594045] text-base text-center mb-10 lg:mb-16">
          يضم فريق سوا نخبة من الأخصائيين في تحليل السلوك التطبيقي، والنطق
          واللغة، والعلاج الوظيفي، والعلاج الطبيعي، والتعليم الإدراكي الأكاديمي.
        </p>
        <div class="mx-auto mb-10 max-w-[640px] overflow-hidden rounded-[32px] bg-[#f6f3f2] lg:mb-14">
          <img
            src="./images/team-illustration.png"
            alt="فريق سوا"
            class="w-full h-auto"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div class="bg-[#f6f3f2] rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <img src="./images/icon-certified.svg" alt="" class="w-9 h-9" />
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              مؤهلون ومعتمدون
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              نخبة من الأخصائيين المؤهلين علمياً، يحملون مزاولة مهنية رسمية معتمدة بتخصصاتهم.
            </p>
          </div>
          <div class="bg-[#f6f3f2] rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <img src="./images/icon-professionalism.svg" alt="" class="w-9 h-9" />
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              اختيار وفق معايير دقيقة
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              يتم اختيارهم وفق معايير دقيقة تضمن الكفاءة العالية والدقة والالتزام المهني.
            </p>
          </div>
          <div class="bg-[#f6f3f2] rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <img src="./images/icon-development.svg" alt="" class="w-9 h-9" />
            <h3 class="text-[#1c6772] font-bold text-xl text-start">
              تدريب مستمر
            </h3>
            <p class="text-[#594045] text-base text-start leading-relaxed">
              يخضع جميع أعضاء فريقنا لبرامج تدريب مستمرة داخل سوا وخارجها، بهدف تطوير دائم لمهاراتهم وتحديث لمعارفهم.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY SAWA -->
    <section class="bg-[#fcf9f8] py-16 lg:py-24">
      <div
        class="max-w-[1264px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <!-- Image -->
        <div class="relative">
          <img
            src="./images/team-photo.jpg"
            alt="لماذا سوا"
            class="w-full h-[300px] sm:h-[400px] lg:h-[512px] object-cover rounded-[48px] shadow-2xl"
          />
          <div
            class="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8 bg-white p-5 lg:p-8 rounded-3xl shadow-xl"
          >
            <p
              class="text-[#b21553] font-bold text-2xl lg:text-[30px] text-start leading-[36px]"
            >
              معكم وبكم
            </p>
            <p class="text-[#1c6772] font-bold text-sm lg:text-base text-start">
              سنبقى سوا
            </p>
          </div>
        </div>
        <!-- Text -->
        <div class="flex flex-col gap-8 lg:gap-10 mt-4 lg:mt-0">
          <h2
            class="text-2xl lg:text-[36px] font-bold text-[#1c6772] text-start"
          >
            لماذا يختار الأهالي "سوا"؟
          </h2>
          <div class="flex flex-col gap-6 w-full">
            <div class="flex items-center gap-4">
              <div
                class="bg-[#b21553]/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0"
              >
                <img src="./images/icon-plan.svg" alt="" class="w-5 h-4" />
              </div>
              <p
                class="text-[#594045] font-semibold text-base lg:text-lg text-start"
              >
                خطط تعليمية فردية (IEP) لكل طفل
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="bg-[#b21553]/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0"
              >
                <img
                  src="./images/icon-report.svg"
                  alt=""
                  class="w-[18px] h-[18px]"
                />
              </div>
              <p
                class="text-[#594045] font-semibold text-base lg:text-lg text-start"
              >
                متابعة مستمرة وتقارير دورية دقيقة
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="bg-[#b21553]/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0"
              >
                <img src="./images/icon-multiteam.svg" alt="" class="w-5 h-5" />
              </div>
              <p
                class="text-[#594045] font-semibold text-base lg:text-lg text-start"
              >
                فريق عمل متعدد التخصصات متكامل
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="bg-[#b21553]/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0"
              >
                <img
                  src="./images/icon-aba.svg"
                  alt=""
                  class="w-[22px] h-[21px]"
                />
              </div>
              <p
                class="text-[#594045] font-semibold text-base lg:text-lg text-start"
              >
                برامج قائمة على مبادئ تحليل السلوك التطبيقي ABA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-white py-16 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div
          class="bg-white rounded-[48px] shadow-2xl p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div
            class="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5 bg-gradient-to-br from-[#b21553] to-[#d4346b]"
          ></div>
          <div
            class="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-5 bg-gradient-to-br from-[#1c6772] to-[#004f58]"
          ></div>
          <h2
            class="text-2xl sm:text-[36px] lg:text-[48px] font-extrabold text-[#1c6772] mb-6 relative"
          >
            ابدأ رحلة طفلك معنا اليوم
          </h2>
          <p
            class="text-[#594045] text-base lg:text-xl leading-relaxed mb-8 lg:mb-10 max-w-[672px] mx-auto relative"
          >
            نحن هنا لنقدم لك الدعم العلمي والمهني الذي يستحقه طفلك لنمو سليم
            ومستقبل واعد.
          </p>
          <div
            class="flex flex-wrap gap-4 lg:gap-6 items-center justify-center relative"
          >
            <a
              href="/web/evaluation"
              class="bg-[#b21553] text-white font-bold text-base lg:text-xl px-8 lg:px-10 py-4 lg:py-5 rounded-full shadow-[0_20px_25px_-5px_rgba(178,21,83,0.25)]"
              >احجز تقييم الآن</a
            >
            <a
              href="/contact"
              class="border-2 border-[#1c6772] text-[#1c6772] font-bold text-base lg:text-xl px-8 lg:px-10 py-4 lg:py-5 rounded-full"
              >تواصل معنا</a
            >
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
