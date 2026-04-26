<template>
  <main>
    <!-- HERO -->
    <section class="bg-[#f6f3f2] overflow-hidden relative">
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Text -->
        <div class="flex flex-col gap-6 lg:gap-8">
          <div class="text-right">
            <h1
              class="text-[36px] sm:text-[48px] lg:text-[60px] font-extrabold leading-[1.1]"
            >
              <span class="block text-[#1c6772]">نرافق طفلك في رحلة</span>
              <span class="block text-[#1c6772]">النمو نحو</span>
              <span class="block text-[#b21553]">الاستقلالية</span>
              <span class="block text-[#b21553]">والدمج</span>
            </h1>
          </div>
          <p
            class="text-[#594045] text-base lg:text-xl text-right leading-relaxed"
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
              href="contact.html"
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
              src="./images/about-hero.jpg"
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
            class="text-2xl lg:text-[36px] font-bold text-[#1c1b1b] text-right leading-tight"
          >
            استجابة لاحتياجات المجتمع<br />بمعايير إكلينيكية
          </h2>
          <div class="flex flex-col gap-4">
            <p
              class="text-[#594045] text-base lg:text-lg text-right leading-[2]"
            >
              تأسست أكاديمية سوا من رؤية واضحة لسد الفجوة في خدمات التربية
              الخاصة المتميزة. لم تكن مجرد مشروع، بل استجابة حقيقية لاحتياجات
              الأسر الباحثة عن التميز العلمي والاحتواء الإنساني.
            </p>
            <p
              class="text-[#594045] text-base lg:text-lg text-right leading-[2]"
            >
              نحن نؤمن أن كل طفل هو قصة نجاح تنتظر من يقرأها، ولذلك اعتمدنا أعلى
              المعايير المهنية العالمية لضمان رحلة تعلم مثمرة وآمنة.
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
            <h3 class="text-[#1c6772] font-bold text-xl text-right">
              استقلالية الطفل
            </h3>
            <p class="text-[#594045] text-base text-right leading-relaxed">
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
            <h3 class="text-[#1c6772] font-bold text-xl text-right">
              الدمج المجتمعي
            </h3>
            <p class="text-[#594045] text-base text-right leading-relaxed">
              بناء جسور التواصل بين أطفالنا والمجتمع الخارجي بفعالية.
            </p>
          </div>
          <div class="bg-white rounded-[32px] p-8 lg:p-10 flex flex-col gap-4">
            <img
              src="./images/icon-programs.svg"
              alt=""
              class="w-[45px] h-[45px]"
            />
            <h3 class="text-[#1c6772] font-bold text-xl text-right">
              برامج مثبتة علمياً
            </h3>
            <p class="text-[#594045] text-base text-right leading-relaxed">
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
            <h3 class="text-[#1c6772] font-bold text-xl text-right">
              شراكة الأسرة
            </h3>
            <p class="text-[#594045] text-base text-right leading-relaxed">
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
              <h3 class="text-[#1c6772] font-bold text-xl text-right">
                المهنية
              </h3>
              <p class="text-[#594045] text-base text-right leading-relaxed">
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
              <h3 class="text-[#1c6772] font-bold text-xl text-right">
                التعاطف
              </h3>
              <p class="text-[#594045] text-base text-right leading-relaxed">
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
              <h3 class="text-[#1c6772] font-bold text-xl text-right">
                الدقة العلمية
              </h3>
              <p class="text-[#594045] text-base text-right leading-relaxed">
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
              <h3 class="text-[#1c6772] font-bold text-xl text-right">
                التطوير المستمر
              </h3>
              <p class="text-[#594045] text-base text-right leading-relaxed">
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
              <h3 class="text-[#1c6772] font-bold text-xl text-right">
                تركيزنا الطفل
              </h3>
              <p class="text-[#594045] text-base text-right leading-relaxed">
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
              <h3 class="text-[#1c6772] font-bold text-xl text-right">
                العمل الجماعي
              </h3>
              <p class="text-[#594045] text-base text-right leading-relaxed">
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
            فريق سوا المتخصص
          </h2>
        </div>
        <p class="text-[#594045] text-base text-center mb-10 lg:mb-16">
          نخبة من الكفاءات المعتمدة عالمياً في مجالات التربية الخاصة وتعديل
          السلوك والنطق.
        </p>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
        >
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48">
              <div
                class="absolute inset-[-10px] bg-[#b21553]/20 blur-[6px] rounded-full"
              ></div>
              <img
                src="./images/team-sara.jpg"
                alt="د. سارة الأحمد"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            <h3 class="text-[#1c6772] font-bold text-xl mt-6">
              د. سارة الأحمد
            </h3>
            <p class="text-[#b21553] font-semibold text-base mt-1">
              أخصائية تحليل سلوك (BCBA)
            </p>
            <p class="text-[#594045] text-sm mt-1">خبرة ١٢ عاماً في التوحد</p>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48">
              <div
                class="absolute inset-[-10px] bg-[#1c6772]/20 blur-[6px] rounded-full"
              ></div>
              <img
                src="./images/team-omar.jpg"
                alt="أ. عمر محمود"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            <h3 class="text-[#1c6772] font-bold text-xl mt-6">أ. عمر محمود</h3>
            <p class="text-[#b21553] font-semibold text-base mt-1">
              أخصائي تخاطب ونطق
            </p>
            <p class="text-[#594045] text-sm mt-1">
              خبرة ٨ سنوات في اضطرابات اللغة
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48">
              <div
                class="absolute inset-[-10px] bg-[#b21553]/20 blur-[6px] rounded-full"
              ></div>
              <img
                src="./images/team-layla.jpg"
                alt="أ. ليلى حسن"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            <h3 class="text-[#1c6772] font-bold text-xl mt-6">أ. ليلى حسن</h3>
            <p class="text-[#b21553] font-semibold text-base mt-1">
              أخصائية علاج وظيفي
            </p>
            <p class="text-[#594045] text-sm mt-1">
              خبرة ١٠ سنوات في تنمية المهارات
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48">
              <div
                class="absolute inset-[-10px] bg-[#1c6772]/20 blur-[6px] rounded-full"
              ></div>
              <img
                src="./images/team-khaled.jpg"
                alt="د. خالد منصور"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            <h3 class="text-[#1c6772] font-bold text-xl mt-6">د. خالد منصور</h3>
            <p class="text-[#b21553] font-semibold text-base mt-1">
              مستشار تربية خاصة
            </p>
            <p class="text-[#594045] text-sm mt-1">
              خبرة ١٥ عاماً في تصميم المناهج
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
            src="./images/why-about.jpg"
            alt="لماذا سوا"
            class="w-full h-[300px] sm:h-[400px] lg:h-[512px] object-cover rounded-[48px] shadow-2xl"
          />
          <div
            class="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8 bg-white p-5 lg:p-8 rounded-3xl shadow-xl"
          >
            <p
              class="text-[#b21553] font-bold text-2xl lg:text-[30px] text-right leading-[36px]"
            >
              +٥٠٠
            </p>
            <p class="text-[#1c6772] font-bold text-sm lg:text-base text-right">
              طفل تم دمجهم بنجاح
            </p>
          </div>
        </div>
        <!-- Text -->
        <div class="flex flex-col gap-8 lg:gap-10 mt-4 lg:mt-0">
          <h2
            class="text-2xl lg:text-[36px] font-bold text-[#1c6772] text-right"
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
                class="text-[#594045] font-semibold text-base lg:text-lg text-right"
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
                class="text-[#594045] font-semibold text-base lg:text-lg text-right"
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
                class="text-[#594045] font-semibold text-base lg:text-lg text-right"
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
                class="text-[#594045] font-semibold text-base lg:text-lg text-right"
              >
                برامج مثبتة النتائج مبنية على الـ ABA
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
              href="contact.html"
              class="bg-[#b21553] text-white font-bold text-base lg:text-xl px-8 lg:px-10 py-4 lg:py-5 rounded-full shadow-[0_20px_25px_-5px_rgba(178,21,83,0.25)]"
              >احجز تقييم الآن</a
            >
            <a
              href="contact.html"
              class="border-2 border-[#1c6772] text-[#1c6772] font-bold text-base lg:text-xl px-8 lg:px-10 py-4 lg:py-5 rounded-full"
              >تواصل معنا</a
            >
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
