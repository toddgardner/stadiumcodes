import React, {useState} from "react";
import CodeForm, {checkCodeErrors, classifyRoomCode, isDigit} from "./CodeForm";

class CodeListError extends Error {}

function solvedResult(codesWithUnknowns, solvedCodes) {
  return {codesWithUnknowns, solvedCodes}
}

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
      throw new CodeListError(`Conflicting digits on position ${i+1}`);
    }

    if (chars.size > 1) {
      throw new CodeListError(`Conflicting chars on position ${i+1}`);
    }

    if (digits.size !== 1 || chars.size !== 1) {
      continue;
    }

    const digit = digits.values().next().value;
    const char = chars.values().next().value;
    if (mapping.has(char) && mapping.get(char) !== digit) {
      throw new CodeListError(`Two translations for: ${char}: ${digit} && ${mapping.get(char)}`);
    }
    mapping.set(char, digit);
  }

  return mapping;
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
  const room = classifyRoomCode(code1);
  if (!room) {
    throw new CodeListError("Code could not be classified by room; check entry");
  }

  const [digits] = digitsAndChars(code1);

  if (room === "C") {
    return solvedResult([code1], getAllPotentialCodes(code1))
  }

  let twoUnknownCodes = [];
  let solvedCodes = [];
  digits.forEach((digit) => {
    const twoUnknownCode = replaceAll(code1, room, digit);
    twoUnknownCodes.push(twoUnknownCode);
    solvedCodes = solvedCodes.concat(getAllPotentialCodes(twoUnknownCode));
  })

  return solvedResult(twoUnknownCodes, solvedCodes);
}

function twoCodeSolver(code1, code2) {
  const mapping = extractMapping([code1, code2]);

  if (mapping.size !== 2) {
    throw new CodeListError("Missing mapping for one character, check code entry");
  }

  let code = code1;
  mapping.forEach((digit, char) => code = replaceAll(code, char, digit));
  return solvedResult([code], getAllPotentialCodes(code))
}

function threeCodeSolver(code1, code2, code3) {
  const mapping = extractMapping([code1, code2, code3]);

  if (mapping.size !== 3) {
    throw new CodeListError("Missing mapping for one character, check code entry");
  }

  let code = code1;
  mapping.forEach((digit, char) => code = replaceAll(code, char, digit));
  return solvedResult(undefined, [code])
}

function checkGroupProperties(codes) {
  const roomList = [], validCodes = [];

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (checkCodeErrors(code).length !== 0) {
      continue;
    }
    validCodes.push(code);
    roomList.push(classifyRoomCode(code));
  }

  if (validCodes.length === 0) {
    return;
  }

  if ((new Set(validCodes)).size !== validCodes.length) {
    throw new CodeListError("Duplicate Codes");
  }

  if ((new Set(roomList)).size !== roomList.length) {
    throw new CodeListError("Got codes from the same type of room; check they're entered correctly.");
  }

  if (validCodes.length === 1) {
    return oneCodeSolver(validCodes[0]);
  } else if (validCodes.length === 2) {
    return twoCodeSolver(validCodes[0], validCodes[1]);
  }

  return threeCodeSolver(validCodes[0], validCodes[1], validCodes[2]);
}

function ResultCodes({codes}) {
  if (!codes) {
    return "";
  }

  if (codes.solvedCodes && codes.solvedCodes.length === 1) {
  return (
    <div className="ResultCodes">
      Code: <strong>{codes.solvedCodes[0]}</strong>
    </div>
  );

  }
  return (
      <div className="ResultCodes">
        {codes.codesWithUnknowns && <div><div>The codes with unknowns are:</div><div><ul className="CodesWithUnknowns">{codes.codesWithUnknowns.map((c, i) => <li key={i}>{c}</li>)}</ul></div></div>}
        {codes.solvedCodes && <div><p>There are {codes.solvedCodes.length} potential codes:</p><div className="Codes">{codes.solvedCodes.map((c, i) => <section key={i}>
          <div>{c}</div></section>)}</div></div>}
     </div>
  );
}

function CodeList() {
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");

  let error, codes;
  try {
    codes = checkGroupProperties([code1, code2, code3]);
  } catch (e) {
    if (e instanceof CodeListError) {
      error = e.message;
    } else {
      error = "Unknown";
    }
  }

  return (
    <div className="CodeList">
      <CodeForm key="code1" code={code1} setCode={setCode1} />
      <CodeForm key="code2" code={code2} setCode={setCode2} />
      <CodeForm key="code3" code={code3} setCode={setCode3} />
      {error && <ul className="Errors"><li>{error}</li></ul>}
      <ResultCodes codes={codes}/>
    </div>
  );
}

export default CodeList;
