<template>
  <main>
    <!-- ===== HERO SECTION ===== -->
    <section
      class="bg-[#fcf9f8] min-h-[500px] flex items-center overflow-hidden"
    >
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
      >
        <!-- Text -->
        <div class="flex flex-col gap-6">
          <h1
            class="text-[36px] sm:text-[48px] lg:text-[60px] font-extrabold text-[#1c1b1b] text-right leading-[1.1]"
          >
            <span class="block">نحن هنا لدعمك</span>
            <span class="block text-[#b21553]">في كل خطوة</span>
          </h1>
          <p
            class="text-[#594045] text-base lg:text-xl text-right leading-relaxed"
          >
            فريق أكاديمية سوا جاهز للإجابة على جميع استفساراتك ومساعدتك في
            اختيار المسار الأنسب لطفلك لضمان نتائج ناجحة.
          </p>
          <div class="flex flex-wrap gap-4 items-center">
            <a
              class="cursor-pointer border-2 border-[#1C6772] text-[#1C6772] font-bold text-base px-6 lg:px-8 py-4 rounded-full shadow-lg"
              >احجز تقييم</a
            >
            <a
              class="bg-[#25d366] text-white font-bold text-base px-6 lg:px-8 py-4 rounded-[15px] flex items-center gap-2 cursor-pointer"
            >
              <img
                src="./images/icon-whatsapp.svg"
                alt=""
                class="w-5 h-5 mx-1"
              />
              <span>واتساب مباشر</span>
            </a>
          </div>
        </div>
        <!-- Image -->
        <div class="relative mt-4 lg:mt-0">
          <div
            class="absolute w-64 h-64 rounded-full bg-[#b21553]/10 blur-[40px] -top-10 -right-10"
          ></div>
          <div class="rounded-[40px] overflow-hidden shadow-2xl relative z-10">
            <img
              src="./images/contact-hero.jpg"
              alt="نحن هنا لدعمك"
              class="w-full h-[280px] sm:h-[360px] lg:h-[440px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TRUST ELEMENTS ===== -->
    <section class="bg-[#f6f3f2] py-10 lg:py-16">
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-center gap-6 lg:gap-16"
      >
        <!-- Trust 1 -->
        <div class="flex items-center gap-4 bg-white py-2 px-4 rounded-lg">
          <img src="./images/icon-quick.svg" alt="" class="w-6 h-6" />
          <p class="font-bold text-[#1C6772]">استجابة سريعة</p>
        </div>
        <!-- Trust 2 -->
        <div class="flex items-center gap-4 bg-white py-2 px-4 rounded-lg">
          <img src="./images/icon-followup.svg" alt="" class="w-6 h-6" />
          <p class="font-bold text-[#1C6772]">متابعة مستمرة</p>
        </div>
        <!-- Trust 3 -->
        <div class="flex items-center gap-4 bg-white py-2 px-4 rounded-lg">
          <img src="./images/icon-team2.svg" alt="" class="w-6 h-6" />
          <p class="font-bold text-[#1C6772]">فريق متخصص</p>
        </div>
      </div>
    </section>

    <!-- ===== CONTACT CARDS GRID ===== -->
    <section class="bg-white py-16 lg:py-20">
      <div class="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card: Location -->
          <div
            class="bg-[#f6f3f2] rounded-3xl p-8 flex flex-col gap-4 justify-center items-center"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-[#b21553]/10 flex items-center justify-center"
            >
              <img src="./images/icon-location.svg" alt="" class="w-6 h-7" />
            </div>
            <h3 class="text-xl font-bold text-[#1c1b1b] text-right">موقعنا</h3>
            <p class="text-[#594045] text-sm text-center leading-relaxed">
              عمان - الرابية - شارع ميسلون
            </p>
          </div>
          <!-- Card: Phone -->
          <div
            class="bg-[#f6f3f2] rounded-3xl p-8 flex flex-col gap-4 justify-center items-center"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-[#1c6772]/10 flex items-center justify-center"
            >
              <img src="./images/icon-phone.svg" alt="" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-[#1c1b1b] text-right">
              اتصل بنا
            </h3>
            <div class="flex flex-col gap-1 text-center">
              <p class="text-[#594045] text-sm" dir="ltr">+962-65522688</p>
              <p class="text-[#594045] text-sm" dir="ltr">0791017001</p>
            </div>
          </div>
          <!-- Card: Email -->
          <div
            class="bg-[#f6f3f2] rounded-3xl p-8 flex flex-col gap-4 justify-center items-center"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-[#b21553]/10 flex items-center justify-center"
            >
              <img src="./images/icon-email.svg" alt="" class="w-6 h-5" />
            </div>
            <h3 class="text-xl font-bold text-[#1c1b1b] text-right">
              البريد الإلكتروني
            </h3>
            <p class="text-[#594045] text-sm text-right" dir="ltr">
              info@sawa.academy
            </p>
          </div>
          <!-- Card: Support -->
          <div
            class="bg-[#b21553] rounded-3xl p-8 flex flex-col gap-4 relative overflow-hidden justify-center items-center"
          >
            <div
              class="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10"
            ></div>
            <div
              class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"
            >
              <img src="./images/icon-support.svg" alt="" class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold text-white text-right relative">
              دعم متواصل
            </h3>
            <p
              class="text-white/80 text-sm text-right leading-relaxed relative"
            >
              "We Are Always Happy To Help"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MAIN FORM & MAP ===== -->
    <section class="bg-[#F6F3F2] py-16 lg:py-20">
      <div
        class="max-w-[1280px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8"
      >
        <!-- Form -->
        <div class="bg-white rounded-xl p-6 flex flex-col w-full lg:w-[60%]">
          <h1 class="text-[#1C6772] text-2xl font-extrabold">
            أرسل استفسارك الآن
          </h1>
          <form class="w-full mt-6 flex flex-col gap-4">
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <div class="flex flex-col gap-2 w-full">
                <label for="name" class="text-[#594045] text-xs"
                  >الاسم الكامل</label
                >
                <input
                  id="name"
                  type="text"
                  class="rounded-lg bg-[#EAE7E7] placeholder:text-start placeholder:font-normal"
                  placeholder="ادخل اسمك هنا"
                />
              </div>
              <div class="flex flex-col gap-2 w-full">
                <label for="phone" class="text-[#594045] text-xs"
                  >رقم الهاتف</label
                >
                <input
                  id="phone"
                  type="text"
                  class="rounded-lg bg-[#EAE7E7] placeholder:text-start placeholder:font-normal"
                  placeholder="07xxxxxxxx"
                />
              </div>
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label for="email" class="text-[#594045] text-xs"
                >البريد الإلكتروني</label
              >
              <input
                id="email"
                type="text"
                class="rounded-lg bg-[#EAE7E7] placeholder:text-start placeholder:font-normal"
                placeholder="example@mail.com"
              />
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label for="message" class="text-[#594045] text-xs">رسالتك</label>
              <textarea
                id="message"
                class="rounded-lg bg-[#EAE7E7] placeholder:text-start placeholder:font-normal text-xs min-h-[80px]"
                placeholder="كيف يمكننا مساعدتك؟"
              ></textarea>
            </div>
            <input
              type="submit"
              class="bg-[#B21553] text-white py-2 rounded-xl cursor-pointer"
              value="إرسال الرسالة"
            />
          </form>
        </div>

        <!-- Map -->
        <div class="w-full lg:w-[40%]">
          <div class="flex justify-center items-center h-full">
            <img
              src="./images/Map Section.png"
              alt=""
              class="w-3/4 lg:w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FINAL CTA ===== -->
    <section class="bg-white py-16 lg:py-24">
      <div class="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div
          class="bg-[#1C6772] rounded-[48px] shadow-2xl p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div
            class="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5 bg-gradient-to-br from-[#b21553] to-[#d4346b]"
          ></div>
          <div
            class="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-5 bg-gradient-to-br from-[#1c6772] to-[#004f58]"
          ></div>
          <h2
            class="text-2xl sm:text-[36px] lg:text-[48px] font-extrabold text-white mb-6 relative"
          >
            ابدأ رحلة طفلك نحو التطور اليوم
          </h2>
          <p
            class="text-[#AAEEF9] text-base lg:text-xl leading-relaxed mb-8 lg:mb-10 max-w-[672px] mx-auto relative"
          >
            نحن نؤمن بأن كل طفل لديه قدرات فريدة تنتظر من يكتشفها. دعنا نكون
            شركاءك في هذا المشوار.
          </p>
          <div class="flex gap-4 items-center justify-center">
            <a
              href="contact.html"
              class="bg-[#b21553] text-white font-bold text-base lg:text-xl px-8 lg:px-10 py-4 lg:py-5 rounded-full shadow-[0_20px_25px_-5px_rgba(178,21,83,0.25)]"
              >احجز تقييم الآن</a
            >
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
