import React, { useState } from 'react';

import './custom-dropdown.styles.css';

const CustomDropDown = ({ title, selected, body, selectItem }) => {

  const [show, toggleDropdown] = useState(false);

  return (
    <div className='custom-dropdown'>
      <div className="d-flex justify justify-content-between m-2">
        <span className="drop-title" >{title}</span>
        <button type='button'
          className="btn default button-selected"
          onClick={() => toggleDropdown((show) => !show)}
        >
          {selected.title}
        </button>
      </div>
      <div className={`dropdown-menu drop-menu ${show ? 'show' : ''}`}>
        {
          body.map((item, idx) => (
            <span
              key={item._id}
              className="dropdown-item"
              onClick={() => {
                selectItem(item._id)
                toggleDropdown((show) => !show)
              }}
            >{item.title}</span>
          ))
        }
        {/* <span class="dropdown-item" href="#">Action</span>
        <span class="dropdown-item" href="#">Another action</span>
        <span class="dropdown-item" href="#">Something else here</span>
        <span class="dropdown-item" href="#">Separated link</span>
        <span class="dropdown-item" href="#">Action</span>
        <span class="dropdown-item" href="#">Another action</span>
        <span class="dropdown-item" href="#">Something else here</span>
        <span class="dropdown-item" href="#">Separated link</span> */}
      </div>
    </div>
  )
}

export default CustomDropDown;