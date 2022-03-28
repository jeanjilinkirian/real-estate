# Real Estate


This is a NodeJS project about Real Estate application that allows users to search and post different properties for sale. Users can also reach out to the agents to express their interest for a specific property.




## Technologies Used


1. The project uses NodeJS as its main technology, so having NodeJS will be enough to run the project.
2. The web server is created using the express framework.
3. MongoDB Atlas is used to host the database.
4. The project uses mongoose to model the data on top of mongoDB.



## Application status

The application is still under development.



## Endpoints
### GET /api/v1/properties

Request:

Optional Query Parameters:
* sort: possible values can be 'price', '-price', 'price,-size', etc...
Pass multiple values separated by commas to sort based on multiple fields. Pass "-" before the property name to make it in descending order.
* fields: this represents the fields that should be returned associated to the documents. Possible values can be 'name', 'name,price,size,location', etc...
* limit: The field is used for pagination to set the maximum number of results per page. Its value is an integer to represent the number of the items listed per page
* page: The field is used in pagination to provide the number of the page.
* There could be other parameters which are the fields of the "properties" data model that can be used to filter the result based on certain criteria, for example: Filtering properties whose price is less than 700000$. 

Sample Response:
~~~
{
    
      status: 'success',
      results: 10,
      data: { properties: [
                <properties>
            ]
      }
    
}
~~~




### POST /api/v1/properties

This endpoint requires authenticated user with admin rights.

Sample Request:

~~~
{
    
        "zipCode": "91401",
        "garage": 2,
        "isPublished": true,
        "photos": [],
        "title": "13819 Burbank Blvd APT 8",
        "address": "13819 Burbank Blvd APT 8",
        "city": "Los Angeles",
        "state": "CA",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "price": 619000,
        "bedrooms": 2,
        "bathrooms": 3,
        "sqft": 1626,
        "lot_size": 0.25,
        "photoMain": <photo path>,
        "agent": "5fcd46128bc9e45324f724cf"
    
}
~~~


Sample Response:

~~~
{
    
      status: 'success',
      data: {
            property: {
              <property fields and values>
            }
       }
    
}
~~~



### GET /api/v1/properties/:id

Sample Response:

~~~
{

        status: 'success',
        data: { property: {
            <property fields and values>
          } 
        }
        
}
~~~



### PATCH /api/v1/properties/:id

This endpoint requires authenticated user with admin rights.

Sample Request:

~~~
{

        "garage": 2,
        "address": "13819 Burbank Blvd APT 8",
        "city": "Los Angeles"
        
}
~~~


Sample Response:

~~~
{
    
      status: 'success',
      data: {
            property: {
              <property fields and values>
            }
       }
    
}
~~~




### DELETE /api/v1/properties/:id

This endpoint requires authenticated user with admin rights.

Sample Response:

~~~
{

      status: 'success'

}
~~~



### GET /api/v1/users

This endpoint requires authenticated user with admin rights.

Sample Response:

~~~
{
    
      status: 'success',
      results: 10,
      data: { users: [
                <users array>
            ]
      }
    
}
~~~




### GET /api/v1/users/:id

This endpoint requires authenticated user with admin rights.

Sample Response:

~~~
{

        status: 'success',
        data: { 
                user: {
                  <user fields and values>
                }
        }
        
}
~~~



### PATCH /api/v1/users/:id

This endpoint requires authenticated user with admin rights.

Sample Request:

~~~
{

        "phone": "+971569960113",
        "hiredDate": "2021-05-05"

}
~~~


Sample Response:

~~~
{
    
      status: 'success',
      data: {
            user: {
              <user fields and values>
            }
       }
    
}
~~~




### DELETE /api/v1/users/:id

This endpoint requires authenticated user with admin rights.

Sample Response:

~~~
{

      status: 'success'

}
~~~



### POST /api/v1/users/signup

Sample Request:

~~~
{
	
    "name": "test example",
    "email": "test@example.com",
    "password": "myPassword",
    "passwordConfirm": "myPassword"
  
}
~~~


Sample Response

~~~
{
        status: 'success',
        token,
        data: { 
                user: {
                  <user fields and values>   
               } 
        }
}
~~~

### POST /api/v1/users/login

Sample Request:

~~~
{
	
    "email": "test@example.com",
    "password": "myPassword"
  
}
~~~


Sample Response

~~~
{
       
    status: 'success',
    token,
    data: { 
      user: {
        <user fields and values>   
      } 
    }
    
}
~~~


### POST /api/v1/users/forgotpassword


Sample Request:

~~~
{
	
    "email": "test@example.com"
  
}
~~~


Sample Response

~~~
{
       
    status: 'success',
    message: 'Token sent to mail'
    
}
~~~


### PATCH /api/v1/users/resetpassword/:token


Sample Request:

~~~
{
	
   "password": "mypassword123",
   "passwordConfirm": "mypassword123"
  
}
~~~


Sample Response

~~~
{
       
    status: 'success',
    data: { 
      user: {
        <user fields and values>
      }
    }
    
}
~~~


### PATCH /api/v1/users/updatemypassword

This endpoint requires authenticated user.

Sample Request:

~~~
{
	
      "passwordCurrent" :"mypassword",
      "password": "myPassword12",
      "passwordConfirm": "myPassword12"
  
}
~~~


Sample Response

~~~
{
       
    status: 'success',
    data: { 
      user: {
        <user fields and values>
      }
    }
    
}
~~~



### PATCH /api/v1/users/updateme

This endpoint requires authenticated user.

Sample Request:

~~~
{	
    
    "name": "Jean Jilinkirian"

}
~~~


Sample Response

~~~
{
       
    status: 'success',
    data: { 
      user: {
        <user fields and values>
      }
    }
    
}
~~~

### GET /api/v1/users/me

This endpoint requires authenticated user.

Sample Response

~~~
{
       
    status: 'success',
    data: { 
      user: {
        <user fields and values>
      }
    }
    
}
~~~


### GET /api/v1/contacts

This endpoint requires authenticated user with admin rights.

Sample Response

~~~
{
       
    status: 'success',
    results: 20,
    data: { 
      contacts: [
        <contacts with their fields and values>
      ]
    }
    
}
~~~


### POST /api/v1/contacts

This endpoint requires authenticated user with admin rights.

Sample Request

~~~
{
       
    message: "I'm interested in this house. Please reach out to set an appointment for viewing",
    email: "jeanjilinkirian@gmail.com",
    phone: "+971569960113",
    contactDate: 2021-06-05
    property: <propertyID>
    
}
~~~

An alternative way to send a similar request is through: POST /api/v1/properties/:propertyId/contacts.
In such case, there is no need to pass the "property" field in the request body.


Sample response

~~~
{
       
    status: 'success',
    data: { 
      contact: {
        <contact fields and values>
      }
    }
    
}
~~~


### GET /api/v1/contacts/:contactId

This endpoint requires authenticated user with admin rights.

Sample Response

~~~
{
       
    status: 'success',
    data: { 
      contact: {
        <contact fields and values>
      }
    }
    
}
~~~


## Authentication

* Jsonwebtoken(JWT) is used for the authentication purpose. A token is sent to the user when logging in into the application or signing up.
* For routes that require authentication, a jwt token should be sent to the server through the request header.

Request Header example:

~~~
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNkNDYxMjhiYzllNDUzMjRmNzI0Y2YiLCJpYXQiOjE2MDc1Mjc4NjAsImV4cCI6MTYwODEzMjY2MH0.DSfVpiCF76Cb5hACTslP-Du-t8Km90xxOFaaUyZFVX0
~~~


## Authorization

Currently the following roles are taken into account: "admin" and "agent".
The application is still under development, thus the authorization rights for different routes are subject to change.

