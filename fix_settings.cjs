const fs = require('fs');

function fixSettingsVue() {
    let filePath = 'src/views/site/Settings.vue';
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the incorrectly keyed translations with the correct ones added to ar.js
    content = content.replace(/\$t\('Site Name '\)/g, "$t('Site_Name')");
    content = content.replace(/\$t\("Site Name "\)/g, "$t('Site_Name')");

    content = content.replace(/\$t\('Site Phone'\)/g, "$t('Site_Phone')");
    content = content.replace(/\$t\("Site Phone"\)/g, "$t('Site_Phone')");

    content = content.replace(/\$t\('address '\)/g, "$t('address')");
    content = content.replace(/\$t\("address "\)/g, "$t('address')");

    content = content.replace(/\$t\('Site Email '\)/g, "$t('Site_Email')");
    content = content.replace(/\$t\("Site Email "\)/g, "$t('Site_Email')");

    content = content.replace(/\$t\('Site description '\)/g, "$t('Site_description')");
    content = content.replace(/\$t\("Site description "\)/g, "$t('Site_description')");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Settings.vue updated.");
}

function appendKey(filePath, isAr) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newKey = isAr ? `  save_changes: "حفظ التغيرات",\n` : `  save_changes: "Save Changes",\n`;
    
    if(!content.includes("save_changes: ")) {
        const lastBraceIndex = content.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            content = content.substring(0, lastBraceIndex) + newKey + content.substring(lastBraceIndex);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Added save_changes to " + filePath);
        }
    }
}

fixSettingsVue();
appendKey('src/locales/ar.js', true);
appendKey('src/locales/en.js', false);
