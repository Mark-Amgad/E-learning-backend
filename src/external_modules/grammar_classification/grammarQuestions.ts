import { spawn, spawnSync } from 'node:child_process';
import * as path from 'path'



export async function generateTorFQ(sentence: string): Promise<McqQ> {

  try {
      const res = (await callPythonFunction('TorFQ', sentence)) as McqQ
      return res
  } catch(err: unknown) {
    throw new Error('Something went wrong during question generatation')
  }
}

export async function generateMcqQ(sentence: string): Promise<McqQ> {

  try {
      const res = (await callPythonFunction('MCQQ', sentence)) as McqQ
      return res
  } catch(err: unknown) {
    throw new Error('Something went wrong during question generatation')
  }
}


async function callPythonFunction(type: string, sentence: string): Promise<any> {
  const args = [path.join(__dirname, 'grammar_classifier', 'cli.py'), type, sentence]
  const child = await spawnSync('python', args)

  if(child.status != 0) {
    console.log(child.stderr.toString())
    throw new Error('Somehting went wrong during generation')
  }
  return JSON.parse(child.stdout.toString().split('\n', 2)[1])
}


interface McqQ {
  question: string,
  mcq: string[],
  answer: string
}

// generateMcqQ('Mary has been feeling a little depressed.').then((d) => console.log(d))
// generateTorFQ('Mary has been feeling a little depressed.').then((d) => console.log(d))