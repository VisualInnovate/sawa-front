<template>
  <main class="w-full overflow-x-hidden bg-[#FCF9F8] text-[#242424]" dir="rtl">
    <!-- Hero Section -->
    <section class="bg-[#F6F3F2] overflow-hidden relative">
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Text -->
        <div class="flex flex-col gap-4 lg:gap-8">
          <div class="text-start">
            <span
              class="mb-5 inline-flex rounded-full bg-[#A7EBF6] text-[#1C6772] text-xs sm:text-sm font-bold px-4 py-2"
            >
              رحلة التمكين تبدأ هنا
            </span>
            <h1
              class="mb-5 text-[36px] font-black leading-[1.15] tracking-normal sm:text-[44px] lg:text-[47px] lg:leading-[1.12]"
            >
              <span class="block text-[#222222]">الأقسام العلاجية</span>
              <span class="block text-[#222222]">المتخصصة</span>
            </h1>
          </div>
          <p
            class="text-[#6F5A5D] text-base lg:text-xl text-start leading-relaxed font-bold"
          >
            نحن نؤمن بأن لكل طفل قدراته الكامنة. في أكاديمية سوا، نصمم برامجنا
            العلاجية وفق أحدث المعايير العلمية لنضمن لطفلكم مستقبلاً أكثر
            استقلالية وتواصلاً، في بيئة تسودها المودة والخبرة.
          </p>
          <div class="flex flex-wrap gap-4 items-center">
            <a
              href="/programs"
              class="bg-[#C91F5F] text-white font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full shadow-[0_20px_25px_-5px_rgba(201,31,95,0.25)]"
              >اكتشف برامجنا</a
            >
            <a
              href="/services"
              class="border-2 border-[#1C6772] text-[#1C6772] font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full"
              >لماذا نختلف؟</a
            >
          </div>
        </div>
        <!-- Image -->
        <div class="relative mt-6 lg:mt-0">
          <div
            class="absolute w-64 h-64 rounded-full bg-[#A7EBF6]/40 blur-[32px] -top-8 -right-10"
          ></div>
          <div
            class="absolute w-64 h-64 rounded-full bg-[#C91F5F]/10 blur-[32px] -bottom-8 -left-8"
          ></div>
          <div
            class="rotate-2 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
          >
            <img
              src="./images/therapy-hero.png"
              alt="الأقسام العلاجية"
              class="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Programs Section -->
    <section id="programs" class="w-full bg-[#FCF9F8] py-12 sm:py-16 lg:py-20">
      <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div class="mb-9 text-center sm:mb-12">
          <h2
            class="text-[26px] font-black leading-tight text-[#242424] sm:text-[30px] lg:text-[34px]"
          >
            برامجنا التخصصية
          </h2>
          <div
            class="mx-auto mt-5 h-[6px] w-[80px] rounded-full bg-[#B21553] sm:mt-[26px] sm:w-[96px]"
          ></div>
        </div>

        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
          <!-- Speech Card -->
          <article
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8 lg:min-h-[406px]"
          >
            <div
              class="mb-7 flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#1C6772]/10 text-[#1C6772]"
            >
              <img
                src="./images/therapeutic-departments2.svg"
                alt=""
                class="h-7 w-7"
              />
            </div>

            <h3
              class="mb-4 text-[19px] font-black leading-tight text-[#252525] sm:text-[20px]"
            >
              علاج النطق واللغة
            </h3>

            <p
              class="mb-6 text-[13px] font-medium leading-[1.85] text-[#746064]"
            >
              جلسات متخصصة لعلاج اضطرابات مخارج الأصوات، التأتأة، والتأخر
              اللغوي، باستخدام أحدث الوسائل التقنية والتدريبات الفردية.
            </p>

            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-1 text-[12px] font-extrabold text-[#8ED1DD]">
                الفئة المستهدفة
              </p>
              <p class="text-[12px] font-bold leading-[1.65] text-[#343434]">
                أطفال متلازمة داون، التوحد، واضطرابات السمع
              </p>
            </div>
          </article>

          <!-- ABA Wide Card -->
          <article
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8 lg:col-span-2 lg:min-h-[406px]"
          >
            <div
              class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(220px,340px)_1fr] md:items-center"
            >
              <div
                class="order-2 h-[230px] overflow-hidden rounded-[16px] bg-[#204F5C] md:order-1 md:h-[340px]"
              >
                <img
                  src="./images/bab-therapy-card.png"
                  alt="BAB Therapy"
                  class="h-full w-full object-cover"
                />
              </div>

              <div class="order-1 md:order-2">
                <div
                  class="mb-6 flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#B21553]/10 text-[#B21553]"
                >
                  <img
                    src="./images/therapeutic-departments1.svg"
                    alt=""
                    class="h-7 w-7"
                  />
                </div>

                <h3
                  class="mb-4 text-[20px] font-black leading-tight text-[#252525] sm:text-[22px]"
                >
                  قسم العلاج السلوكي (ABA)
                </h3>

                <p
                  class="mb-6 text-[14px] font-medium leading-[1.85] text-[#746064] sm:text-[15px]"
                >
                  نظام تحليلي متكامل لذوي التأخر النمائي، يركز على تعديل السلوك
                  وتعزيز مهارات التواصل الاجتماعي والاستقلالية في بيئة إيجابية
                  محفزة.
                </p>

                <ul class="mb-6 space-y-3 text-[14px] font-bold text-[#343434]">
                  <li class="flex items-start gap-[10px]">
                    <span
                      class="mt-1 flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border-2 border-[#B21553] text-[#B21553]"
                    >
                      <svg
                        class="h-[9px] w-[9px]"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 12.5l3.6 3.6L18 7.8"
                          stroke="currentColor"
                          stroke-width="3.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    تقليل السلوكيات غير المرغوبة
                  </li>

                  <li class="flex items-start gap-[10px]">
                    <span
                      class="mt-1 flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border-2 border-[#B21553] text-[#B21553]"
                    >
                      <svg
                        class="h-[9px] w-[9px]"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 12.5l3.6 3.6L18 7.8"
                          stroke="currentColor"
                          stroke-width="3.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    تنمية مهارات التواصل الوظيفي
                  </li>
                </ul>

                <a
                  href="#"
                  class="inline-flex items-center gap-2 text-[14px] font-black text-[#B21553]"
                >
                  تفاصيل القسم
                  <svg
                    class="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M14 5l-7 7 7 7"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 12h11"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          <!-- Academic Card -->
          <article
            class="relative overflow-hidden rounded-[22px] bg-[#1C6772] p-5 text-start text-white sm:p-8 lg:min-h-[314px]"
          >
            <div
              class="pointer-events-none absolute bottom-[-40px] left-[-40px] h-[128px] w-[128px] rounded-full bg-white/10"
            ></div>

            <h3
              class="mb-4 text-[19px] font-black leading-tight sm:text-[20px]"
            >
              التعليم الإدراكي الأكاديمي
            </h3>

            <p class="mb-8 text-[13px] font-medium leading-[1.9] text-white/78">
              برامج متخصصة للدمج الأكاديمي ومعالجة صعوبات التعلم، تركز على
              العمليات العقلية الأساسية والانتباه والتركيز.
            </p>

            <div class="flex items-center gap-3 text-[14px] font-black">
              <img
                src="./images/therapeutic-departments5.svg"
                alt=""
                class="h-6 w-6 brightness-0 invert"
              />
              دعم مسار الدمج المدرسي
            </div>
          </article>

          <!-- Physical Therapy -->
          <article
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8 lg:min-h-[318px]"
          >
            <div
              class="mb-7 flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#B21553]/10 text-[#B21553]"
            >
              <img
                src="./images/therapeutic-departments4.svg"
                alt=""
                class="h-7 w-7"
              />
            </div>

            <h3
              class="mb-4 text-[19px] font-black leading-tight text-[#252525] sm:text-[20px]"
            >
              العلاج الطبيعي
            </h3>

            <p
              class="mb-6 text-[13px] font-medium leading-[1.9] text-[#746064]"
            >
              تطوير التوازن والقوة الحركية باستخدام بدلة الثيراسويت (Therasuit)
              ومنهج بوباث العالمي لإعادة التأهيل الحركي.
            </p>

            <a
              href="#"
              class="flex min-h-[40px] w-full items-center justify-center rounded-[12px] bg-[#D4346B] px-4 py-2 text-center text-[13px] font-extrabold text-white"
            >
              عرض الأهداف العلاجية
            </a>
          </article>

          <!-- Occupational Therapy -->
          <article
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8 lg:min-h-[318px]"
          >
            <div
              class="mb-7 flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#006B24]/10 text-[#006B24]"
            >
              <img
                src="./images/therapeutic-departments3.svg"
                alt=""
                class="h-7 w-7"
              />
            </div>

            <h3
              class="mb-4 text-[19px] font-black leading-tight text-[#252525] sm:text-[20px]"
            >
              العلاج الوظيفي
            </h3>

            <p
              class="mb-6 text-[13px] font-medium leading-[1.9] text-[#746064]"
            >
              تنمية المهارات الدقيقة والتكامل الحسي لتحقيق أقصى درجات
              الاستقلالية في الأنشطة اليومية من خلال غرف حسية متطورة.
            </p>

            <div class="flex flex-wrap gap-2">
              <span
                class="rounded-full bg-[#F0EDED] px-3 py-1 text-[11px] font-bold text-[#3F3F3F]"
              >
                مهارات حركية
              </span>
              <span
                class="rounded-full bg-[#F0EDED] px-3 py-1 text-[11px] font-bold text-[#3F3F3F]"
              >
                تكامل حسي
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Evaluation Section -->
    <section
      id="evaluation"
      class="w-full bg-[#F6F3F2] py-12 sm:py-16 lg:py-20"
    >
      <div
        class="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-8"
      >
        <div class="text-start">
          <h2
            class="mb-8 text-[26px] font-black leading-tight text-[#242424] sm:text-[30px] lg:text-[34px]"
          >
            التقييم والمتابعة المستمرة
          </h2>

          <div class="space-y-7">
            <div class="flex items-start gap-4 sm:gap-[22px]">
              <div
                class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#1C6772] text-[18px] font-black text-white"
              >
                ١
              </div>
              <div>
                <h3
                  class="mb-2 text-[17px] font-black text-[#252525] sm:text-[18px]"
                >
                  التقييم الشامل
                </h3>
                <p
                  class="max-w-[440px] text-[13px] font-medium leading-[1.85] text-[#746064]"
                >
                  جلسات تقييم أولية لتحديد نقاط القوة والاحتياج باستخدام
                  اختبارات مقننة عالمياً.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 sm:gap-[22px]">
              <div
                class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#1C6772] text-[18px] font-black text-white"
              >
                ٢
              </div>
              <div>
                <h3
                  class="mb-2 text-[17px] font-black text-[#252525] sm:text-[18px]"
                >
                  الخطة التربوية الفردية
                </h3>
                <p
                  class="max-w-[440px] text-[13px] font-medium leading-[1.85] text-[#746064]"
                >
                  بناء خارطة طريق فريدة لكل طفل تتضمن أهدافاً قصيرة وطويلة المدى
                  قابلة للقياس.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 sm:gap-[22px]">
              <div
                class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#1C6772] text-[18px] font-black text-white"
              >
                ٣
              </div>
              <div>
                <h3
                  class="mb-2 text-[17px] font-black text-[#252525] sm:text-[18px]"
                >
                  التقارير الدورية
                </h3>
                <p
                  class="max-w-[440px] text-[13px] font-medium leading-[1.85] text-[#746064]"
                >
                  تزويد الأهل برسوم بيانية توضح معدلات نمو المهارات ومدى استجابة
                  الطفل للتدخل.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <article
            class="rounded-[22px] bg-white p-6 text-start shadow-[0_8px_20px_rgba(40,40,40,0.018)]"
          >
            <div class="mb-5 text-[#1C6772]">
              <img src="./images/icon-planIEP.svg" alt="" class="h-8 w-8" />
            </div>
            <h3 class="mb-2 text-[19px] font-black text-[#252525]">خطة IEP</h3>
            <p class="text-[12px] font-medium leading-relaxed text-[#746064]">
              برنامج تربوي فردي مخصص لكل طفل
            </p>
          </article>

          <article
            class="rounded-[22px] bg-white p-6 text-start shadow-[0_8px_20px_rgba(40,40,40,0.018)]"
          >
            <div class="mb-5 text-[#B21553]">
              <img src="./images/icon-measure.svg" alt="" class="h-8 w-8" />
            </div>
            <h3 class="mb-3 text-[18px] font-black text-[#252525]">
              تقارير دقيقة
            </h3>
            <div
              class="mb-3 h-[8px] w-full overflow-hidden rounded-full bg-[#F0EDED]"
            >
              <div class="h-full w-[85%] bg-[#B21553]"></div>
            </div>
            <p class="text-[11px] font-medium text-[#746064]">
              تطور بنسبة 85% في 3 أشهر
            </p>
          </article>

          <article
            class="relative overflow-hidden rounded-[22px] bg-[#1C6772] p-6 text-start text-white sm:col-span-2"
          >
            <div class="pointer-events-none absolute left-8 top-8 opacity-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <path
                  d="M18 36C15.5 36 13.1583 35.525 10.975 34.575C8.79167 33.625 6.89167 32.3417 5.275 30.725C3.65833 29.1083 2.375 27.2083 1.425 25.025C0.475 22.8417 0 20.5 0 18C0 15.5 0.475 13.1583 1.425 10.975C2.375 8.79167 3.65833 6.89167 5.275 5.275C6.89167 3.65833 8.79167 2.375 10.975 1.425C13.1583 0.475 15.5 0 18 0C20.7333 0 23.325 0.583333 25.775 1.75C28.225 2.91667 30.3 4.56667 32 6.7V2H36V14H24V10H29.5C28.1333 8.13333 26.45 6.66667 24.45 5.6C22.45 4.53333 20.3 4 18 4C14.1 4 10.7917 5.35833 8.075 8.075C5.35833 10.7917 4 14.1 4 18C4 21.9 5.35833 25.2083 8.075 27.925C10.7917 30.6417 14.1 32 18 32C21.5 32 24.5583 30.8667 27.175 28.6C29.7917 26.3333 31.3333 23.4667 31.8 20H35.9C35.4 24.5667 33.4417 28.375 30.025 31.425C26.6083 34.475 22.6 36 18 36ZM23.6 26.4L16 18.8V8H20V17.2L26.4 23.6L23.6 26.4Z"
                  fill="white"
                />
              </svg>
            </div>

            <h3 class="mb-3 text-[24px] font-black leading-tight">
              متابعة لحظية
            </h3>
            <p class="text-[14px] font-medium leading-relaxed text-white/82">
              نشارككم التقدم خطوة بخطوة
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="w-full bg-[#FCF9F8] py-14 sm:py-20">
      <div class="mx-auto max-w-[1024px] px-4 sm:px-6 lg:px-8">
        <div
          class="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#C51A58] to-[#D73572] px-5 py-14 text-center text-white sm:rounded-[34px] sm:px-10 sm:py-16 lg:rounded-[40px] lg:px-16"
        >
          <div
            class="pointer-events-none absolute left-[-120px] top-[-80px] h-[260px] w-[260px] rounded-full bg-white/5 sm:h-[310px] sm:w-[310px]"
          ></div>
          <div
            class="pointer-events-none absolute bottom-[-130px] right-[-90px] h-[280px] w-[280px] rounded-full bg-white/5 sm:h-[330px] sm:w-[330px]"
          ></div>

          <div class="relative z-10">
            <h2
              class="mb-5 text-[28px] font-black leading-tight tracking-normal sm:text-[36px] lg:text-[48px]"
            >
              ابدأ رحلة طفلك معنا اليوم
            </h2>

            <p
              class="mx-auto mb-8 max-w-[690px] text-[15px] font-medium leading-[1.85] text-white/90 sm:mb-10 sm:text-[17px] lg:text-[18px]"
            >
              نحن هنا لنسمعك، لندعمك، ولنأخذ بيد طفلك نحو غد أفضل. احجز جلسة
              تقييم أولية الآن.
            </p>

            <div
              class="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <a
                href="/web/evaluation"
                class="inline-flex h-[56px] items-center justify-center rounded-[18px] bg-white px-8 text-[16px] font-black text-[#C91F5F] sm:h-[64px] sm:px-10 sm:text-[18px]"
              >
                احجز تقييم الآن
              </a>

              <a
                href="/contact"
                class="inline-flex h-[56px] items-center justify-center rounded-[18px] border-2 border-white/30 px-8 text-[16px] font-black text-white sm:h-[64px] sm:px-10 sm:text-[18px]"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
