<template>
    <main class="w-full overflow-x-hidden bg-[#FCF9F8] text-[#242424]" dir="rtl">
        <!-- Hero Section -->
        <section class="relative w-full overflow-hidden bg-[#F6F3F2]">
            <div class="pointer-events-none absolute right-[-70px] top-[-90px] hidden h-[260px] w-[260px] rounded-full bg-[#DDE6E4] sm:block"></div>
            <div class="pointer-events-none absolute left-[-82px] bottom-[-84px] hidden h-[250px] w-[250px] rounded-full bg-[#F3DCE5] sm:block"></div>

            <div
                class="relative mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[820px] lg:flex-row lg:gap-[80px] lg:px-10 lg:py-20">
                <div class="flex w-full max-w-[560px] flex-col items-start text-right">
                    <h1 class="mb-6 text-right text-[36px] font-black leading-[1.12] tracking-normal sm:mb-8 sm:text-[48px] lg:text-[64px] lg:leading-[1.08]">
                        <span class="block text-[#1D7780]">نحو دمج حقيقي</span>
                        <span class="block text-[#C91F5F]">واستقلالية</span>
                        <span class="block text-[#C91F5F]">مستدامة</span>
                    </h1>

                    <p class="mb-8 max-w-[500px] text-[15px] font-medium leading-[1.9] text-[#746064] sm:text-[16px] lg:mb-[38px] lg:text-[17px]">
                        نعمل في سوا على تأهيل الطفل للوصول إلى أقصى درجات الاستقلالية
                        ودمجه بثقة وفاعلية في المجتمع والبيئات التعليمية.
                    </p>

                    <div class="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-[18px]">
                        <a href="#"
                            class="inline-flex h-[50px] w-full min-w-[142px] items-center justify-center rounded-full bg-[#C91F5F] px-6 text-[14px] font-extrabold text-white sm:h-[52px] sm:w-auto sm:px-[28px] sm:text-[15px]">
                            احجز تقييم الآن
                        </a>

                        <a href="#"
                            class="inline-flex h-[50px] w-full min-w-[132px] items-center justify-center rounded-full border-2 border-[#1D7780] px-6 text-[14px] font-extrabold text-[#1D7780] sm:h-[52px] sm:w-auto sm:px-[26px] sm:text-[15px]">
                            تواصل معنا
                        </a>
                    </div>
                </div>
                <div
                    class="h-[260px] w-full max-w-[610px] overflow-hidden rounded-[16px] bg-white shadow-[0_10px_30px_rgba(20,20,20,0.04)] sm:h-[380px] sm:rounded-[20px] lg:h-[520px]">
                    <img src="./images/integration-hero.png" alt="Integration hero"
                        class="h-full w-full object-cover" />
                </div>
            </div>
        </section>

        <!-- Intro Text Section -->
        <section class="w-full bg-white py-12 sm:py-16 lg:py-[92px]">
            <div class="mx-auto flex max-w-[780px] flex-col items-center px-4 text-center sm:px-6 lg:px-8">
                <div
                    class="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-[#A7EBF6] text-[#1D7780] sm:mb-[34px] sm:h-[56px] sm:w-[56px]">
                    <svg class="h-[29px] w-[29px]" viewBox="0 0 24 24" fill="none">
                        <path d="M7.5 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor"
                            stroke-width="2.1" />
                        <path d="M16.5 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor"
                            stroke-width="2.1" />
                        <path d="M12 10a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 12 10Z" stroke="currentColor"
                            stroke-width="2.1" />
                        <path d="M4.5 18.5c.5-2.4 1.9-4 4-4s3.5 1.6 4 4" stroke="currentColor" stroke-width="2.1"
                            stroke-linecap="round" />
                        <path d="M11.5 18.5c.6-2.4 2-4 4.2-4s3.7 1.6 4.3 4" stroke="currentColor" stroke-width="2.1"
                            stroke-linecap="round" />
                    </svg>
                </div>

                <p class="text-[17px] font-bold leading-[1.75] text-[#6C5C60] sm:text-[20px] sm:leading-[1.65] lg:text-[22px] lg:leading-[1.55]">
                    يقدم برنامج الدمج للأطفال ذوي صعوبات التعلم والتحديات الإدراكية
                    والأكاديمية، بهدف تحسين المهارات التي تساعدهم داخل الأكاديمية في
                    بيئات حقيقية مثل الروضات والمدارس.
                </p>
            </div>
        </section>

        <!-- Program Section -->
        <section class="w-full bg-[#FCF9F8] py-12 sm:py-16 lg:py-[96px]">
            <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <div class="mb-8 text-right sm:mb-10 lg:mb-[56px]">
                    <h2 class="mb-[12px] text-[26px] font-black leading-tight text-[#1D7780] sm:text-[30px] lg:text-[34px]">
                        برنامج الدمج في الروضات والمدارس
                    </h2>
                    <p class="text-[14px] font-medium leading-relaxed text-[#8A787B] sm:text-[15px]">
                        أكاديمياً واجتماعياً: رحلة مدروسة لكل خطوة
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(300px,368px)_1fr] lg:gap-[32px]">
                    <!-- Goals Card -->
                    <article
                        class="rounded-[18px] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(40,40,40,0.025)] sm:rounded-[20px] sm:px-[34px] sm:py-[38px]">
                        <h3 class="mb-6 text-[18px] font-black text-[#C91F5F] sm:mb-[30px] sm:text-[20px]">
                            أهدافنا الرئيسية
                        </h3>

                        <ul class="space-y-5 text-[13px] font-bold leading-[1.8] text-[#3D3D3D] sm:space-y-[25px] sm:text-[13.5px] sm:leading-[1.7]">
                            <li class="flex items-start gap-[12px]">
                                <span
                                    class="mt-[4px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#1D7780] text-[#1D7780]">
                                    <svg class="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="3"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                وجود الطفل بالبيئة الأقل تقييداً مثل
                                الروضة والمدرسة
                            </li>

                            <li class="flex items-start gap-[12px]">
                                <span
                                    class="mt-[4px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#1D7780] text-[#1D7780]">
                                    <svg class="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="3"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                المشاركة الصحيحة بالأنشطة المنهجية
                                واللامنهجية
                            </li>

                            <li class="flex items-start gap-[12px]">
                                <span
                                    class="mt-[4px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#1D7780] text-[#1D7780]">
                                    <svg class="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="3"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                تكوين الصداقات وبناء العلاقات
                                الاجتماعية
                            </li>

                            <li class="flex items-start gap-[12px]">
                                <span
                                    class="mt-[4px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#1D7780] text-[#1D7780]">
                                    <svg class="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="3"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                تطوير التفاعل الاجتماعي والمهارات
                                الأكاديمية
                            </li>

                            <li class="flex items-start gap-[12px]">
                                <span
                                    class="mt-[4px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#1D7780] text-[#1D7780]">
                                    <svg class="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 12.5l3.8 3.8L18 8" stroke="currentColor" stroke-width="3"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                تقليل الدعم تدريجياً للوصول
                                للاستقلالية
                            </li>
                        </ul>
                    </article>

                    <!-- Feature Cards -->
                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-[28px]">
                        <article class="rounded-[18px] bg-[#F7F4F3] px-5 py-7 sm:rounded-[20px] sm:px-[32px] sm:py-10 lg:py-12">
                            <div class="mb-5 text-[#C91F5F] sm:mb-[28px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="30" viewBox="0 0 27 30"
                                    fill="none">
                                    <path
                                        d="M3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V6C0 5.175 0.29375 4.46875 0.88125 3.88125C1.46875 3.29375 2.175 3 3 3H9.3C9.65 2.1 10.2 1.375 10.95 0.825C11.7 0.275 12.55 0 13.5 0C14.45 0 15.3 0.275 16.05 0.825C16.8 1.375 17.35 2.1 17.7 3H24C24.825 3 25.5312 3.29375 26.1187 3.88125C26.7062 4.46875 27 5.175 27 6V27C27 27.825 26.7062 28.5312 26.1187 29.1187C25.5312 29.7062 24.825 30 24 30H3ZM13.5 4.875C13.825 4.875 14.0938 4.76875 14.3062 4.55625C14.5187 4.34375 14.625 4.075 14.625 3.75C14.625 3.425 14.5187 3.15625 14.3062 2.94375C14.0938 2.73125 13.825 2.625 13.5 2.625C13.175 2.625 12.9062 2.73125 12.6938 2.94375C12.4813 3.15625 12.375 3.425 12.375 3.75C12.375 4.075 12.4813 4.34375 12.6938 4.55625C12.9062 4.76875 13.175 4.875 13.5 4.875ZM3 25.275C4.35 23.95 5.91875 22.9062 7.70625 22.1437C9.49375 21.3812 11.425 21 13.5 21C15.575 21 17.5063 21.3812 19.2938 22.1437C21.0813 22.9062 22.65 23.95 24 25.275V6H3V25.275ZM13.5 18C14.95 18 16.1875 17.4875 17.2125 16.4625C18.2375 15.4375 18.75 14.2 18.75 12.75C18.75 11.3 18.2375 10.0625 17.2125 9.0375C16.1875 8.0125 14.95 7.5 13.5 7.5C12.05 7.5 10.8125 8.0125 9.7875 9.0375C8.7625 10.0625 8.25 11.3 8.25 12.75C8.25 14.2 8.7625 15.4375 9.7875 16.4625C10.8125 17.4875 12.05 18 13.5 18ZM6 27H21C21 26.925 21 26.8625 21 26.8125C21 26.7625 21 26.7 21 26.625C19.95 25.75 18.7875 25.0938 17.5125 24.6562C16.2375 24.2188 14.9 24 13.5 24C12.1 24 10.7625 24.2188 9.4875 24.6562C8.2125 25.0938 7.05 25.75 6 26.625C6 26.7 6 26.7625 6 26.8125C6 26.8625 6 26.925 6 27ZM13.5 15C12.875 15 12.3438 14.7812 11.9062 14.3438C11.4688 13.9062 11.25 13.375 11.25 12.75C11.25 12.125 11.4688 11.5938 11.9062 11.1562C12.3438 10.7188 12.875 10.5 13.5 10.5C14.125 10.5 14.6562 10.7188 15.0938 11.1562C15.5312 11.5938 15.75 12.125 15.75 12.75C15.75 13.375 15.5312 13.9062 15.0938 14.3438C14.6562 14.7812 14.125 15 13.5 15Z"
                                        fill="#B21553" />
                                </svg>
                            </div>
                            <h3 class="mb-3 text-[17px] font-black text-[#2D2D2D] sm:mb-[16px] sm:text-[18px]">
                                تقييم فردي شامل
                            </h3>
                            <p class="text-[13px] font-medium leading-[1.8] text-[#75686B] sm:leading-[1.7]">
                                تحليل دقيق لقدرات كل طالب واحتياجاته الخاصة
                                قبل البدء.
                            </p>
                        </article>

                        <article class="rounded-[18px] bg-[#F7F4F3] px-5 py-7 sm:rounded-[20px] sm:px-[32px] sm:py-10 lg:py-12">
                            <div class="mb-5 text-[#C91F5F] sm:mb-[28px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"
                                    fill="none">
                                    <path
                                        d="M21 19.5C19.75 19.5 18.6875 19.0625 17.8125 18.1875C16.9375 17.3125 16.5 16.25 16.5 15C16.5 13.75 16.9375 12.6875 17.8125 11.8125C18.6875 10.9375 19.75 10.5 21 10.5C22.25 10.5 23.3125 10.9375 24.1875 11.8125C25.0625 12.6875 25.5 13.75 25.5 15C25.5 16.25 25.0625 17.3125 24.1875 18.1875C23.3125 19.0625 22.25 19.5 21 19.5ZM21 16.5C21.425 16.5 21.7812 16.3563 22.0688 16.0688C22.3563 15.7812 22.5 15.425 22.5 15C22.5 14.575 22.3563 14.2188 22.0688 13.9312C21.7812 13.6437 21.425 13.5 21 13.5C20.575 13.5 20.2188 13.6437 19.9312 13.9312C19.6437 14.2188 19.5 14.575 19.5 15C19.5 15.425 19.6437 15.7812 19.9312 16.0688C20.2188 16.3563 20.575 16.5 21 16.5ZM12 30V25.65C12 25.125 12.125 24.6313 12.375 24.1688C12.625 23.7063 12.975 23.3375 13.425 23.0625C14.225 22.5875 15.0688 22.1938 15.9563 21.8813C16.8438 21.5688 17.75 21.3375 18.675 21.1875L21 24L23.325 21.1875C24.25 21.3375 25.15 21.5688 26.025 21.8813C26.9 22.1938 27.7375 22.5875 28.5375 23.0625C28.9875 23.3375 29.3438 23.7063 29.6063 24.1688C29.8688 24.6313 30 25.125 30 25.65V30H12ZM14.9625 27H19.575L17.55 24.525C17.1 24.65 16.6625 24.8125 16.2375 25.0125C15.8125 25.2125 15.3875 25.425 14.9625 25.65V27ZM22.425 27H27V25.65C26.6 25.4 26.1875 25.1812 25.7625 24.9937C25.3375 24.8062 24.9 24.65 24.45 24.525L22.425 27ZM3 27C2.175 27 1.46875 26.7062 0.88125 26.1187C0.29375 25.5312 0 24.825 0 24V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H24C24.825 0 25.5312 0.29375 26.1187 0.88125C26.7062 1.46875 27 2.175 27 3V10.5C26.6 10 26.1625 9.525 25.6875 9.075C25.2125 8.625 24.65 8.325 24 8.175V3H3V24H9.225C9.15 24.275 9.09375 24.55 9.05625 24.825C9.01875 25.1 9 25.375 9 25.65V27H3ZM6 9H16.5C17.15 8.5 17.8625 8.125 18.6375 7.875C19.4125 7.625 20.2 7.5 21 7.5V6H6V9ZM6 15H13.5C13.5 14.475 13.5562 13.9625 13.6687 13.4625C13.7812 12.9625 13.9375 12.475 14.1375 12H6V15ZM6 21H11.175C11.45 20.775 11.7437 20.575 12.0562 20.4C12.3687 20.225 12.6875 20.0625 13.0125 19.9125V18H6V21ZM3 24V3V8.1375C3 7.9375 3 7.78125 3 7.66875C3 7.55625 3 7.5 3 7.5C3 7.5 3 8.23125 3 9.69375C3 11.1562 3 12.925 3 15C3 15.7 3 16.4 3 17.1C3 17.8 3 18.5 3 19.2C3 19.4 3 19.6125 3 19.8375C3 20.0625 3 20.275 3 20.475C3 21.05 3 21.6375 3 22.2375C3 22.8375 3 23.425 3 24Z"
                                        fill="#B21553" />
                                </svg>
                            </div>
                            <h3 class="mb-3 text-[17px] font-black text-[#2D2D2D] sm:mb-[16px] sm:text-[18px]">
                                خطة تربوية فردية (IEP)
                            </h3>
                            <p class="text-[13px] font-medium leading-[1.8] text-[#75686B] sm:leading-[1.7]">
                                تصميم مسار تعليمي خاص يتناسب مع وتيرة تطور
                                الطفل.
                            </p>
                        </article>

                        <article class="rounded-[18px] bg-[#F7F4F3] px-5 py-7 sm:rounded-[20px] sm:px-[32px] sm:py-10 lg:py-12">
                            <div class="mb-5 text-[#C91F5F] sm:mb-[28px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="23" viewBox="0 0 33 23"
                                    fill="none">
                                    <path
                                        d="M16.5 18C18.375 18 19.9688 17.3438 21.2812 16.0312C22.5938 14.7188 23.25 13.125 23.25 11.25C23.25 9.375 22.5938 7.78125 21.2812 6.46875C19.9688 5.15625 18.375 4.5 16.5 4.5C14.625 4.5 13.0312 5.15625 11.7188 6.46875C10.4062 7.78125 9.75 9.375 9.75 11.25C9.75 13.125 10.4062 14.7188 11.7188 16.0312C13.0312 17.3438 14.625 18 16.5 18ZM16.5 15.3C15.375 15.3 14.4188 14.9062 13.6313 14.1187C12.8438 13.3312 12.45 12.375 12.45 11.25C12.45 10.125 12.8438 9.16875 13.6313 8.38125C14.4188 7.59375 15.375 7.2 16.5 7.2C17.625 7.2 18.5812 7.59375 19.3687 8.38125C20.1562 9.16875 20.55 10.125 20.55 11.25C20.55 12.375 20.1562 13.3312 19.3687 14.1187C18.5812 14.9062 17.625 15.3 16.5 15.3ZM16.5 22.5C12.85 22.5 9.525 21.4813 6.525 19.4438C3.525 17.4062 1.35 14.675 0 11.25C1.35 7.825 3.525 5.09375 6.525 3.05625C9.525 1.01875 12.85 0 16.5 0C20.15 0 23.475 1.01875 26.475 3.05625C29.475 5.09375 31.65 7.825 33 11.25C31.65 14.675 29.475 17.4062 26.475 19.4438C23.475 21.4813 20.15 22.5 16.5 22.5ZM16.5 19.5C19.325 19.5 21.9188 18.7562 24.2812 17.2687C26.6437 15.7812 28.45 13.775 29.7 11.25C28.45 8.725 26.6437 6.71875 24.2812 5.23125C21.9188 3.74375 19.325 3 16.5 3C13.675 3 11.0813 3.74375 8.71875 5.23125C6.35625 6.71875 4.55 8.725 3.3 11.25C4.55 13.775 6.35625 15.7812 8.71875 17.2687C11.0813 18.7562 13.675 19.5 16.5 19.5Z"
                                        fill="#B21553" />
                                </svg>
                            </div>
                            <h3 class="mb-3 text-[17px] font-black text-[#2D2D2D] sm:mb-[16px] sm:text-[18px]">
                                إشراف ميداني
                            </h3>
                            <p class="text-[13px] font-medium leading-[1.8] text-[#75686B] sm:leading-[1.7]">
                                متابعة مباشرة داخل المدارس لضمان تنفيذ خطط
                                الدمج بكفاءة.
                            </p>
                        </article>

                        <article class="rounded-[18px] bg-[#F7F4F3] px-5 py-7 sm:rounded-[20px] sm:px-[32px] sm:py-10 lg:py-12">
                            <div class="mb-5 text-[#C91F5F] sm:mb-[28px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27"
                                    fill="none">
                                    <path
                                        d="M6 21H9V13.5H6V21ZM18 21H21V6H18V21ZM12 21H15V16.5H12V21ZM12 13.5H15V10.5H12V13.5ZM3 27C2.175 27 1.46875 26.7062 0.88125 26.1187C0.29375 25.5312 0 24.825 0 24V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H24C24.825 0 25.5312 0.29375 26.1187 0.88125C26.7062 1.46875 27 2.175 27 3V24C27 24.825 26.7062 25.5312 26.1187 26.1187C25.5312 26.7062 24.825 27 24 27H3ZM3 24H24V3H3V24ZM3 3V24V3Z"
                                        fill="#B21553" />
                                </svg>
                            </div>
                            <h3 class="mb-3 text-[17px] font-black text-[#2D2D2D] sm:mb-[16px] sm:text-[18px]">
                                تقارير دورية
                            </h3>
                            <p class="text-[13px] font-medium leading-[1.8] text-[#75686B] sm:leading-[1.7]">
                                تحديثات أسبوعية مفصلة للأهل حول التقدم
                                الملحوظ.
                            </p>
                        </article>

                    </div>
                </div>
            </div>
        </section>

        <!-- Steps Section -->
        <section class="w-full bg-[#F6F3F2] py-12 sm:py-16 lg:py-[88px]">
            <div class="mx-auto max-w-[1180px] px-4 text-center sm:px-6 lg:px-8">
                <h2 class="mb-[12px] text-[26px] font-black leading-tight text-[#1D7780] sm:text-[30px] lg:text-[34px]">
                    كيف نحقق الدمج؟
                </h2>
                <p class="mb-10 text-[14px] font-medium leading-relaxed text-[#8A787B] lg:mb-[78px]">
                    إشراف دائم لضمان الاستقرار
                </p>

                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-[42px]" dir="ltr">
                    <div class="flex flex-col items-center">
                        <div
                            class="mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#1D7780] text-[14px] font-black text-white sm:mb-[26px] sm:h-[58px] sm:w-[58px]">
                            5
                        </div>
                        <h3 class="mb-[10px] text-[16px] font-black leading-tight text-[#282828]">
                            دعم مستمر
                        </h3>
                        <p class="text-[12px] font-medium leading-[1.7] text-[#76686B]">
                            إشراف دائم للأهل والمدرسة
                        </p>
                    </div>

                    <div class="flex flex-col items-center">
                        <div
                            class="mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#C91F5F] text-[14px] font-black text-white sm:mb-[26px] sm:h-[58px] sm:w-[58px]">
                            4
                        </div>
                        <h3 class="mb-[10px] text-[16px] font-black leading-tight text-[#282828]">
                            انتقال تدريجي
                        </h3>
                        <p class="text-[12px] font-medium leading-[1.7] text-[#76686B]">
                            البدء الجزئي في المدرسة
                        </p>
                    </div>

                    <div class="flex flex-col items-center">
                        <div
                            class="mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#C91F5F] text-[14px] font-black text-white sm:mb-[26px] sm:h-[58px] sm:w-[58px]">
                            3
                        </div>
                        <h3 class="mb-[10px] text-[16px] font-black leading-tight text-[#282828]">
                            تعميم المهارات
                        </h3>
                        <p class="text-[12px] font-medium leading-[1.7] text-[#76686B]">
                            تطبيقها في بيئات متنوعة
                        </p>
                    </div>

                    <div class="flex flex-col items-center">
                        <div
                            class="mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#C91F5F] text-[14px] font-black text-white sm:mb-[26px] sm:h-[58px] sm:w-[58px]">
                            2
                        </div>
                        <h3 class="mb-[10px] text-[16px] font-black leading-tight text-[#282828]">
                            إتقان المهارات
                        </h3>
                        <p class="text-[12px] font-medium leading-[1.7] text-[#76686B]">
                            الوصول لمستوى التميز الأساسي
                        </p>
                    </div>

                    <div class="flex flex-col items-center">
                        <div
                            class="mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#C91F5F] text-[14px] font-black text-white sm:mb-[26px] sm:h-[58px] sm:w-[58px]">
                            1
                        </div>
                        <h3 class="mb-[10px] text-[16px] font-black leading-tight text-[#282828]">
                            تدريب الطفل
                        </h3>
                        <p class="text-[12px] font-medium leading-[1.7] text-[#76686B]">
                            داخل الأكاديمية لبناء المهارات
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Progress Section -->
        <section class="w-full bg-[#FCF9F8] py-12 sm:py-16 lg:py-[96px]">
            <div class="mx-auto flex max-w-[1180px] flex-col-reverse items-center justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:gap-[90px] lg:px-8" dir="ltr">
                <div class="relative h-[260px] w-full max-w-[610px] sm:h-[420px] lg:h-[600px]">
                    <div class="pointer-events-none absolute left-[-44px] top-[-54px] hidden h-[150px] w-[150px] rounded-full bg-[#F4DDE7] sm:block"></div>

                    <div class="relative h-full w-full overflow-hidden rounded-[16px] bg-white sm:rounded-[20px]">
                        <img src="./images/integration-progress.png" alt="Integration progress"
                            class="h-full w-full object-cover" />
                    </div>
                </div>

                <div dir="rtl" class="w-full max-w-[520px] text-right">
                    <h2 class="mb-5 text-[26px] font-black leading-tight text-[#1D7780] sm:text-[30px] lg:mb-[28px] lg:text-[34px]">
                        قياس التطور والتقدم
                    </h2>

                    <p class="mb-8 text-[15px] font-medium leading-[1.9] text-[#746064] sm:text-[16px] lg:mb-[50px] lg:text-[17px]">
                        نستخدم أدوات تقييم معيارية ومبتكرة لقياس مدى استجابة الطفل
                        وتطوره الأكاديمي والاجتماعي. يتم رصد النتائج بدقة لضمان أننا نسير
                        على الطريق الصحيح نحو الاستقلالية الكاملة.
                    </p>

                    <div class="space-y-5 sm:space-y-[24px]">
                        <div>
                            <div
                                class="mb-[9px] flex items-center justify-between gap-4 text-[12px] font-bold text-[#41383A] sm:text-[13px]">
                                <span>التفاعل الاجتماعي</span>
                                <span>85%</span>
                            </div>
                            <div class="h-[8px] w-full rounded-full bg-[#E6E2E1]">
                                <div class="h-full w-[85%] rounded-full bg-[#C91F5F]"></div>
                            </div>
                        </div>

                        <div>
                            <div
                                class="mb-[9px] flex items-center justify-between gap-4 text-[12px] font-bold text-[#41383A] sm:text-[13px]">
                                <span>الاستقلالية الأكاديمية</span>
                                <span>70%</span>
                            </div>
                            <div class="h-[8px] w-full rounded-full bg-[#E6E2E1]">
                                <div class="h-full w-[70%] rounded-full bg-[#1D7780]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Family Partnership -->
        <section class="w-full bg-[#1C6772] py-12 sm:py-16 lg:py-[86px]">
            <div class="mx-auto flex max-w-[1060px] flex-col items-center justify-evenly gap-8 px-4 text-center sm:px-6 lg:flex-row lg:gap-[80px] lg:px-8 lg:text-right">
                <div class="flex h-[128px] w-[128px] shrink-0 items-center justify-center rounded-[18px] bg-white/10 text-white sm:h-[150px] sm:w-[150px] lg:h-[170px] lg:w-[170px] lg:rounded-[20px]">
                    <svg class="h-[58px] w-[58px] sm:h-[64px] sm:w-[64px] lg:h-[72px] lg:w-[72px]" viewBox="0 0 24 24" fill="none">
                        <path d="M6 8h4v4H6V8Z" stroke="currentColor" stroke-width="2.2" />
                        <path d="M14 4h4v4h-4V4Z" stroke="currentColor" stroke-width="2.2" />
                        <path d="M14 16h4v4h-4v-4Z" stroke="currentColor" stroke-width="2.2" />
                        <path d="M10 10h2.5c1.5 0 2.5-1 2.5-2.5V8" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" />
                        <path d="M10 10h2.5c1.5 0 2.5 1 2.5 2.5V16" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" />
                    </svg>
                </div>

                <div class="max-w-[560px] text-white">
                    <h2 class="mb-5 text-[26px] font-black leading-tight sm:text-[30px] lg:mb-[26px] lg:text-[34px]">
                        شراكتنا مع العائلة
                    </h2>

                    <p class="text-[15px] leading-[1.9] text-white/85 sm:text-[16px]">
                        نؤمن بأن الأهل هم الشريك الأساسي في رحلة النجاح. نوفر برامج تمكين وتدريب
                        لأولياء الأمور لضمان استمرارية الدعم في المنزل، وتزويدهم بالأدوات اللازمة
                        للتعامل مع التحديات اليومية بثقة.
                    </p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="w-full bg-[#FCF9F8] py-14 sm:py-20 lg:py-[120px]">
            <div class="mx-auto max-w-[940px] px-4 text-center sm:px-6 lg:px-8">
                <h2 class="mb-5 text-[28px] font-black leading-[1.35] tracking-normal text-[#242424] sm:mb-[24px] sm:text-[34px] lg:text-[43px] lg:leading-[1.18]">
                    تمكين الطفل من النجاح داخل المجتمع<br class="hidden sm:block" />
                    والمدرسة بثقة واستقلالية
                </h2>

                <p class="mb-8 text-[17px] font-black leading-relaxed text-[#C91F5F] sm:mb-[44px] sm:text-[20px]">
                    إبدأ رحلة الدمج لطفلك اليوم
                </p>

                <div class="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-[24px]">
                    <a href="#"
                        class="inline-flex h-[52px] w-full min-w-[170px] items-center justify-center rounded-full bg-[#C91F5F] px-7 text-[15px] font-extrabold text-white sm:h-[58px] sm:w-auto sm:px-[34px] sm:text-[16px]">
                        سجل طفلك الآن
                    </a>

                    <a href="#"
                        class="inline-flex h-[52px] w-full min-w-[165px] items-center justify-center rounded-full border-2 border-[#1D7780] px-7 text-[15px] font-extrabold text-[#1D7780] sm:h-[58px] sm:w-auto sm:px-[34px] sm:text-[16px]">
                        تواصل معنا
                    </a>
                </div>
            </div>
        </section>
    </main>
</template>
