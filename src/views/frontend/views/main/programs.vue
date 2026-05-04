<template>
  <main class="bg-[#fcf9f8] text-[#1c1b1b]" dir="rtl">
    <!-- HERO -->
    <section class="overflow-hidden bg-[#fcf9f8]">
      <div
        class="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
      >
        <div class="flex flex-col items-start text-right gap-4 lg:gap-5">
          <span
            class="inline-flex rounded-full bg-[#a7ebf6]/50 text-[#1c6772] text-xs sm:text-sm font-bold px-4 py-2"
          >
            نصنع الفرق في حياة طفلك
          </span>
          <h1
            class="text-[34px] sm:text-[46px] lg:text-[58px] font-extrabold leading-[1.12] text-[#1c1b1b]"
          >
            <span class="block">برامج متكاملة</span>
            <span class="block text-[#b21553]">لدعم نمو طفلك</span>
          </h1>
          <p
            class="text-[#594045] text-sm sm:text-base lg:text-lg leading-[1.9] max-w-[560px]"
          >
            نقدم في أكاديمية سوا بيئة تعليمية وعلاجية متخصصة تجمع بين العلم
            والتعاطف، لتمكين الأطفال من مواجهة التحديات وتحقيق أقصى إمكاناتهم.
          </p>
          <div class="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <a
              class="bg-[#b21553] cursor-pointer text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-[0_16px_26px_rgba(178,21,83,0.22)]"
            >
              احجز تقييم الآن
            </a>
            <a
              class="border-2 cursor-pointer border-[#1c6772] text-[#1c6772] font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-sm"
            >
              تواصل معنا
            </a>
          </div>
        </div>

        <div class="relative">
          <div
            class="absolute -top-6 -left-6 w-44 h-44 rounded-full bg-[#ffd9df] blur-[28px] opacity-80"
          ></div>
          <div
            class="absolute -bottom-7 -right-8 w-48 h-48 rounded-full bg-[#a7ebf6] blur-[32px] opacity-70"
          ></div>
          <div
            class="relative overflow-hidden rounded-[24px] sm:rounded-[30px] bg-white p-2 shadow-[0_20px_50px_rgba(89,64,69,0.16)] rotate-[-1deg]"
          >
            <img
              src="./images/programs-hero.png"
              alt="برامج أكاديمية سوا"
              class="w-full h-[240px] sm:h-[350px] lg:h-[430px] object-cover rounded-[18px] sm:rounded-[24px]"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK VALUES -->
    <section class="bg-[#f6f3f2] py-7 sm:py-9">
      <div class="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            class="bg-white rounded-2xl p-5 items-start flex flex-col gap-4 shadow-[0_8px_24px_rgba(28,27,27,0.04)]"
          >
            <img src="./images/icon-planFull.svg" alt="" class="w-12 h-12" />
            <div class="text-right">
              <h3 class="text-[#1c6772] font-bold text-base mb-1">
                تقييم شامل
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                تحليل دقيق لمهارات الطفل الأساسية وتحديد نقاط القوة والاحتياج.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-5 items-start flex flex-col gap-4 shadow-[0_8px_24px_rgba(28,27,27,0.04)]"
          >
            <img src="./images/icon-planIEP.svg" alt="" class="w-12 h-12" />
            <div class="text-right">
              <h3 class="text-[#1c6772] font-bold text-base mb-1">
                خطة فردية IEP
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                تصميم برامج تربوية مخصصة تتناسب مع وتيرة تعلم كل طفل بشكل مستقل.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-5 items-start flex flex-col gap-4 shadow-[0_8px_24px_rgba(28,27,27,0.04)]"
          >
            <img src="./images/icon-follow.svg" alt="" class="w-12 h-12" />
            <div class="text-right">
              <h3 class="text-[#1c6772] font-bold text-base mb-1">
                متابعة مستمرة
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                جلسات دورية وتواصل فعال مع أولياء الأمور لضمان استمرارية التطور.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl p-5 items-start flex flex-col gap-4 shadow-[0_8px_24px_rgba(28,27,27,0.04)]"
          >
            <img src="./images/icon-measure.svg" alt="" class="w-12 h-12" />
            <div class="text-right">
              <h3 class="text-[#1c6772] font-bold text-base mb-1">
                قياس التقدم
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                تقارير بيانية دقيقة توضح مدى استجابة الطفل للأهداف الموضوعة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN PROGRAMS -->
    <section id="programs-main" class="bg-white py-12 lg:py-20">
      <div class="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-9 lg:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-[36px] font-extrabold">
            برامجنا الرئيسية
          </h2>
          <p class="text-[#594045] text-sm sm:text-base mt-3">
            مسارات تعليمية وتأهيلية متكاملة تبدأ من التقييم وتنمو مع الطفل.
          </p>
        </div>

        <div class="flex flex-col gap-6 lg:gap-8">
          <article
            class="bg-[#F6F3F2] rounded-[24px] p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center"
          >
            <div class="overflow-hidden rounded-[20px] bg-[#ffd9df]/55">
              <img
                src="./images/programs-early-intervention.png"
                alt="برنامج التدخل المبكر"
                class="w-full h-[230px] sm:h-[310px] object-cover"
              />
            </div>
            <div class="text-right flex flex-col gap-8">
              <span class="text-[#b21553] font-bold text-sm flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M11.5 8.75C11.15 8.75 10.8542 8.62917 10.6125 8.3875C10.3708 8.14583 10.25 7.85 10.25 7.5C10.25 7.15 10.3708 6.85417 10.6125 6.6125C10.8542 6.37083 11.15 6.25 11.5 6.25C11.85 6.25 12.1458 6.37083 12.3875 6.6125C12.6292 6.85417 12.75 7.15 12.75 7.5C12.75 7.85 12.6292 8.14583 12.3875 8.3875C12.1458 8.62917 11.85 8.75 11.5 8.75ZM6.5 8.75C6.15 8.75 5.85417 8.62917 5.6125 8.3875C5.37083 8.14583 5.25 7.85 5.25 7.5C5.25 7.15 5.37083 6.85417 5.6125 6.6125C5.85417 6.37083 6.15 6.25 6.5 6.25C6.85 6.25 7.14583 6.37083 7.3875 6.6125C7.62917 6.85417 7.75 7.15 7.75 7.5C7.75 7.85 7.62917 8.14583 7.3875 8.3875C7.14583 8.62917 6.85 8.75 6.5 8.75ZM9 14C8 14 7.09583 13.725 6.2875 13.175C5.47917 12.625 4.88333 11.9 4.5 11H13.5C13.1167 11.9 12.5208 12.625 11.7125 13.175C10.9042 13.725 10 14 9 14ZM9 18C7.75 18 6.57917 17.7625 5.4875 17.2875C4.39583 16.8125 3.44583 16.1708 2.6375 15.3625C1.82917 14.5542 1.1875 13.6042 0.7125 12.5125C0.2375 11.4208 0 10.25 0 9C0 7.75 0.2375 6.57917 0.7125 5.4875C1.1875 4.39583 1.82917 3.44583 2.6375 2.6375C3.44583 1.82917 4.39583 1.1875 5.4875 0.7125C6.57917 0.2375 7.75 0 9 0C10.25 0 11.4208 0.2375 12.5125 0.7125C13.6042 1.1875 14.5542 1.82917 15.3625 2.6375C16.1708 3.44583 16.8125 4.39583 17.2875 5.4875C17.7625 6.57917 18 7.75 18 9C18 10.25 17.7625 11.4208 17.2875 12.5125C16.8125 13.6042 16.1708 14.5542 15.3625 15.3625C14.5542 16.1708 13.6042 16.8125 12.5125 17.2875C11.4208 17.7625 10.25 18 9 18ZM9 16C10.9333 16 12.5833 15.3167 13.95 13.95C15.3167 12.5833 16 10.9333 16 9C16 7.06667 15.3167 5.41667 13.95 4.05C12.5833 2.68333 10.9333 2 9 2C8.9 2 8.8 2 8.7 2C8.6 2 8.5 2.01667 8.4 2.05C8.3 2.15 8.23333 2.25833 8.2 2.375C8.16667 2.49167 8.15 2.61667 8.15 2.75C8.15 3.1 8.27083 3.39583 8.5125 3.6375C8.75417 3.87917 9.05 4 9.4 4C9.55 4 9.6875 3.975 9.8125 3.925C9.9375 3.875 10.0667 3.85 10.2 3.85C10.4 3.85 10.5667 3.925 10.7 4.075C10.8333 4.225 10.9 4.4 10.9 4.6C10.9 4.98333 10.7208 5.22917 10.3625 5.3375C10.0042 5.44583 9.68333 5.5 9.4 5.5C8.65 5.5 8.00417 5.22917 7.4625 4.6875C6.92083 4.14583 6.65 3.5 6.65 2.75C6.65 2.7 6.65 2.65 6.65 2.6C6.65 2.55 6.65833 2.48333 6.675 2.4C5.29167 2.9 4.16667 3.74167 3.3 4.925C2.43333 6.10833 2 7.46667 2 9C2 10.9333 2.68333 12.5833 4.05 13.95C5.41667 15.3167 7.06667 16 9 16Z"
                    fill="#B21553"
                  />
                </svg>
                الأعمار من 2-6 سنوات
              </span>
              <h3
                class="text-[#1c6772] text-2xl sm:text-3xl font-extrabold leading-tight"
              >
                برنامج التدخل المبكر
              </h3>
              <p class="text-[#594045] text-sm sm:text-base leading-[1.9]">
                نركز في هذا البرنامج على استغلال مرونة الدماغ في السنوات الأولى
                لتطوير المهارات اللغوية، الحركية، والاجتماعية عبر جلسات مكثفة
                ومدروسة.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm">تحفيز لغوي مكثف</span>
                </div>
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm"
                    >تنمية المهارات الحركية الدقيقة</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm"
                    >تدريب على الاستقلالية</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm">دمج الحواس</span>
                </div>
              </div>
            </div>
          </article>

          <article
            class="bg-[#F6F3F2] rounded-[24px] p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center"
          >
            <div class="text-right flex flex-col gap-8 order-1 lg:order-2">
              <span
                class="text-[#1c6772] font-bold text-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                >
                  <path
                    d="M11 18L4 14.2V8.2L0 6L11 0L22 6V14H20V7.1L18 8.2V14.2L11 18ZM11 9.7L17.85 6L11 2.3L4.15 6L11 9.7ZM11 15.725L16 13.025V9.25L11 12L6 9.25V13.025L11 15.725Z"
                    fill="#1C6772"
                  />
                </svg>
                الصفوف النهارية
              </span>
              <h3
                class="text-[#b21553] text-2xl sm:text-3xl font-extrabold leading-tight"
              >
                برنامج الصفوف التعليمية
              </h3>
              <p class="text-[#594045] text-sm sm:text-base leading-[1.9]">
                بيئة مدرسية متخصصة توفر مناهج تعليمية معدلة تتناسب مع احتياجات
                كل طالب، مع التركيز على المهارات الأكاديمية والاجتماعية في بيئة
                داعمة.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm">فصول صغيرة العدد</span>
                </div>
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm"
                    >مناهج معتمدة ومطورة</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm">أنشطة دمج اجتماعي</span>
                </div>
                <div class="flex items-center gap-2">
                  <img src="./images/icon-check.svg" alt="" class="w-4 h-4" />
                  <span class="text-[#594045] text-sm">تقييم أكاديمي دوري</span>
                </div>
              </div>
            </div>
            <div
              class="overflow-hidden rounded-[20px] bg-[#a7ebf6]/50 order-2 lg:order-1"
            >
              <img
                src="./images/programs-day-classes.png"
                alt="برنامج الصفوف النهارية"
                class="w-full h-[230px] sm:h-[310px] object-cover"
              />
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- THERAPEUTIC DEPARTMENTS -->
    <section class="bg-white py-12 lg:py-20">
      <div class="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="mb-9 lg:mb-12">
            <h2 class="text-2xl sm:text-3xl lg:text-[34px] font-extrabold">
              الأقسام العلاجية
            </h2>
            <p class="text-[#594045] text-sm sm:text-base mt-3">
              تخصصات طبية وتعليمية تحت سقف واحد
            </p>
          </div>
          <span
            class="text-[#B21553] font-bold border-b-2 border-[#B21553] text-sm cursor-pointer"
          >
            عرض كافة الأقسام
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            class="bg-[#fcf9f8] rounded-2xl p-5 text-right min-h-[150px] flex flex-col gap-2"
          >
            <div
              class="w-11 h-11 rounded-[10px] mb-2 shadow-sm bg-[#fff] flex items-center justify-center"
            >
              <img
                src="./images/therapeutic-departments1.svg"
                alt=""
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-black font-bold text-base">ABA</h3>
            <p class="text-[#594045] text-xs leading-relaxed">
              تحليل السلوك التطبيقي لتعديل السلوك وتنمية المهارات.
            </p>
          </div>
          <div
            class="bg-[#fcf9f8] rounded-2xl p-5 text-right min-h-[150px] flex flex-col gap-2"
          >
            <div
              class="w-11 h-11 rounded-[10px] mb-2 shadow-sm bg-[#fff] flex items-center justify-center"
            >
              <img
                src="./images/therapeutic-departments2.svg"
                alt=""
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-black font-bold text-base">النطق واللغة</h3>
            <p class="text-[#594045] text-xs leading-relaxed">
              علاجات متخصصة لمشاكل التخاطب واضطرابات اللغة.
            </p>
          </div>
          <div
            class="bg-[#fcf9f8] rounded-2xl p-5 text-right min-h-[150px] flex flex-col gap-2"
          >
            <div
              class="w-11 h-11 rounded-[10px] mb-2 shadow-sm bg-[#fff] flex items-center justify-center"
            >
              <img
                src="./images/therapeutic-departments3.svg"
                alt=""
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-black font-bold text-base">العلاج الوظيفي</h3>
            <p class="text-[#594045] text-xs leading-relaxed">
              تطوير المهارات الحركية الدقيقة والاعتماد على الذات.
            </p>
          </div>
          <div
            class="bg-[#fcf9f8] rounded-2xl p-5 text-right min-h-[150px] flex flex-col gap-2"
          >
            <div
              class="w-11 h-11 rounded-[10px] mb-2 shadow-sm bg-[#fff] flex items-center justify-center"
            >
              <img
                src="./images/therapeutic-departments4.svg"
                alt=""
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-black font-bold text-base">العلاج الطبيعي</h3>
            <p class="text-[#594045] text-xs leading-relaxed">
              تحسين الحركة، التوازن، والقوة العضلية للأطفال.
            </p>
          </div>
          <div
            class="bg-[#fcf9f8] rounded-2xl p-5 text-right min-h-[150px] flex flex-col gap-2"
          >
            <div
              class="w-11 h-11 rounded-[10px] mb-2 shadow-sm bg-[#fff] flex items-center justify-center"
            >
              <img
                src="./images/therapeutic-departments5.svg"
                alt=""
                class="w-6 h-6"
              />
            </div>
            <h3 class="text-black font-bold text-base">التعليم الإدراكي</h3>
            <p class="text-[#594045] text-xs leading-relaxed">
              برامج لرفع كفاءة العمليات العقلية والتركيز والانتباه.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- LEARNING JOURNEY -->
    <section class="bg-[#f6f3f2] py-12 lg:py-20 overflow-hidden">
      <div class="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 lg:mb-14">
          <h2 class="text-2xl sm:text-3xl lg:text-[34px] font-extrabold">
            رحلة العمل معنا
          </h2>
          <p class="text-[#594045] text-sm sm:text-base mt-3">
            رحلة العمل معنا
          </p>
        </div>

        <div class="relative">
          <div
            class="hidden lg:block absolute top-[30px] right-[9%] left-[9%] h-1 bg-[#1c6772]/15"
          ></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7">
            <div class="relative flex flex-col items-center text-center gap-2">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-white border-[5px] border-[#1c6772] flex items-center justify-center shadow-md"
              >
                <img
                  src="./images/your-career-journey-with-us1.svg"
                  alt=""
                  class="w-6 h-6"
                />
              </div>
              <h3 class="text-[#1c1b1b] font-bold text-base mt-2">
                تقييم مبدئي
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                جلسة تشخيصية لتحديد المستوى
              </p>
            </div>

            <div class="relative flex flex-col items-center text-center gap-2">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-white border-[5px] border-[#b21553] flex items-center justify-center shadow-md"
              >
                <img
                  src="./images/your-career-journey-with-us2.svg"
                  alt=""
                  class="w-5 h-6"
                />
              </div>
              <h3 class="text-[#1c1b1b] font-bold text-base mt-2">
                بناء الخطة
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                تصميم البرنامج العلاجي الفردي
              </p>
            </div>

            <div class="relative flex flex-col items-center text-center gap-2">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-white border-[5px] border-[#1c6772] flex items-center justify-center shadow-md"
              >
                <img
                  src="./images/your-career-journey-with-us3.svg"
                  alt=""
                  class="w-6 h-6"
                />
              </div>
              <h3 class="text-[#1c1b1b] font-bold text-base mt-2">
                بدء الجلسات
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                تنفيذ التدخلات بأعلى معايير الجودة
              </p>
            </div>

            <div class="relative flex flex-col items-center text-center gap-2">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-white border-[5px] border-[#b21553] flex items-center justify-center shadow-md"
              >
                <img
                  src="./images/your-career-journey-with-us4.svg"
                  alt=""
                  class="w-6 h-6"
                />
              </div>
              <h3 class="text-[#1c1b1b] font-bold text-base mt-2">
                متابعة الأداء
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                رصد يومي وتعديل مستمر للأهداف
              </p>
            </div>

            <div class="relative flex flex-col items-center text-center gap-2">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-white border-[5px] border-[#1c6772] flex items-center justify-center shadow-md"
              >
                <img
                  src="./images/your-career-journey-with-us5.svg"
                  alt=""
                  class="w-6 h-6"
                />
              </div>
              <h3 class="text-[#1c1b1b] font-bold text-base mt-2">
                تقارير دورية
              </h3>
              <p class="text-[#594045] text-xs leading-relaxed">
                مشاركة النتائج والتقدم مع الأهل
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DATA PROGRESS -->
    <section class="bg-[#fcf9f8] py-12 lg:py-20">
      <div
        class="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <div
          class="order-2 lg:order-2 bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_14px_40px_rgba(28,27,27,0.06)]"
        >
          <div
            class="h-[230px] sm:h-[280px] flex items-end justify-center border-b border-[#e5e2e1] pb-6"
          >
            <div class="flex-1 flex flex-col items-center gap-3">
              <div
                class="w-full h-[62px] sm:h-[92px] rounded-t-lg bg-[#f1d1df]"
              ></div>
              <span class="text-[#594045] text-xs font-bold">الشهر 1</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-3">
              <div
                class="w-full h-[94px] sm:h-[130px] rounded-t-lg bg-[#e0a8c0]"
              ></div>
              <span class="text-[#594045] text-xs font-bold">الشهر 2</span>
            </div>

            <div class="flex-1 flex flex-col items-center gap-3">
              <div
                class="w-full h-[125px] sm:h-[170px] rounded-t-lg bg-[#d95d91]"
              ></div>
              <span class="text-[#594045] text-xs font-bold">الشهر 3</span>
            </div>

            <div class="flex-1 flex flex-col items-center gap-3">
              <div
                class="w-full h-[160px] sm:h-[210px] rounded-t-lg bg-[#b21553]"
              ></div>
              <span class="text-[#594045] text-xs font-bold">الشهر 4</span>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-1 text-right flex flex-col gap-4">
          <h2
            class="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-tight"
          >
            قياس التقدم <span class="text-[#B21553]">بالبيانات</span>
          </h2>
          <p class="text-[#594045] text-sm sm:text-base leading-[1.9]">
            نحن لا نعتمد فقط على الملاحظة، بل نستخدم أحدث أنظمة تتبع البيانات
            الرقمية لرصد كل مهارة يكتسبها طفلك. تحصل العائلة على تقارير بيانية
            دقيقة توضح منحنى التطور في مختلف الجوانب.
          </p>
          <div class="flex flex-col gap-3 pt-2">
            <div class="bg-white rounded-2xl p-4 flex items-center gap-3">
              <span
                class="w-8 h-8 rounded-full bg-[#DCFCE7] shrink-0 text-[#16A34A] text-xs flex items-center justify-center font-bold"
                >25%+</span
              >
              <p class="text-[#594045] text-sm font-bold">
                تحسن في مهارات التواصل اللفظي خلال 3 أشهر
              </p>
            </div>
            <div class="bg-white rounded-2xl p-4 flex items-center gap-3">
              <span
                class="w-8 h-8 rounded-full bg-[#DBEAFE] shrink-0 text-[#2563EB] text-xs flex items-center justify-center font-bold"
                >40%+</span
              >
              <p class="text-[#594045] text-sm font-bold">
                زيادة في التركيز والانتباه في المهام التعليمية
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT WE OFFER -->
    <section class="bg-[#eafcff] py-20 lg:py-20">
      <div class="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 lg:mb-10">
          <h2 class="text-2xl sm:text-3xl lg:text-[34px] font-extrabold">
            ماذا نقدم لطفلك؟
          </h2>
          <p class="text-[#594045] text-sm sm:text-base mt-3">
            تطوير شامل لكافة جوانب الشخصية
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            class="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3"
          >
            <img
              src="./images/what-should-we-offer-your-child-1.svg"
              alt=""
              class="w-9 h-9"
            />
            <h3 class="font-bold text-sm">سلوكي</h3>
          </div>
          <div
            class="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3"
          >
            <img
              src="./images/what-should-we-offer-your-child-2.svg"
              alt=""
              class="w-9 h-9"
            />
            <h3 class="font-bold text-sm">تواصلي</h3>
          </div>
          <div
            class="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3"
          >
            <img
              src="./images/what-should-we-offer-your-child-3.svg"
              alt=""
              class="w-9 h-9"
            />
            <h3 class="font-bold text-sm">معرفي</h3>
          </div>
          <div
            class="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3"
          >
            <img
              src="./images/what-should-we-offer-your-child-4.svg"
              alt=""
              class="w-9 h-9"
            />
            <h3 class="font-bold text-sm">حركي</h3>
          </div>
          <div
            class="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3"
          >
            <img
              src="./images/what-should-we-offer-your-child-5.svg"
              alt=""
              class="w-9 h-9"
            />
            <h3 class="font-bold text-sm">مهارات الحياة</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[#fcf9f8] py-12 lg:py-20">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#b21553] px-6 sm:px-10 lg:px-16 py-20 sm:py-24 text-center shadow-[0_24px_60px_rgba(178,21,83,0.26)]"
        >
          <div
            class="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-white/10"
          ></div>
          <div
            class="absolute -bottom-28 -left-20 w-64 h-64 rounded-full bg-[#d4346b]"
          ></div>
          <div class="relative flex flex-col items-center justify-center gap-6">
            <h2
              class="text-white text-2xl sm:text-3xl lg:text-[42px] font-extrabold leading-tight mb-4"
            >
              ابدأ رحلة طفلك معنا اليوم
            </h2>
            <p
              class="text-[#FFFFFFCC] text-sm sm:text-base leading-[1.9] max-w-[620px] mx-auto mb-7"
            >
              نحن هنا لنكون شركاءكم في رحلة النجاح. احجز موعدك الآن لنبدأ معاً
              في رسم مستقبل أفضل.
            </p>
            <div
              class="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                class="cursor-pointer w-full sm:w-auto text-[#B21553] bg-[#fff] font-bold text-sm sm:text-base px-8 py-3 rounded-full"
              >
                احجز الآن
              </a>
              <a
                class="cursor-pointer w-full sm:w-auto border-2 border-white text-white font-bold text-sm sm:text-base px-8 py-3 rounded-full"
              >
                تواصل مباشر
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
