const fs = require('fs');

function extractSections(content) {
  const lines = content.split('\n');
  const sections = [];

  for (const [index, line] of lines.entries()) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)[0].length;
      const title = trimmedLine.replace(/^#+\s*/, '').trim();
      sections.push({ level, title, line: index + 1 });
    }
  }

  return sections;
}

function compareStructures(file1, file2, content1, content2) {
  const sections1 = extractSections(content1);
  const sections2 = extractSections(content2);

  console.log(`\n=== ${file1} vs ${file2} ===`);
  console.log(`${file1}: ${sections1.length} sections`);
  console.log(`${file2}: ${sections2.length} sections`);

  const maxLength = Math.max(sections1.length, sections2.length);

  for (const index of Array.from({ length: maxLength }, (_, i) => i)) {
    const s1 = sections1[index];
    const s2 = sections2[index];

    if (!s1) {
      console.log(`❌ Missing in ${file1}: ${s2.level === 1 ? '#' : '##'.repeat(s2.level)} ${s2.title}`);
    } else if (!s2) {
      console.log(`❌ Missing in ${file2}: ${s1.level === 1 ? '#' : '##'.repeat(s1.level)} ${s1.title}`);
    } else if (s1.level !== s2.level || s1.title !== s2.title) {
      console.log(`⚠️  Structure mismatch:`);
      console.log(`   ${file1}: ${'#'.repeat(s1.level)} ${s1.title}`);
      console.log(`   ${file2}: ${'#'.repeat(s2.level)} ${s2.title}`);
    } else {
      console.log(`✅ Match: ${'#'.repeat(s1.level)} ${s1.title}`);
    }
  }
}

// ファイルを読み込んで比較
const files = [
  ['../README.md', '../README-jp.md'],
  ['../packages/specment/README.md', '../packages/specment/README-jp.md'],
  ['../apps/website/README-specment.md', '../apps/website/README-specment-jp.md']
];

for (const [file1, file2] of files) {
  try {
    const content1 = fs.readFileSync(file1, 'utf8');
    const content2 = fs.readFileSync(file2, 'utf8');
    compareStructures(file1, file2, content1, content2);
  } catch (error) {
    console.log(`❌ Error reading files ${file1} or ${file2}: ${error.message}`);
  }
}