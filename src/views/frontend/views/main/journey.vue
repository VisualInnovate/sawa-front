<template>
  <main class="w-full overflow-x-hidden bg-white text-[#2B2B2B]">
    <!-- Hero -->
      <section class="bg-white overflow-hidden relative">
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Text -->
        <div class="flex flex-col gap-4 lg:gap-8">
          <div class="text-right">
            <h1
              class="mb-5 text-[36px] font-black leading-[1.15] tracking-normal sm:text-[44px] lg:text-[47px] lg:leading-[1.12]"
            >
              <span class="block text-[#252525]">رحلة طفلك معنا</span>
              <span class="block text-[#C91F5F]">خطوة بخطوة</span>
            </h1>
          </div>
          <p
            class="text-[#6F6669] text-base lg:text-xl text-right leading-relaxed font-bold"
          >
            نرافق طفلك في رحلة التعلم والنمو نحو الاستقلالية والدمج من خلال
            برامج تأهيلية متكاملة وخطط فردية دقيقة.
          </p>
          <div class="flex flex-wrap gap-4 items-center">
            <a
              href="/web/evaluation"
              class="bg-[#C91F5F] text-white font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full shadow-[0_20px_25px_-5px_rgba(201,31,95,0.25)]"
              >احجز تقييم الآن</a
            >
            <a
              href="/contact"
              class="border-2 border-[#1B7A83] text-[#1B7A83] font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full"
              >تواصل معنا</a
            >
          </div>
        </div>
        <!-- Image -->
        <div class="relative mt-6 lg:mt-0">
          <div
            class="absolute w-64 h-64 rounded-full bg-[#51BDBB]/20 blur-[32px] -top-8 -right-10"
          ></div>
          <div
            class="absolute w-64 h-64 rounded-full bg-[#C91F5F]/10 blur-[32px] -bottom-8 -left-8"
          ></div>
          <div
            class="rotate-2 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
          >
            <img
              src="./images/child-journey-hero.png"
              alt="رحلة الطفل"
              class="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
            />
          </div>

          <div
            class="relative z-20 mx-4 mt-[-54px] max-w-[260px] rounded-[12px] bg-white px-5 py-4 text-right shadow-[0_14px_28px_rgba(0,0,0,0.16)] sm:absolute sm:bottom-[-24px] sm:left-[-24px] sm:mx-0 sm:mt-0"
          >
            <h3 class="mb-1 text-[14px] font-black text-[#C91F5F]">
              دعم متكامل
            </h3>
            <p class="text-[12px] font-semibold leading-[1.6] text-[#5F5F5F]">
              بيئة تعليمية محفزة للنمو والاستقلال
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote -->
    <section class="w-full bg-[#F7F5F4] py-12 sm:py-16">
      <div class="mx-auto max-w-[900px] px-4 text-center sm:px-6 lg:px-8">
        <span
          class="inline-flex rounded-full bg-[#F7E7EF] px-5 py-2 text-[11px] font-black text-[#C91F5F]"
        >
          فلسفتنا في العمل
        </span>

        <p
          class="mt-8 text-[20px] font-semibold leading-[1.8] text-[#1B7A83] sm:text-[23px] lg:text-[25px] lg:leading-[1.65]"
        >
          "نؤمن أن التقدم الحقيقي للطفل يحتاج إلى متابعة دقيقة وخطة واضحة تبدأ
          بالتقييم وتنتهي بتحقيق الأهداف"
        </p>
      </div>
    </section>

    <!-- Growth Path -->
    <section class="w-full bg-[#FCF9F8] py-12 sm:py-16 lg:py-20">
      <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center sm:mb-14">
          <h2 class="text-[27px] font-black leading-tight text-[#252525] sm:text-[32px]">
            مسار التأهيل والنمو
          </h2>
          <div class="mx-auto mt-5 h-[5px] w-[74px] rounded-full bg-[#C91F5F]"></div>
        </div>

        <div class="relative">
          <div
            class="absolute bottom-0 right-[26px] top-0 w-[4px] rounded-full bg-[#DDF6F8] lg:left-1/2 lg:right-auto lg:-translate-x-1/2"
          ></div>

          <div class="space-y-8 lg:space-y-14">
            <!-- Step 1 -->
            <div class="relative grid grid-cols-[56px_1fr] gap-4 lg:grid-cols-[1fr_72px_1fr] lg:gap-8">
              <div class="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#C91F5F] text-[18px] font-black text-white lg:col-start-2 lg:mx-auto lg:h-[62px] lg:w-[62px]">
                1
              </div>
              <article class="rounded-[17px] border-r-[4px] border-[#C91F5F] bg-white p-5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:col-start-3 lg:row-start-1">
                <div class="mb-4 flex items-center gap-[10px]">
                  <svg class="h-[22px] w-[22px] text-[#C91F5F]" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4h14v16H5V4Z" stroke="currentColor" stroke-width="2.2" />
                    <path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                    <path d="M15.5 18.5l1.5 1.5 3-3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <h3 class="text-[17px] font-black text-[#252525]">
                    التقييم الشامل
                  </h3>
                </div>

                <p class="mb-5 text-[12px] font-bold leading-[1.85] text-[#6F6669] sm:text-[13px]">
                  التقييم الشامل لكافة الجوانب النمائية لدى الطفل من قبل فريق
                  متكامل التخصصات بهدف تحديد قدراته واحتياجاته بدقة.
                </p>

                <div class="flex flex-wrap gap-2">
                  <span class="rounded-full bg-[#F3F3F3] px-4 py-2 text-[11px] font-bold text-[#626262]">السلوكي</span>
                  <span class="rounded-full bg-[#F3F3F3] px-4 py-2 text-[11px] font-bold text-[#626262]">التواصلي</span>
                  <span class="rounded-full bg-[#F3F3F3] px-4 py-2 text-[11px] font-bold text-[#626262]">المعرفي</span>
                  <span class="rounded-full bg-[#F3F3F3] px-4 py-2 text-[11px] font-bold text-[#626262]">الحركي</span>
                  <span class="rounded-full bg-[#F3F3F3] px-4 py-2 text-[11px] font-bold text-[#626262]">مهارات الحياة</span>
                </div>
              </article>
            </div>

            <!-- Step 2 -->
            <div class="relative grid grid-cols-[56px_1fr] gap-4 lg:grid-cols-[1fr_72px_1fr] lg:gap-8">
              <div class="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#1B7A83] text-[18px] font-black text-white lg:col-start-2 lg:mx-auto lg:h-[62px] lg:w-[62px]">
                2
              </div>
              <article class="rounded-[17px] border-r-[4px] border-[#1B7A83] bg-white p-5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:col-start-1 lg:row-start-1 lg:border-l-[4px] lg:border-r-0">
                <div class="mb-4 flex items-center gap-[10px]">
                  <svg class="h-[22px] w-[22px] text-[#1B7A83]" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4h12v16H6V4Z" stroke="currentColor" stroke-width="2.2" />
                    <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                  </svg>
                  <h3 class="text-[17px] font-black text-[#252525]">
                    الخطة التربوية الفردية (IEP)
                  </h3>
                </div>

                <p class="mb-5 text-[12px] font-bold leading-[1.85] text-[#6F6669] sm:text-[13px]">
                  بناءً على نتائج التقييم، يتم إعداد خطة تربوية فردية مخصصة لكل
                  طفل تلبي احتياجاته الفريدة.
                </p>

                <ul class="space-y-3 text-[12px] font-bold text-[#6F6669] sm:text-[13px]">
                  <li class="flex items-center gap-2">
                    <span class="h-2 w-2 shrink-0 rounded-full bg-[#C91F5F]"></span>
                    أهداف قابلة للقياس
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="h-2 w-2 shrink-0 rounded-full bg-[#C91F5F]"></span>
                    استراتيجيات مناسبة
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="h-2 w-2 shrink-0 rounded-full bg-[#C91F5F]"></span>
                    إشراك الأسرة بشكل كامل
                  </li>
                </ul>
              </article>
            </div>

            <!-- Step 3 -->
            <div class="relative grid grid-cols-[56px_1fr] gap-4 lg:grid-cols-[1fr_72px_1fr] lg:gap-8">
              <div class="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#C91F5F] text-[18px] font-black text-white lg:col-start-2 lg:mx-auto lg:h-[62px] lg:w-[62px]">
                3
              </div>
              <article class="rounded-[17px] border-r-[4px] border-[#C91F5F] bg-white p-5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:col-start-3 lg:row-start-1">
                <div class="mb-4 flex items-center gap-[10px]">
                  <svg class="h-[22px] w-[22px] text-[#C91F5F]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3 4 7l8 4 8-4-8-4Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
                    <path d="M4 12l8 4 8-4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4 17l8 4 8-4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <h3 class="text-[17px] font-black text-[#252525]">تنفيذ البرامج</h3>
                </div>

                <p class="mb-5 text-[12px] font-bold leading-[1.85] text-[#6F6669] sm:text-[13px]">
                  يتم تنفيذ الخطة من خلال برامج متخصصة وجلسات فردية وجماعية
                  مكثفة.
                </p>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <span class="flex min-h-[38px] items-center justify-center rounded-[8px] bg-[#EEF8FA] px-3 text-center text-[12px] font-black text-[#1B7A83]">ABA</span>
                  <span class="flex min-h-[38px] items-center justify-center rounded-[8px] bg-[#EEF8FA] px-3 text-center text-[12px] font-black text-[#1B7A83]">علاج نطق</span>
                  <span class="flex min-h-[38px] items-center justify-center rounded-[8px] bg-[#EEF8FA] px-3 text-center text-[12px] font-black text-[#1B7A83]">علاج وظيفي</span>
                  <span class="flex min-h-[38px] items-center justify-center rounded-[8px] bg-[#EEF8FA] px-3 text-center text-[12px] font-black text-[#1B7A83]">أكاديمي</span>
                </div>
              </article>
            </div>

            <!-- Step 4 -->
            <div class="relative grid grid-cols-[56px_1fr] gap-4 lg:grid-cols-[1fr_72px_1fr] lg:gap-8">
              <div class="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#1B7A83] text-[18px] font-black text-white lg:col-start-2 lg:mx-auto lg:h-[62px] lg:w-[62px]">
                4
              </div>
              <article class="rounded-[17px] border-r-[4px] border-[#1B7A83] bg-white p-5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:col-start-1 lg:row-start-1 lg:border-l-[4px] lg:border-r-0">
                <div class="mb-4 flex items-center gap-[10px]">
                  <svg class="h-[22px] w-[22px] text-[#1B7A83]" viewBox="0 0 24 24" fill="none">
                    <path d="M3.5 12s3.2-5 8.5-5 8.5 5 8.5 5-3.2 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" stroke-width="2.2" />
                    <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" stroke-width="2.2" />
                  </svg>
                  <h3 class="text-[17px] font-black text-[#252525]">
                    المتابعة المستمرة
                  </h3>
                </div>

                <p class="text-[12px] font-bold leading-[1.85] text-[#6F6669] sm:text-[13px]">
                  رصد أداء الطفل يومياً، مراجعة الأهداف دورياً، وتعديل الخطة
                  فوراً عند الحاجة لضمان أقصى استفادة.
                </p>
              </article>
            </div>

            <!-- Step 5 -->
            <div class="relative grid grid-cols-[56px_1fr] gap-4 lg:grid-cols-[1fr_72px_1fr] lg:gap-8">
              <div class="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#C91F5F] text-[18px] font-black text-white lg:col-start-2 lg:mx-auto lg:h-[62px] lg:w-[62px]">
                5
              </div>
              <article class="rounded-[17px] border-r-[4px] border-[#C91F5F] bg-white p-5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:col-start-3 lg:row-start-1">
                <div class="mb-4 flex items-center gap-[10px]">
                  <svg class="h-[22px] w-[22px] text-[#C91F5F]" viewBox="0 0 24 24" fill="none">
                    <path d="M5 19V5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                    <path d="M9 19v-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                    <path d="M13 19V9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                    <path d="M17 19v-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                  </svg>
                  <h3 class="text-[17px] font-black text-[#252525]">قياس التقدم</h3>
                </div>

                <p class="text-[12px] font-bold leading-[1.85] text-[#6F6669] sm:text-[13px]">
                  نستخدم الرسوم البيانية المتطورة لعرض تطور الطفل بشكل واضح
                  وموضوعي للأهل.
                </p>
              </article>
            </div>

            <!-- Step 6 -->
            <div class="relative grid grid-cols-[56px_1fr] gap-4 lg:grid-cols-[1fr_72px_1fr] lg:gap-8">
              <div class="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#1B7A83] text-[18px] font-black text-white lg:col-start-2 lg:mx-auto lg:h-[62px] lg:w-[62px]">
                6
              </div>
              <article class="rounded-[17px] border-r-[4px] border-[#1B7A83] bg-white p-5 text-right shadow-[0_12px_30px_rgba(0,0,0,0.035)] sm:p-7 lg:col-start-1 lg:row-start-1 lg:border-l-[4px] lg:border-r-0">
                <div class="mb-4 flex items-center gap-[10px]">
                  <svg class="h-[22px] w-[22px] text-[#1B7A83]" viewBox="0 0 24 24" fill="none">
                    <path d="M7 4h8l3 3v13H7V4Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
                    <path d="M15 4v4h4" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
                    <path d="M10 12h5M10 16h5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                  </svg>
                  <h3 class="text-[17px] font-black text-[#252525]">التقارير</h3>
                </div>

                <p class="text-[12px] font-bold leading-[1.85] text-[#6F6669] sm:text-[13px]">
                  تقارير أسبوعية وشهرية ودورية مفصلة تطلعكم على كافة تفاصيل
                  تقدم الطفل في جميع المجالات.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Family Partnership -->
    <section class="w-full bg-[#F0FAFC] py-12 sm:py-16 lg:py-20">
      <div
        class="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8"
      >
        <div class="relative">
          <div class="h-[260px] overflow-hidden rounded-[16px] bg-[#4CBDBB] shadow-[0_15px_35px_rgba(0,0,0,0.16)] sm:h-[360px] lg:h-[383px]">
            <img
              src="./images/family-safe-work.png"
              alt="شراكة حقيقية مع الأسرة"
              class="h-full w-full object-cover"
            />
          </div>

          <div
            class="absolute right-[-10px] top-[-18px] flex h-[46px] w-[46px] items-center justify-center rounded-[10px] bg-[#C91F5F] text-white shadow-[0_10px_22px_rgba(201,31,95,0.22)] sm:right-[-18px]"
          >
            <svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none">
              <path d="M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" stroke-width="2.1" />
              <path d="M16 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" stroke-width="2.1" />
              <path d="M4.5 18.5c.45-2.6 1.8-4.1 3.9-4.1s3.45 1.5 3.9 4.1" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
              <path d="M11.7 18.5c.45-2.6 1.8-4.1 3.9-4.1s3.45 1.5 3.9 4.1" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <div class="text-right">
          <h2 class="mb-5 text-[26px] font-black leading-tight text-[#1B7A83] sm:text-[31px]">
            شراكة حقيقية مع الأسرة
          </h2>

          <p class="mb-7 text-[15px] font-bold leading-[1.9] text-[#696367]">
            تمكين الوالدين عبر تدريبهم على استراتيجيات عملية تساعدهم على دعم
            طفلهم داخل البيت بطريقة صحيحة ومتسقة مع الخطط العلاجية. نحن نؤمن
            أنكم الجزء الأهم في رحلة النجاح.
          </p>

          <div class="space-y-3">
            <div class="flex min-h-[42px] w-full items-center gap-3 rounded-[9px] bg-white px-4 py-2 text-[12px] font-bold text-[#4E4E4E]">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7E7EF] text-[#C91F5F]">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v16M5 11h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                </svg>
              </span>
              تدريب متخصص للأهالي
            </div>

            <div class="flex min-h-[42px] w-full items-center gap-3 rounded-[9px] bg-white px-4 py-2 text-[12px] font-bold text-[#4E4E4E]">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7E7EF] text-[#C91F5F]">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M5 7h14v9H8l-3 3V7Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
                </svg>
              </span>
              تواصل يومي فعال
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Goal -->
    <section class="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div class="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8">
        <div class="rounded-[24px] border border-[#F0C9D6] bg-[#FAEEF2] px-5 py-10 text-center sm:rounded-[34px] sm:px-10 sm:py-12">
          <div class="mx-auto mb-6 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white text-[#C91F5F]">
            <svg class="h-8 w-8" viewBox="0 0 45 45" fill="none">
              <path
                d="M10 45V40H20V32.25C17.9583 31.7917 16.1354 30.9271 14.5312 29.6562C12.9271 28.3854 11.75 26.7917 11 24.875C7.875 24.5 5.26042 23.1354 3.15625 20.7812C1.05208 18.4271 0 15.6667 0 12.5V10C0 8.625 0.489583 7.44792 1.46875 6.46875C2.44792 5.48958 3.625 5 5 5H10V0H35V5H40C41.375 5 42.5521 5.48958 43.5312 6.46875C44.5104 7.44792 45 8.625 45 10V12.5C45 15.6667 43.9479 18.4271 41.8438 20.7812C39.7396 23.1354 37.125 24.5 34 24.875C33.25 26.7917 32.0729 28.3854 30.4688 29.6562C28.8646 30.9271 27.0417 31.7917 25 32.25V40H35V45H10ZM10 19.5V10H5V12.5C5 14.0833 5.45833 15.5104 6.375 16.7812C7.29167 18.0521 8.5 18.9583 10 19.5ZM22.5 27.5C24.5833 27.5 26.3542 26.7708 27.8125 25.3125C29.2708 23.8542 30 22.0833 30 20V5H15V20C15 22.0833 15.7292 23.8542 17.1875 25.3125C18.6458 26.7708 20.4167 27.5 22.5 27.5ZM35 19.5C36.5 18.9583 37.7083 18.0521 38.625 16.7812C39.5417 15.5104 40 14.0833 40 12.5V10H35V19.5Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h2 class="text-[24px] font-black text-[#252525] sm:text-[25px]">
            هدفنا الأسمى
          </h2>

          <p class="mx-auto mt-5 max-w-[640px] text-[16px] font-semibold leading-[1.85] text-[#1B7A83] sm:text-[17px]">
            "الوصول بالطفل إلى أقصى درجات الاستقلالية ودمجه بثقة وفاعلية في
            المجتمع"
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full bg-[#C91F5F] px-4 py-14 text-center text-white sm:px-6 sm:py-16">
      <h2 class="text-[26px] font-black leading-tight sm:text-[32px]">
        ابدأ رحلة طفلك معنا اليوم
      </h2>

      <p class="mx-auto mt-5 max-w-[760px] text-[14px] leading-[1.9] text-white/80 sm:text-[15px]">
        فريقنا جاهز لاستقبالكم وتقديم الدعم اللازم لبدء رحلة التغيير الحقيقية.
      </p>

      <div class="mx-auto mt-8 flex max-w-[340px] flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
        <a
          href="/web/evaluation"
          class="inline-flex h-[51px] items-center justify-center rounded-full bg-white px-7 text-[13px] font-black text-[#C91F5F]"
        >
          احجز تقييم الآن
        </a>

        <a
          href="/contact"
          class="inline-flex h-[51px] items-center justify-center rounded-full border-2 border-white bg-transparent px-7 text-[13px] font-black text-white"
        >
          تواصل معنا
        </a>
      </div>
    </section>
  </main>
</template>
