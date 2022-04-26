import React, { useState } from 'react';

import useFormInput from '../../hooks/use-form-input.hooks';

import FormInput from '../form-input/form-input.component';
import FormButton from '../form-button/form-button.component';
import FormTextarea from '../form-textarea/form-textarea.component';
import CustomDropdown from '../custom-dropdown/custom-dropdown.component';

import './bookmark-form.styles.css';

const BookmarkForm = ({ tabs, categories, token }) => {

  const [bookmark, updadeBookmark, resetBookmark] = useFormInput({
    title: document.title,
    url: document.URL,
    tags: '',
    notes: ''
  })
  const [isLoading, setLoading] = useState(false);
  const [category, setCategory] = useState({ title: 'Select' })
  const selectCategory = (id) => {
    setCategory(categories.find(category => category._id === id))
  }
  const [tab, setTab] = useState({ title: 'Select' })
  const selectTab = (id) => {
    setTab(tabs.find(tab => tab._id === id))
    setCategory({ title: 'Select' })
  }
  // console.log(tab, category)

  const handleSubmit = e => {
    e.preventDefault()
    try {
      setLoading(true)
      fetch('https://bmark-easy.herokuapp.com/bookmark/', {
        method: 'POST',
        body: JSON.stringify({
          _id: category,
          title,
          url,
          tags: tags.split(','),
          notes,
        }),
        headers: {
          Authorization: token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          let errorMessage;
          if (res.status === 422) {
            errorMessage = 'Validation failed.';
          }
          else if (res.status === 500) {
            errorMessage = 'Internal server error. Please try again!';
          }
          else if (res.status !== 200 && res.status !== 201) {
            errorMessage = 'Not Authorized!'
          }
          if (errorMessage) throw new Error(errorMessage)
          return res.json();
        })
        .then(resData => {
          console.log(resData)
          setLoading(false)
          resetBookmark({
            title: '',
            url: '',
            tags: '',
            notes: '',
          })
          const app = document.getElementById('my-extension-root')
          app.style.display = "none";
        })
        .catch(err => {
          setLoading(false)
          console.log(err)
        });
    } catch (err) {
      console.log(err)
    }
  }
  const { title, url, tags, notes } = bookmark;
  return (
    <div id='add-bookmark' className='bookmark show'>
      <div className="bookmark-dialog bookmark-add-bookmark">
        <div className="bookmark-content">
          <div className="bookmark-header">
            <h4 className="bookmark-title">Add New Bookmark</h4>
          </div>
          <div className="bookmark-body">
            <form onSubmit={handleSubmit}>
              <FormInput
                name='title'
                value={title}
                placeholder='Title'
                type='text'
                required
                maxLength="100"
                title='3 and more Alphabetic letter'
                handleChange={updadeBookmark}
              />
              <FormInput
                name='url'
                value={url}
                placeholder='URL'
                type='text'
                required
                maxLength="100"
                title='3 and more Alphabetic letter'
                handleChange={updadeBookmark}
              />
              <FormTextarea
                name='tags'
                value={tags}
                required
                placeholder='Seprate tags by commas'
                type='text'
                title='3 and more Alphabetic letter'
                handleChange={updadeBookmark}
              />
              <CustomDropdown
                selected={tab}
                title="Tab:"
                body={tabs}
                selectItem={selectTab} />
              <CustomDropdown
                selected={category}
                title="Category:"
                body={categories.filter(item => item.tab === tab._id)}
                selectItem={selectCategory} />
              <FormTextarea
                name='notes'
                value={notes}
                placeholder='Notes'
                type='text'
                title='3 and more Alphabetic letter'
                handleChange={updadeBookmark}
              />
              <FormButton
                type='submit'
                label='Add'
                isLoading={isLoading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


export default BookmarkForm;