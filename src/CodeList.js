import React, {useState} from "react";
import CodeForm, {checkCodeErrors, classifyRoomCode, isDigit} from "./CodeForm";

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function digitsAndChars(code) {
  const digits = new Set();
  const chars = new Set();
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (isDigit(c)) {
      digits.add(c);
    } else {
      chars.add(c);
    }
  }

  return [digits, chars];
}

function extractMapping(codes) {
  const mapping = new Map();
  for (let i = 0; i < 8; i++) {
    const digits = new Set();
    const chars = new Set();
    for (let j = 0; j < codes.length; j++) {
      const c = codes[j].charAt(i);
      if (isDigit(c)) {
        digits.add(c);
      } else {
        chars.add(c);
      }
    }

    if (digits.size > 1) {
      return [[`Conflicting digits on position ${i+1}`], []];
    }

    if (chars.size > 1) {
      return [[`Conflicting chars on position ${i+1}`], []];
    }

    if (digits.size !== 1 || chars.size !== 1) {
      continue;
    }

    const digit = digits.values().next().value;
    const char = chars.values().next().value;
    if (mapping.has(char) && mapping.get(char) !== digit) {
      return [[`Two translations for: ${char}: ${digit} && ${mapping.get(char)}`], []];
    }
    mapping.set(char, digit);
  }

  return [[], mapping];
}

function getAllPotentialCodes(code) {
  const resultList = [];
  getAllPotentialCodesHelper(code, resultList);
  return resultList;
}

function getAllPotentialCodesHelper(code, resultList) {
  const [digits, chars] = digitsAndChars(code)
  if (chars.size === 0) {
    resultList.push(code);
    return;
  }

  const firstChar = chars.values().next().value;
  for (let i = 0; i < 10; i++) {
    const digitStr = i.toString()
    if (digits.has(digitStr)) {
      continue;
    }

    const translatedCode = replaceAll(code, firstChar, digitStr);
    if (chars.size === 1) {
      resultList.push(translatedCode);
    } else {
      getAllPotentialCodesHelper(translatedCode, resultList);
    }
  }
}

function oneCodeSolver(code1) {
  console.log(code1);

  const room = classifyRoomCode(code1);
  if (!room) {
    return [["Code could not be classified by room; check entry"], []];
  }

  const [digits] = digitsAndChars(code1);

  if (room === "C") {
    console.log(code1);
    return [[], getAllPotentialCodes(code1)];
  }

  const potentialCodes = [];
  digits.forEach((digit) => {
    potentialCodes.concat(getAllPotentialCodes(replaceAll(code1, room, digit)))
  })

  return [[], potentialCodes];
}

function twoCodeSolver(code1, code2) {
  const mappingResult = extractMapping([code1, code2]);

  if (mappingResult[0].length > 0) {
    return mappingResult;
  }

  const mapping = mappingResult[1];

  console.dir(mapping);
  if (mapping.size !== 2) {
    return [[`Missing mapping for one character, check code entry`], []];
  }

  let code = code1;
  mapping.forEach((digit, char) => code = replaceAll(code, char, digit));
  return [[], getAllPotentialCodes(code)];
}

function threeCodeSolver(code1, code2, code3) {
  const mappingResult = extractMapping([code1, code2, code3]);

  if (mappingResult[0].length > 0) {
    return mappingResult;
  }

  const mapping = mappingResult[1];

  if (mapping.size !== 3) {
    return [[`Missing mapping for one character, check code entry`], []];
  }

  let code = code1;
  mapping.forEach((digit, char) => code = replaceAll(code, char, digit));
  return [[], [code]];
}

function checkGroupProperties(codes) {
  const roomList = [], validCodes = [];
  console.log(codes);

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (checkCodeErrors(code).length !== 0) {
      continue;
    }
    validCodes.push(code);
    roomList.push(classifyRoomCode(code));
  }

  console.log(validCodes);


  if (validCodes.length === 0) {
    return [[], []];
  }

  if ((new Set(validCodes)).size !== validCodes.length) {
    return [["Duplicate Codes"], []]
  }

  if ((new Set(roomList)).size !== roomList.length) {
    return [["Got codes from the same type of room; check they're entered correctly."], []]
  }

  if (validCodes.length === 1) {
    return oneCodeSolver(validCodes[0]);
  } else if (validCodes.length === 2) {
    return twoCodeSolver(validCodes[0], validCodes[1]);
  }

  return threeCodeSolver(validCodes[0], validCodes[1], validCodes[2]);
}

function ResultCodes({codes}) {
  if (codes.length === 0) {
    return "";
  }

  return (
      <div className="ResultCodes">
        <p>The number of codes is: {codes.length}</p>
        <ul className="Codes">{codes.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
  );
}

function CodeList() {
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");

  const [errors, codes] = checkGroupProperties([code1, code2, code3]);
  return (
    <div className="CodeList">
      <CodeForm key="code1" code={code1} setCode={setCode1} />
      <CodeForm key="code2" code={code2} setCode={setCode2} />
      <CodeForm key="code3"  code={code3} setCode={setCode3} />
      {errors && <ul className="Errors">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
      <ResultCodes codes={codes}/>
    </div>
  );
}

export default CodeList;
