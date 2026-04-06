const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/{collections,globals}/*.ts');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  let inField = false;
  let fieldType = null;
  let hasLocalized = false;
  let bracketDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('type: \'text\'') || lines[i].includes('type: \'textarea\'') || lines[i].includes('type: \'richText\'')) {
      // Check if localized is in the next few lines
      let j = i;
      let alreadyLocalized = false;
      while (j > 0 && !lines[j].includes('{')) {
        j--;
      }
      let k = i;
      while (k < lines.length && !lines[k].includes('},')) {
        if (lines[k].includes('localized: true')) {
          alreadyLocalized = true;
          break;
        }
        k++;
      }
      if (!alreadyLocalized && !lines[i].includes('name: \'slug\'')) {
        lines.splice(i + 1, 0, '      localized: true,');
      }
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'));
});
