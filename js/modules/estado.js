import { formatearNumero } from '../utils/formatters.js';
import { UIManager } from './ui.js';

// Rest of the estado.js code remains the same

function myFunction() {
  console.log("This is a sample function.");
  const formattedNumber = formatearNumero(12345.67);

  console.log(formattedNumber); // Example usage of imported function
}

myFunction();

