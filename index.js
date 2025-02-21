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


console.log(chalk.blue(' • Ajouter un film : '));

const movieInserted = await movieModel.create({
  name: 'Test movie 01',
  desc: 'Exemple de test',
  release: new Date(2020, 11, 31),
  duration: 30,
  rating: null,
  genre: 'Action'
});
console.log(movieInserted);
console.log();
