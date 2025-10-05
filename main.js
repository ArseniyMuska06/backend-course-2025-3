import fs from 'fs';
import { Command } from 'commander';

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до вхідного JSON-файлу')
  .option('-o, --output <path>', 'шлях до вихідного файлу')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-f, --furnished', 'відображати лише будинки зі статусом "furnished"')
  .option('-p, --price <number>', 'відображати лише будинки з ціною меншою за вказану');

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

let filteredData = data;

if (options.furnished) {
  filteredData = filteredData.filter(item => item.furnishingstatus === 'furnished');
}

if (options.price) {
  const maxPrice = Number(options.price);
  if (isNaN(maxPrice)) {
    console.error('Помилка: значення параметра --price має бути числом');
    process.exit(1);
  }
  filteredData = filteredData.filter(item => Number(item.price) < maxPrice);
}

const result = filteredData.map(item => `${item.price} ${item.area}`).join('\n');

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
