# E-learning-backend

Graduation project 2022

## Ready endpoints

1- http://localhost:4040/mcq

2- http://localhost:4040/lr

3- http://localhost:4040/questions/

4- http://localhost:4040/questions/:category

(grammar, vocabulary, reading, listening)

5- http://localhost:4040/questions/:category/:quantity/:margin

6- http://localhost:4040/questions/:category/:id

7- http://localhost:4040/generateReadingQuestion/:level

7- http://localhost:4040/generateVocabQuestion/:level

7- http://localhost:4040/generateGrammarQuestion/:level

(category : grammar,vocabulary.. , quantity : number , margin : number)

### Users

7- http://localhost:4040/auth/signup

8- http://localhost:4040/auth/login

9- http://localhost:4040/users

10- http://localhost:4040/users/:email

11- http://localhost:4040/users/update

12- http://localhost:4040/users/:email

### Tests
13- http://localhost:4040/tests/create/:email/:category/:level/:size

14- http://localhost:4040/tests/get/:test_id

15- http://localhost:4040/tests/submit (POST)

body Example :

    {

    "testId" : "645acb332790ec92f2dd3d61",

    "answers" : [["mine"],["for"],["twice a"],["wrong answer"],["empty"]]
    
}

