import React from 'react'
import FilterForm from './components/FilterForm'
import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notification'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			persons: [],
			newName: '',
			newNumber: '',
			filter: '',
			success: null
		}
	}

	componentDidMount() {
		personService
			.getAll()
			.then(personsList => {
				this.setState({
					persons: personsList
				})
			})
	}
 
	addPerson = (event) => {
		event.preventDefault()

		const oldPerson = this.state.persons.find(person => 
			person.name === this.state.newName)
			//console.log(oldPerson)
			

		if(oldPerson) {
				if(window.confirm(`${oldPerson.name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
					this.updatePersonsNumber(oldPerson.id)
				} else {
					this.setState({
						newName: '',
						newNumber: '',
						filter: ''
					})
				}
			} else {

				const personObject = {
					name: this.state.newName,
					number: this.state.newNumber
				}
		
				personService
					.create(personObject)
					.then(newPerson => {
						this.setState({
							persons: this.state.persons.concat(newPerson),
							newName: '',
							newNumber: '',
							filter: '',
							success: `Lisättiin ${newPerson.name}`
						})
						setTimeout(() => {
							this.setState({ success: null })
						}, 5000)
					})
			}
	}

	updatePersonsNumber = (id) => {
		const person = this.state.persons.find(person => person.id === id)
		const changedPerson = { ...person, number: this.state.newNumber }
		personService
			.update(id, changedPerson)
			.then(changedPerson => {
				this.setState({
					persons: this.state.persons.map(person => person.id !== id ? person : changedPerson),
					newName: '',
					newNumber: '',
					filter: '',
					success: `Henkilön ${changedPerson.name} numero vaihdettiin`
				})
				setTimeout(() => {
					this.setState({ success: null })
				}, 5000)
			})
			.catch((err) => {
				personService
					.create(changedPerson)
					.then(addedPerson => {
						this.setState({
							persons: this.state.persons.map(person => person.id !== addedPerson.id ? person : addedPerson),
							newName: '',
							newNumber: '',
							filter: '',
							success: `Henkilön ${changedPerson.name} numero vaihdettiin`
						})
						setTimeout(() => {
							this.setState({ success: null })
						}, 5000)
					})
				
			})
	}

	nameInputHandler = (event) => {
		this.setState({
			newName: event.target.value
		})
	}

	numberInputHandler = (event) => {
		this.setState({
			newNumber: event.target.value
		})
	}

	filterHandler = (event) => {
		this.setState({
			filter: event.target.value
		})
	}

	personDeleteHandler = (id) => {
		return (event) => {
			const personToDelete = this.state.persons.find(person => person.id === id)
			
			if (!window.confirm(`Poistetaanko ${personToDelete.name}?`)){
				return
			}
		
			personService
				.remove(personToDelete.id)	
				.then(response => {
					//console.log(response)
					this.setState({
						persons: this.state.persons.filter(person => person.id !== personToDelete.id),
						newName: '',
						newNumber: '',
						filter: '', 
						success: `Poistettiin ${personToDelete.name}`
					})
					setTimeout(() => {
						this.setState({ success: null })
					}, 5000)
				})
		}
	}

	render() {

		let personList = [...this.state.persons]
		let filter = this.state.filter.toLowerCase()

		if (filter) {
			personList = personList.filter(person => {
				let personStartsWith = person.name.substring(0, filter.length).toLowerCase()
				return personStartsWith === filter
			})
		}

		return (
			<div>
				<h1>Puhelinluettelo</h1>
				<Notification message={this.state.success} />
				<div>
					<FilterForm filter={this.state.filter} changed={this.filterHandler} />
				</div>
				<h2>Lisää uusi</h2>
				<form onSubmit={this.addPerson}>
					<div>
						nimi: 
						<input value={this.state.newName} onChange={this.nameInputHandler} />
					</div>
					<div>
						numero:
						<input value={this.state.newNumber} onChange={this.numberInputHandler} />
					</div>
					<div>
						<button type="submit">lisää</button>
					</div>
				</form>
				<h2>Numerot</h2>
				<div>
					<table>
						<tbody>
							{
								personList.map(person => 
									<Person 
										key={person.id}
										person={person}
										clicked={this.personDeleteHandler(person.id)} />
								)
							}
							</tbody>
						</table>
				</div>
			</div>
		)
	}
}

export default App