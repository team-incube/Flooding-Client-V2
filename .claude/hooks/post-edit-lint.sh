#!/bin/sh
# PostToolUse: .ts/.tsx 파일 편집 후 ESLint + Prettier 자동 실행

INPUT=$(cat)
FILE=$(echo "$INPUT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString());
    console.log(data.tool_input?.file_path || '');
  } catch { console.log(''); }
});
")

case "$FILE" in
  *.ts|*.tsx)
    npx eslint --fix "$FILE" 2>/dev/null || true
    npx prettier --write "$FILE" 2>/dev/null || true
    ;;
esac
