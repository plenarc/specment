const fs = require('fs');

function extractContent(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;

  for (const [index, line] of lines.entries()) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const level = trimmedLine.match(/^#+/)[0].length;
      const title = trimmedLine.replace(/^#+\s*/, '').trim();
      currentSection = { level, title, content: [], line: index + 1 };
    } else if (currentSection && trimmedLine) {
      currentSection.content.push(trimmedLine);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

function checkTranslationCompleteness(file1, file2, content1, content2) {
  const sections1 = extractContent(content1);
  const sections2 = extractContent(content2);

  console.log(`\n=== ${file1} vs ${file2} 翻訳完全性チェック ===`);

  // セクション数の比較
  if (sections1.length !== sections2.length) {
    console.log(`❌ セクション数が不一致: ${file1}=${sections1.length}, ${file2}=${sections2.length}`);
    return;
  }

  let missingTranslations = 0;
  let emptyTranslations = 0;

  for (const [index, s1] of sections1.entries()) {
    const s2 = sections2[index];

    // レベルの一致確認
    if (s1.level !== s2.level) {
      console.log(`⚠️  セクションレベル不一致 (${index + 1}): ${s1.level} vs ${s2.level}`);
    }

    // 内容の長さ比較（大幅な差がある場合は翻訳漏れの可能性）
    const contentLength1 = s1.content.join(' ').length;
    const contentLength2 = s2.content.join(' ').length;

    if (contentLength1 > 0 && contentLength2 === 0) {
      console.log(`❌ 翻訳漏れ: "${s1.title}" -> "${s2.title}"`);
      missingTranslations++;
    } else if (contentLength1 > 50 && contentLength2 < contentLength1 * 0.3) {
      console.log(`⚠️  翻訳不完全の可能性: "${s1.title}" -> "${s2.title}" (${contentLength1} -> ${contentLength2} chars)`);
    }

    // 空の翻訳セクション
    if (contentLength2 === 0 && contentLength1 > 0) {
      emptyTranslations++;
    }
  }

  console.log(`✅ 総セクション数: ${sections1.length}`);
  console.log(`❌ 翻訳漏れ: ${missingTranslations}`);
  console.log(`⚠️  空の翻訳: ${emptyTranslations}`);

  if (missingTranslations === 0 && emptyTranslations === 0) {
    console.log(`🎉 翻訳完全性: 良好`);
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
    checkTranslationCompleteness(file1, file2, content1, content2);
  } catch (error) {
    console.log(`❌ ファイル読み込みエラー ${file1} または ${file2}: ${error.message}`);
  }
}