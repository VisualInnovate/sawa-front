const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const vueFiles = [];
walk('src/views', (filePath) => {
    if (filePath.endsWith('.vue')) {
        vueFiles.push(filePath);
    }
});

let modifiedFiles = 0;

for (const file of vueFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    content = content.replace(/summary:\s*['"]Successful['"]/g, "summary: t('success_message')");
    content = content.replace(/detail:\s*['"]Successful['"]/g, "detail: t('successful')");
    
    content = content.replace(/summary:\s*['"]Success Message['"]/g, "summary: t('success_message')");
    content = content.replace(/detail:\s*['"]Success['"]/g, "detail: t('successful')");
    content = content.replace(/detail:\s*['"]Message Content['"]/g, "detail: t('successful')");
    
    content = content.replace(/header="Confirm"/g, ':header="$t(\'confirm\')"');
    content = content.replace(/<title>Leaves Report<\/title>/g, "<title>${t('leaves_report')}</title>");
    content = content.replace(/<h1>Leaves Report<\/h1>/g, "<h1>${t('leaves_report')}</h1>");
    content = content.replace(/Generated on \$\{new Date\(\)\.toLocaleString\(\)\}/g, "${t('generated_on')} ${new Date().toLocaleString()}");

    // Replace <p class="text-xl">No records found</p>
    content = content.replace(/<p class="text-xl">No records found<\/p>/g, "<p class=\"text-xl\">{{ $t('no_records_found') }}</p>");

    // Fix this.$t for Options API
    if (content.includes('export default {') && !content.includes('<script setup>')) {
        content = content.replace(/t\('success_message'\)/g, "this.$t('success_message')");
        content = content.replace(/t\('successful'\)/g, "this.$t('successful')");
    } else {
        // script setup
        if ((content.includes("t('success_message')") || content.includes("t('successful')")) && !content.includes("useI18n")) {
            content = content.replace(/<script setup( lang="ts")?>/, "<script setup$1>\nimport { useI18n } from 'vue-i18n';");
            content = content.replace(/(import .*from 'vue-i18n';?)/, "$1\nconst { t } = useI18n();");
        }
    }

    // Paginator
    content = content.replace(/current-page-report-template="Showing \{first\} to \{last\} of \{totalRecords\} (products|records|users|entries|devices)"/g, 
        ":current-page-report-template=\"\\`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('$1')}\\`\"");

    content = content.replace(/currentPageReportTemplate="Showing \{first\} to \{last\} of \{totalRecords\} (products|records|users|entries|devices)"/g, 
        ":currentPageReportTemplate=\"\\`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('$1')}\\`\"");

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFiles++;
        console.log('Updated: ' + file);
    }
}
console.log('Total files modified: ' + modifiedFiles);
