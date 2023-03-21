import edu.stanford.nlp.simple.*;
import edu.stanford.nlp.util.Quadruple;

import java.util.*;



public class Main {
    public static void main(String[] args) {


//        Sentence sent = new Sentence("I like apple");
//        List<String> words = sent.words();  // [PERSON, O, O, O, O, O, O, O]
//        for(int i = 0 ; i < words.size();i++)
//        {
//            System.out.println(words.get(i) + "    =>     " + sent.posTag(i));
//        }

        String text = "Oceans and lakes have much in common, but they are also quite different. Both are bodies of water, but oceans are very large bodies of salt water, while lakes are much smaller bodies of fresh water. Lakes are usually surrounded by land, while oceans are what surround continents. Both have plants and animals living in them. The ocean is home to the largest animals on the planet, whereas lakes support much smaller forms of life. When it is time for a vacation, both will make a great place to visit and enjoy.";
        /*
        Text t = new Text(text);
        t.printText();
        t.printSentences();
        t.printVerbs();
        */
        Text t = new Text("abc");
        String s;
        //s = "The wolf did destroy the whole flock at his leisure.";
        //s= "The Weasel was the enemy of all birds in the forest.";
        s="Oceans and lakes have much in common.";
        t.getOpenIE(s);
        t.printPos(s);
        System.out.println(s);
        //ArrayList<String> openIe2 = t.getOpenIE("Oceans and lakes have much in common.");
        //ArrayList<String> openIe3 = t.getOpenIE("I believe there is much to be excited about");
        /*
        t.tags("The Weasel was the enemy of all birds in the forest.");
        t.tags("The fruit was the product of an apple tree in the yard.");
        t.tags("Oceans and lakes have much in common.");
        t.tags("Barack Obama was born in Hawaii");
        t.tags("In Hawaii Barack Obama was born");
        t.tags("The Blue Whales just played their first baseball game of the new season");
        t.tags("I believe there is much to be excited about");
        t.tags("it was against an excellent team that had won the championship last year");
        t.tags("the school fair is a great value when compared with other forms of entertainment.");
        */



    }
}