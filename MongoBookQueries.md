# Create Collection

db.createCollection("books");

# Insert Sample Data

db.books.insertMany([
{
title: "The Hobbit",
author: "J.R.R. Tolkien",
genre: "Fantasy",
year: "1937"
},
{
title: "To Kill a Mockingbird",
author: "Harper Lee",
genre: "Fiction",
year: "1949"
},
{
title: "1984",
author: "George Orwell",
genre: "Dystopian",
year: "1949"
}
])

# Queries

## Retrieve titles of all books

db.books.find({}, {\_id: 0, title: 1});

## Find all books by "J.R.R. Tolkien"

db.books.find({author: "J.R.R. Tolkien"});

## Update genre of "1984" to "Science Fiction"

db.books.updateOne(
{title: "1984"},
{$set: {genre: "Science Fiction"} }
);

## Delete the book "The Hobbit"

db.books.deleteOne({title: "The Hobbit"});
