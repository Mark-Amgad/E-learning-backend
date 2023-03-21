import edu.stanford.nlp.simple.*;
import edu.stanford.nlp.util.Quadruple;

import java.util.*;

public class Text {
    private String text;
    private List<Sentence> sentences;
    public Text(String text)
    {
        this.text = text;
        Document doc = new Document(text);
        this.sentences = doc.sentences();
    }

    public List<Sentence> getSentences() {
        return sentences;
    }

    public void printSentences()
    {
        System.out.println("Sentences : ");
        for(int i = 0 ; i < this.sentences.size();i++)
        {
            System.out.println(i+1 + "- " + this.sentences.get(i));
        }
        System.out.println("******************************************");
    }

    public List<List<String>> getPosTags()
    {
        List<List<String>> posTags = new ArrayList<List<String>>();
        for(int i = 0 ; i < this.sentences.size();i++)
        {
            List<String> tags = this.sentences.get(i).posTags();
            posTags.add(tags);
        }
        return posTags;
    }

    public void printPos()
    {
        List<List<String>> pos = getPosTags();
        for(int i = 0 ; i < pos.size();i++)
        {
            System.out.println(pos.get(i));
        }
    }

    public void printPos(String sentence)
    {
        Sentence sent = new Sentence(sentence);
        System.out.println(sent.posTags());
    }

    public List<List<String>> getVerbs()
    {
        List<List<String>> verbs = new ArrayList<List<String>>();
        List<List<String>> pos = getPosTags();
        for(int i = 0; i < pos.size();i++)
        {
            List<String> sentVerbs = new ArrayList<String>();
            for(int j = 0; j < pos.get(i).size();j++)
            {

                if(pos.get(i).get(j).charAt(0) == 'V')
                {
                    sentVerbs.add(this.sentences.get(i).word(j));
                }
            }
            verbs.add(sentVerbs);
        }
        //System.out.println(verbs);
        return verbs;
    }

    public void printVerbs()
    {
        List<List<String>> verbs = getVerbs();
        System.out.println("Verbs : ");
        for(int i = 0; i < verbs.size();i++)
        {
            System.out.print(i+1 + "- ");
            for(int j = 0 ; j < verbs.get(i).size();j++)
            {
                System.out.print(verbs.get(i).get(j) + ", ");
            }
            System.out.println();
        }
    }

    public void printText()
    {
        System.out.println("The main text : ");
        System.out.println(this.text);
        System.out.println("******************************************");
    }

    public List<Quadruple<String,String,String,Double>> getOpenIE(String sentence)
    {
        Sentence sent = new Sentence(sentence);
        List<Quadruple<String,String,String,Double>> res = sent.openie().stream().toList();
        System.out.println(res);
        return res;


    }

    public void generate(String sentence)
    {
        List<Quadruple<String,String,String,Double>> openIEs = getOpenIE(sentence);
        for(int i = 0; i < openIEs.size();i++)
        {

        }
    }
}
