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

8- http://localhost:4040/generateVocabQuestion/:level

9- http://localhost:4040/generateGrammarQuestion/:level

10- http://localhost:4040/generateListeningQuestion/:level

11- http://localhost:4040/sentence

(category : grammar,vocabulary.. , quantity : number , margin : number)

### Users

1- http://localhost:4040/auth/signup

2- http://localhost:4040/auth/login

3- http://localhost:4040/users

4- http://localhost:4040/users/:email

5- http://localhost:4040/users/update

6- http://localhost:4040/users/:email

### Tests
13- http://localhost:4040/tests/create/:email/:category/:level/:size

14- http://localhost:4040/tests/get/:test_id

15- http://localhost:4040/tests/submit (POST)

body Example :

    {

    "testId" : "645acb332790ec92f2dd3d61",

    "answers" : [["mine"],["for"],["twice a"],["wrong answer"],["empty"]] 
    }

