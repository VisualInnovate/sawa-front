const fs = require('fs');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) {
        console.log('File not found: ' + filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    } else {
        console.log('No changes in ' + filePath);
    }
}

// 1. bonus/index.vue
replaceInFile('src/views/hr/bonus/index.vue', [
    [/(<h2 class="text-2xl font-bold">)\{\{ \$t\("Employee Bonuses"\) \}\}(<\/h2>)/, "$1{{ $t('Employee_Bonuses') }}$2"]
]);

// 2. departments/index.vue
replaceInFile('src/views/hr/departments/index.vue', [
    [/(<h2 class="text-2xl font-bold">)\{\{ \$t\("Departments"\) \}\}(<\/h2>)/, "$1{{ $t('departments') }}$2"]
]);

// 3. Employees/daily_attendance.vue
replaceInFile('src/views/hr/Employees/daily_attendance.vue', [
    [/:header='\$t\("Employee"\)'/, ":header=\"$t('Employee')\""],
    [/:header='\$t\("Date"\)'/, ":header=\"$t('Date')\""],
    [/:header='\$t\("Clock In"\)'/, ":header=\"$t('clock_in')\""],
    [/:header='\$t\("Clock Out"\)'/, ":header=\"$t('clock_out')\""],
    [/:header='\$t\("Status"\)'/, ":header=\"$t('status')\""],
    [/:header='\$t\("Hours"\)'/, ":header=\"$t('hours')\""],
    [/:header='\$t\("Late \(h\)"\)'/, ":header=\"$t('late_h')\""],
    [/:header='\$t\("Early Leave \(h\)"\)'/, ":header=\"$t('early_leave_h')\""]
]);

// 4. site/Settings.vue
replaceInFile('src/views/site/Settings.vue', [
    [/Site Name/g, "{{ $t('Site_Name') }}"],
    [/Site Phone/g, "{{ $t('Site_Phone') }}"],
    [/address/g, "{{ $t('address') }}"],
    [/Site description/g, "{{ $t('Site_description') }}"],
    [/Site Email/g, "{{ $t('Site_Email') }}"],
    [/facebook/g, "{{ $t('facebook') }}"],
    [/Twitter/g, "{{ $t('Twitter') }}"],
    [/youtube/g, "{{ $t('youtube') }}"],
    [/Instagram/g, "{{ $t('Instagram') }}"],
    [/Site Cover/g, "{{ $t('Site_Cover') }}"],
    [/Site Logo/g, "{{ $t('Site_Logo') }}"]
]);

// 5. SideProfile/Index.vue
replaceInFile('src/views/SideProfile/Index.vue', [
    [/Side Profiles/g, "{{ $t('Side_Profiles') }}"],
    [/Actions/g, "{{ $t('Actions') }}"],
    [/Profile Title/g, "{{ $t('Profile_Title') }}"],
    [/Create a new side profile to get started/g, "{{ $t('Create_a_new_side_profile_to_get_started') }}"]
]);

// 6. children/Index.vue
replaceInFile('src/views/children/Index.vue', [
    [/Children Management/g, "{{ $t('Children_Management') }}"],
    [/CHILD NAME/g, "{{ $t('CHILD_NAME') }}"],
    [/BIRTH DATE/g, "{{ $t('BIRTH_DATE') }}"]
]);

