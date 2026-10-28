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
              class="mb-5 inline-flex rounded-full bg-bp-a7ebf6 text-bp-1c6772 text-xs sm:text-sm font-bold px-4 py-2"
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
              class="bg-bs-c91f5f text-white font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full shadow-[0_20px_25px_-5px_rgba(201,31,95,0.25)]"
              >اكتشف برامجنا</a
            >
            <a
              href="/services"
              class="border-2 border-bp-1c6772 text-bp-1c6772 font-bold text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-[18px] rounded-full"
              >لماذا نختلف؟</a
            >
          </div>
        </div>
        <!-- Image -->
        <div class="relative mt-6 lg:mt-0">
          <div
            class="absolute w-64 h-64 rounded-full bg-bp-a7ebf6/40 blur-[32px] -top-8 -right-10"
          ></div>
          <div
            class="absolute w-64 h-64 rounded-full bg-bs-c91f5f/10 blur-[32px] -bottom-8 -left-8"
          ></div>
          <div
            class="rotate-2 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
          >
            <img
              src="./images/pt-gym.jpg"
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
            الأقسام المتخصصة في سوا
          </h2>
          <p class="mx-auto mt-4 max-w-[720px] text-[14px] font-medium leading-[1.85] text-[#746064]">
            تُقدَّم الأقسام ضمن برنامج الجلسات الفردية (العيادات) من قبل فريق
            متكامل التخصصات، وفي كل قسم رئيس قسم متفرغ لضبط الجودة ومتابعة العمل
            بالتنسيق مع باقي البرامج والأقسام.
          </p>
          <div
            class="mx-auto mt-5 h-[6px] w-[80px] rounded-full bg-bs-b21553 sm:mt-[26px] sm:w-[96px]"
          ></div>
        </div>

        <div class="flex flex-col gap-6 lg:gap-8">
          <article
            id="aba"
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8"
          >
            <div
              class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(220px,300px)_1fr] md:items-center"
            >
              <div class="overflow-hidden rounded-[16px] bg-[#F6F3F2]">
                <img
                  src="./images/aba-illustration.jpg"
                  alt="قسم العلاج السلوكي (ABA)"
                  class="h-[220px] w-full object-cover md:h-[260px]"
                />
              </div>
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <div
                    class="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-bs-b21553/10"
                  >
                    <img src="./images/therapeutic-departments1.svg" alt="" class="h-7 w-7" />
                  </div>
                  <h3
                    class="text-[20px] font-black leading-tight text-[#252525] sm:text-[24px]"
                  >
                    قسم العلاج السلوكي (ABA)
                  </h3>
                </div>
                <p class="text-[14px] font-medium leading-[1.9] text-[#746064]">
                  يستند هذا القسم لمبادئ تحليل السلوك التطبيقي (ABA)، ويوجد مشرف متفرغ لضبط الجودة ومتابعة العمل بالتنسيق مع رؤساء الأقسام المختلفة. وهو مخصص للأطفال من ذوي التأخر والاضطرابات النمائية، وللأطفال الذين لديهم سلوكيات غير مرغوبة.
                </p>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bs-b21553">
                لمن يواجهون تحديات في
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>مهارات التواصل اللفظي وغير اللفظي مثل: (الطلبات، التسمية، استجابة المستمع، التقليد الصوتي).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>المهارات الاجتماعية مثل: (التفاعل، تبادل الأدوار، بدء اللعب).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>السلوكيات غير المرغوبة مثل: (البكاء، الصراخ، الانسحاب، السلوكيات العدوانية أو النمطية).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>مهارات اللعب الوظيفي والرمزي مثل: (دفع السيارة لتحريكها، إطعام دمية).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>المهارات المعرفية والإدراكية مثل: (الانتباه، الاستجابة، تقليل التشتت).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>مهارات الاستقلالية مثل: (الجلوس، الانتظار، اتباع الروتين).</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bs-b21553">
                أهداف القسم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تطوير مهارات التواصل اللفظي والوظيفي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>بناء مهارات اجتماعية مستقرة ومتدرجة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تقليل السلوكيات غير المرغوبة بطريقة آمنة وعلمية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تعزيز السلوكيات البديلة المناسبة مثل: (التواصل، الطلب، المهارات الاجتماعية).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تطوير مهارات اللعب والتفاعل.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تحسين الانتباه، الاستجابة، وتنظيم السلوك.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>دعم استقلالية الطفل داخل الجلسة وفي البيئة المدرسية والمنزلية.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bs-b21553">
                كيف نعمل؟
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تقييم سلوكي شامل باستخدام أدوات تقييم معتمدة عالمياً.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>إعداد خطة تربوية فردية مبنية على احتياجات الطفل وأهداف قابلة للقياس.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>جلسات علاج فردية باستخدام استراتيجيات ABA مثل: DTT التجارب المنفصلة، NET التعليم في البيئة الطبيعية، Prompting & Fading التدريب بتقديم المساعدات وسحبها تدريجياً.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تعزيز السلوكيات البديلة.</span>
                </li>
              </ul>
            </div>
            </div>
          </article>

          <article
            id="speech"
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8"
          >
            <div
              class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(220px,300px)_1fr] md:items-center"
            >
              <div class="overflow-hidden rounded-[16px] bg-[#F6F3F2]">
                <img
                  src="./images/speech-illustration.jpg"
                  alt="قسم علاج اضطرابات النطق واللغة"
                  class="h-[220px] w-full object-cover md:h-[260px]"
                />
              </div>
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <div
                    class="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-bp-1c6772/10"
                  >
                    <img src="./images/therapeutic-departments2.svg" alt="" class="h-7 w-7" />
                  </div>
                  <h3
                    class="text-[20px] font-black leading-tight text-[#252525] sm:text-[24px]"
                  >
                    قسم علاج اضطرابات النطق واللغة
                  </h3>
                </div>
                <p class="text-[14px] font-medium leading-[1.9] text-[#746064]">
                  يُعنى هذا القسم بعلاج اضطرابات النطق واللغة، بهدف تحسين قدرة الطفل على التعبير والفهم، ويسهم في تعزيز التواصل الفعّال ورفع جودة الحياة لديه، حيث يوجد رئيس قسم متفرغ لضبط الجودة ومتابعة العمل بالتنسيق مع باقي البرامج والأقسام المختلفة.
                </p>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                مخصص للأطفال الذين لديهم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تأخر لغوي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>مشاكل في مخارج الأصوات الكلامية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>مشاكل بالطلاقة الكلامية مثل: (التأتأة والسرعة في الكلام).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>الاضطرابات النطقية واللغوية الناتجة عن الضعف السمعي.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                أهداف القسم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تطوير مهارات النطق والتواصل اللفظي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تحسين القدرة النطقية واللغوية عند الطفل.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تعزيز التعبير عن الانفعالات والمشاعر والأفكار والاحتياجات.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تنمية مهارات التواصل الاجتماعي والتفاعل مع الآخرين.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تحسين وتعزيز استخدام اللغة بالمواقف الاجتماعية المختلفة.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                كيف نعمل؟
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>نبدأ بإجراء تقييم شامل للمهارات اللغوية والنطقية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تحديد مستوى الأداء الحالي بالإضافة إلى رسومات بيانية توضيحية تبين التقدم وتتيح مراقبة التطور لدى الطفل.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>إعداد خطة علاجية فردية مخصصة حسب احتياجات الطفل ومستواه اللغوي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>جلسات علاجية منظمة باستخدام استراتيجيات وأدوات علاجية حديثة وشيّقة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>متابعة دورية وتعاون مستمر مع الأسرة والمدرسة لضمان استمرارية التقدم.</span>
                </li>
              </ul>
            </div>
            </div>
          </article>

          <article
            id="ot"
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8"
          >
            <div
              class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(220px,300px)_1fr] md:items-center"
            >
              <div class="overflow-hidden rounded-[16px] bg-[#F6F3F2]">
                <img
                  src="./images/ot-illustration.jpg"
                  alt="قسم العلاج الوظيفي"
                  class="h-[220px] w-full object-cover md:h-[260px]"
                />
              </div>
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <div
                    class="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-[#006B24]/10"
                  >
                    <img src="./images/therapeutic-departments3.svg" alt="" class="h-7 w-7" />
                  </div>
                  <h3
                    class="text-[20px] font-black leading-tight text-[#252525] sm:text-[24px]"
                  >
                    قسم العلاج الوظيفي
                  </h3>
                </div>
                <p class="text-[14px] font-medium leading-[1.9] text-[#746064]">
                  يهدف هذا القسم إلى تنمية مهارات الاستقلالية والوظائف الحركية والحسية لدى الأفراد، ويساعد على تحسين القدرة على أداء الأنشطة اليومية وتعزيز التكيف مع البيئة المحيطة، حيث يوجد رئيس قسم متفرغ لضبط الجودة ومتابعة العمل بالتنسيق مع باقي البرامج والأقسام المختلفة.
                </p>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-[#006B24]">
                مخصص للأطفال الذين يواجهون صعوبات في
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>المهارات الحركية الدقيقة مثل: (استخدام كلتا اليدين، الإمساك والإفلات، وتحريك الأدوات داخل اليد الواحدة وبين اليدين).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>المهارات الحركية الكبرى مثل: (التوازن، القفز، التنقل).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>المهارات الحياتية اليومية مثل: (التعامل مع الملابس / استخدام الحمام / تناول الطعام / النظافة الشخصية).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>المهارات المعرفية والإدراكية مثل: (الانتباه والذاكرة والإدراك البصري).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>مهارات التآزر البصري الحركي مثل: (مهارات ما قبل الكتابة، القص).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>مهارات اللعب.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-[#006B24]">
                أهداف القسم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تعزيز قدرة الطفل على أداء أنشطة الحياة اليومية باستقلالية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تطوير المهارات الحركية الدقيقة والبصرية الحركية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تحسين التكامل الحسي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تهيئة الطفل للدمج في البيئة التعليمية والمجتمعية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تعزيز المهارات المعرفية والإدراكية.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-[#006B24]">
                كيف نعمل؟
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تقييم شامل متخصص من قبل أخصائي علاج وظيفي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>تحديد مستوى الأداء الحالي بالإضافة إلى رسومات بيانية توضيحية تبين التقدم وتتيح مراقبة التطور لدى الطفل.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>إعداد خطة علاجية مخصصة حسب احتياجات الطفل.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>جلسات فردية بأحدث الوسائل والأدوات العلاجية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#006B24]"></span>
                  <span>متابعة دورية وتعاون مستمر مع الأسرة والمدرسة.</span>
                </li>
              </ul>
            </div>
            </div>
          </article>

          <article
            id="academic"
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8"
          >
            <div
              class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(220px,300px)_1fr] md:items-center"
            >
              <div class="overflow-hidden rounded-[16px] bg-[#F6F3F2]">
                <img
                  src="./images/academic-illustration.jpg"
                  alt="قسم التعليم الإدراكي الأكاديمي"
                  class="h-[220px] w-full object-cover md:h-[260px]"
                />
              </div>
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <div
                    class="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-bp-1c6772/10"
                  >
                    <img src="./images/therapeutic-departments5.svg" alt="" class="h-7 w-7" />
                  </div>
                  <h3
                    class="text-[20px] font-black leading-tight text-[#252525] sm:text-[24px]"
                  >
                    قسم التعليم الإدراكي الأكاديمي
                  </h3>
                </div>
                <p class="text-[14px] font-medium leading-[1.9] text-[#746064]">
                  يُقدَّم قسم التعليم الإدراكي الأكاديمي ضمن برنامج الجلسات الفردية (العيادات)، ويُعد أحد الأقسام الأساسية الداعمة لنجاح برنامج الدمج الأكاديمي والاجتماعي في الروضات والمدارس، حيث يوجد رئيس قسم متفرغ لضبط الجودة ومتابعة العمل بالتنسيق مع باقي البرامج والأقسام المختلفة.
                </p>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                مخصص للأطفال الذين لديهم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>صعوبات تعلم أكاديمية أو إدراكية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>اضطرابات نمائية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>انخفاض بنسبة الذكاء مثل ذوي بطء التعلّم.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                أهداف القسم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تطوير المهارات الأكاديمية بما يتناسب مع القدرات الإدراكية الحقيقية لكل طفل.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>دعم التحصيل الدراسي داخل الصف المدرسي وفق المنهاج المعتمد.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تنمية المهارات الإدراكية اللازمة للتعلّم (الانتباه، الذاكرة، الفهم، التنظيم).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تمكين الطالب من الدمج الشامل والفعلي داخل الصف دون إقصاء أو تهميش.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تقليل الفجوة الأكاديمية بين الطالب وأقرانه.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>دعم انتقال الطالب التدريجي نحو الاستقلالية الأكاديمية.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                المهارات المستهدفة
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>أولاً: المهارات الأكاديمية مثل: (القراءة والكتابة والرياضيات حسب مستوى الطالب، متابعة الدروس الصفية وأداء الواجبات، أهداف المنهاج المدرسي).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>ثانياً: المهارات الإدراكية مثل: (الانتباه والتركيز داخل الصف، الذاكرة، الإدراك السمعي والبصري، الفهم والاستيعاب).</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                مميزات القسم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>دمج حقيقي مبني على التخطيط وليس التجربة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تعليم فردي دقيق مرتبط بالخطة الفردية للطالب ومستند على المنهاج المدرسي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>تنسيق فعّال بين الأكاديمية والمدرسة والأسرة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>متابعة مستمرة وتوثيق لتقدّم الطالب.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bp-1c6772">
                كيف نعمل؟
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>إجراء تقييم إدراكي وأكاديمي شامل لكل طالب مستند على منهاج عالمي مقنن وعلى المناهج المدرسية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>بناء خطة إدراكية أكاديمية لكل طالب اعتماداً على نتائج التقييم، شاملة لنقاط الضعف والقوة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>جلسات فردية لتدريب الطالب على أهداف الخطة من قبل معالجين ذوي خبرة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>توثيق يومي ورسومات بيانية توضح تطور الطفل بإتقانه أهداف الخطة.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bp-1c6772"></span>
                  <span>اتصالات يومية وأسبوعية وشهرية واجتماعات دورية مع الأهل.</span>
                </li>
              </ul>
            </div>
            </div>
          </article>

          <article
            id="pt"
            class="rounded-[22px] border border-[#E5DCDA] bg-white p-5 text-start shadow-[0_8px_22px_rgba(40,40,40,0.018)] sm:p-8"
          >
            <div
              class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(220px,300px)_1fr] md:items-center"
            >
              <div class="overflow-hidden rounded-[16px] bg-[#F6F3F2]">
                <img
                  src="./images/pt-room.jpg"
                  alt="قسم العلاج الطبيعي"
                  class="h-[220px] w-full object-cover md:h-[260px]"
                />
              </div>
              <div>
                <div class="mb-4 flex items-center gap-3">
                  <div
                    class="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-bs-b21553/10"
                  >
                    <img src="./images/therapeutic-departments4.svg" alt="" class="h-7 w-7" />
                  </div>
                  <h3
                    class="text-[20px] font-black leading-tight text-[#252525] sm:text-[24px]"
                  >
                    قسم العلاج الطبيعي
                  </h3>
                </div>
                <p class="text-[14px] font-medium leading-[1.9] text-[#746064]">
                  يهدف قسم العلاج الطبيعي لتطوير المهارات الحركية للأطفال المتأخرين حركياً منذ الأشهر الأولى، حيث نعمل على تحسين قوة العضلات والتوازن، وتحسين التناسق العصبي الحركي، وزيادة القدرة على الحركة والتنقل بأمان، ورفع مهارات الحياة اليومية، حيث يوجد رئيس قسم متفرغ لضبط الجودة ومتابعة العمل بالتنسيق مع باقي البرامج والأقسام المختلفة.
                </p>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bs-b21553">
                مخصص للأطفال الذين تظهر عليهم العلامات التالية
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تأخر في اكتساب المهارات الحركية مثل التقلب، الجلوس، المشي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>ضعف واضح في قوة العضلات.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>ارتخاء أو شد زائد بالجسم.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>صعوبة في التوازن أو كثرة السقوط.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>المشي على أطراف الأصابع.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>وضعيات غير طبيعية للجسم.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>مشاكل في التناسق الحركي (نوعية المشي والركض).</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bs-b21553">
                أهداف القسم
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تطوير المهارات الحركية الأساسية مثل: (التقلب، الجلوس، الوقوف، المشي والركض، وصعود الدرج).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تحسين التوازن والتناسق الحركي.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>زيادة قوة العضلات والقدرة على التحمل خلال النشاطات اليومية.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>تصحيح قوام الجسم وتعزيز الاستقلالية في الأنشطة الحركية اليومية.</span>
                </li>
              </ul>
            </div>
            <div class="rounded-[12px] bg-[#FCF9F8] px-4 py-4">
              <p class="mb-3 text-[13px] font-extrabold text-bs-b21553">
                كيف نعمل؟ نعمل على أكثر الطرق المعتمدة عالمياً مثل
              </p>
              <ul class="space-y-2 text-[12.5px] font-bold leading-[1.75] text-[#343434]">
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>طريقة بوباث (Bobath).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>طريقة الثيراسوت (البذلة الفضائية).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>نظام البكرات (Pulley System).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>نظام السبايدر (Spider System).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-bs-b21553"></span>
                  <span>نظام عزل الجاذبية (Suspension System).</span>
                </li>
              </ul>
            </div>
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
                class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-bp-1c6772 text-[18px] font-black text-white"
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
                  نبدأ بالتقييم الشامل لكافة الجوانب النمائية لدى الطفل
                  (السلوكي، الحركي، المعرفي، التواصلي، مهارات الحياة اليومية)
                  من قبل فريق متكامل التخصصات لتحديد قدراته واحتياجاته بدقة.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 sm:gap-[22px]">
              <div
                class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-bp-1c6772 text-[18px] font-black text-white"
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
                  خطة مخصصة لكل طفل بأهداف واضحة وقابلة للقياس (قصيرة وطويلة
                  المدى) واستراتيجيات مناسبة لقدراته، مع إشراك الأسرة وأخذ
                  موافقتهم عليها قبل تنفيذها.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 sm:gap-[22px]">
              <div
                class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-bp-1c6772 text-[18px] font-black text-white"
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
                  رصد يومي لأداء الطفل، ومراجعة دورية للأهداف، وتقرير أسبوعي
                  وشهري ودوري لكل طفل مع رسوم بيانية توضح تقدّمه في كل مهارة.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <article
            class="rounded-[22px] bg-white p-6 text-start shadow-[0_8px_20px_rgba(40,40,40,0.018)]"
          >
            <div class="mb-5 text-bp-1c6772">
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
            <div class="mb-5 text-bs-b21553">
              <img src="./images/icon-measure.svg" alt="" class="h-8 w-8" />
            </div>
            <h3 class="mb-2 text-[18px] font-black text-[#252525]">
              رسوم بيانية
            </h3>
            <p class="text-[12px] font-medium leading-relaxed text-[#746064]">
              توضح مستوى التقدّم في كل مهارة تم تدريب الطفل عليها
            </p>
          </article>

          <article
            class="relative overflow-hidden rounded-[22px] bg-bp-1c6772 p-6 text-start text-white sm:col-span-2"
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
              نماذج العمل والتطبيق العملي
            </h3>
            <p class="text-[14px] font-medium leading-relaxed text-white/82">
              نماذج التوثيق والمتابعة (DTT / Tracking)، ونماذج رصد المشاكل
              السلوكية، وأوراق العمل للأهداف المستهدفة بالتدريب، ونماذج من
              الأنشطة التطبيقية مع الطفل.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="w-full bg-[#FCF9F8] py-14 sm:py-20">
      <div class="mx-auto max-w-[1024px] px-4 sm:px-6 lg:px-8">
        <div
          class="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-bs-c51a58 to-bs-d73572 px-5 py-14 text-center text-white sm:rounded-[34px] sm:px-10 sm:py-16 lg:rounded-[40px] lg:px-16"
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
                class="inline-flex h-[56px] items-center justify-center rounded-[18px] bg-white px-8 text-[16px] font-black text-bs-c91f5f sm:h-[64px] sm:px-10 sm:text-[18px]"
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
