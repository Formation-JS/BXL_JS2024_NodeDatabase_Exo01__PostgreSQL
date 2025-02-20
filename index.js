import chalk from 'chalk';
import movieModel from './models/movie.model.js';

console.log('Exercice 01 - Utilisation de PostgreSQL en Node');
console.log();


console.log(chalk.blue(' • Affiche le film "11" : '));

const movie = await movieModel.getById(11);
// console.log(movie);
console.log(movie.name + ' - ' + movie.release.toLocaleDateString());
console.log();


console.log(chalk.blue(' • Affiche tous les films : '));

const movies = await movieModel.getAll();
console.log(movies);
console.log();
