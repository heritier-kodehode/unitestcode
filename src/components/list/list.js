import React, { useEffect, useState } from 'react';
import './list.css';
import { useAuth, withAuth } from 'oidc-react';
import { JWTInterceptor } from '../hoc/jwtinterceptor';
const companyKey = process.env.REACT_APP_COMPANY_KEY;

const reqBody = {
  'CustomValues': {},
  'InfoID': 14,
  'ID': 0,
  'CreatedBy': '13686aa6-6307-4028-aa84-40ffd96f36c0',
  'CreatedAt': '2023-01-13T01:01:28.77Z',
  'Role': null,
  'UpdatedBy': null,
  'Comment': 'Her har vi en splitter ny kontaktperson',
  'UpdatedAt': null,
  'ParentBusinessRelationID': null,
  'Deleted': false,
  'StatusCode': null,
};

function ListItem({
  item,
  deleteUserById,
  editContactStart,
  contactItemTargeted,
  contacts,
}) {
  return (
    <div className='list-item-container'>
      <p>ID:</p>
      <p className='list-id'> {item.ID}</p>
      <p className='list-comment'>{item.Comment}</p>
      <button
        onClick={() => {
          deleteUserById(item.ID);
        }}
        className='delete-btn'
      >
        <svg
          width='12'
          height='12'
          viewBox='0 0 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10.5714 4.28572H10.2857C10.4429 4.28572 10.5714 4.15714 10.5714 4V4.28572H21.4286V4C21.4286 4.15714 21.5572 4.28572 21.7143 4.28572H21.4286V6.85714H24V4C24 2.73929 22.975 1.71429 21.7143 1.71429H10.2857C9.02501 1.71429 8.00001 2.73929 8.00001 4V6.85714H10.5714V4.28572ZM28.5714 6.85714H3.42858C2.79644 6.85714 2.28572 7.36786 2.28572 8V9.14286C2.28572 9.3 2.41429 9.42857 2.57144 9.42857H4.72858L5.61072 28.1071C5.66786 29.325 6.67501 30.2857 7.89286 30.2857H24.1072C25.3286 30.2857 26.3322 29.3286 26.3893 28.1071L27.2714 9.42857H29.4286C29.5857 9.42857 29.7143 9.3 29.7143 9.14286V8C29.7143 7.36786 29.2036 6.85714 28.5714 6.85714ZM23.8321 27.7143H8.16786L7.30358 9.42857H24.6964L23.8321 27.7143Z'
            fill='black'
          />
        </svg>
        Delete
      </button>
      <button
        onClick={() => {
          contactItemTargeted(item.ID, contacts);
          editContactStart(item.ID);
        }}
        className='edit-btn'
      >
        Edit
      </button>
    </div>
  );
}

function List() {
  const { fetchData } = JWTInterceptor();
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const auth = useAuth();
  const [phoneNr, setPhoneNr] = useState('');
  const [newname, setNewName] = useState('');
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [contactToEdit, setContactToEdit] = useState({});
  const [updatedPhoneNr, setUpdatedPhoneNr] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [filter, setFilter] = useState(false);
  const [filterInfo, setFilterInfo] = useState('');

  useEffect(() => {
    const expired = auth.userData.expired;

    if (expired) {
      console.log('Its expired');
      console.log('It expired in', auth.userData.expires_in, ' min');
    } else {
      console.log('Not expired , still usable');
    }
  }, [auth.userData]);

  const fetchContacts = (accessToken, companyKey) => {
    fetchData('https://test-api.softrig.com/api/biz/contacts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'CompanyKey': companyKey,
        'Accept': 'application/json, text/plain, */*',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        setContacts(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  };
  useEffect(() => {
    if (auth && auth.userData) {
      fetchContacts(auth.userData.access_token, companyKey);
    }
  }, [auth]);

  const postData = async () => {
    const url = 'https://test-api.softrig.com/api/biz/contacts';
    const body = JSON.stringify({
      'CustomValues': { 'DefaultPhone': phoneNr, 'Name': newname },
      'InfoID': 18,
      'ID': 0,
      'CreatedBy': '',
      'CreatedAt': '2023-01-13T01:01:28.77Z',
      'Role': null,
      'UpdatedBy': null,
      'Comment': `${newname}  📱 : ${phoneNr}`,
      'UpdatedAt': null,
      'ParentBusinessRelationID': null,
      'Deleted': false,
      'StatusCode': null,
    });
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Authorization': `Bearer ${auth.userData.access_token}`,
      'Content-Type': 'application/json',
      'CompanyKey': companyKey,
      'Access-Control-Allow-Origin': '*',
    };
    try {
      const response = await fetchData(url, {
        method: 'POST',
        body: body,
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    fetchContacts(auth.userData.access_token, companyKey);
  };

  const deleteUserById = async (id) => {
    const apiUrl = `https://test-api.softrig.com/api/biz/contacts/${id}`;
    fetchData(apiUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, /',
        'Authorization': `Bearer ${auth.userData.access_token}`,
        'Content-Type': 'application/json',
        'CompanyKey': companyKey,
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
      });

    fetchContacts(auth.userData.access_token, companyKey);
  };

  const updateUserById = async (id, updatedName, updatedPhoneNr) => {
    const url = `https://test-api.softrig.com/api/biz/contacts/${id}`;
    const body = JSON.stringify({
      ...contactToEdit,
      'Comment': `${updatedName} 📱 : ${updatedPhoneNr}`,
      'UpdatedAt': new Date(),
      'CustomValues': `'DefaultPhone': ${updatedPhoneNr}, 'Name': ${updatedName}`,
    });
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Authorization': `Bearer ${auth.userData.access_token}`,
      'Content-Type': 'application/json',
      'CompanyKey': companyKey,
      'Access-Control-Allow-Origin': '*',
    };
    try {
      const response = await fetchData(url, {
        method: 'PUT',
        headers: headers,
        body: body,
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    fetchContacts(auth.userData.access_token, companyKey);
  };

  //start editing and specify item id to edit
  function editContactStart(id) {
    setEdit(true);
    setEditId(id);
  }
  //end editing and clear item id to edit
  function editContactEnd() {
    setEdit(false);
    setEditId('');
  }

  //Helper function for Edit
  function contactItemTargeted(id, contactArr) {
    const getTargetContactArr = [];
    for (let i = 0; i < contactArr.length; i++) {
      if (contactArr[i].ID === id) {
        getTargetContactArr.push(contactArr[i]);
      }
    }
    setContactToEdit(getTargetContactArr[0]);
  }

  useEffect(() => {
    console.log(contactToEdit);
  }, [contactToEdit]);

  useEffect(() => {
    if (auth && auth.userData && contacts) {
    }
    console.log(contacts);
  }, [contacts]);

  function filterListByPhoneNrAndName(value) {
    if (value === '') {
      fetchContacts(auth.userData.access_token, companyKey);
      return;
    }
    const filteredList = contacts.filter((item) =>
      item.Comment.includes(value)
    );

    setContacts(filteredList);
  }
  return (
    <div>
      {edit ? (
        <div className='create-section'>
          <div className='input-section'>
            <div className='input-and-label-section'>
              <label htmlFor='phoneNrInput'>PhoneNr</label>
              <input
                className='input'
                id='phoneNrInputUpdate'
                type='text'
                value={updatedPhoneNr}
                onChange={(e) => {
                  setUpdatedPhoneNr(e.target.value);
                }}
                placeholder='Update Phone Number '
              />
            </div>
            <div className='input-and-label-section'>
              <label htmlFor='nameInput'>Name</label>
              <input
                className='input'
                id='nameInputUpdate'
                type='text'
                value={updatedName}
                onChange={(e) => {
                  setUpdatedName(e.target.value);
                }}
                placeholder='Update Contact Name'
              />
            </div>
          </div>
          <button
            className='update-btn'
            onClick={() => {
              updateUserById(editId, updatedName, updatedPhoneNr);
              setEdit(false);
            }}
          >
            Update
          </button>
          <button
            className='cancel-btn'
            onClick={() => {
              editContactEnd();
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className='create-section'>
          <div className='input-section'>
            <div className='input-and-label-section'>
              <label htmlFor='phoneNrInput'>PhoneNr</label>
              <input
                className='input'
                id='phoneNrInput'
                type='text'
                value={phoneNr}
                onChange={(e) => {
                  setPhoneNr(e.target.value);
                }}
                placeholder='Write Phone Number '
              />
            </div>
            <div className='input-and-label-section'>
              <label htmlFor='nameInput'>Name</label>
              <input
                className='input'
                id='nameInput'
                type='text'
                value={newname}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                placeholder='Write Contact Name'
              />
            </div>
          </div>
          <button
            className='create-btn'
            onClick={() => {
              postData(reqBody, auth.userData.access_token, companyKey);
            }}
          >
            Create New
          </button>
        </div>
      )}

      <div className='list-header'>
        <p className='my-contacts-title'>My Contacts </p>
        <input
          className='filter-input'
          type='text'
          placeholder='Filter Contact by Name/Nr'
          onChange={(e) => {
            setFilterInfo(e.target.value);
            filterListByPhoneNrAndName(e.target.value);
          }}
          value={filterInfo}
        />
      </div>

      <div className='container-border'>
        {contacts
          ? contacts.map((item, index) => {
              return (
                <ListItem
                  key={index + 1}
                  item={item}
                  deleteUserById={deleteUserById}
                  editContactStart={editContactStart}
                  contactItemTargeted={contactItemTargeted}
                  contacts={contacts}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

export default withAuth(List);
