<template>
  <main class="w-full bg-white text-[#2B2B2B]">
    <div class="mx-auto overflow-hidden bg-[#FCF9F8]">
      <!-- Hero -->
      <section class="bg-[#FCF9F8] overflow-hidden relative">
        <div
          class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <!-- Text -->
          <div class="flex flex-col gap-4 lg:gap-8">
            <div class="text-right">
              <span
                class="mb-5 inline-flex items-center rounded-full bg-[#E7FBFE] text-[#1B7A83] text-xs sm:text-sm font-bold px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M10.5 4.66667L9.77083 3.0625L8.16667 2.33333L9.77083 1.60417L10.5 0L11.2292 1.60417L12.8333 2.33333L11.2292 3.0625L10.5 4.66667ZM10.5 12.8333L9.77083 11.2292L8.16667 10.5L9.77083 9.77083L10.5 8.16667L11.2292 9.77083L12.8333 10.5L11.2292 11.2292L10.5 12.8333ZM4.66667 11.0833L3.20833 7.875L0 6.41667L3.20833 4.95833L4.66667 1.75L6.125 4.95833L9.33333 6.41667L6.125 7.875L4.66667 11.0833ZM4.66667 8.25417L5.25 7L6.50417 6.41667L5.25 5.83333L4.66667 4.57917L4.08333 5.83333L2.82917 6.41667L4.08333 7L4.66667 8.25417Z"
                    fill="#1C6772"
                  />
                </svg>
                <span class="mx-2">خدمات دعم متكاملة</span>
              </span>
              <h1
                class="mb-5 text-[36px] font-black leading-[1.15] tracking-normal sm:text-[44px] lg:text-[47px] lg:leading-[1.12]"
              >
                <span class="block text-[#1B7A83]">بيئة متكاملة تدعم</span>
                <span class="block text-[#1B7A83]">راحة طفلك وتطوره</span>
              </h1>
            </div>
            <p
              class="text-[#70676A] text-base lg:text-xl text-right leading-relaxed font-bold"
            >
              في أكاديمية سوا، نؤمن أن البيئة المحيطة هي المحرك الأول للنمو.
              نوفر فضاءات آمنة، مريحة، ومحفزة صُممت خصيصاً لتلبية احتياجات
              أطفالنا الفريدة.
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
              class="absolute w-64 h-64 rounded-full bg-[#FAEEF2] blur-[32px] -top-8 -right-10"
            ></div>
            <div
              class="absolute w-64 h-64 rounded-full bg-[#F4F1F0] blur-[32px] -bottom-8 -left-8"
            ></div>
            <div
              class="rotate-2 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
            >
              <img
                src="./images/support-hero-room.png"
                alt="الخدمات المساندة"
                class="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Intro -->
      <section class="w-full bg-[#F6F3F2] px-4 py-16 text-center lg:py-20">
        <div class="mx-auto h-[4px] w-[80px] rounded-full bg-[#B21553]"></div>

        <h2 class="mt-10 text-[24px] font-black text-[#1B7A83] lg:text-[28px]">
          مرافق صُممت لتكون بيتهم الثاني
        </h2>

        <p
          class="mx-auto mt-[27px] w-full max-w-[780px] text-[14px] font-bold leading-[1.95] text-[#766C70]"
        >
          نحن ندرك أن التعلم يبدأ بالشعور بالأمان. لذا، قمنا بتجهيز كافة مرافق
          الأكاديمية لتوفير بيئة تعليمية وعلاجية آمنة تتجاوز المعايير التقليدية،
          حيث تلتقي التكنولوجيا الحديثة بلمسة إنسانية دافئة.
        </p>
      </section>

      <!-- Safe Transport -->
      <section class="w-full bg-[#FCF9F8] px-4 py-16 lg:px-8 lg:py-[136px]">
        <div
          class="mx-auto flex max-w-[1262px] flex-col overflow-hidden rounded-[20px] bg-white lg:flex-row"
        >
          <div
            class="w-full px-6 py-10 text-right sm:px-10 lg:w-[48%] lg:px-[72px] lg:py-[80px]"
          >
            <h2 class="mb-[24px] text-[24px] font-black text-[#1B7A83] lg:text-[29px]">
              النقل المدرسي الآمن
            </h2>

            <p
              class="mb-[33px] text-[14px] font-bold leading-[1.9] text-[#6F6669]"
            >
              نقدم خدمة نقل ذكية ومريحة تضمن وصول طفلك في الموعد بكل أمان. أسطولنا
              مجهز خصيصاً لتقليل التوتر وضمان أعلى مستويات الرعاية.
            </p>

            <div class="space-y-[20px]">
              <div
                v-for="feature in transportFeatures"
                :key="feature.title"
                class="flex items-start justify-start gap-[14px]"
              >
                <div :class="feature.iconBox">
                  <svg class="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none">
                    <path
                      v-for="(path, index) in getIconPaths(feature.icon)"
                      :key="index"
                      :d="path.d"
                      stroke="currentColor"
                      :stroke-width="path.width || 2.1"
                      :stroke-linecap="path.linecap"
                      :stroke-linejoin="path.linejoin"
                    />
                  </svg>
                </div>

                <div>
                  <h3 :class="feature.titleClass">{{ feature.title }}</h3>
                  <p
                    class="mt-[5px] text-[12px] font-bold leading-[1.65] text-[#766C70]"
                  >
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="relative order-[-1] h-[240px] w-full sm:h-[340px] lg:order-[1] lg:h-auto lg:min-h-[410px] lg:w-[52%]"
          >
            <img
              src="./images/support-bus.png"
              alt="حافلة أكاديمية سوا"
              class="absolute inset-0 h-full w-full object-cover"
            />

            <div
              class="absolute left-[18px] top-[18px] flex h-[36px] items-center gap-[8px] rounded-full bg-[#E9FBFE] px-[16px] text-[11px] font-black text-[#1B7A83]"
            >
              <span class="h-[9px] w-[9px] rounded-full bg-[#C91F5F]"></span>
              مراقبة بالكاميرات 24/7
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Infrastructure -->
      <section class="w-full bg-[#F6F3F2] px-4 py-16 lg:px-8 lg:py-[95px]">
        <div class="mx-auto max-w-[1188px]">
          <div class="text-right">
            <h2 class="text-[26px] font-black text-[#1B7A83] lg:text-[30px]">
              بنية تحتية متطورة
            </h2>
            <p class="mt-[20px] text-[13px] font-bold text-[#766C70]">
              كل زاوية في أكاديميتنا مدروسة بعناية فائقة لتوفير أفضل تجربة
              تعليمية.
            </p>
          </div>

          <div
            class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-[50px] lg:grid-cols-3 lg:gap-x-[32px] lg:gap-y-[28px]"
          >
            <article
              v-for="card in techCards"
              :key="card.title"
              class="rounded-[14px] bg-white p-6 text-right shadow-[0_8px_22px_rgba(0,0,0,0.018)] lg:min-h-[182px] lg:p-[32px]"
            >
              <div class="mb-[25px] flex">
                <svg :class="card.iconClass" viewBox="0 0 24 24" fill="none">
                  <path
                    v-for="(path, index) in getIconPaths(card.icon)"
                    :key="index"
                    :d="path.d"
                    stroke="currentColor"
                    :stroke-width="path.width || 2.1"
                    :stroke-linecap="path.linecap"
                    :stroke-linejoin="path.linejoin"
                  />
                </svg>
              </div>

              <h3 class="mb-[13px] text-[17px] font-black text-[#1B7A83]">
                {{ card.title }}
              </h3>

              <p class="text-[12px] font-bold leading-[1.75] text-[#71686B]">
                {{ card.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- Animal Garden -->
      <section class="w-full bg-[#FCF9F8] px-4 py-16 lg:px-8 lg:py-[96px]">
        <div
          class="mx-auto flex max-w-[1150px] flex-col items-center gap-8 overflow-hidden rounded-[28px] bg-[#1F7A83] p-6 sm:p-10 lg:flex-row lg:justify-evenly lg:gap-10 lg:rounded-[42px] lg:py-[75px]"
        >
          <div
            class="h-[220px] w-full overflow-hidden rounded-[28px] bg-white/10 sm:h-[300px] lg:h-[346px] lg:w-[520px] lg:shrink-0"
          >
            <img
              src="./images/support-animal-garden.png"
              alt="حديقة العصافير والحيوانات الأليفة"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="w-full text-right text-white lg:w-[410px]">
            <h2
              class="mb-[24px] text-[28px] font-black leading-[1.16] sm:text-[32px] lg:text-[38px]"
            >
              حديقة العصافير والحيوانات الأليفة
            </h2>

            <p
              class="mb-[33px] text-[15px] font-bold leading-[1.9] text-white/82"
            >
              مرفق فريد من نوعه يهدف إلى دمج العلاج باللعب والمسؤولية. الحديقة
              ليست مجرد مكان للمرح، بل هي أداة علاجية قوية.
            </p>

            <div class="grid grid-cols-2 gap-[16px]">
              <div
                v-for="item in animalFeatures"
                :key="item.title"
                class="flex min-h-[76px] flex-col justify-center gap-[10px] rounded-[10px] bg-[#FFFFFF1A] px-[15px] py-3 text-white"
              >
                <svg
                  class="h-[22px] w-[22px] shrink-0 text-white/88"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    v-for="(path, index) in getIconPaths(item.icon)"
                    :key="index"
                    :d="path.d"
                    stroke="currentColor"
                    :stroke-width="path.width || 2.1"
                    :stroke-linecap="path.linecap"
                    :stroke-linejoin="path.linejoin"
                  />
                </svg>

                <span class="text-[13px] font-black leading-[1.5]">
                  {{ item.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Activities -->
      <section class="mb-20 w-full bg-[#FCF9F8] px-4 lg:px-0">
        <div class="text-center">
          <h2 class="text-[26px] font-black text-[#1B7A83] lg:text-[29px]">
            أنشطة تنبض بالحياة
          </h2>
        </div>

        <div
          class="mx-auto mt-8 flex w-full max-w-[1100px] flex-col gap-10 lg:w-[85%] lg:flex-row lg:gap-6"
        >
          <div class="w-full lg:w-1/2">
            <div class="mb-6 flex items-center gap-[9px] lg:mb-[34px]">
              <h3 class="text-[17px] font-black text-[#C91F5F]">
                أنشطة داخلية
              </h3>
              <svg
                class="h-[18px] w-[18px] text-[#C91F5F]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 20V8l7-5 7 5v12H5Z"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 20v-6h4v6"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <article
              v-for="activity in indoorActivities"
              :key="activity.title"
              class="mb-[20px] flex min-h-[96px] items-center gap-4 rounded-[14px] bg-[#F8F6F5] px-4 py-3 text-right sm:gap-6 sm:px-[20px] lg:mb-[26px]"
            >
              <img
                :src="activity.image"
                :alt="activity.title"
                class="h-[64px] w-[80px] shrink-0 rounded-[10px] object-cover sm:h-[72px] sm:w-[96px]"
              />

              <div class="sm:pr-[18px]">
                <h4 class="mb-[8px] text-[15px] font-black text-[#1B7A83]">
                  {{ activity.title }}
                </h4>
                <p class="text-[11px] font-bold leading-[1.65] text-[#766C70]">
                  {{ activity.description }}
                </p>
              </div>
            </article>
          </div>

          <div class="w-full lg:w-1/2">
            <div class="mb-6 flex items-center gap-[9px] lg:mb-[34px]">
              <h3 class="text-[17px] font-black text-[#1B7A83]">
                أنشطة خارجية
              </h3>
              <svg
                class="h-[18px] w-[18px] text-[#1B7A83]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 19h16"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linecap="round"
                />
                <path
                  d="M6 19V9l6-4 6 4v10"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <article
              v-for="activity in outdoorActivities"
              :key="activity.title"
              class="mb-[20px] flex min-h-[96px] items-center gap-4 rounded-[14px] bg-[#F8F6F5] px-4 py-3 text-right sm:gap-6 sm:px-[20px] lg:mb-[26px]"
            >
              <img
                :src="activity.image"
                :alt="activity.title"
                class="h-[64px] w-[80px] shrink-0 rounded-[10px] object-cover sm:h-[72px] sm:w-[96px]"
              />

              <div class="sm:pr-[18px]">
                <h4 class="mb-[8px] text-[15px] font-black text-[#1B7A83]">
                  {{ activity.title }}
                </h4>
                <p class="text-[11px] font-bold leading-[1.65] text-[#766C70]">
                  {{ activity.description }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Comfort -->
      <section class="w-full bg-[#F0F6F7] px-4 py-16 lg:px-8 lg:py-[89px]">
        <div
          class="mx-auto flex max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:justify-between"
        >
          <div class="w-full text-right lg:w-[535px]">
            <h2 class="mb-[27px] text-[26px] font-black text-[#1B7A83] lg:text-[30px]">
              راحة الأهل أولوية
            </h2>

            <p
              class="mb-[36px] text-[14px] font-bold leading-[1.9] text-[#6F6669]"
            >
              ندرك أن رحلة الأهل تتطلب الدعم أيضاً. وفرنا مرافق مريحة تجعل وقت
              انتظاركم وقتاً للاسترخاء والمتابعة.
            </p>

            <ul class="space-y-[18px]">
              <li
                v-for="item in comfortItems"
                :key="item.text"
                class="flex items-center justify-start gap-[13px] text-[14px] font-black text-[#1B7A83]"
              >
                <svg
                  class="h-[18px] w-[18px] shrink-0 text-[#C91F5F]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    v-for="(path, index) in getIconPaths(item.icon)"
                    :key="index"
                    :d="path.d"
                    stroke="currentColor"
                    :stroke-width="path.width || 2.1"
                    :stroke-linecap="path.linecap"
                    :stroke-linejoin="path.linejoin"
                  />
                </svg>
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>

          <div
            class="order-[-1] aspect-square w-full max-w-[512px] overflow-hidden rounded-[24px] shadow-[0_14px_32px_rgba(0,0,0,0.08)] lg:order-[1]"
          >
            <img
              src="./images/comfort-room.png"
              alt="راحة الأهل"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <!-- Educational Environment -->
      <section class="w-full bg-[#FCF9F8] px-4 py-16 text-center lg:py-[88px]">
        <div
          class="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#F7E7EF] text-[#C91F5F]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="30"
            viewBox="0 0 29 30"
            fill="none"
          >
            <path
              d="M4.5 30V23.55C3.075 22.25 1.96875 20.7312 1.18125 18.9937C0.39375 17.2563 0 15.425 0 13.5C0 9.75 1.3125 6.5625 3.9375 3.9375C6.5625 1.3125 9.75 0 13.5 0C16.625 0 19.3937 0.91875 21.8062 2.75625C24.2188 4.59375 25.7875 6.9875 26.5125 9.9375L28.4625 17.625C28.5875 18.1 28.5 18.5312 28.2 18.9188C27.9 19.3063 27.5 19.5 27 19.5H24V24C24 24.825 23.7062 25.5312 23.1187 26.1187C22.5312 26.7062 21.825 27 21 27H18V30H15V24H21V16.5H25.05L23.625 10.6875C23.05 8.4125 21.825 6.5625 19.95 5.1375C18.075 3.7125 15.925 3 13.5 3C10.6 3 8.125 4.0125 6.075 6.0375C4.025 8.0625 3 10.525 3 13.425C3 14.925 3.30625 16.35 3.91875 17.7C4.53125 19.05 5.4 20.25 6.525 21.3L7.5 22.2V30H4.5ZM13.5 21C13.925 21 14.2812 20.8563 14.5688 20.5688C14.8563 20.2812 15 19.925 15 19.5C15 19.075 14.8563 18.7188 14.5688 18.4312C14.2812 18.1437 13.925 18 13.5 18C13.075 18 12.7188 18.1437 12.4312 18.4312C12.1437 18.7188 12 19.075 12 19.5C12 19.925 12.1437 20.2812 12.4312 20.5688C12.7188 20.8563 13.075 21 13.5 21ZM12.375 16.2H14.6625C14.6625 15.575 14.7437 15.0687 14.9062 14.6812C15.0688 14.2937 15.4 13.825 15.9 13.275C16.35 12.775 16.7875 12.2688 17.2125 11.7563C17.6375 11.2438 17.85 10.575 17.85 9.75C17.85 8.7 17.4438 7.8125 16.6313 7.0875C15.8188 6.3625 14.8125 6 13.6125 6C12.6125 6 11.7063 6.2875 10.8938 6.8625C10.0813 7.4375 9.5125 8.1875 9.1875 9.1125L11.25 9.975C11.425 9.425 11.7312 8.98125 12.1687 8.64375C12.6062 8.30625 13.0875 8.1375 13.6125 8.1375C14.1625 8.1375 14.6187 8.2875 14.9812 8.5875C15.3438 8.8875 15.525 9.275 15.525 9.75C15.525 10.275 15.3687 10.7437 15.0562 11.1562C14.7437 11.5688 14.375 11.9875 13.95 12.4125C13.45 12.9375 13.0625 13.4625 12.7875 13.9875C12.5125 14.5125 12.375 15.25 12.375 16.2Z"
              fill="#B21553"
            />
          </svg>
        </div>

        <h2 class="mt-8 text-[26px] font-black text-[#1B7A83] lg:mt-[27px] lg:text-[30px]">
          بيئة تعليمية غنية
        </h2>

        <p
          class="mx-auto mt-[25px] w-full max-w-[850px] text-[14px] font-bold leading-[1.9] text-[#6F6669]"
        >
          نحن لا نبني جدراناً، بل نبني مستقبلاً. إن بيئتنا الثرية والآمنة هي
          المختبر الحقيقي الذي يكتسب فيه طفلك المهارات الحياتية، الاجتماعية،
          والأكاديمية اللازمة لينطلق نحو آفاق جديدة من الاستقلالية والتميز.
        </p>
      </section>

      <!-- CTA -->
      <section class="w-full bg-[#C91F5F] px-4 py-16 text-center text-white lg:py-[93px]">
        <h2 class="text-[28px] font-black leading-[1.3] sm:text-[34px] lg:text-[41px]">
          وفّر لطفلك بيئة آمنة تدعم نموه
        </h2>

        <p
          class="mx-auto mt-[26px] w-full max-w-[590px] text-[15px] font-bold leading-[1.8] text-[#ffffff95]"
        >
          انضم إلى عائلة سوا اليوم، حيث الرعاية تلتقي بالإبداع في كل ركن.
        </p>

        <div class="mt-[36px] flex flex-wrap justify-center gap-[18px]">
          <a
            href="/web/evaluation"
            class="flex h-[51px] w-[138px] items-center justify-center rounded-[9px] bg-[#fff] text-[13px] font-black text-[#C91F5F]"
          >
            احجز تقييم الآن
          </a>

          <a
            href="/contact"
            class="flex h-[51px] w-[126px] items-center justify-center rounded-[9px] border-2 border-white bg-transparent text-[13px] font-black text-white"
          >
            تواصل معنا
          </a>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import greenMazeImage from "./images/green-maze.png";
import comfortAreaImage from "./images/family-safe-work.png";
import indoorPlayroomImage from "./images/indoor-playroom.png";
import musicRoomImage from "./images/music-room.png";
import outdoorPlaygroundImage from "./images/outdoor-playground.png";
import theaterRoomImage from "./images/theater-room.png";

export default {
  name: "SupportServicesPage",

  data() {
    return {
      comfortAreaImage,

      transportFeatures: [
        {
          title: "مركبات صغيرة",
          description: "بحد أقصى 8 أطفال لضمان الراحة والهدوء.",
          icon: "users",
          iconBox:
            "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#E7FBFE] text-[#1B7A83]",
          titleClass: "text-[15px] font-black text-[#1B7A83]",
        },
        {
          title: "مرافق متخصص",
          description: "يتواجد أخصائي تعديل سلوك في كل رحلة للدعم.",
          icon: "location-heart",
          iconBox:
            "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#F8E4EC] text-[#C91F5F]",
          titleClass: "text-[15px] font-black text-[#C91F5F]",
        },
      ],

      techCards: [
        {
          title: "بنية آمنة تماماً",
          description:
            "جميع القاعات والممرات مراقبة بالكاميرات لضمان سلامة الأطفال المستمرة.",
          icon: "shield",
          iconClass: "h-[26px] w-[26px] text-[#C91F5F]",
        },
        {
          title: "مسارات ومداخل آمنة",
          description:
            "تصميم انسيابي للمداخل والمخارج مع منحدرات مدروسة لتسهيل الحركة.",
          icon: "wheelchair",
          iconClass: "h-[26px] w-[26px] text-[#1B7A83]",
        },
        {
          title: "مصعد كهربائي",
          description:
            "تجهيزات متكاملة لخدمة ذوي الهمم وتسهيل التنقل بين الطوابق.",
          icon: "building",
          iconClass: "h-[26px] w-[26px] text-[#C91F5F]",
        },
        {
          title: "فصول مجهزة",
          description:
            "فصول دراسية واسعة مزودة بأحدث الوسائل التعليمية والتفاعلية.",
          icon: "school",
          iconClass: "h-[26px] w-[26px] text-[#1B7A83]",
        },
        {
          title: "غرف علاج هادئة",
          description:
            "بيئة محفزة للتركيز بعيداً عن المشتتات لجلسات علاجية فعالة.",
          icon: "therapy",
          iconClass: "h-[26px] w-[26px] text-[#C91F5F]",
        },
        {
          title: "ملاعب فسيحة",
          description: "مساحات خارجية للعب الحر مجهزة بأرضيات ممتصة للصدمات.",
          icon: "playground",
          iconClass: "h-[26px] w-[26px] text-[#1B7A83]",
        },
      ],

      animalFeatures: [
        { title: "مهارات حسية", icon: "hand" },
        { title: "تعزيز التواصل", icon: "message" },
        { title: "تنمية المسؤولية", icon: "users" },
        { title: "زيادة الانتباه", icon: "building" },
      ],

      indoorActivities: [
        {
          title: "العلاج بالموسيقى",
          description: "استخدام الإيقاعات لتحسين التواصل والتعبير.",
          image: musicRoomImage,
        },
        {
          title: "مسرح العرائس",
          description: "تنمية الخيال الاجتماعي والمهارات اللغوية.",
          image: theaterRoomImage,
        },
        {
          title: "قاعة الانتظار واللعب",
          description: "مساحات آمنة للتفريغ الحركي خلال فترات الاستراحة",
          image: indoorPlayroomImage,
        },
      ],

      outdoorActivities: [
        {
          title: "الألعاب المائية",
          description: "تحفيز حسي ممتع في بيئة مائية آمنة.",
          image: outdoorPlaygroundImage,
        },
        {
          title: "الترامبولين",
          description: "تقوية التوازن والقدرات الحركية الكبرى.",
          image: greenMazeImage,
        },
      ],

      comfortItems: [
        { text: "قاعات انتظار فندقية مريحة", icon: "sofa" },
        { text: "أجهزة تابلت لمتابعة الجلسات مباشرة", icon: "screen" },
        { text: "منطقة ضيافة مجانية", icon: "cup" },
      ],
    };
  },

  methods: {
    getIconPaths(icon) {
      const icons = {
        users: [
          { d: "M8 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" },
          { d: "M16 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" },
          {
            d: "M4.5 18.5c.45-2.6 1.8-4.1 3.9-4.1s3.45 1.5 3.9 4.1",
            linecap: "round",
          },
          {
            d: "M11.7 18.5c.45-2.6 1.8-4.1 3.9-4.1s3.45 1.5 3.9 4.1",
            linecap: "round",
          },
        ],
        "location-heart": [
          { d: "M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" },
          {
            d: "M9.5 10.5c0-1 .8-1.8 1.8-1.8.6 0 1.1.3 1.4.7.3-.4.8-.7 1.4-.7 1 0 1.8.8 1.8 1.8 0 1.8-3.2 3.8-3.2 3.8s-3.2-2-3.2-3.8Z",
            linejoin: "round",
          },
        ],
        shield: [
          {
            d: "M12 3 19 6v5c0 4.8-2.8 8.1-7 10-4.2-1.9-7-5.2-7-10V6l7-3Z",
            linejoin: "round",
          },
          { d: "M9 12l2 2 4-5", linecap: "round", linejoin: "round" },
        ],
        wheelchair: [
          { d: "M10 5a2 2 0 1 0 0-.1" },
          { d: "M10 8v5h4l2 4", linecap: "round", linejoin: "round" },
          { d: "M8.5 12.5A4.5 4.5 0 1 0 13 17", linecap: "round" },
        ],
        building: [
          { d: "M5 21V4h14v17" },
          {
            d: "M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2",
            linecap: "round",
          },
          { d: "M4 21h16", linecap: "round" },
        ],
        school: [
          { d: "M4 10.5 12 6l8 4.5-8 4.5-8-4.5Z", linejoin: "round" },
          {
            d: "M7 13v3.3c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5V13",
            linecap: "round",
          },
        ],
        therapy: [
          {
            d: "M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z",
            linejoin: "round",
          },
          { d: "M12 8v6M9 11h6", linecap: "round" },
        ],
        playground: [
          { d: "M5 19 12 5l7 14", linecap: "round", linejoin: "round" },
          { d: "M8 14h8M7 19h10", linecap: "round" },
        ],
        hand: [
          { d: "M8 12V7a1.5 1.5 0 0 1 3 0v5" },
          { d: "M11 12V5.5a1.5 1.5 0 0 1 3 0V12" },
          {
            d: "M14 12V7a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7H9c-2.5 0-4-2-4-4v-4a1.5 1.5 0 0 1 3 0v2",
            linecap: "round",
          },
        ],
        message: [
          { d: "M4 5h16v11H7l-3 3V5Z", linejoin: "round" },
          { d: "M8 9h8M8 12h5", linecap: "round" },
        ],
        smile: [
          { d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" },
          { d: "M8.5 10h.01M15.5 10h.01", linecap: "round" },
          { d: "M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2", linecap: "round" },
        ],
        sofa: [
          { d: "M5 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" },
          { d: "M4 13h16v5H4v-5Z", linejoin: "round" },
          { d: "M6 18v2M18 18v2", linecap: "round" },
        ],
        screen: [
          { d: "M4 5h16v11H4V5Z", linejoin: "round" },
          { d: "M9 20h6M12 16v4", linecap: "round" },
        ],
        cup: [
          { d: "M6 7h10v6a5 5 0 0 1-10 0V7Z", linejoin: "round" },
          { d: "M16 9h2a2 2 0 0 1 0 4h-2", linecap: "round" },
          { d: "M7 20h8", linecap: "round" },
        ],
        phone: [
          {
            d: "M6.5 5.5h3l1.2 4-2 1.2c1 2.1 2.6 3.7 4.7 4.7l1.2-2 4 1.2v3a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 4.5 7.7a2 2 0 0 1 2-2.2Z",
            linejoin: "round",
          },
        ],
        mail: [{ d: "M4 5h16v14H4V5Z" }, { d: "M4 7l8 6 8-6" }],
        facebook: [
          {
            d: "M18 8a6 6 0 1 0-6 10h2v-5h2l1-3h-3V8.5c0-.8.3-1.2 1.2-1.2H17V4.8c-.7-.1-1.4-.2-2.1-.2-2.5 0-4.1 1.5-4.1 4V10H8v3h2.8v5",
            linecap: "round",
          },
        ],
        location: [
          { d: "M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" },
          { d: "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" },
        ],
      };

      return icons[icon] || [];
    },
  },
};
</script>
