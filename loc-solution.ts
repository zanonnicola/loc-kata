const program = `
// Hello World! comment

/**
 * 
 "string"
 'string'
class Hey {
}
*/

// Start /*

string hello = "Hello 
/*
World
";

string yeah = "Hello //World";

namespace HelloWorld /**/
{
    class Hello {         
        static /*inBetween*/ void Main(string[] args)
        { // comment

            System.Console.WriteLine(hello + yeah);
        }
    }
}`;

// On my first attempt I tried using RegEx but it seems that I could not cover all the edge cases
// Also, RegEx was becoming too complex and it would have been hard to add new constraints if necessary

const parser = (code: string): number => {
  const chars = code.split("");
  const output = [];

  let isComment = false;
  let isCode = false;
  let separator = null; // Used to identify strings

  for (let index = 0; index < chars.length; index++) {
    const currChar = chars[index];
    const nextChar = chars[index + 1];

    if (isCode) {
      if (currChar === separator) {
        // we reached the end of the string delimeter
        isCode = false;
        output.push(currChar);
      } else {
        output.push(currChar);
      }
    } else if (isComment) {
      // we reached the end of the block comment delimeter
      if (currChar === "*" && nextChar === "/") {
        isComment = false;
        index++; // skipp
      }
    } else {
      if (currChar === "/" && nextChar === "/") {
        // single line comment
        const newChars = chars.slice(index);
        for (let i = 0; i < newChars.length; i++) {
          // We need to skip all the chars until we reach the end of file or the end of the line
          if (newChars[i] === "\n" || newChars[i] === undefined) {
            break;
          }
          index++;
        }
      } else if (currChar === "/" && nextChar === "*") {
        // Block comment
        isComment = true;
        index++; // skipp
      } else if (currChar === "'" || currChar === '"') {
        // string
        isCode = true;
        output.push(currChar);
        separator = currChar;
      } else {
        output.push(currChar);
      }
    }
  }
  return output
    .join("")
    .trim()
    .split("\n")
    .filter((line) => line !== "").length;
};

console.log(parser(program));
