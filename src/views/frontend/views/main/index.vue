<template>
  <main class="font-cairo bg-warm text-dark">
    <!-- ===== HERO SECTION ===== -->
     <section
      class="bg-gradient-to-l from-[#fcf9f8] from-[40%] to-[#ffd9df] overflow-hidden relative"
    >
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Text -->
        <div class="flex flex-col gap-4 lg:gap-8">
          <div class="text-start">
            <h1
              class="mb-5 text-[36px] font-black leading-[1.15] tracking-normal sm:text-[44px] lg:text-[47px] lg:leading-[1.12]"
            >
              <span class="block">نمضي في رحلة التعلم</span>
              <span class="block">والنمو معا نحو</span>
              <span class="block text-[#B21553]">الاستقلالية والدمج</span>
            </h1>
          </div>
          <p
            class="text-[#6F6669] text-base lg:text-xl text-start leading-relaxed font-bold"
          >
            أكاديمية سوا للتربية الخاصة تقدم برامج تأهيلية متكاملة تجمع بين
            العلم والخبرة والمهنية، لتمكين أطفالنا من الوصول إلى أقصى إمكاناتهم
            في بيئة محفزة وآمنة.
          </p>
          <div class="flex flex-wrap gap-4 items-center">
            <a
              href="/web/evaluation"
              class="bg-[#B21553] text-white font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full shadow-[0_20px_25px_-5px_rgba(178,21,83,0.25)]"
              >احجز تقييم الآن</a
            >
            <a
              href="/programs"
              class="border-2 border-[#1C6772] text-[#1C6772] font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full"
              >تعرف على برامجنا</a
            >
          </div>
        </div>
        <!-- Image -->
        <div class="relative mt-6 lg:mt-0">
          <div
            class="absolute w-64 h-64 rounded-full bg-[#1C6772]/10 blur-[32px] -top-8 -right-10"
          ></div>
          <div
            class="absolute w-64 h-64 rounded-full bg-[#b21553]/10 blur-[32px] -bottom-8 -left-8"
          ></div>
          <div
            class="rotate-2 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
          >
            <img
              src="./images/hero-teacher-child.jpg"
              alt="طفل مع معلمة"
              class="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ABOUT SECTION ===== -->
    <section class="bg-warm py-12 lg:py-24">
      <div
        class="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <!-- Image Grid — hidden on mobile, shown on lg+ -->
        <div class="hidden lg:grid grid-cols-2 gap-4 h-[528px]">
          <div class="flex flex-col gap-4 pt-8">
            <div class="bg-[#f6f3f2] p-2 rounded-2xl">
              <img
                src="./images/classroom-1.jpg"
                alt=""
                class="w-full h-48 object-cover rounded-xl shadow-sm"
              />
            </div>
            <div class="bg-[#ffd9df] p-2 rounded-2xl">
              <img
                src="./images/class-kids.jpg"
                alt=""
                class="w-full h-64 object-cover rounded-xl shadow-sm"
              />
            </div>
          </div>
          <div class="flex flex-col gap-4 pb-8">
            <div class="bg-[#a7ebf6] p-2 rounded-2xl">
              <img
                src="./images/individual-session.jpg"
                alt=""
                class="w-full h-64 object-cover rounded-xl shadow-sm"
              />
            </div>
            <div class="bg-[#f6f3f2] p-2 rounded-2xl">
              <img
                src="./images/classroom-2.jpg"
                alt=""
                class="w-full h-48 object-cover rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
        <!-- Single image for mobile -->
        <div class="lg:hidden rounded-2xl overflow-hidden shadow-md">
          <img
            src="./images/class-kids.jpg"
            alt=""
            class="w-full h-56 sm:h-72 object-cover"
          />
        </div>

        <!-- Text -->
        <div class="flex flex-col gap-4 sm:gap-5">
          <p
            class="text-[#B21553] font-bold text-xs sm:text-sm tracking-[1.4px] uppercase"
          >
            من نحن
          </p>
          <h2
            class="text-2xl sm:text-3xl lg:text-[36px] font-bold text-dark text-start"
          >
            تأسيس مبني على احتياج حقيقي
          </h2>
          <p class="text-body text-base lg:text-lg text-start leading-[1.7]">
            جاء تأسيس أكاديمية سوا للتربية الخاصة استجابةً لحاجة مجتمعية
            حقيقية بوجود مؤسسة تجمع بين العلم والخبرة والمهنية، وتطبق المعايير
            العالمية في التعامل مع الأطفال الذين يحتاجون للبرامج التأهيلية
            الشاملة.
          </p>
          <div class="grid grid-cols-2 gap-4 sm:gap-6 w-full pt-2 sm:pt-4">
            <div class="flex items-start gap-3">
              <img
                src="./images/icon-team.svg"
                alt=""
                class="w-8 h-6 sm:w-10 sm:h-7 shrink-0 mt-1"
              />
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  فريق تخصصي
                </p>
                <p class="text-body text-xs sm:text-sm">
                  نخبة من الأخصائيين ذوي الخبرة
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <img
                src="./images/icon-programs.svg"
                alt=""
                class="w-8 h-8 sm:w-[38px] sm:h-[38px] shrink-0 mt-1"
              />
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  برامج متكاملة
                </p>
                <p class="text-body text-xs sm:text-sm">
                  تغطي كافة الجوانب النمائية
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <img
                src="./images/icon-supervision.svg"
                alt=""
                class="w-7 h-8 sm:w-8 sm:h-9 shrink-0 mt-1"
              />
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  إشراف مهني
                </p>
                <p class="text-body text-xs sm:text-sm">
                  رقابة مستمرة لضمان الجودة
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <img
                src="./images/icon-integration.svg"
                alt=""
                class="w-8 h-8 sm:w-[34px] sm:h-[34px] shrink-0 mt-1"
              />
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  الاستقلالية والدمج
                </p>
                <p class="text-body text-xs sm:text-sm">
                  هدفنا النهائي هو نجاح طفلك
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PROGRAMS SECTION ===== -->
    <section class="bg-warm-gray py-12 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div class="text-center mb-3 sm:mb-4">
          <h2 class="text-2xl sm:text-3xl lg:text-[36px] font-bold text-dark">
            برامجنا الرئيسية
          </h2>
        </div>
        <p class="text-body text-sm sm:text-base text-center mb-10 lg:mb-16">
          نقدم خدمات تعليمية وتأهيلية متخصصة مصممة لتناسب احتياجات كل طفل
          الفردية
        </p>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-8"
        >
          <!-- Card 1 -->
          <div
            class="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style="
                background: linear-gradient(135deg, #b21553 0%, #d4346b 100%);
              "
            >
              <img
                src="./images/icon-early.svg"
                alt=""
                class="w-5 h-5 sm:w-[22px] sm:h-[22px]"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-dark">
              التدخل المبكر
            </h3>
            <p class="text-body text-sm leading-relaxed">
              للأطفال من الولادة حتى عمر 6 سنوات ممن تظهر عليهم علامات التأخر
              النمائي.
            </p>
          </div>
          <!-- Card 2 -->
          <div
            class="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style="
                background: linear-gradient(135deg, #b21553 0%, #d4346b 100%);
              "
            >
              <img
                src="./images/icon-classroom.svg"
                alt=""
                class="w-6 h-5 sm:w-[27px] sm:h-[22px]"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-dark">
              الصفوف النهارية
            </h3>
            <p class="text-body text-sm leading-relaxed">
              برنامج تربوي تأهيلي في بيئة صفية منظمة بالحد الأدنى من عدد
              الطلبة، تحضيراً للدمج في الروضات والمدارس.
            </p>
          </div>
          <!-- Card 3 -->
          <div
            class="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style="
                background: linear-gradient(135deg, #b21553 0%, #d4346b 100%);
              "
            >
              <img
                src="./images/icon-inclusion.svg"
                alt=""
                class="w-5 h-5 sm:w-[25px] sm:h-[25px]"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-dark">
              الدمج المدرسي
            </h3>
            <p class="text-body text-sm leading-relaxed">
              دمج طلبة الأكاديمية في الروضات والمدارس أكاديمياً واجتماعياً،
              بمعلم دمج مخصص لكل طالب.
            </p>
          </div>
          <!-- Card 4 -->
          <div
            class="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style="
                background: linear-gradient(135deg, #b21553 0%, #d4346b 100%);
              "
            >
              <img
                src="./images/icon-individual.svg"
                alt=""
                class="w-5 h-5 sm:w-[23px] sm:h-[25px]"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-dark">
              الجلسات الفردية
            </h3>
            <p class="text-body text-sm leading-relaxed">
              تحليل السلوك التطبيقي (ABA)، العلاج الوظيفي، النطق واللغة، العلاج
              الطبيعي، والبرنامج الأكاديمي.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== WHY SAWA ===== -->
    <section class="py-12 lg:py-24 overflow-hidden relative bg-[#035B65]">
      <div
        class="absolute w-96 h-96 rounded-full bg-[#1C6772]/20 blur-[60px] -top-0 -left-48"
      ></div>
      <div
        class="max-w-[1228px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative"
      >
        <!-- Text -->
        <div class="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
          <h2
            class="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white text-start"
          >
            لماذا تختار أكاديمية سوا؟
          </h2>
          <div class="flex flex-col gap-6 sm:gap-8 w-full">
            <div class="flex items-start gap-3">
              <div class="bg-[#B21553]/20 rounded-full p-2 sm:p-3 shrink-0">
                <img
                  src="./images/icon-iep.svg"
                  alt=""
                  class="w-8 h-9 sm:w-[42px] sm:h-[45px]"
                />
              </div>
              <div class="text-start flex-1">
                <h4
                  class="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2"
                >
                  برنامج تربوي فردي (IEP)
                </h4>
                <p class="text-white/70 text-sm sm:text-base leading-relaxed">
                  نصمم خطة تعليمية وتأهيلية فريدة لكل طفل بناءً على نقاط قوته
                  واحتياجاته.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-[#B21553]/20 rounded-full p-2 sm:p-3 shrink-0">
                <img
                  src="./images/icon-certified.svg"
                  alt=""
                  class="w-8 h-9 sm:w-[43px] sm:h-[45px]"
                />
              </div>
              <div class="text-start flex-1">
                <h4
                  class="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2"
                >
                  فريق معتمد ومحترف
                </h4>
                <p class="text-white/70 text-sm sm:text-base leading-relaxed">
                  أخصائيون مؤهلون علمياً يحملون مزاولة مهنية رسمية معتمدة
                  بتخصصاتهم.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-[#B21553]/20 rounded-full p-2 sm:p-3 shrink-0">
                <img
                  src="./images/icon-assessment.svg"
                  alt=""
                  class="w-8 h-8 sm:w-[42px] sm:h-[42px]"
                />
              </div>
              <div class="text-start flex-1">
                <h4
                  class="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2"
                >
                  تقييم علمي دقيق
                </h4>
                <p class="text-white/70 text-sm sm:text-base leading-relaxed">
                  نستخدم أدوات تقييم مقننة وعالمية لتحديد نقطة البداية الصحيحة.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-[#B21553]/20 rounded-full p-2 sm:p-3 shrink-0">
                <img
                  src="./images/icon-data.svg"
                  alt=""
                  class="w-8 h-8 sm:w-[42px] sm:h-[42px]"
                />
              </div>
              <div class="text-start flex-1">
                <h4
                  class="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2"
                >
                  نتائج مبنية على البيانات
                </h4>
                <p class="text-white/70 text-sm sm:text-base leading-relaxed">
                  نرصد أداء الطفل يومياً ونعرض تقدّمه برسوم بيانية واضحة.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="relative order-1 lg:order-2">
          <div
            class="backdrop-blur-[6px] bg-white/10 border border-white/20 p-3 sm:p-4 rounded-[32px] lg:rounded-[40px]"
          >
            <img
              src="./images/team-photo.jpg"
              alt="لماذا سوا"
              class="w-full h-64 sm:h-96 lg:h-[600px] object-cover rounded-[24px] lg:rounded-[30px] shadow-2xl"
            />
          </div>
          <div
            class="absolute -bottom-4 sm:-bottom-8 left-0 sm:-left-8 bg-[#B21553] p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl"
          >
            <p
              class="text-white font-bold text-xl sm:text-[28px] leading-tight text-center"
            >
              معكم وبكم
            </p>
            <p
              class="text-white font-medium text-xs tracking-[0.6px] uppercase text-center"
            >
              سنبقى سوا
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== JOURNEY TIMELINE ===== -->
    <section class="bg-white py-12 lg:py-24 overflow-hidden">
      <div class="max-w-[1280px] mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl lg:text-[36px] font-bold text-dark text-center mb-10 lg:mb-20"
        >
          رحلة طفلك معنا
        </h2>
        <div class="relative">
          <!-- Timeline line — desktop only -->
          <div
            class="absolute top-8 left-0 right-0 h-1 bg-[#1C6772]/20 hidden lg:block"
          ></div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 relative"
          >
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#035B65] bg-white flex items-center justify-center z-10 shadow-md"
              >
                <img
                  src="./images/icon-step-assess.svg"
                  alt=""
                  class="w-5 h-[18px]"
                />
              </div>
              <p
                class="font-bold text-dark text-sm sm:text-base text-center mt-3 lg:mt-4"
              >
                تقييم شامل
              </p>
              <p class="text-body text-xs text-center">
                تحديد المستوى والاحتياجات
              </p>
            </div>
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#035B65] bg-white flex items-center justify-center z-10 shadow-md"
              >
                <img src="./images/icon-step-plan.svg" alt="" class="w-4 h-5" />
              </div>
              <p
                class="font-bold text-dark text-sm sm:text-base text-center mt-3 lg:mt-4"
              >
                إعداد الـ IEP
              </p>
              <p class="text-body text-xs text-center">خطة فردية مخصصة</p>
            </div>
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#035B65] bg-white flex items-center justify-center z-10 shadow-md"
              >
                <img
                  src="./images/icon-step-start.svg"
                  alt=""
                  class="w-5 h-5"
                />
              </div>
              <p
                class="font-bold text-dark text-sm sm:text-base text-center mt-3 lg:mt-4"
              >
                بدء الجلسات
              </p>
              <p class="text-body text-xs text-center">انطلاق رحلة التأهيل</p>
            </div>
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#035B65] bg-white flex items-center justify-center z-10 shadow-md"
              >
                <img
                  src="./images/icon-step-follow.svg"
                  alt=""
                  class="w-[18px] h-[18px]"
                />
              </div>
              <p
                class="font-bold text-dark text-sm sm:text-base text-center mt-3 lg:mt-4"
              >
                المتابعة والتعديل
              </p>
              <p class="text-body text-xs text-center">تحديث الخطة باستمرار</p>
            </div>
            <div
              class="flex flex-col items-center gap-2 sm:col-span-1 col-span-2 sm:col-start-auto col-start-1 justify-self-center sm:justify-self-auto w-full sm:w-auto"
            >
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#B21553] bg-white flex items-center justify-center z-10 shadow-md"
              >
                <img
                  src="./images/icon-step-goal.svg"
                  alt=""
                  class="w-5 h-[19px]"
                />
              </div>
              <p
                class="font-bold text-dark text-sm sm:text-base text-center mt-3 lg:mt-4"
              >
                الدمج والاستقلالية
              </p>
              <p class="text-body text-xs text-center">الهدف الأسمى والنجاح</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PROGRESS TRACKING ===== -->
    <section class="py-12 lg:py-24 bg-[#F6F3F2]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div
          class="bg-white rounded-[28px] lg:rounded-[40px] shadow-sm p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
        >
          <!-- Text -->
          <div class="flex flex-col gap-4 sm:gap-6 flex-1 w-full">
            <h2
              class="text-xl sm:text-2xl lg:text-[30px] font-bold text-dark text-start"
            >
              متابعة دقيقة لكل خطوة
            </h2>
            <p
              class="text-body text-sm sm:text-base text-start leading-relaxed"
            >
              نرصد أداء الطفل ونسجّل استجاباته بشكل يومي، ونراجع أهداف خطته
              الفردية بشكل دوري ونعدّلها عند الحاجة، ونستخدم الرسوم البيانية
              لعرض تطوّره بشكل واضح وموضوعي.
            </p>
            <div class="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4 w-full">
              <div class="flex items-center gap-3">
                <img
                  src="./images/icon-check.svg"
                  alt=""
                  class="w-5 h-5 shrink-0"
                />
                <span class="text-dark font-medium text-sm sm:text-base"
                  >تقرير أسبوعي وشهري ودوري لكل طفل</span
                >
              </div>
              <div class="flex items-center gap-3">
                <img
                  src="./images/icon-check.svg"
                  alt=""
                  class="w-5 h-5 shrink-0"
                />
                <span class="text-dark font-medium text-sm sm:text-base"
                  >مراجعة الأهداف دورياً وتعديل الخطة عند الحاجة</span
                >
              </div>
              <div class="flex items-center gap-3">
                <img
                  src="./images/icon-check.svg"
                  alt=""
                  class="w-5 h-5 shrink-0"
                />
                <span class="text-dark font-medium text-sm sm:text-base"
                  >رسوم بيانية توضح التقدّم في كل مهارة</span
                >
              </div>
            </div>
          </div>

          <!-- Progress bars -->
          <div
            class="bg-[#F6F3F2] p-5 sm:p-8 rounded-xl w-full lg:w-[448px] shrink-0"
          >
            <div class="flex flex-col gap-4 sm:gap-6">
              <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-dark font-bold text-sm sm:text-base"
                    >التواصل اللفظي</span
                  >
                </div>
                <div class="bg-[#f4f4f5] h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-[#B21553] h-full rounded-full"
                    style="width: 85%"
                  ></div>
                </div>
              </div>
              <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-dark font-bold text-sm sm:text-base"
                    >التفاعل الاجتماعي</span
                  >
                </div>
                <div class="bg-[#f4f4f5] h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-[#1C6772] h-full rounded-full"
                    style="width: 70%"
                  ></div>
                </div>
              </div>
              <div class="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-dark font-bold text-sm sm:text-base"
                    >الرعاية الذاتية</span
                  >
                </div>
                <div class="bg-[#f4f4f5] h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-[#006b24] h-full rounded-full"
                    style="width: 92%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TEAM SECTION ===== -->
    <section class="bg-white py-12 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl lg:text-[36px] font-bold text-dark text-center mb-4"
        >
          فريقنا
        </h2>
        <p
          class="text-body text-base lg:text-lg text-center leading-relaxed max-w-[760px] mx-auto mb-10 lg:mb-16"
        >
          نعمل كفريق متكامل التخصصات، وتحت إشراف إدارة ذات خبرة طويلة في مجال
          التأهيل والتعليم، للوصول بكل طفل إلى أقصى درجات الاستقلالية والاعتماد
          على الذات.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div
            class="bg-[#F6F3F2] rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-[#B21553]/10"
            >
              <img src="./images/icon-certified.svg" alt="" class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-[#B21553]">مؤهلون ومعتمدون</h3>
            <p class="text-body text-sm leading-relaxed">
              نخبة من الأخصائيين المؤهلين علمياً، يحملون مزاولة مهنية رسمية معتمدة بتخصصاتهم.
            </p>
          </div>
          <div
            class="bg-[#F6F3F2] rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-[#1C6772]/10"
            >
              <img src="./images/icon-professionalism.svg" alt="" class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-[#1C6772]">اختيار وفق معايير دقيقة</h3>
            <p class="text-body text-sm leading-relaxed">
              يتم اختيارهم وفق معايير دقيقة تضمن الكفاءة العالية والدقة والالتزام المهني.
            </p>
          </div>
          <div
            class="bg-[#F6F3F2] rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-[#B21553]/10"
            >
              <img src="./images/icon-growth.svg" alt="" class="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-[#B21553]">تدريب مستمر</h3>
            <p class="text-body text-sm leading-relaxed">
              يخضع جميع أعضاء فريقنا لبرامج تدريب مستمرة داخل سوا وخارجها، لتطوير مهاراتهم وتحديث معارفهم.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FACILITIES GALLERY ===== -->
    <section class="py-12 lg:py-24 bg-[#F6F3F2]">
      <div class="max-w-[1280px] mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl lg:text-[36px] font-bold text-dark text-center mb-10 lg:mb-16"
        >
          بيئة آمنة ومحفزة
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4"
        >
          <!-- Large image: spans 2 cols and 2 rows on lg -->
          <div
            class="sm:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl overflow-hidden relative h-64 sm:h-80 lg:h-full"
          >
            <img
              src="./images/classroom-2.jpg"
              alt="صفوف دراسية"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5 sm:p-8"
            >
              <p class="text-white font-bold text-base sm:text-lg">
                صفوف دراسية مجهزة
              </p>
            </div>
          </div>
          <!-- Small images -->
          <div
            class="rounded-3xl overflow-hidden relative h-44 sm:h-52 lg:h-full"
          >
            <img
              src="./images/indoor-play-slide.jpg"
              alt="مناطق اللعب"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
            >
              <p class="text-white font-bold text-sm">ساحات اللعب الداخلية</p>
            </div>
          </div>
          <div
            class="rounded-3xl overflow-hidden relative h-44 sm:h-52 lg:h-full"
          >
            <img
              src="./images/reception.jpg"
              alt="مرافق الأكاديمية"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
            >
              <p class="text-white font-bold text-sm">مرافق مراقبة بالكاميرات</p>
            </div>
          </div>
          <div
            class="rounded-3xl overflow-hidden relative h-44 sm:h-52 lg:h-full"
          >
            <img
              src="./images/pt-room.jpg"
              alt="غرف علاجية"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
            >
              <p class="text-white font-bold text-sm">قسم العلاج الطبيعي</p>
            </div>
          </div>
          <div
            class="rounded-3xl overflow-hidden relative h-44 sm:h-52 lg:h-full"
          >
            <img
              src="./images/garden-umbrella.jpg"
              alt="مرافق خارجية"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
            >
              <p class="text-white font-bold text-sm">ساحات واسعة</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TRANSPORTATION ===== -->
    <section class="bg-white py-12 lg:py-24">
      <div
        class="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center"
      >
        <!-- Image -->
        <div class="flex-1 relative w-full">
          <img
            src="./images/bus.jpg"
            alt="نقل آمن"
            class="w-full h-56 sm:h-80 lg:h-[400px] object-cover rounded-[32px] lg:rounded-[40px] shadow-xl"
          />
          <div
            class="absolute -top-4 sm:-top-6 right-0 sm:-right-6 bg-[#1C6772] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg"
          >
            <p class="font-bold text-xl sm:text-2xl text-start">8 أطفال</p>
            <p class="text-xs text-white text-start">كحد أقصى لكل رحلة</p>
          </div>
        </div>

        <!-- Text -->
        <div class="flex-1 flex flex-col gap-4 sm:gap-6 w-full">
          <h2
            class="text-xl sm:text-2xl lg:text-[30px] font-bold text-dark text-start"
          >
            نقل آمن.. براحة بال تامة
          </h2>
          <p class="text-body text-sm sm:text-base text-start leading-relaxed">
            نوفر خدمة المواصلات لطلبتنا بمركبات صغيرة لا تتجاوز سعتها 8 أطفال،
            حتى لا تطول الجولة على الأطفال ويصل كل طفل لبيته وللأكاديمية بأقرب
            وقت ممكن.
          </p>
          <div class="flex flex-col gap-3 pt-2 w-full">
            <div class="flex gap-3 items-center">
              <div
                class="shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14"
              >
                <img
                  src="./images/icon-camera.svg"
                  alt=""
                  class="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  كاميرات صوت وصورة وتتبع GPS
                </p>
                <p class="text-body text-xs sm:text-sm">
                  مراقبة كاملة للمركبة طوال الرحلة
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14"
              >
                <img
                  src="./images/icon-companion.svg"
                  alt=""
                  class="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  معالج سلوكي مرافق
                </p>
                <p class="text-body text-xs sm:text-sm">
                  مؤهل ومرخّص، يتعامل مع أي سلوك غير مرغوب داخل المركبة
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14"
              >
                <img
                  src="./images/icon-quick.svg"
                  alt=""
                  class="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <div class="text-start">
                <p class="font-bold text-dark text-sm sm:text-base">
                  دون تأخير
                </p>
                <p class="text-body text-xs sm:text-sm">
                  جولات قصيرة ليصل كل طفل بأقرب وقت ممكن
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FINAL CTA ===== -->
    <section class="py-12 lg:py-24 relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-10"
        style="background: linear-gradient(138deg, #b21553 0%, #d4346b 100%)"
      ></div>
      <div class="max-w-[896px] mx-auto px-4 sm:px-6 text-center relative">
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] font-extrabold text-dark leading-tight mb-4 sm:mb-6"
        >
          ابدأ رحلة طفلك نحو الاستقلالية اليوم
        </h2>
        <p
          class="text-body text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10"
        >
          لا تتردد في استشارتنا. نحن هنا لندعمكم، لنسمعكم، ولنخطط معاً لمستقبل
          أفضل لأطفالكم.
        </p>
        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center"
        >
          <a
            href="/web/evaluation"
            class="w-full sm:w-auto bg-[#B21553] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl text-center"
            >احجز تقييم الآن</a
          >
          <a
            href="/contact"
            class="w-full sm:w-auto bg-white border-2 border-[#1C6772] text-[#1C6772] font-bold text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full text-center"
            >تواصل معنا</a
          >
        </div>
      </div>
    </section>
  </main>
</template>
