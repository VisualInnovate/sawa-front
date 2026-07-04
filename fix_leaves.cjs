const fs = require('fs');

function appendKey(filePath, isAr) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newKeys = isAr ? 
        `  leaves_list: "قائمة المغادرات",\n  leave_type: "نوع المغادرة",\n` : 
        `  leaves_list: "Leaves List",\n  leave_type: "Leave Type",\n`;
    
    if(!content.includes("leaves_list: ")) {
        const lastBraceIndex = content.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            content = content.substring(0, lastBraceIndex) + newKeys + content.substring(lastBraceIndex);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Added keys to " + filePath);
        }
    }
}

function fixLeavesVue() {
    let filePath = 'src/views/hr/leave/Leaves/index.vue';
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/\$t\("Leaves List"\)/g, "$t('leaves_list')");
    content = content.replace(/\$t\('Leaves List'\)/g, "$t('leaves_list')");

    content = content.replace(/\$t\("Employee Name"\)/g, "$t('employee_name')");
    content = content.replace(/\$t\('Employee Name'\)/g, "$t('employee_name')");

    content = content.replace(/\$t\("Request Reason"\)/g, "$t('request_reason')");
    content = content.replace(/\$t\('Request Reason'\)/g, "$t('request_reason')");

    content = content.replace(/\$t\("Leave Type"\)/g, "$t('leave_type')");
    content = content.replace(/\$t\('Leave Type'\)/g, "$t('leave_type')");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated " + filePath);
}

appendKey('src/locales/ar.js', true);
appendKey('src/locales/en.js', false);
fixLeavesVue();
