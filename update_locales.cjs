const fs = require('fs');

function addKeys(file, isAr) {
    let content = fs.readFileSync(file, 'utf8');
    const newKeys = isAr ? `
  clock_in: "تسجيل الدخول",
  clock_out: "تسجيل الخروج",
  status: "الحالة",
  hours: "الساعات",
  late_h: "تأخير (ساعات)",
  early_leave_h: "خروج مبكر (ساعات)",
  no_records_found: "لا توجد سجلات",
  no_departments_found: "لا توجد أقسام",
  no_official_leaves_found: "لا توجد إجازات رسمية",
  Employee_Bonuses: "مكافآت الموظفين",
  Employee: "الموظف",
  Date: "التاريخ",
  Side_Profiles: "الملفات الجانبية",
  Actions: "الإجراءات",
  Profile_Title: "عنوان الملف",
  Children_Management: "إدارة الأطفال",
  CHILD_NAME: "اسم الطفل",
  BIRTH_DATE: "تاريخ الميلاد",
  Site_Name: "اسم الموقع",
  Site_Phone: "هاتف الموقع",
  address: "العنوان",
  Site_description: "وصف الموقع",
  Site_Email: "البريد الإلكتروني للموقع",
  Site_Cover: "غلاف الموقع",
  Site_Logo: "شعار الموقع",
  facebook: "فيسبوك",
  Twitter: "تويتر",
  youtube: "يوتيوب",
  Instagram: "إنستغرام",
  Create_a_new_side_profile_to_get_started: "أنشئ ملفاً جانبياً جديداً للبدء"
` : `
  clock_in: "Clock In",
  clock_out: "Clock Out",
  status: "Status",
  hours: "Hours",
  late_h: "Late (h)",
  early_leave_h: "Early Leave (h)",
  no_records_found: "No records found",
  no_departments_found: "No departments found",
  no_official_leaves_found: "No official leaves found",
  Employee_Bonuses: "Employee Bonuses",
  Employee: "Employee",
  Date: "Date",
  Side_Profiles: "Side Profiles",
  Actions: "Actions",
  Profile_Title: "Profile Title",
  Children_Management: "Children Management",
  CHILD_NAME: "CHILD NAME",
  BIRTH_DATE: "BIRTH DATE",
  Site_Name: "Site Name",
  Site_Phone: "Site Phone",
  address: "Address",
  Site_description: "Site Description",
  Site_Email: "Site Email",
  Site_Cover: "Site Cover",
  Site_Logo: "Site Logo",
  facebook: "facebook",
  Twitter: "Twitter",
  youtube: "youtube",
  Instagram: "Instagram",
  Create_a_new_side_profile_to_get_started: "Create a new side profile to get started"
`;

    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        content = content.substring(0, lastBraceIndex) + newKeys + content.substring(lastBraceIndex);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added keys to ' + file);
    }
}

addKeys('src/locales/ar.js', true);
addKeys('src/locales/en.js', false);
