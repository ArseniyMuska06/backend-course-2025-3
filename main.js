import fs from 'fs';
import { Command } from 'commander';

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до вхідного JSON-файлу')
  .option('-o, --output <path>', 'шлях до вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

let data;
try {
  const content = fs.readFileSync(options.input, 'utf8');
  data = JSON.parse(content);
} catch (error) {
  console.error('Помилка при читанні або парсингу файлу:', error.message);
  process.exit(1);
}

const result = JSON.stringify(data, null, 2);

if (!options.output && !options.display) {
  process.exit(0);
}

if (options.output) {
  try {
    fs.writeFileSync(options.output, result);
    console.log(`Результат записано у файл ${options.output}`);
  } catch (error) {
    console.error('Помилка при записі у файл:', error.message);
  }
}

if (options.display) {
  console.log('Результат:\n', result);
}
