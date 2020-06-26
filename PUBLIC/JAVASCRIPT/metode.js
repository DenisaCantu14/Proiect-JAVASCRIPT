async function verify(url = '') {
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}
async function update(url = '', data = {}) {
   
    const response = await fetch(url, {
        method: 'PUT',
        headers:
        {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    });
    return response.json();
}


 async function postData(url = '', data = {}) {
    const response = await fetch(url,
       {
          method: 'POST', 
          headers:
          {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
       });
    
    if(response.status==200 || response.status==202 || response.status==201)
    {
        return response.json();
      }
    else
        return response;    
 }
 async function deleteUser(url = '') {
  
    const response = await fetch(url, {
       method: 'DELETE',
    });
 
    return response.json();
 }
 
 async function verify(url = '') {
    const response = await fetch(url, {
       method: 'GET',
    });
    return response.json();
 }
 