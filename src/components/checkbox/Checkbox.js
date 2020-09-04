import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Checkbox extends Component 
{
  static propTypes = {
    label: PropTypes.string.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired
  }
  
  state = {
    isChecked: false
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked
    }))

    handleCheckboxChange(label)
  }

  render() {
    const { label } = this.props
    const { isChecked } = this.state

    return (
      <div className="page__toggle">
        <label 
          className="toggle"
        >
          <input 
            className="toggle__input" 
            type="checkbox" 
            checked={isChecked}
            value={label}
            onChange={this.toggleCheckboxChange}
          />
          <span className="toggle__label">
            <span className="toggle__text text-secondary font-weight-normal">{label}</span>
          </span>
        </label>
      </div>
    )
  }
}

export default Checkbox