
import React , { useState } from "react";
import axios from 'axios';
import qs from 'qs';


function EditForm({user}) {
  const [edit, setEdit] = useState(
    {  name: user.name,
      
      address: user.address,
      email: user.email
    }

);

const handleSubmit = (e) => {
  e.preventDefault();
  console.log(edit)
  const data = qs.stringify({
    name: edit.name,
    email: edit.email,
    address: edit.address


      
    });
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };
  // req.body.name, req.body.price, req.body.description, req.body.service, req.body.uid, req.body.lat, req.body.long
  // axios.post('https://example.com', form, { headers: form.getHeaders() })
  
  
  axios.put('/api/users', data,
  headers)
       .then(res => {
          console.log(res);
          setEdit({
            name:"",
            email:"",
            address:""
          });
       })
       .catch(err => {
          console.log(err);
       });
}

const handleChange = (e) => {
  setEdit({...edit, [e.target.name]: e.target.value});

}
    
  

  return (
    <div>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              <div class="p-2 w-1/2">
                <div class="relative">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name"
                  >
                    Username
                  </label>
                  <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    type="text"
                    name="name"
                    value={edit.name}
                    onChange={handleChange}
                    placeholder="Username"
                  ></input>
                  <p class="text-red-500 text-xs italic">
                    Please fill out this field.
                  </p>
                </div>
              </div>
              <div class="p-2 w-1/2">
                <div class="relative">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name"
                  >
                    Email
                  </label>
                  <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={edit.email}
                    onChange={handleChange}
                  ></input>
                  <p class="text-red-500 text-xs italic">
                    Please fill out this field.
                  </p>
                </div>
              </div>
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="message" class="leading-7 text-sm text-gray-600">
                    Address
                  </label>
                  <input
                    id="message"
                    class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    name="address"
                    value={edit.address}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div class="p-2 w-full">
                <button class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                type="submit">
                  Submit
                </button>
              </div>
            </div>
          </div>


          </form>
    </div>
  );
}

export default EditForm;
