import React from "react";

export function isDigit(c) {
  return (c >= '0' && c <= '9');
}

export function classifyRoomCode(code) {
  const noses = (code.match(/N/g) || []).length;
  const houses = (code.match(/H/g) || []).length;
  const chinese =  (code.match(/C/g) || []).length;

  if (noses === 3 && houses === 2 && chinese === 0) {
    return "C";
  }
  if (noses === 2 && houses === 2 && chinese === 1) {
    return "N";
  }
  if (noses === 3 && houses === 1 && chinese === 1) {
    return "H";
  }
}

export function checkCodeErrors(code) {
  if (code.length < 8) {
    return ["Too short"];
  }

  if (code.length > 8) {
    return ["Too long"];
  }

  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (!isDigit(c) && c !== 'C' && c !== 'N' && c !== 'H') {
      return [`Invalid character: ${c}`]
    }
  }

  const room = classifyRoomCode(code);
  if (!room) {
    return [`Code does not match room pattern; check it's entered correctly`]
  }

  return [];
}

function CodeForm({code, setCode}) {
  const errors = checkCodeErrors(code);

  return (
    <div className="Code">
      <input type="text" value={code} onChange={({target: {value}}) => setCode(value.toUpperCase())} />
      {errors && code !== "" && <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
    </div>
  );
}

export default CodeForm;
