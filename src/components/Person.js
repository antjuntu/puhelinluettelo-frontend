import React from 'react'

const Person = ({ person, clicked }) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><button onClick={clicked}>poista</button></td>
    </tr>
  )
}

export default Person